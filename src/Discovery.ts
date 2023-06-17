import dgram from 'dgram'
import fetch from 'node-fetch'
import { type XMLParser } from 'fast-xml-parser'
import type AlphaSyncTypes from './Types'

/**
 * The Discovery class handles discovery and interaction with Sony Alpha Camera's services.
 * It employs UPnP (Universal Plug and Play) for service discovery and interaction.
 *
 * @class
 */
export class Discovery {
  // Class Properties
  /**
    * @property {dgram.Socket} socket - UDP socket for communication.
    * @property {Buffer} discoveryMessage - The discovery message sent over SSDP (Simple Service Discovery Protocol).
    * @property {string} discoveryAddr - The IP address used for service discovery.
    * @property {number} discoveryPort - The port used for service discovery.
    * @property {RegExp} ipMatcher - Regular expression for matching IP addresses.
    * @property {string} assumedServiceDirectoryUrl - The assumed URL for the service directory.
    * @property {string} discoveredServiceDirectoryUrl - The discovered URL for the service directory.
    * @property {string} serverDetails - Details about the discovered server.
    * @property {AlphaSyncTypes.Service | undefined} contentDirectoryDetails - The Content Directory service details.
    * @property {AlphaSyncTypes.Service | undefined} digitalImagingDetails - The Digital Imaging service details.
    * @property {AlphaSyncTypes.Service | undefined} XPushListDetails - The XPushList service details.
    * @property {AlphaSyncTypes.Service | undefined} connectionManagerDetails - The Connection Manager service details.
    * @property {string} serverIP - The IP address of the server.
    * @property {string} serverPort - The port of the server.
    * @property {AlphaSyncTypes.Service[]} services - The array of discovered services.
    * @property {AlphaSyncTypes.ServiceDirectoryObject | undefined} serviceDirectoryObject - The object representing the service directory.
    * @property {XMLParser} parser - The XML parser to parse responses.
    * @property {XMLBuilder} builder - The XML builder to construct XML documents.
    */
  private readonly socket = dgram.createSocket('udp4')
  private readonly discoveryMessage: Buffer = Buffer.from('M-SEARCH * HTTP/1.1\r\n' + 'HOST:239.255.255.250:1900\r\n' + 'ST:upnp:rootdevice\r\n' + 'MX:2\r\n' + 'MAN:"ssdp:discover"\r\n' + '\r\n')
  private readonly discoveryAddr: string = '239.255.255.250'
  private readonly discoveryPort: number = 1900
  private readonly assumedServiceDirectoryUrl: string = 'http://192.168.122.1:64321/dd.xml'
  private discoveredServiceDirectoryUrl: string = ''
  private serverDetails = ''
  public contentDirectoryDetails: AlphaSyncTypes.Service | undefined
  public digitalImagingDetails: AlphaSyncTypes.Service | undefined
  public XPushListDetails: AlphaSyncTypes.Service | undefined
  public connectionManagerDetails: AlphaSyncTypes.Service | undefined
  public serverIP = ''
  public serverPort = ''
  private services: AlphaSyncTypes.Service[] = []
  private serviceDirectoryObject: AlphaSyncTypes.ServiceDirectoryObject | undefined = undefined
  private readonly parser: XMLParser

  /**
     * Initializes an instance of Discovery class.
     *
     * @param {XMLParser} parser - The parser instance to parse responses.
     */
  constructor (parser: XMLParser) {
    this.parser = parser
  }

  /**
     * Parses the services and assigns the service details to the appropriate properties.
     *
     * @private
     * @returns {Promise<void>}
     */
  private parse_services (): void {
    this.services.forEach((service: AlphaSyncTypes.Service) => {
      if (service.serviceId.includes('ContentDirectory')) {
        this.contentDirectoryDetails = service
      } else if (service.serviceId.includes('ConnectionManager')) {
        this.connectionManagerDetails = service
      } else if (service.serviceId.includes('XPushList')) {
        this.XPushListDetails = service
      } else if (service.serviceId.includes('DigitalImaging')) {
        this.digitalImagingDetails = service
      }
    })
  }

  /**
     * Initiates the service discovery process.
     *
     * @public
     * @returns {Promise<void>} Returns a promise that resolves when the discovery process is finished.
     * @throws Will throw an error if the discovery process fails.
     */
  public async discover_avaliable_services (): Promise<void> {
    try {
      await this.get_service_directory_object()
      await this.get_service_list()
      this.parse_services()
    } catch (error) {
      throw new Error('Error when discovering avaliable services')
    }
  }

  /**
     * Fetches the service list.
     *
     * @private
     * @returns {Promise<void>} Returns a promise that resolves when the service list is fetched.
     * @throws Will throw an error if the serviceDirectoryObject is undefined.
     */
  private async get_service_list (): Promise<void> {
    if (this.serviceDirectoryObject !== undefined) {
      this.services = this.serviceDirectoryObject.root?.device?.serviceList?.service
    } else {
      throw new Error('serviceDirectoryObject was not defined')
    }
  }

  /**
     * Constructs a URL with the provided suffix.
     *
     * @public
     * @param {string} suffix - The URL suffix.
     * @returns {string} Returns the constructed URL.
     */
  public construct_url (suffix: string): string {
    return 'http://' + this.serverIP + ':' + this.serverPort + suffix
  }

  /**
     * Sends a HTTP GET request to the provided URL and parses the response as XML.
     *
     * @public
     * @param {string} url - The URL to request from.
     * @returns {Promise<any>} Returns a promise that resolves with the parsed XML object.
     * @throws Will throw an error if the XML request fails.
     */
  public async requestXML (url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*'
        }
      })
      const XML = (await response.text())
      return this.parser.parse(XML)
    } catch (error) {
      throw new Error('Could not request XML from server')
    }
  }

  /**
     * Extracts the server IP and port from the provided URL.
     *
     * @private
     * @param {String} url - The URL to extract details from.
     */
  private scrape_service_discovery_url (url: string): void {
    const suffix: string = url.slice('http://'.length)

    const middle: string = suffix.split('/')[0]

    this.serverIP = middle.split(':')[0]
    this.serverPort = middle.split(':')[1]
  }

  /**
     * Fetches the service directory object.
     *
     * @private
     * @returns {Promise<void>} Returns a promise that resolves when the service directory object is fetched.
     * @throws Will throw an error if fetching the service directory object fails.
     */
  private async get_service_directory_object (): Promise<void> {
    const url = this.discoveredServiceDirectoryUrl.length === 0 ? this.assumedServiceDirectoryUrl : this.discoveredServiceDirectoryUrl
    this.scrape_service_discovery_url(url)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*'
        }
      })
      const serviceDiscoveryXML = (await response.text())
      this.serviceDirectoryObject = this.parser.parse(serviceDiscoveryXML)
    } catch (error) {
      console.error(error)
    }
  }

  /**
     * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
     *
     * @public
     * @param {number} waitFor - The maximum wait time in milliseconds.
     * @param {number} sendEvery - The interval in milliseconds to send the discovery message.
     * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
     * @throws Will throw an error if the SSDP process fails or if the camera is not found.
     */
  public async SSDP (waitFor: number, sendEvery: number): Promise<void> {
    // this.socket.bind(this.port, this.addr, () => { console.log('Socket is bound and Listening') })
    await new Promise<void>((resolve, reject) => {
      let timeoutId: number
      this.socket.on('message', (resp, rinfo) => {
        if (resp.toString().search('UPnP/1.0 SonyImagingDevice/1.0') !== -1) {
          this.serverDetails = resp.toString()
          this.socket.close()
          clearTimeout(timeoutId)
          clearTimeout(timeout)
          const idx = this.serverDetails.split(/\r?\n/).findIndex((keyValue) => keyValue.startsWith('LOCATION: '))
          this.discoveredServiceDirectoryUrl = this.serverDetails.split(/\r?\n/)[idx].slice('LOCATION: '.length)
          resolve()
        }
      })

      function loop (obj: Discovery): void {
        obj.send_disc_msg()
          .then(() => { timeoutId = setTimeout(loop, sendEvery) })
          .catch((error) => { console.error(error) })
      }

      loop(this)

      // const interval = setInterval(async () => {
      //   // called 5 times each time after one second
      //   // before getting cleared by below timeout.
      //   try {
      //     await this.send_disc_msg()
      //   } catch (error) {
      //     clearInterval(interval)
      //     clearTimeout(timeout)
      //     this.socket.close()
      //     reject(new Error('Error sending discovery message:'))
      //   }
      // }, sendEvery) // delay is in milliseconds

      const timeout = setTimeout(() => {
        clearTimeout(timeoutId) // clear above interval after 5 seconds
        this.socket.close()
        reject(new Error('Could not find the camera'))
      }, waitFor)
    })
  }

  /**
     * Sends a discovery message over the UDP socket.
     *
     * @private
     * @returns {Promise<void>} Returns a promise that resolves when the discovery message is successfully sent.
     * @throws Will throw an error if sending the discovery message fails.
     */
  private async send_disc_msg (): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.socket.send(this.discoveryMessage, this.discoveryPort, this.discoveryAddr, error => {
        if (error != null) {
          reject(error)
          this.socket.close()
        } else {
          resolve()
        }
      })
    })
  }
}

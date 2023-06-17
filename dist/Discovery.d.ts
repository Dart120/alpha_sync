import { XMLParser } from "fast-xml-parser";
import AlphaSyncTypes from "./Types";
/**
 * The Discovery class handles discovery and interaction with Sony Alpha Camera's services.
 * It employs UPnP (Universal Plug and Play) for service discovery and interaction.
 *
 * @class
 */
export declare class Discovery {
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
    private readonly socket;
    private readonly discoveryMessage;
    private readonly discoveryAddr;
    private readonly discoveryPort;
    private readonly assumedServiceDirectoryUrl;
    private discoveredServiceDirectoryUrl;
    private serverDetails;
    contentDirectoryDetails: AlphaSyncTypes.Service | undefined;
    digitalImagingDetails: AlphaSyncTypes.Service | undefined;
    XPushListDetails: AlphaSyncTypes.Service | undefined;
    connectionManagerDetails: AlphaSyncTypes.Service | undefined;
    serverIP: string;
    serverPort: string;
    private services;
    private serviceDirectoryObject;
    private parser;
    /**
      * Initializes an instance of Discovery class.
      *
      * @param {XMLParser} parser - The parser instance to parse responses.
      */
    constructor(parser: XMLParser);
    /**
     * Parses the services and assigns the service details to the appropriate properties.
     *
     * @private
     * @returns {Promise<void>}
     */
    private parse_services;
    /**
        * Initiates the service discovery process.
        *
        * @public
        * @returns {Promise<void>} Returns a promise that resolves when the discovery process is finished.
        * @throws Will throw an error if the discovery process fails.
        */
    discover_avaliable_services(): Promise<void>;
    /**
        * Fetches the service list.
        *
        * @private
        * @returns {Promise<void>} Returns a promise that resolves when the service list is fetched.
        * @throws Will throw an error if the serviceDirectoryObject is undefined.
        */
    private get_service_list;
    /**
       * Constructs a URL with the provided suffix.
       *
       * @public
       * @param {string} suffix - The URL suffix.
       * @returns {string} Returns the constructed URL.
       */
    construct_url(suffix: string): string;
    /**
       * Sends a HTTP GET request to the provided URL and parses the response as XML.
       *
       * @public
       * @param {string} url - The URL to request from.
       * @returns {Promise<any>} Returns a promise that resolves with the parsed XML object.
       * @throws Will throw an error if the XML request fails.
       */
    requestXML(url: string): Promise<any>;
    /**
      * Extracts the server IP and port from the provided URL.
      *
      * @private
      * @param {String} url - The URL to extract details from.
      */
    private scrape_service_discovery_url;
    /**
      * Fetches the service directory object.
      *
      * @private
      * @returns {Promise<void>} Returns a promise that resolves when the service directory object is fetched.
      * @throws Will throw an error if fetching the service directory object fails.
      */
    private get_service_directory_object;
    /**
      * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
      *
      * @public
      * @param {number} waitFor - The maximum wait time in milliseconds.
      * @param {number} sendEvery - The interval in milliseconds to send the discovery message.
      * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
      * @throws Will throw an error if the SSDP process fails or if the camera is not found.
      */
    SSDP(waitFor: number, sendEvery: number): Promise<void>;
    /**
       * Sends a discovery message over the UDP socket.
       *
       * @private
       * @returns {Promise<void>} Returns a promise that resolves when the discovery message is successfully sent.
       * @throws Will throw an error if sending the discovery message fails.
       */
    private send_disc_msg;
}
//# sourceMappingURL=Discovery.d.ts.map
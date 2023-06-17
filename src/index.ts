import fetch from 'node-fetch'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type AlphaSyncTypes from './Types'
import { Discovery } from './Discovery'
import { ContentDirectory } from './ContentDirectory'
import fs from 'fs'
import path from 'path'
import { type UPNPContainer, type UPNPImage } from './ContentDirectoryObjects'

/**
 * AlphaSync is a class responsible for discovering and interacting with Sony Alpha Camera's services.
 * It utilizes UPnP (Universal Plug and Play) to discover services and communicate with them.
 */
const URL_TIMEOUT: number = 50000
const SSDP_WAIT_FOR: number = 50000
const SSDP_SEND_EVERY: number = 3000
/**
 * @class
 *
 * Class responsible for discovery, interaction and synchronization with Sony Alpha Camera's services.
 */
export class AlphaSync {
  // Class Properties
  private readonly today = new Date()

  private readonly discovery: Discovery
  private contentDirectory: ContentDirectory | undefined
  private date_to_items: Record<string, UPNPImage[]> = {}
  private readonly builder = new XMLBuilder({ attributeNamePrefix: '@_', ignoreAttributes: false })
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true
  })

  /**
   * Initializes an instance of AlphaSync class.
   */
  constructor () {
    this.discovery = new Discovery(this.parser)
  }

  /**
   * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
   * @throws Will throw an error if the SSDP process fails.
   */
  public async ssdp () {
    await this.discovery.SSDP(SSDP_WAIT_FOR, SSDP_SEND_EVERY)
  }

  /**
   * Discovers the available services on the Sony Alpha Camera.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the discovery of services is finished.
   * @throws Will throw an error if the discovery process fails or if the Content Directory service is not found.
   */
  public async discover_avaliable_services () {
    await this.discovery.discover_avaliable_services()
    if (this.discovery.contentDirectoryDetails != null) {
      this.contentDirectory = new ContentDirectory(this.discovery.serverIP, this.discovery.serverPort, this.discovery.contentDirectoryDetails, this.parser, this.builder)
    }
  }

  /**
   * Generates the Content Directory tree of the Sony Alpha Camera.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
   * @throws Will throw an error if the Content Directory service is not found or discovered yet.
   */
  public async generate_tree () {
    if (this.contentDirectory != null) {
      await this.contentDirectory.generate_tree()
      this.date_to_items = this.contentDirectory.date_to_items
      let totalLength = 0
      for (const key in this.contentDirectory.date_to_items) {
        if (this.contentDirectory.date_to_items.hasOwnProperty(key)) {
          totalLength += this.contentDirectory.date_to_items[key].length
        }
      }
    } else {
      throw new Error('UPNP Content Directory service Not discovered yet')
    }
  }

  /**
   * Fetches a single image from the Digital Imaging service.
   *
   * @param {string} save_path - The path to save the fetched image.
   * @returns {Promise<void>} Returns a promise that resolves when the image is fetched and saved.
   * @throws Will throw an error if the Digital Imaging service is not discovered yet or if the image fetching process fails.
   */
  public async get_single_image (save_path: string): Promise<void> {
    await new Promise<void>(async (resolve, reject) => {
      if (this.discovery.digitalImagingDetails !== undefined) {
        const url: string = this.discovery.construct_url(this.discovery.digitalImagingDetails?.SCPDURL)
        try {
          const digitalImagingDescXML: AlphaSyncTypes.DigitalImagingDescXML = await this.discovery.requestXML(url)
          const imageSizes: AlphaSyncTypes.SingleImageSizes[] = digitalImagingDescXML.scpd.X_DigitalImagingDeviceInfo.X_CurrentContent_URL.X_CurrentContent_URL_URL
          const targetURL = imageSizes[imageSizes.length - 1]['#text']
          await this.download_from_url(targetURL, save_path)
          resolve()
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error('Need to discover DigitalImagingService first'))
      }
    })
  }

  /**
   * Fetches all images from a specific container in the Content Directory service.
   *
   * @param {UPNPContainer} container - The container to fetch images from.
   * @param {string} save_path - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the image fetching process fails.
   */
  public async get_all_images_from_container (container: UPNPContainer, save_path: string) {
    for (const child of container.children) {
      if (child['upnp:class'] == 'object.container') {
        await this.get_all_images_from_container(child, save_path)
      } else if (child['upnp:class'] == 'object.item.imageItem.photo') {
        await this.download_from_url(child.ORG, save_path, child['dc:title'])
      }
    }
  }

  /**
   * Fetches all images as per the date-to-items dictionary, where each date maps to multiple images.
   *
   * @param {string} save_path - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if there are no entries with specific keys in the record.
   */
  public async get_all_images_dict (save_path: string) {
    for (const key in this.date_to_items) {
      console.log(`downloading for date ${key}`)
      const p = path.join(save_path, key)
      const files = new Set()
      if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file) => {
          files.add(file)
          console.log(file)
        })
      }

      if (this.date_to_items.hasOwnProperty(key)) {
        const value = this.date_to_items[key]

        for (const image of value) {
          if (!files.has(image['dc:title']) && image['upnp:class'] === 'object.item.imageItem.photo') {
            console.log(`calling download for ${image['dc:title']}`)
            await this.download_from_url(image.ORG, path.join(save_path, key), image['dc:title'])
          } else {
            console.info(`Found ${image['dc:title']} in ${key} already, skipping!`)
          }
        }
      } else {
        throw new Error(`No entry with ${key} in record`)
      }
    }
  }

  /**
   * Fetches all images as per the Content Directory tree.
   *
   * @param {string} save_path - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the tree is not created yet. Run the generate_tree method before calling this method.
   */
  public async get_all_images_tree (save_path: string) {
    if ((this.contentDirectory?.root) != null) {
      await this.get_all_images_from_container(this.contentDirectory.root, save_path)
    } else {
      throw new Error('Tree not created, Run generate_tree')
    }
  }

  /**
   * Downloads an image from a specific URL.
   *
   * @private
   * @param {string} url - The URL of the image to be downloaded.
   * @param {string} save_path - The path to save the downloaded image.
   * @returns {Promise<void>} Returns a promise that resolves when the image is downloaded and saved.
   * @throws Will throw an error if the image downloading process fails.
   */
  private async download_from_url (url: string, save_path: string, name?: string) {
    await new Promise<void>(async (resolve, reject) => {
      try {
        console.log(`downloading ${name}`)
        const image = await fetch(url, {
          timeout: URL_TIMEOUT // wait for 5 seconds
        })

        if (!fs.existsSync(save_path)) {
          fs.mkdirSync(save_path, { recursive: true }) // The "recursive" option is for nested directories
        }

        if (name === undefined) {
          name = this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds()
        }

        const destination = fs.createWriteStream(path.join(save_path, `${name}`))
        await image.body.pipe(destination)
        console.log(`finished ${name}`)
        resolve()
      } catch (error) {
        reject(new Error(`While downloading images, could not download from ${url}`))
      }
    })
  }
}

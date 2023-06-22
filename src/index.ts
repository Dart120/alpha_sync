import fetch from 'node-fetch'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type AlphaSyncTypes from './Types'
import { Discovery } from './Discovery'
import { ContentDirectory } from './ContentDirectory'
import fs from 'fs-extra'
import path from 'path'
import { type UPNPVideo, type UPNPContainer, type UPNPImage } from './ContentDirectoryObjects'

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
  private port?: string = undefined
  private addr?: string = undefined
  private readonly discovery: Discovery
  private contentDirectory: ContentDirectory | undefined
  public date_to_items: Record<string, UPNPImage[]> = {}
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
   * @async
   * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
   * @throws Will throw an error if the SSDP process fails.
   */
  public async ssdp (): Promise<void> {
    await this.discovery.SSDP(SSDP_WAIT_FOR, SSDP_SEND_EVERY)
  }

  /**
   * Gets discovered url
   *
   * @returns {string} Returns the url discovered via ssdp
   */
  get cameraUrl (): string {
    return this.discovery.construct_url('')
  }

  /**
   * @async
   * Discovers the available services on the Sony Alpha Camera.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the discovery of services is finished.
   * @throws Will throw an error if the discovery process fails or if the Content Directory service is not found.
   */
  public async discover_avaliable_services (): Promise<void> {
    await this.discovery.discover_avaliable_services()
    this.addr = this.discovery.serverIP
    this.port = this.discovery.serverPort
    if (this.discovery.contentDirectoryDetails != null) {
      this.contentDirectory = new ContentDirectory(this.discovery.serverIP, this.discovery.serverPort, this.discovery.contentDirectoryDetails, this.parser, this.builder)
    }
  }

  /**
   * @async
   * Generates the Content Directory tree of the Sony Alpha Camera.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
   * @throws Will throw an error if the Content Directory service is not found or discovered yet.
   */
  public async generate_tree (): Promise<void> {
    if (this.contentDirectory != null) {
      await this.contentDirectory.generate_tree()
      this.date_to_items = this.contentDirectory.date_to_items
    } else {
      throw new Error('UPNP Content Directory service not discovered yet')
    }
  }

  /**
   * @async
   * Fetches a single image from the Digital Imaging service.
   *
   * @param {string} savePath - The path to save the fetched image.
   * @returns {Promise<void>} Returns a promise that resolves when the image is fetched and saved.
   * @throws Will throw an error if the Digital Imaging service is not discovered yet or if the image fetching process fails.
   */
  public async get_single_image (savePath: string): Promise<void> {
    if (this.discovery.digitalImagingDetails !== undefined) {
      const url: string = this.discovery.construct_url(this.discovery.digitalImagingDetails?.SCPDURL)
      try {
        const digitalImagingDescXML: AlphaSyncTypes.DigitalImagingDescXML = await this.discovery.requestXML(url)
        const imageSizes: AlphaSyncTypes.SingleImageSizes[] = digitalImagingDescXML.scpd.X_DigitalImagingDeviceInfo.X_CurrentContent_URL.X_CurrentContent_URL_URL
        const targetURL = imageSizes[imageSizes.length - 1]['#text']
        await this.download_from_url(targetURL, savePath)
      } catch (error) {
        throw new Error('Trouble downloading single image')
      }
    } else {
      throw new Error('Need to discover DigitalImagingService first')
    }
  }

  /**
   * @async
   * Fetches all images from a specific container in the Content Directory service.
   *
   * @param {UPNPContainer} container - The container to fetch images from.
   * @param {string} savePath - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the image fetching process fails.
   */
  public async get_all_images_from_container (container: UPNPContainer, savePath: string): Promise<void> {
    for (const child of container.children) {
      if (child['upnp:class'] === 'object.container') {
        await this.get_all_images_from_container(child, savePath)
      } else if (child['upnp:class'] === 'object.item.imageItem.photo') {
        await this.download_from_url(child.ORG, path.join(savePath, child['dc:title']))
      }
    }
  }

  /**
   * @async
   * Fetches all images taken between two specific dates.
   *
   * @param {string} savePath - The path where the fetched images will be saved.
   * @param {string[]} afterDate - The start date for fetching images, in the format ['YYYY', 'MM', 'DD'].
   * @param {string[]} beforeDate - The end date for fetching images, in the format ['YYYY', 'MM', 'DD'].
   * @returns {Promise<void>} Returns a promise that resolves when all images between the specified dates are fetched and saved.
   * @throws Will throw an error if the dates are not in the correct format, or if there's an error in the image downloading process.
   */
  public async get_all_between_two_dates (savePath: string, afterDate: string[], beforeDate: string[]): Promise<void> {
    if (afterDate.length !== 3 && beforeDate.length !== 3) {
      throw new Error('Dates must be in YYYY-MM-DD format')
    }

    const afterDateString = afterDate.join('-')
    const beforeDateString = beforeDate.join('-')
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!(regex.test(afterDateString) && regex.test(beforeDateString))) {
      throw new Error('Dates must be in YYYY-MM-DD format')
    }
    const afterDateObj = new Date(afterDate.join('-'))
    const beforeDateObj = new Date(beforeDate.join('-'))

    const validRecords = Object.fromEntries(Object.entries(this.date_to_items).filter(([key]) => {
      const currDate = new Date(key)
      return currDate <= beforeDateObj && currDate >= afterDateObj
    }))
    try {
      await this.get_all_images_from_dict(savePath, validRecords)
    } catch (error) {
      throw new Error('Error downloading images')
    }
  }

  /**
   * Returns a Set of filenames of all existing images for a specific date in a given path.
   *
   * @private
   * @param {string} key - Date for which images are checked.
   * @param {string} savePath - Path where images are saved.
   * @returns {Set<string>} Returns a set of filenames of existing images for the date specified.
   */
  private get_set_of_existing_images (key: string, savePath: string): Set<string> {
    const p = path.join(savePath, key)
    const files: Set<string> = new Set<string>()
    if (fs.existsSync(p)) {
      fs.readdirSync(p).forEach((file) => {
        files.add(file)
      })
    }
    return files
  }

  /**
   * Checks if an image already exists in a specified directory. If it does not, the image will be downloaded and saved.
   *
   * @private
   * @param {UPNPImage | UPNPVideo} item - The image or video to be checked.
   * @param {Set<string>} files - Set of existing file names in the directory.
   * @param {string} savePath - The path where the file would be saved.
   * @param {string} key - The key, typically a date string, used to identify the image or video in question.
   * @returns {Promise<void>} Returns a promise that resolves when the check and potential download are complete.
   * @throws Will throw an error if there's an issue in the image downloading process.
   */
  private async check_image_already_exists (item: UPNPImage | UPNPVideo, files: Set<string>, savePath: string, key: string): Promise<void> {
    if (!files.has(item['dc:title']) && item['upnp:class'] === 'object.item.imageItem.photo') {
      await this.download_from_url(item.ORG, path.join(savePath, key, item['dc:title']))
    } else {
      console.info(`Found ${item['dc:title']} in ${key} already, skipping!`)
    }
  }

  /**
   * @async
   * Fetches all images from a provided dictionary, where each date maps to multiple images.
   *
   * @param {string} savePath - The path where the fetched images will be saved.
   * @param {Record<string, UPNPImage[]>} [dict] - An optional dictionary parameter where each key (date string) maps to an array of UPNPImage objects. If not provided, the function will use the `date_to_items` property of the class.
   * @returns {Promise<void>} Returns a promise that resolves when all images from the dictionary are fetched and saved.
   * @throws Will throw an error if there are no entries with specific keys in the record or if there's an error in the image downloading process.
   */
  public async get_all_images_from_dict (savePath: string, dict?: Record<string, UPNPImage[]>): Promise<void> {
    if (dict === undefined) {
      dict = this.date_to_items
    }
    for (const key in dict) {
      const files: Set<string> = this.get_set_of_existing_images(key, savePath)

      const value = this.date_to_items[key]

      for (const item of value) {
        await this.check_image_already_exists(item, files, savePath, key)
      }
    }
  }

  /**
   * @async
   * Fetches all images as per the Content Directory tree.
   *
   * @param {string} savePath - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the tree is not created yet. Run the generate_tree method before calling this method.
   */
  public async get_all_images_tree (savePath: string): Promise<void> {
    if ((this.contentDirectory?.root) != null) {
      await this.get_all_images_from_container(this.contentDirectory.root, savePath)
    } else {
      throw new Error('Tree not created, Run generate_tree')
    }
  }

  /**
   * @async
   * Fetches all images from a specific date in the Content Directory service.
   *
   * @param {string} date - The date to fetch images from.
   * @param {string} savePath - The path to save the fetched images.
   * @returns {Promise<void>} A promise that resolves when all images are fetched and saved.
   * @throws {Error} If the image fetching process fails.
   */
  public async get_all_images_in_date (date: string, savePath: string): Promise<void> {
    if (this.date_to_items[date] !== undefined) {
      const files = this.get_set_of_existing_images(date, savePath)
      for (const item of this.date_to_items[date]) {
        try {
          await this.check_image_already_exists(item, files, savePath, date)
        } catch (error) {
          throw new Error(`Download of date ${date} failed `)
        }
      }
    } else {
      throw new Error('Date not in Record')
    }
  }

  /**
   * @async
   * Downloads an image from a specific URL.
   *
   * @public
   * @param {string} url - The URL of the image to be downloaded.
   * @param {string} savePath - The path to save the downloaded image.
   * @returns {Promise<void>} Returns a promise that resolves when the image is downloaded and saved.
   * @throws Will throw an error if the image downloading process fails.
   */
  public async download_from_url (url: string, savePath: string): Promise<void> {
    const names = savePath.split('/')
    const noName = names.slice(0, names.length - 2).join('/')
    try {
      const image = await fetch(url, {
        timeout: URL_TIMEOUT // wait for 5 seconds
      })
      await fs.remove(savePath) // Remove existing file or directory
      await fs.ensureDir(noName) // Create the directory

      const fileStream = fs.createWriteStream(savePath, { flags: 'w' })
      image.body.pipe(fileStream)
    } catch (error) {
      throw new Error(`While downloading images, could not download from ${url}: ${error as string}`)
    }
  }
}

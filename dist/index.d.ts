import { UPNPContainer } from './ContentDirectoryObjects';
/**
 * @class
 *
 * Class responsible for discovery, interaction and synchronization with Sony Alpha Camera's services.
 */
export declare class AlphaSync {
    private today;
    private discovery;
    private contentDirectory;
    private date_to_items;
    private readonly builder;
    private readonly parser;
    /**
     * Initializes an instance of AlphaSync class.
     */
    constructor();
    /**
     * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
     * @throws Will throw an error if the SSDP process fails.
     */
    ssdp(): Promise<void>;
    /**
     * Discovers the available services on the Sony Alpha Camera.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the discovery of services is finished.
     * @throws Will throw an error if the discovery process fails or if the Content Directory service is not found.
     */
    discover_avaliable_services(): Promise<void>;
    /**
     * Generates the Content Directory tree of the Sony Alpha Camera.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
     * @throws Will throw an error if the Content Directory service is not found or discovered yet.
     */
    generate_tree(): Promise<void>;
    /**
       * Fetches a single image from the Digital Imaging service.
       *
       * @param {string} save_path - The path to save the fetched image.
       * @returns {Promise<void>} Returns a promise that resolves when the image is fetched and saved.
       * @throws Will throw an error if the Digital Imaging service is not discovered yet or if the image fetching process fails.
       */
    get_single_image(save_path: string): Promise<void>;
    /**
     * Fetches all images from a specific container in the Content Directory service.
     *
     * @param {UPNPContainer} container - The container to fetch images from.
     * @param {string} save_path - The path to save the fetched images.
     * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
     * @throws Will throw an error if the image fetching process fails.
     */
    get_all_images_from_container(container: UPNPContainer, save_path: string): Promise<void>;
    /**
     * Fetches all images as per the date-to-items dictionary, where each date maps to multiple images.
     *
     * @param {string} save_path - The path to save the fetched images.
     * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
     * @throws Will throw an error if there are no entries with specific keys in the record.
     */
    get_all_images_dict(save_path: string): Promise<void>;
    /**
   * Fetches all images as per the Content Directory tree.
   *
   * @param {string} save_path - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the tree is not created yet. Run the generate_tree method before calling this method.
   */
    get_all_images_tree(save_path: string): Promise<void>;
    /**
      * Downloads an image from a specific URL.
      *
      * @private
      * @param {string} url - The URL of the image to be downloaded.
      * @param {string} save_path - The path to save the downloaded image.
      * @returns {Promise<void>} Returns a promise that resolves when the image is downloaded and saved.
      * @throws Will throw an error if the image downloading process fails.
      */
    private download_from_url;
}
//# sourceMappingURL=index.d.ts.map
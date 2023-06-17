import { XMLParser, XMLBuilder } from "fast-xml-parser";
import AlphaSyncTypes from "./Types";
import { UPNPContainer, UPNPImage } from './ContentDirectoryObjects';
/**
 * @class
 *
 * Class responsible for interacting with Sony Alpha Camera's Content Directory services.
 * It utilizes UPnP (Universal Plug and Play) to interact with the services.
 */
export declare class ContentDirectory {
    service_details: AlphaSyncTypes.Service;
    IP: string;
    PORT: string;
    private parser;
    private builder;
    root?: UPNPContainer;
    date_to_items: Record<string, UPNPImage[]>;
    /**
   * Initializes an instance of ContentDirectory class.
   *
   * @param {string} IP - The IP address of the device.
   * @param {string} PORT - The port number of the device.
   * @param {AlphaSyncTypes.Service} contentDirectoryDetails - The details of the Content Directory service.
   * @param {XMLParser} parser - An XML parser instance.
   * @param {XMLBuilder} builder - An XML builder instance.
   */
    constructor(IP: string, PORT: string, contentDirectoryDetails: AlphaSyncTypes.Service, parser: XMLParser, builder: XMLBuilder);
    /**
         * Constructs the browse XML for the Browse request.
         *
         * @private
         * @param {BrowseRequestObject} browseRequestObject - The Browse request object.
         * @returns {string} Returns the Browse XML string.
         */
    private construct_browse_xml;
    /**
     * Sends a browse request to the Content Directory service.
     *
     * @private
     * @param {BrowseRequestObject} browseRequestObject - The browse request object.
     * @returns {Promise<string>} Returns a promise that resolves to the response body of the SOAP request.
     * @throws Will throw an error if the SOAP request fails.
     */
    private send_browse_request;
    /**
      * Parses the response of a browse request.
      *
      * @private
      * @param {string} xml_text_resp - The XML text response of the browse request.
      * @returns {BrowseResponseObject} Returns the parsed BrowseResponseObject.
      */
    private parse_browse_response;
    /**
     * This method constructs a URL from a given suffix.
     *
     * @param {string} suffix - The URL suffix.
     */
    private construct_url;
    /**
      * Parses a container XML string.
      *
      * @private
      * @param {string} container_data - The container XML string.
      * @returns {UPNPContainer} Returns the parsed UPNPContainer object.
      */
    private parse_container;
    /**
       * Parses an items XML string.
       *
       * @private
       * @param {string} item_data - The items XML string.
       * @returns {UPNPImage[]} Returns an array of parsed UPNPImage objects.
       */
    private parse_items;
    /**
       * Generates a Browse request object that returns all direct children of a specified parent object.
       *
       * @private
       * @param {string} parentID - The ID of the parent object.
       * @returns {BrowseRequestObject} Returns the generated Browse request object.
       */
    private generate_return_all_browse_request;
    /**
   * Generates the Content Directory tree.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
   * @throws Will throw an error if the tree generation fails.
   */
    generate_tree(): Promise<void>;
    /**
      * Populates the children of a given node.
      *
      * @private
      * @param {UPNPContainer} node - The node to populate the children of.
      * @returns {Promise<void>} Returns a promise that resolves when the children are populated.
      */
    private populate_children_of;
}
//# sourceMappingURL=ContentDirectory.d.ts.map
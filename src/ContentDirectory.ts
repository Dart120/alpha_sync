import soapRequest from 'easy-soap-request'
import { XMLParser, XMLBuilder } from "fast-xml-parser"
import AlphaSyncTypes from "./Types"
import { BrowseRequestObject, BrowseResponseObject, UPNPContainer, UPNPImage } from './ContentDirectoryObjects'


/**
 * @class
 * 
 * Class responsible for interacting with Sony Alpha Camera's Content Directory services.
 * It utilizes UPnP (Universal Plug and Play) to interact with the services.
 */
export class ContentDirectory {
    // Class Properties
    service_details: AlphaSyncTypes.Service
    IP:string
    PORT:string
    private parser: XMLParser
    private builder: XMLBuilder
    root?: UPNPContainer
    date_to_items: Record<string, UPNPImage[]> = {};
 
   
    /**
   * Initializes an instance of ContentDirectory class.
   *
   * @param {string} IP - The IP address of the device.
   * @param {string} PORT - The port number of the device.
   * @param {AlphaSyncTypes.Service} contentDirectoryDetails - The details of the Content Directory service.
   * @param {XMLParser} parser - An XML parser instance.
   * @param {XMLBuilder} builder - An XML builder instance.
   */
   constructor (IP: string, PORT: string, contentDirectoryDetails: AlphaSyncTypes.Service, parser:XMLParser, builder:XMLBuilder) {
    this.service_details = contentDirectoryDetails
    this.IP = IP
    this.PORT = PORT
    this.builder = builder
    this.parser = parser

   }
 
/**
     * Constructs the browse XML for the Browse request.
     *
     * @private
     * @param {BrowseRequestObject} browseRequestObject - The Browse request object.
     * @returns {string} Returns the Browse XML string.
     */
 private construct_browse_xml(browseRequestObject: BrowseRequestObject): string {
    let finalBrowseRequestObject = {
        "u:Browse" : {
            "@_xmlns:u" : "urn:schemas-upnp-org:service:ContentDirectory:1",
            ...browseRequestObject
        }
    }
    let xml = '<?xml version="1.0" encoding= "UTF-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>' + this.builder.build(finalBrowseRequestObject) + "    </s:Body></s:Envelope>"
    return xml
 }
  /**
   * Sends a browse request to the Content Directory service.
   *
   * @private
   * @param {BrowseRequestObject} browseRequestObject - The browse request object.
   * @returns {Promise<string>} Returns a promise that resolves to the response body of the SOAP request.
   * @throws Will throw an error if the SOAP request fails.
   */
 private async send_browse_request(browseRequestObject: BrowseRequestObject): Promise<string>{
    let browseXML: string = this.construct_browse_xml(browseRequestObject)
    const url = this.construct_url(this.service_details.controlURL)
    const pheaders = {
        "Content-Type":"text/xml",
        "Accept-Language":"en-gb",
        "SOAPACTION":'"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        "Accept-Encoding":"gzip, deflate"
    };
   
    try{
        const { response } = await soapRequest({ url: url, headers: pheaders, xml: browseXML, timeout: 60000 ,maxContentLength: 1000 * 1024 * 1024, // 10MB
        maxBodyLength: 1000 * 1024 * 1024});
        const { headers, body, statusCode } = response;
   
        return body
    }catch(error){
      
        throw new Error('Could not send browse request')
    }
   // Optional timeout parameter(milliseconds)
 
 }
 /**
   * Parses the response of a browse request.
   *
   * @private
   * @param {string} xml_text_resp - The XML text response of the browse request.
   * @returns {BrowseResponseObject} Returns the parsed BrowseResponseObject.
   */
 private parse_browse_response(xml_text_resp: string): BrowseResponseObject{
    let obj_response = this.parser.parse(xml_text_resp)
    return obj_response['s:Envelope']['s:Body']['u:BrowseResponse']
 }
   /**
    * This method constructs a URL from a given suffix.
    *
    * @param {string} suffix - The URL suffix.
    */
   private construct_url(suffix: string) {
    return 'http://' + this.IP + ':' + this.PORT + suffix
  }
   /**
     * Parses a container XML string.
     *
     * @private
     * @param {string} container_data - The container XML string.
     * @returns {UPNPContainer} Returns the parsed UPNPContainer object.
     */
  private parse_container(container_data: string): UPNPContainer{
    let obj_response = this.parser.parse(container_data)
    let res = obj_response['DIDL-Lite'].container
    return res
  }
  /**
     * Parses an items XML string.
     *
     * @private
     * @param {string} item_data - The items XML string.
     * @returns {UPNPImage[]} Returns an array of parsed UPNPImage objects.
     */
  private parse_items(item_data: string): UPNPImage[]{
    let obj_response = this.parser.parse(item_data)
    // console.log(obj_response,'bare resp')
    let res = obj_response['DIDL-Lite']['item']
    if (!Array.isArray(res)){
        res = [res]
    }
    res = res.map((image_meta:any) => {
        
        // return image_meta.assign

        image_meta.res.forEach((image: any) => {
            if (image['#text'].includes('LRG_')){
                image_meta = Object.assign({LRG:image['#text']},image_meta)
               
            } else if (image['#text'].includes('ORG_')){
                image_meta = Object.assign({ORG:image['#text']},image_meta)
            } else if (image['#text'].includes('SM_')){
                image_meta = Object.assign({SM:image['#text']},image_meta)
            } else if (image['#text'].includes('TN_')){
                image_meta = Object.assign({TN:image['#text']},image_meta)
            }
        })
        // console.log(image_meta)
        return image_meta
    })
    // console.log(res)
    return res
  }
  /**
     * Generates a Browse request object that returns all direct children of a specified parent object.
     *
     * @private
     * @param {string} parentID - The ID of the parent object.
     * @returns {BrowseRequestObject} Returns the generated Browse request object.
     */
  private generate_return_all_browse_request(parentID:string): BrowseRequestObject{
    return {
        ObjectID:parentID,
        BrowseFlag: "BrowseDirectChildren",
        Filter:"*",
        StartingIndex:0,
        RequestedCount:0,
        SortCriteria:""
}
  }
    /**
   * Generates the Content Directory tree.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
   * @throws Will throw an error if the tree generation fails.
   */
  public async generate_tree(){
    let xml = await this.send_browse_request(this.generate_return_all_browse_request('0'))
      let browse_resp = this.parse_browse_response(xml)
      this.root = this.parse_container(browse_resp.Result)
      this.root.children = []
      await this.populate_children_of(this.root)
      
      
  }
   /**
     * Populates the children of a given node.
     *
     * @private
     * @param {UPNPContainer} node - The node to populate the children of.
     * @returns {Promise<void>} Returns a promise that resolves when the children are populated.
     */
  private async populate_children_of(node: UPNPContainer){
    let xml = await this.send_browse_request(this.generate_return_all_browse_request(node['@_id']))
      let browse_resp = this.parse_browse_response(xml)
        
      let children: (UPNPContainer[] | UPNPImage[] | UPNPContainer | UPNPImage)
        if (browse_resp.Result.includes('<container')){
            children =  this.parse_container(browse_resp.Result) as (UPNPContainer[]| UPNPContainer)
        } else {
        
            children =  this.parse_items(browse_resp.Result)
           
            if (node['dc:title'] in this.date_to_items){
              this.date_to_items[node['dc:title']]= children as UPNPImage[]
            } else {
              this.date_to_items[node['dc:title']] = children as UPNPImage[]
            }
          
        }
        
      
        
   
    //   process.exit(0)
      if (Array.isArray(children)){
        for (const child of children) {
            if (child['upnp:class'] == "object.container"){
              child.children = []
              await this.populate_children_of(child)
            }
            node.children.push(child)
          }
      } else {
        if (children['upnp:class'] == "object.container"){
            children.children = []
            await this.populate_children_of(children)
        }
        node.children.push(children)
      }
    //   console.log(node)
  }
 
 }

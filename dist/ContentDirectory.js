"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentDirectory = void 0;
var easy_soap_request_1 = __importDefault(require("easy-soap-request"));
/**
 * @class
 *
 * Class responsible for interacting with Sony Alpha Camera's Content Directory services.
 * It utilizes UPnP (Universal Plug and Play) to interact with the services.
 */
var ContentDirectory = /** @class */ (function () {
    /**
   * Initializes an instance of ContentDirectory class.
   *
   * @param {string} IP - The IP address of the device.
   * @param {string} PORT - The port number of the device.
   * @param {AlphaSyncTypes.Service} contentDirectoryDetails - The details of the Content Directory service.
   * @param {XMLParser} parser - An XML parser instance.
   * @param {XMLBuilder} builder - An XML builder instance.
   */
    function ContentDirectory(IP, PORT, contentDirectoryDetails, parser, builder) {
        this.date_to_items = {};
        this.service_details = contentDirectoryDetails;
        this.IP = IP;
        this.PORT = PORT;
        this.builder = builder;
        this.parser = parser;
    }
    /**
         * Constructs the browse XML for the Browse request.
         *
         * @private
         * @param {BrowseRequestObject} browseRequestObject - The Browse request object.
         * @returns {string} Returns the Browse XML string.
         */
    ContentDirectory.prototype.construct_browse_xml = function (browseRequestObject) {
        var finalBrowseRequestObject = {
            "u:Browse": __assign({ "@_xmlns:u": "urn:schemas-upnp-org:service:ContentDirectory:1" }, browseRequestObject)
        };
        var xml = '<?xml version="1.0" encoding= "UTF-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>' + this.builder.build(finalBrowseRequestObject) + "    </s:Body></s:Envelope>";
        return xml;
    };
    /**
     * Sends a browse request to the Content Directory service.
     *
     * @private
     * @param {BrowseRequestObject} browseRequestObject - The browse request object.
     * @returns {Promise<string>} Returns a promise that resolves to the response body of the SOAP request.
     * @throws Will throw an error if the SOAP request fails.
     */
    ContentDirectory.prototype.send_browse_request = function (browseRequestObject) {
        return __awaiter(this, void 0, void 0, function () {
            var browseXML, url, pheaders, response, headers, body, statusCode, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browseXML = this.construct_browse_xml(browseRequestObject);
                        url = this.construct_url(this.service_details.controlURL);
                        pheaders = {
                            "Content-Type": "text/xml",
                            "Accept-Language": "en-gb",
                            "SOAPACTION": '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
                            "Accept-Encoding": "gzip, deflate"
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, easy_soap_request_1.default)({ url: url, headers: pheaders, xml: browseXML, timeout: 60000, maxContentLength: 1000 * 1024 * 1024,
                                maxBodyLength: 1000 * 1024 * 1024 })];
                    case 2:
                        response = (_a.sent()).response;
                        headers = response.headers, body = response.body, statusCode = response.statusCode;
                        return [2 /*return*/, body];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error('Could not send browse request');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
      * Parses the response of a browse request.
      *
      * @private
      * @param {string} xml_text_resp - The XML text response of the browse request.
      * @returns {BrowseResponseObject} Returns the parsed BrowseResponseObject.
      */
    ContentDirectory.prototype.parse_browse_response = function (xml_text_resp) {
        var obj_response = this.parser.parse(xml_text_resp);
        return obj_response['s:Envelope']['s:Body']['u:BrowseResponse'];
    };
    /**
     * This method constructs a URL from a given suffix.
     *
     * @param {string} suffix - The URL suffix.
     */
    ContentDirectory.prototype.construct_url = function (suffix) {
        return 'http://' + this.IP + ':' + this.PORT + suffix;
    };
    /**
      * Parses a container XML string.
      *
      * @private
      * @param {string} container_data - The container XML string.
      * @returns {UPNPContainer} Returns the parsed UPNPContainer object.
      */
    ContentDirectory.prototype.parse_container = function (container_data) {
        var obj_response = this.parser.parse(container_data);
        var res = obj_response['DIDL-Lite'].container;
        return res;
    };
    /**
       * Parses an items XML string.
       *
       * @private
       * @param {string} item_data - The items XML string.
       * @returns {UPNPImage[]} Returns an array of parsed UPNPImage objects.
       */
    ContentDirectory.prototype.parse_items = function (item_data) {
        var obj_response = this.parser.parse(item_data);
        // console.log(obj_response,'bare resp')
        var res = obj_response['DIDL-Lite']['item'];
        if (!Array.isArray(res)) {
            res = [res];
        }
        res = res.map(function (image_meta) {
            // return image_meta.assign
            image_meta.res.forEach(function (image) {
                if (image['#text'].includes('LRG_')) {
                    image_meta = Object.assign({ LRG: image['#text'] }, image_meta);
                }
                else if (image['#text'].includes('ORG_')) {
                    image_meta = Object.assign({ ORG: image['#text'] }, image_meta);
                }
                else if (image['#text'].includes('SM_')) {
                    image_meta = Object.assign({ SM: image['#text'] }, image_meta);
                }
                else if (image['#text'].includes('TN_')) {
                    image_meta = Object.assign({ TN: image['#text'] }, image_meta);
                }
            });
            // console.log(image_meta)
            return image_meta;
        });
        // console.log(res)
        return res;
    };
    /**
       * Generates a Browse request object that returns all direct children of a specified parent object.
       *
       * @private
       * @param {string} parentID - The ID of the parent object.
       * @returns {BrowseRequestObject} Returns the generated Browse request object.
       */
    ContentDirectory.prototype.generate_return_all_browse_request = function (parentID) {
        return {
            ObjectID: parentID,
            BrowseFlag: "BrowseDirectChildren",
            Filter: "*",
            StartingIndex: 0,
            RequestedCount: 0,
            SortCriteria: ""
        };
    };
    /**
   * Generates the Content Directory tree.
   *
   * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
   * @throws Will throw an error if the tree generation fails.
   */
    ContentDirectory.prototype.generate_tree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xml, browse_resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send_browse_request(this.generate_return_all_browse_request('0'))];
                    case 1:
                        xml = _a.sent();
                        browse_resp = this.parse_browse_response(xml);
                        this.root = this.parse_container(browse_resp.Result);
                        this.root.children = [];
                        return [4 /*yield*/, this.populate_children_of(this.root)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
      * Populates the children of a given node.
      *
      * @private
      * @param {UPNPContainer} node - The node to populate the children of.
      * @returns {Promise<void>} Returns a promise that resolves when the children are populated.
      */
    ContentDirectory.prototype.populate_children_of = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var xml, browse_resp, children, _i, children_1, child;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send_browse_request(this.generate_return_all_browse_request(node['@_id']))];
                    case 1:
                        xml = _a.sent();
                        browse_resp = this.parse_browse_response(xml);
                        if (browse_resp.Result.includes('<container')) {
                            children = this.parse_container(browse_resp.Result);
                        }
                        else {
                            children = this.parse_items(browse_resp.Result);
                            if (node['dc:title'] in this.date_to_items) {
                                this.date_to_items[node['dc:title']] = children;
                            }
                            else {
                                this.date_to_items[node['dc:title']] = children;
                            }
                        }
                        if (!Array.isArray(children)) return [3 /*break*/, 7];
                        _i = 0, children_1 = children;
                        _a.label = 2;
                    case 2:
                        if (!(_i < children_1.length)) return [3 /*break*/, 6];
                        child = children_1[_i];
                        if (!(child['upnp:class'] == "object.container")) return [3 /*break*/, 4];
                        child.children = [];
                        return [4 /*yield*/, this.populate_children_of(child)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        node.children.push(child);
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 10];
                    case 7:
                        if (!(children['upnp:class'] == "object.container")) return [3 /*break*/, 9];
                        children.children = [];
                        return [4 /*yield*/, this.populate_children_of(children)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        node.children.push(children);
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return ContentDirectory;
}());
exports.ContentDirectory = ContentDirectory;

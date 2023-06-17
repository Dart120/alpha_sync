"use strict";
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
exports.Discovery = void 0;
var dgram_1 = __importDefault(require("dgram"));
var node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * The Discovery class handles discovery and interaction with Sony Alpha Camera's services.
 * It employs UPnP (Universal Plug and Play) for service discovery and interaction.
 *
 * @class
 */
var Discovery = /** @class */ (function () {
    /**
      * Initializes an instance of Discovery class.
      *
      * @param {XMLParser} parser - The parser instance to parse responses.
      */
    function Discovery(parser) {
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
        this.socket = dgram_1.default.createSocket('udp4');
        this.discoveryMessage = Buffer.from('M-SEARCH * HTTP/1.1\r\n' + 'HOST:239.255.255.250:1900\r\n' + 'ST:upnp:rootdevice\r\n' + 'MX:2\r\n' + 'MAN:"ssdp:discover"\r\n' + '\r\n');
        this.discoveryAddr = '239.255.255.250';
        this.discoveryPort = 1900;
        this.assumedServiceDirectoryUrl = "http://192.168.122.1:64321/dd.xml";
        this.discoveredServiceDirectoryUrl = '';
        this.serverDetails = '';
        this.serverIP = '';
        this.serverPort = '';
        this.services = [];
        this.serviceDirectoryObject = undefined;
        this.parser = parser;
    }
    /**
     * Parses the services and assigns the service details to the appropriate properties.
     *
     * @private
     * @returns {Promise<void>}
     */
    Discovery.prototype.parse_services = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.services.forEach(function (service) {
                    if (service.serviceId.includes('ContentDirectory')) {
                        _this.contentDirectoryDetails = service;
                    }
                    else if (service.serviceId.includes('ConnectionManager')) {
                        _this.connectionManagerDetails = service;
                    }
                    else if (service.serviceId.includes('XPushList')) {
                        _this.XPushListDetails = service;
                    }
                    else if (service.serviceId.includes('DigitalImaging')) {
                        _this.digitalImagingDetails = service;
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    /**
        * Initiates the service discovery process.
        *
        * @public
        * @returns {Promise<void>} Returns a promise that resolves when the discovery process is finished.
        * @throws Will throw an error if the discovery process fails.
        */
    Discovery.prototype.discover_avaliable_services = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, this.get_service_directory_object()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.get_service_list()];
                                    case 2:
                                        _a.sent();
                                        this.parse_services();
                                        resolve();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        reject(new Error('Error when discovering avaliable services'));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
        * Fetches the service list.
        *
        * @private
        * @returns {Promise<void>} Returns a promise that resolves when the service list is fetched.
        * @throws Will throw an error if the serviceDirectoryObject is undefined.
        */
    Discovery.prototype.get_service_list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                if (this.serviceDirectoryObject !== undefined) {
                                    this.services = (_c = (_b = (_a = this.serviceDirectoryObject.root) === null || _a === void 0 ? void 0 : _a.device) === null || _b === void 0 ? void 0 : _b.serviceList) === null || _c === void 0 ? void 0 : _c.service;
                                    resolve();
                                }
                                else {
                                    reject(new Error("serviceDirectoryObject was not defined"));
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
       * Constructs a URL with the provided suffix.
       *
       * @public
       * @param {string} suffix - The URL suffix.
       * @returns {string} Returns the constructed URL.
       */
    Discovery.prototype.construct_url = function (suffix) {
        return 'http://' + this.serverIP + ':' + this.serverPort + suffix;
    };
    /**
       * Sends a HTTP GET request to the provided URL and parses the response as XML.
       *
       * @public
       * @param {string} url - The URL to request from.
       * @returns {Promise<any>} Returns a promise that resolves with the parsed XML object.
       * @throws Will throw an error if the XML request fails.
       */
    Discovery.prototype.requestXML = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var response, XML, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                                            method: 'GET',
                                            headers: {
                                                Accept: '*/*'
                                            }
                                        })];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.text()];
                                case 2:
                                    XML = (_a.sent());
                                    resolve(this.parser.parse(XML));
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    reject(new Error('Could not request XML from server'));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
      * Extracts the server IP and port from the provided URL.
      *
      * @private
      * @param {String} url - The URL to extract details from.
      */
    Discovery.prototype.scrape_service_discovery_url = function (url) {
        var suffix = url.slice('http://'.length);
        var middle = suffix.split('/')[0];
        this.serverIP = middle.split(':')[0];
        this.serverPort = middle.split(':')[1];
    };
    /**
      * Fetches the service directory object.
      *
      * @private
      * @returns {Promise<void>} Returns a promise that resolves when the service directory object is fetched.
      * @throws Will throw an error if fetching the service directory object fails.
      */
    Discovery.prototype.get_service_directory_object = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var url, response, serviceDiscoveryXML, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = this.discoveredServiceDirectoryUrl.length === 0 ? this.assumedServiceDirectoryUrl : this.discoveredServiceDirectoryUrl;
                                        this.scrape_service_discovery_url(url);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                                                method: 'GET',
                                                headers: {
                                                    Accept: '*/*'
                                                }
                                            })];
                                    case 2:
                                        response = _a.sent();
                                        return [4 /*yield*/, response.text()];
                                    case 3:
                                        serviceDiscoveryXML = (_a.sent());
                                        this.serviceDirectoryObject = this.parser.parse(serviceDiscoveryXML);
                                        resolve();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_3 = _a.sent();
                                        reject(error_3);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
      * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
      *
      * @public
      * @param {number} waitFor - The maximum wait time in milliseconds.
      * @param {number} sendEvery - The interval in milliseconds to send the discovery message.
      * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
      * @throws Will throw an error if the SSDP process fails or if the camera is not found.
      */
    Discovery.prototype.SSDP = function (waitFor, sendEvery) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // this.socket.bind(this.port, this.addr, () => { console.log('Socket is bound and Listening') })
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            _this.socket.on('message', function (resp, rinfo) {
                                if (resp.toString().search('UPnP/1.0 SonyImagingDevice/1.0') !== -1) {
                                    _this.serverDetails = resp.toString();
                                    _this.socket.close();
                                    clearInterval(interval);
                                    clearTimeout(timeout);
                                    var idx = _this.serverDetails.split(/\r?\n/).findIndex(function (keyValue) { return keyValue.startsWith('LOCATION: '); });
                                    _this.discoveredServiceDirectoryUrl = _this.serverDetails.split(/\r?\n/)[idx].slice('LOCATION: '.length);
                                    resolve();
                                }
                            });
                            var interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.send_disc_msg()];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_4 = _a.sent();
                                            clearInterval(interval);
                                            clearTimeout(timeout);
                                            this.socket.close();
                                            reject(new Error('Error sending discovery message:'));
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, sendEvery); // delay is in milliseconds
                            var timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    clearInterval(interval); // clear above interval after 5 seconds
                                    this.socket.close();
                                    reject(new Error('Could not find the camera'));
                                    return [2 /*return*/];
                                });
                            }); }, waitFor);
                        })];
                    case 1:
                        // this.socket.bind(this.port, this.addr, () => { console.log('Socket is bound and Listening') })
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
       * Sends a discovery message over the UDP socket.
       *
       * @private
       * @returns {Promise<void>} Returns a promise that resolves when the discovery message is successfully sent.
       * @throws Will throw an error if sending the discovery message fails.
       */
    Discovery.prototype.send_disc_msg = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            _this.socket.send(_this.discoveryMessage, _this.discoveryPort, _this.discoveryAddr, function (error) {
                                if (error) {
                                    reject(error);
                                    _this.socket.close();
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Discovery;
}());
exports.Discovery = Discovery;

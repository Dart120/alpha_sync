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
exports.AlphaSync = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var fast_xml_parser_1 = require("fast-xml-parser");
var Discovery_1 = require("./Discovery");
var ContentDirectory_1 = require("./ContentDirectory");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
/**
 * AlphaSync is a class responsible for discovering and interacting with Sony Alpha Camera's services.
 * It utilizes UPnP (Universal Plug and Play) to discover services and communicate with them.
 */
var URL_TIMEOUT = 50000;
var SSDP_WAIT_FOR = 50000;
var SSDP_SEND_EVERY = 3000;
/**
 * @class
 *
 * Class responsible for discovery, interaction and synchronization with Sony Alpha Camera's services.
 */
var AlphaSync = /** @class */ (function () {
    /**
     * Initializes an instance of AlphaSync class.
     */
    function AlphaSync() {
        // Class Properties
        this.today = new Date();
        this.date_to_items = {};
        this.builder = new fast_xml_parser_1.XMLBuilder({ attributeNamePrefix: "@_", ignoreAttributes: false });
        this.parser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true
        });
        this.discovery = new Discovery_1.Discovery(this.parser);
    }
    /**
     * Initiates the SSDP (Simple Service Discovery Protocol) process for service discovery.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the SSDP process is finished.
     * @throws Will throw an error if the SSDP process fails.
     */
    AlphaSync.prototype.ssdp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.discovery.SSDP(SSDP_WAIT_FOR, SSDP_SEND_EVERY)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Discovers the available services on the Sony Alpha Camera.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the discovery of services is finished.
     * @throws Will throw an error if the discovery process fails or if the Content Directory service is not found.
     */
    AlphaSync.prototype.discover_avaliable_services = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.discovery.discover_avaliable_services()];
                    case 1:
                        _a.sent();
                        if (this.discovery.contentDirectoryDetails) {
                            this.contentDirectory = new ContentDirectory_1.ContentDirectory(this.discovery.serverIP, this.discovery.serverPort, this.discovery.contentDirectoryDetails, this.parser, this.builder);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates the Content Directory tree of the Sony Alpha Camera.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the tree generation is finished.
     * @throws Will throw an error if the Content Directory service is not found or discovered yet.
     */
    AlphaSync.prototype.generate_tree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalLength, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentDirectory) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contentDirectory.generate_tree()];
                    case 1:
                        _a.sent();
                        this.date_to_items = this.contentDirectory.date_to_items;
                        totalLength = 0;
                        for (key in this.contentDirectory.date_to_items) {
                            if (this.contentDirectory.date_to_items.hasOwnProperty(key)) {
                                totalLength += this.contentDirectory.date_to_items[key].length;
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2: throw new Error('UPNP Content Directory service Not discovered yet');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
       * Fetches a single image from the Digital Imaging service.
       *
       * @param {string} save_path - The path to save the fetched image.
       * @returns {Promise<void>} Returns a promise that resolves when the image is fetched and saved.
       * @throws Will throw an error if the Digital Imaging service is not discovered yet or if the image fetching process fails.
       */
    AlphaSync.prototype.get_single_image = function (save_path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, digitalImagingDescXML, imageSizes, targetURL, error_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(this.discovery.digitalImagingDetails !== undefined)) return [3 /*break*/, 6];
                                    url = this.discovery.construct_url((_a = this.discovery.digitalImagingDetails) === null || _a === void 0 ? void 0 : _a.SCPDURL);
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, this.discovery.requestXML(url)];
                                case 2:
                                    digitalImagingDescXML = _b.sent();
                                    imageSizes = digitalImagingDescXML.scpd.X_DigitalImagingDeviceInfo.X_CurrentContent_URL.X_CurrentContent_URL_URL;
                                    targetURL = imageSizes[imageSizes.length - 1]['#text'];
                                    return [4 /*yield*/, this.download_from_url(targetURL, save_path)];
                                case 3:
                                    _b.sent();
                                    resolve();
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _b.sent();
                                    reject(error_1);
                                    return [3 /*break*/, 5];
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    reject(new Error("Need to discover DigitalImagingService first"));
                                    _b.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Fetches all images from a specific container in the Content Directory service.
     *
     * @param {UPNPContainer} container - The container to fetch images from.
     * @param {string} save_path - The path to save the fetched images.
     * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
     * @throws Will throw an error if the image fetching process fails.
     */
    AlphaSync.prototype.get_all_images_from_container = function (container, save_path) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, child;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = container.children;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        child = _a[_i];
                        if (!(child['upnp:class'] == "object.container")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.get_all_images_from_container(child, save_path)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(child['upnp:class'] == "object.item.imageItem.photo")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.download_from_url(child.ORG, save_path, child['dc:title'])];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetches all images as per the date-to-items dictionary, where each date maps to multiple images.
     *
     * @param {string} save_path - The path to save the fetched images.
     * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
     * @throws Will throw an error if there are no entries with specific keys in the record.
     */
    AlphaSync.prototype.get_all_images_dict = function (save_path) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _c, _i, key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _loop_1 = function (key) {
                            var p, files, value, _e, value_1, image;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        console.log("downloading for date ".concat(key));
                                        p = path_1.default.join(save_path, key);
                                        files = new Set();
                                        if (fs_1.default.existsSync(p)) {
                                            fs_1.default.readdirSync(p).forEach(function (file) {
                                                files.add(file);
                                                console.log(file);
                                            });
                                        }
                                        if (!this_1.date_to_items.hasOwnProperty(key)) return [3 /*break*/, 6];
                                        value = this_1.date_to_items[key];
                                        _e = 0, value_1 = value;
                                        _f.label = 1;
                                    case 1:
                                        if (!(_e < value_1.length)) return [3 /*break*/, 5];
                                        image = value_1[_e];
                                        if (!(!files.has(image['dc:title']) && image['upnp:class'] === 'object.item.imageItem.photo')) return [3 /*break*/, 3];
                                        console.log("calling download for ".concat(image['dc:title']));
                                        return [4 /*yield*/, this_1.download_from_url(image.ORG, path_1.default.join(save_path, key), image['dc:title'])];
                                    case 2:
                                        _f.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        console.info("Found ".concat(image['dc:title'], " in ").concat(key, " already, skipping!"));
                                        _f.label = 4;
                                    case 4:
                                        _e++;
                                        return [3 /*break*/, 1];
                                    case 5: return [3 /*break*/, 7];
                                    case 6: throw new Error("No entry with ".concat(key, " in record"));
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = this.date_to_items;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        key = _c;
                        return [5 /*yield**/, _loop_1(key)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
   * Fetches all images as per the Content Directory tree.
   *
   * @param {string} save_path - The path to save the fetched images.
   * @returns {Promise<void>} Returns a promise that resolves when all images are fetched and saved.
   * @throws Will throw an error if the tree is not created yet. Run the generate_tree method before calling this method.
   */
    AlphaSync.prototype.get_all_images_tree = function (save_path) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.contentDirectory) === null || _a === void 0 ? void 0 : _a.root)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.get_all_images_from_container(this.contentDirectory.root, save_path)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2: throw new Error('Tree not created, Run generate_tree');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
      * Downloads an image from a specific URL.
      *
      * @private
      * @param {string} url - The URL of the image to be downloaded.
      * @param {string} save_path - The path to save the downloaded image.
      * @returns {Promise<void>} Returns a promise that resolves when the image is downloaded and saved.
      * @throws Will throw an error if the image downloading process fails.
      */
    AlphaSync.prototype.download_from_url = function (url, save_path, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var image, destination, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    console.log("downloading ".concat(name));
                                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                                            timeout: URL_TIMEOUT, // wait for 5 seconds
                                        })];
                                case 1:
                                    image = _a.sent();
                                    if (!fs_1.default.existsSync(save_path)) {
                                        fs_1.default.mkdirSync(save_path, { recursive: true }); // The "recursive" option is for nested directories
                                    }
                                    if (name === undefined) {
                                        name = this.today.getHours() + ":" + this.today.getMinutes() + ":" + this.today.getSeconds();
                                    }
                                    destination = fs_1.default.createWriteStream(path_1.default.join(save_path, "".concat(name)));
                                    return [4 /*yield*/, image.body.pipe(destination)];
                                case 2:
                                    _a.sent();
                                    console.log("finished ".concat(name));
                                    resolve();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    reject(new Error("While downloading images, could not download from ".concat(url)));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return AlphaSync;
}());
exports.AlphaSync = AlphaSync;

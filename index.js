#!/usr/bin/env node
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import express from 'express';
import { readdir, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
var __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
var __dirname = path.dirname(__filename); // get the name of the directory
var cliOptions = {
    port: 3000,
    hostPath: process.cwd()
};
(function () {
    for (var i = 2; i < process.argv.length; i++) {
        var arg = process.argv[i];
        switch (arg) {
            case '-p':
                cliOptions.port = parseInt(process.argv[++i]);
                break;
            default:
                cliOptions.hostPath = arg;
                break;
        }
    }
})();
var app = express();
app.set('port', cliOptions.port);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
console.log(cliOptions);
app.use(showSlideShow);
app.use(showDirectory);
app.use('/favicon.ico', express.static(__dirname + 'assets/favicon.ico'));
// Serve static files from the hostpath directory
app.use(express.static(path.join(cliOptions.hostPath)));
app.listen(cliOptions.port, function () {
    console.log("Server listening on port ".concat(cliOptions.port));
});
function showDirectory(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var requestPath, localPath, fileStats, error_1, fileLinkList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestPath = decodeURIComponent(req.path);
                    localPath = path.join(cliOptions.hostPath, requestPath);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, stat(localPath)];
                case 2:
                    fileStats = _a.sent();
                    if (!fileStats.isDirectory()) {
                        return [2 /*return*/, next()];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, next()];
                case 4: return [4 /*yield*/, getLinksFromDir(localPath, requestPath)];
                case 5:
                    fileLinkList = _a.sent();
                    res.render('index', {
                        title: "Instahost: ".concat(requestPath),
                        links: fileLinkList
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function showSlideShow(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var assetUrlPath, assetParentPath, localParentPath, siblings, imageSiblings, assetIndex, prevLink, nextLink;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.path.startsWith('/_slideshow/')) {
                        return [2 /*return*/, next()];
                    }
                    assetUrlPath = decodeURIComponent(req.path.replace('/_slideshow/', '/'));
                    assetParentPath = path.parse(assetUrlPath).dir;
                    localParentPath = path.join(cliOptions.hostPath, assetParentPath);
                    return [4 /*yield*/, getLinksFromDir(localParentPath, assetParentPath)];
                case 1:
                    siblings = _a.sent();
                    imageSiblings = siblings.filter(function (_a) {
                        var href = _a.href;
                        return isImagePath(href);
                    });
                    assetIndex = imageSiblings.findIndex(function (_a) {
                        var href = _a.href;
                        return href === assetUrlPath;
                    });
                    prevLink = imageSiblings[assetIndex - 1];
                    nextLink = imageSiblings[assetIndex + 1];
                    res.render('slideshow', {
                        title: "Instahost: ".concat(assetUrlPath),
                        asset: assetUrlPath,
                        prevLink: prevLink,
                        nextLink: nextLink,
                        dirLink: assetParentPath,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function getLinksFromDir(localPath, requestPath) {
    return __awaiter(this, void 0, void 0, function () {
        var filenameList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readdir(localPath)];
                case 1:
                    filenameList = _a.sent();
                    return [2 /*return*/, filenameList.sort().map(function (filename) {
                            var href = path.join(requestPath, filename);
                            var slideShowUrl = isImagePath(filename) ? '/_slideshow' + href : undefined;
                            return {
                                name: filename,
                                href: href,
                                slideShowUrl: slideShowUrl
                            };
                        })];
            }
        });
    });
}
function isImagePath(imagePath) {
    return ['.jpg', '.jpeg', '.png', '.gif'].some(function (extension) { return imagePath.endsWith(extension); });
}

'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
class LocalWebService {
    constructor(context) {
        this.app = express();
        this.server = http.createServer();
        this._content = "";
        this._htmlContentLocation = 'out/src/content';
        let self = this;
        // add static content for express web server to serve
        this._staticContentPath = path.join(context.extensionPath, this._htmlContentLocation);
        this.app.use(express.static(this._staticContentPath));
        this.app.use(bodyParser.json());
        this.app.get('/storage', function (req, res) {
            let storage = {
                content: self._content,
                options: self._options
            };
            res.send(storage);
        });
        this.app.post('/state', function (req, res) {
            context.workspaceState.update(self._options.uri, req.body);
            res.send(200);
        });
        this.server.on('request', this.app);
    }
    get serviceUrl() {
        return 'http://localhost:' + this._servicePort;
    }
    init(content, options) {
        this._content = content;
        this._options = options;
    }
    start() {
        const port = this.server.listen(0).address().port; // 0 = listen on a random port
        this._servicePort = port.toString();
    }
}
exports.default = LocalWebService;
//# sourceMappingURL=localWebService.js.map
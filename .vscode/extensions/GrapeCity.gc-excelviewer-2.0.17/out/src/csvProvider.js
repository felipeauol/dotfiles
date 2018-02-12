'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const base = require("./baseProvider");
const localWebService_1 = require("./localWebService");
var Base64 = require('js-base64').Base64;
class CsvDocumentContentProvider extends base.BaseDocumentContentProvider {
    constructor(context) {
        super(context);
        // create local express server
        this._service = new localWebService_1.default(context);
        this._service.start();
    }
    createSnippet(uri) {
        let file = uri.with({
            scheme: "file"
        });
        return vscode_1.workspace.openTextDocument(file).then(doc => {
            let lang = doc.languageId;
            if (lang !== 'csv' && lang !== 'plaintext') {
                return this.errorSnippet("Active editor doesn't show a CSV or plain text document.");
            }
            let text = doc.getText();
            let base64 = Base64.encode(text);
            let options = {
                separator: this.separator,
                quoteMark: this.quoteMark,
                hasHeaders: this.hasHeaders,
                capitalizeHeaders: this.capitalizeHeaders,
                resizeColumns: this.resizeColumns,
                uri: this.uri.toString(),
                state: this.state
            };
            this._service.init(base64, options);
            return this.snippet();
        });
    }
    get separator() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("separator");
    }
    get quoteMark() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("quoteMark");
    }
    get hasHeaders() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("hasHeaders");
    }
    get capitalizeHeaders() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("capitalizeHeaders");
    }
    get resizeColumns() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("resizeColumns");
    }
    get serviceUrl() {
        return this._service.serviceUrl;
    }
    snippet() {
        return `<!DOCTYPE html>
        <html>
        <head>
            <link href="${this.serviceUrl}/styles/wijmo.min.css" rel="stylesheet" type="text/css" />
            <link href="${this.serviceUrl}/styles/themes/wijmo.theme.${this.theme}.min.css" rel="stylesheet" type="text/css" />
        </head>
        <script src="${this.serviceUrl}/controls/wijmo.min.js" type="text/javascript"></script>
        <script src="${this.serviceUrl}/controls/wijmo.input.min.js" type="text/javascript"></script>
        <script src="${this.serviceUrl}/controls/wijmo.grid.min.js" type="text/javascript"></script>
        <script src="${this.serviceUrl}/controls/wijmo.grid.filter.min.js" type="text/javascript"></script>
        <script src="${this.serviceUrl}/js-base64.js"></script>
        <script src="${this.serviceUrl}/common.js"></script>
        <script src="${this.serviceUrl}/csv.js"></script>
        <body onload="resizeGrid()" onresize="resizeGrid()">
            <div id="flex"></div>
        </body>
        <script type="text/javascript">
            loadFile("${this.serviceUrl}", renderFile);
        </script>
        </html>`;
    }
}
exports.CsvDocumentContentProvider = CsvDocumentContentProvider;
//# sourceMappingURL=csvProvider.js.map
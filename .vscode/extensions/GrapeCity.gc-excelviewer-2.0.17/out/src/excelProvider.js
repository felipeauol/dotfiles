'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base = require("./baseProvider");
const localWebService_1 = require("./localWebService");
class ExcelDocumentContentProvider extends base.BaseDocumentContentProvider {
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
        let options = {
            uri: this.uri.toString(),
            state: this.state
        };
        this._service.init(file.toString(), options);
        return this.snippet();
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
                <script src="${this.serviceUrl}/controls/wijmo.grid.sheet.min.js" type="text/javascript"></script>
                <script src="${this.serviceUrl}/controls/wijmo.grid.xlsx.min.js" type="text/javascript"></script>
                <script src="${this.serviceUrl}/controls/wijmo.xlsx.min.js" type="text/javascript"></script>
                <script src="${this.serviceUrl}/jszip.min.js"></script>
                <script src="${this.serviceUrl}/common.js"></script>
                <script src="${this.serviceUrl}/excel.js"></script>
                <body onload="resizeSheet()" onresize="resizeSheet()">
                    <div id="sheet"></div>
                </body>                
                <script type="text/javascript">
                    loadFile("${this.serviceUrl}", renderFile);
                </script>
                </html>`;
    }
}
exports.ExcelDocumentContentProvider = ExcelDocumentContentProvider;
//# sourceMappingURL=excelProvider.js.map
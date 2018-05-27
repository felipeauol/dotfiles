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
            let lang = doc ? doc.languageId : null;
            if (lang !== 'csv' && lang !== 'tab' && lang !== 'tsv' && lang !== 'plaintext') {
                return this.errorSnippet("Active editor doesn't show a CSV or plain text document.");
            }
            let text = doc.getText();
            let base64 = Base64.encode(text);
            let options = {
                separator: (lang === 'tab' || lang === 'tsv') ? "\t" : this.separator,
                quoteMark: this.quoteMark,
                hasHeaders: this.hasHeaders,
                capitalizeHeaders: this.capitalizeHeaders,
                resizeColumns: this.resizeColumns,
                lineNumbers: this.lineNumbers,
                commentCharacter: this.commentCharacter,
                skipComments: this.skipComments,
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
    get lineNumbers() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("lineNumbers");
    }
    get commentCharacter() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("commentCharacter");
    }
    get skipComments() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("skipComments");
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
        <body style="padding:0px; overflow:hidden" onload="resizeGrid()" onresize="resizeGrid()">
            <div id="flex"></div>
        </body>
        <script type="text/javascript">
            const key = "GrapeCity-Internal-Use-Only,wijmo-designer-beta.azurewebsites.net,141832842148448#B0HbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TP7JGUpp4KqBnb7gGNndFNkhjd6UmUvkjaJBnWBNXOWJ6S9UXZhFlaxJDVUF4ZpRjeiNERXFVUMNlaRFVQItiNUJzdop4dKFTdCNVMaJzd4pXNCRVY8QkQx3Sev26dwE4amNVcvIjSiVle6RDZPRFSsZTNwgFWu9GU6UUM8R5djpEWnVUeJ3yaUplTy9EUQpXcwVDbJd7bIR4N9Q7bm9mY0ZGOa36cLZVaPJFVhhDRUlEUMtkQQdFO7MWOHhHWNFERqdWOVR4KzF7aRRmcjNmWD5kN5EGT6RTbkVUbvU5L4czcE9mN8dmYsRzKRZVatlnR5o6TOVXO8ZWOklERaVDNkRVaIBDcvp4V5g6av2WMRRTMzkWRycVQwUWaWZ6c9gkN9sSauJkc4syModlY4FXOY56a9E5Tt3UML3CMFFlVhBVSsBnb4Mla4Z4ZIZ5LuZUW4E7NBJUWiojITJCLiIkQCFzNBhTMiojIIJCL8QzMzgDMxQTO0IicfJye35XX3JSSwIjUiojIDJCLi86bpNnblRHeFBCI4VWZoNFelxmRg2Wbql6ViojIOJyes4nI5kkTRJiOiMkIsIibvl6cuVGd8VEIgIXZ7VWaWRncvBXZSBybtpWaXJiOi8kI1xSfis4N8gkI0IyQiwiIu3Waz9WZ4hXRgAydvJVa4xWdNBybtpWaXJiOi8kI1xSfiQjR6QkI0IyQiwiIu3Waz9WZ4hXRgACUBx4TgAybtpWaXJiOi8kI1xSfiMzQwIkI0IyQiwiIlJ7bDBybtpWaXJiOi8kI1xSfiUFO7EkI0IyQiwiIu3Waz9WZ4hXRgACdyFGaDxWYpNmbh9WaGBybtpWaXJiOi8kI1tlOiQmcQJCLiITN8ITNwASMwMDM8EDMyIiOiQncDJCLiQXZu9yclRXazJWZ7Vmc5pXYuEGdlJWLyVmbnl6clRWLv5mapdnI0IyctRkIsIyajFmY5pEIuh6bKJiOiEmTDJCLigDN4gDNxIDN8IzM8EDNxIiOiQWSiwSfiEjd8EDMyIiOiIXZ6JLLcN";
            wijmo.setLicenseKey(key);
            loadFile("${this.serviceUrl}", renderFile);
        </script>
        </html>`;
    }
}
exports.CsvDocumentContentProvider = CsvDocumentContentProvider;
//# sourceMappingURL=csvProvider.js.map
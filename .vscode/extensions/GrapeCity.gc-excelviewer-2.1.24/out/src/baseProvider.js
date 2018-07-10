'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class BaseDocumentContentProvider {
    constructor(context) {
        this._onDidChange = new vscode_1.EventEmitter();
        this._storage = context.workspaceState;
    }
    dispose() {
        this._onDidChange.dispose();
    }
    get storage() {
        return this._storage;
    }
    get theme() {
        return vscode_1.workspace.getConfiguration('csv-preview').get("theme");
    }
    get uri() {
        return this._uri;
    }
    get state() {
        return this.storage.get(this.uri.toString());
    }
    provideTextDocumentContent(uri) {
        this._uri = uri;
        return this.createSnippet(uri);
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
    errorSnippet(error) {
        return `<body>
                ${error}
                </body>`;
    }
}
exports.BaseDocumentContentProvider = BaseDocumentContentProvider;
//# sourceMappingURL=baseProvider.js.map
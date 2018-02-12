'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const csv = require("./csvProvider");
const excel = require("./excelProvider");
const path = require("path");
function activate(context) {
    let previewUri;
    let csvProvider = new csv.CsvDocumentContentProvider(context);
    let csvSubscription = vscode_1.workspace.registerTextDocumentContentProvider('csv-preview', csvProvider);
    let excelProvider = new excel.ExcelDocumentContentProvider(context);
    let excelSubscription = vscode_1.workspace.registerTextDocumentContentProvider('excel-preview', excelProvider);
    let csvCommand = vscode_1.commands.registerCommand('csv.preview', (uri) => {
        let resource = uri;
        let viewColumn = getViewColumn();
        if (!(resource instanceof vscode_1.Uri)) {
            if (vscode_1.window.activeTextEditor) {
                resource = vscode_1.window.activeTextEditor.document.uri;
                viewColumn = vscode_1.window.activeTextEditor.viewColumn;
            }
            else {
                vscode_1.window.showInformationMessage("Open a CSV file first to show a preview.");
                return;
            }
        }
        previewUri = resource.with({
            scheme: "csv-preview"
        });
        let title = `Preview '${path.basename(resource.fsPath)}'`;
        return vscode_1.commands.executeCommand('vscode.previewHtml', previewUri, viewColumn, title).then((success) => {
        }, (reason) => {
            vscode_1.window.showErrorMessage(reason);
        });
    });
    let excelCommand = vscode_1.commands.registerCommand('excel.preview', (uri) => {
        let resource = uri;
        let viewColumn = getViewColumn();
        if (!(resource instanceof vscode_1.Uri)) {
            vscode_1.window.showInformationMessage("Use the explorer context menu or editor title menu to preview Excel files.");
            return;
        }
        previewUri = resource.with({
            scheme: "excel-preview"
        });
        let title = `Preview '${path.basename(resource.fsPath)}'`;
        return vscode_1.commands.executeCommand('vscode.previewHtml', previewUri, viewColumn, title).then((success) => {
        }, (reason) => {
            vscode_1.window.showErrorMessage(reason);
        });
    });
    context.subscriptions.push(csvProvider, csvCommand, csvSubscription);
    context.subscriptions.push(excelProvider, excelCommand, excelSubscription);
    vscode_1.workspace.onDidSaveTextDocument(document => {
        if (isCsvFile(document)) {
            let resource = document.uri;
            const uri = resource.with({
                scheme: 'csv-preview'
            });
            csvProvider.update(uri);
        }
    });
    vscode_1.workspace.onDidChangeConfiguration(() => {
        vscode_1.workspace.textDocuments.forEach(document => {
            let scheme = document.uri.scheme;
            if (scheme === 'csv-preview') {
                csvProvider.update(document.uri);
            }
            else if (scheme === 'excel-preview') {
                excelProvider.update(document.uri);
            }
        });
    });
    vscode_1.window.onDidChangeActiveTextEditor(editor => {
        if (!editor) {
            vscode_1.workspace.textDocuments.forEach(document => {
                let scheme = document.uri.scheme;
                if (scheme === 'csv-preview') {
                    csvProvider.update(document.uri);
                }
                else if (scheme === 'excel-preview') {
                    excelProvider.update(document.uri);
                }
            });
        }
    });
    let clearCommand = vscode_1.commands.registerCommand('csv.clearState', () => {
        if (previewUri && csvProvider.storage.get(previewUri.toString())) {
            csvProvider.storage.update(previewUri.toString(), null);
        }
    });
    context.subscriptions.push(clearCommand);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function isCsvFile(document) {
    let lang = document.languageId;
    return (lang === 'csv' || lang === 'plaintext') && document.uri.scheme !== 'csv-preview';
}
function getViewColumn() {
    const active = vscode_1.window.activeTextEditor;
    return active ? active.viewColumn : vscode_1.ViewColumn.One;
}
//# sourceMappingURL=extension.js.map
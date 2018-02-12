'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const officialExt = vscode.extensions.getExtension("Microsoft.vscode-markdown");
const TocProvider = require(path.join(officialExt.extensionPath, 'out', 'tableOfContentsProvider')).TableOfContentsProvider;
const MdEngine = require(path.join(officialExt.extensionPath, 'out', 'markdownEngine')).MarkdownEngine;
const engine = new MdEngine();
const prefix = 'markdown.extension.toc.';
/**
 * Workspace config
 */
let docConfig = { tab: '    ', eol: '\r\n' };
let tocConfig = { startDepth: 1, endDepth: 6, listMarker: '-', orderedList: false, updateOnSave: false, plaintext: false };
function activate(context) {
    const cmds = [
        { command: 'create', callback: createToc },
        { command: 'update', callback: updateToc }
        // , { command: 'delete', callback: deleteToc }
    ].map(cmd => {
        cmd.command = prefix + cmd.command;
        return cmd;
    });
    cmds.forEach(cmd => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.command, cmd.callback));
    });
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(onWillSave));
    context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'markdown', scheme: 'file' }, new TocCodeLensProvider()));
    vscode.window.registerTreeDataProvider('mdOutline', new MdOutlineProvider());
}
exports.activate = activate;
function createToc() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let toc = yield generateTocText(editor.document);
        yield editor.edit(function (editBuilder) {
            editBuilder.delete(editor.selection);
            editBuilder.insert(editor.selection.active, toc);
        });
    });
}
function updateToc() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let tocRange = yield detectTocRange(editor.document);
        if (tocRange != null) {
            let oldToc = getText(tocRange).replace(/\r?\n|\r/g, docConfig.eol);
            let newToc = yield generateTocText(editor.document);
            if (oldToc != newToc) {
                // Keep the unchanged lines. (to prevent codeLens from re-emergence in UI)
                let oldTocArr = oldToc.split(docConfig.eol);
                let newTocArr = newToc.split(docConfig.eol);
                let firstChangedLine = 0;
                for (let i = 0; i < newTocArr.length; i++) {
                    if (newTocArr[i] != oldTocArr[i]) {
                        firstChangedLine = i;
                        break;
                    }
                }
                let text = newTocArr.slice(firstChangedLine).join(docConfig.eol);
                let justAppending = false;
                let rangeToBeDel;
                let location;
                if (firstChangedLine + 1 > oldTocArr.length) {
                    justAppending = true;
                    location = tocRange.end;
                    text = docConfig.eol + text;
                }
                else {
                    let delPosition = new vscode.Position(tocRange.start.line + firstChangedLine, tocRange.start.character);
                    rangeToBeDel = new vscode.Range(delPosition, tocRange.end);
                    location = rangeToBeDel.start;
                }
                yield vscode.window.activeTextEditor.edit(editBuilder => {
                    if (!justAppending) {
                        editBuilder.delete(rangeToBeDel);
                    }
                    editBuilder.insert(location, text);
                });
            }
        }
    });
}
function deleteToc() {
    // Pass
}
function generateTocText(document) {
    return __awaiter(this, void 0, void 0, function* () {
        loadTocConfig();
        const tocProvider = new TocProvider(engine, document);
        let toc = [];
        let tocEntry = yield tocProvider.getToc();
        let startDepth = tocConfig.startDepth;
        let order = new Array(tocConfig.endDepth - startDepth + 1).fill(0); // Used for ordered list
        tocEntry.forEach(entry => {
            if (entry.level <= tocConfig.endDepth && entry.level >= startDepth) {
                let indentation = entry.level - startDepth;
                // #83 TOC entries that contain links do not generate correctly
                let entryText = entry.text.replace(/\[([^\]]+?)\]\([^\)]+?\)/g, function (match, g1) {
                    return g1;
                });
                let row = [
                    docConfig.tab.repeat(indentation),
                    (tocConfig.orderedList ? ++order[indentation] + '.' : tocConfig.listMarker) + ' ',
                    tocConfig.plaintext ? entryText : `[${entryText}](#${TocProvider.slugify(entryText)})`
                ];
                toc.push(row.join(''));
                if (tocConfig.orderedList)
                    order.fill(0, indentation + 1);
            }
        });
        return toc.join(docConfig.eol);
    });
}
function detectTocRange(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        loadTocConfig();
        const tocProvider = new TocProvider(engine, doc);
        let start, end;
        let headings = yield tocProvider.getToc();
        if (headings.length == 0) {
            // No headings
            return null;
        }
        else if (headings[0].text.length == 0) {
            // The first heading is empty
            return null;
        }
        else {
            for (let index = 0; index < doc.lineCount; index++) {
                let lineText = doc.lineAt(index).text;
                if (start == null) {
                    let regResult = lineText.match(/^[\-\*\+1]\.? (.+)$/); // Match list block and get list item
                    if (regResult != null) {
                        let header = regResult[1];
                        let res = header.match(/^\[(.+?)\]\(#.+?\)$/); // Get `header` from `[header](anchor)`
                        if (res != null) {
                            header = res[1];
                        }
                        let expectedFirstHeader = headings.find(h => {
                            return h.level == tocConfig.startDepth;
                        }).text;
                        if (header.startsWith(expectedFirstHeader)) {
                            start = new vscode.Position(index, 0);
                        }
                    }
                }
                else {
                    lineText = lineText.trim();
                    if (lineText.match(/^[\-\*\+\d]\.? /) == null) {
                        end = new vscode.Position(index - 1, doc.lineAt(index - 1).text.length);
                        // log('End', end);
                        break;
                    }
                    else if (index == doc.lineCount - 1) {
                        end = new vscode.Position(index, doc.lineAt(index).text.length);
                        // log('End', end);
                    }
                }
            }
            if ((start != null) && (end != null)) {
                return new vscode.Range(start, end);
            }
            // log('No TOC detected.');
            return null;
        }
    });
}
function onWillSave(e) {
    if (!tocConfig.updateOnSave)
        return;
    if (e.document.languageId == 'markdown') {
        e.waitUntil(updateToc());
    }
}
function loadTocConfig() {
    let tocSectionCfg = vscode.workspace.getConfiguration('markdown.extension.toc');
    let tocLevels = tocSectionCfg.get('levels');
    let matches;
    if (matches = tocLevels.match(/^([1-6])\.\.([1-6])$/)) {
        tocConfig.startDepth = matches[1];
        tocConfig.endDepth = matches[2];
    }
    tocConfig.orderedList = tocSectionCfg.get('orderedList');
    tocConfig.listMarker = tocSectionCfg.get('unorderedList.marker');
    tocConfig.plaintext = tocSectionCfg.get('plaintext');
    tocConfig.updateOnSave = tocSectionCfg.get('updateOnSave');
    // Load workspace config
    docConfig.eol = vscode.window.activeTextEditor.document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
    let tabSize = Number(vscode.window.activeTextEditor.options.tabSize);
    let insertSpaces = vscode.window.activeTextEditor.options.insertSpaces;
    docConfig.tab = '\t';
    if (insertSpaces && tabSize > 0) {
        docConfig.tab = " ".repeat(tabSize);
    }
}
function getText(range) {
    return vscode.window.activeTextEditor.document.getText(range);
}
class TocCodeLensProvider {
    provideCodeLenses(document, token) {
        let lenses = [];
        return detectTocRange(document).then(tocRange => {
            if (tocRange == null)
                return lenses; // No TOC
            return generateTocText(document).then(text => {
                let status = getText(tocRange).replace(/\r?\n|\r/g, docConfig.eol) === text ? 'up to date' : 'out of date';
                lenses.push(new vscode.CodeLens(tocRange, {
                    arguments: [],
                    title: `Table of Contents (${status})`,
                    command: ''
                }));
                return lenses;
            });
        });
    }
}
class MdOutlineProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (this.isMdEditor(editor)) {
                vscode.commands.executeCommand('setContext', 'mdContext', true);
            }
            else {
                vscode.commands.executeCommand('setContext', 'mdContext', false);
            }
            this.update();
        });
        vscode.workspace.onDidSaveTextDocument(doc => {
            this.update();
        });
        // First time
        if (this.isMdEditor(vscode.window.activeTextEditor)) {
            vscode.commands.executeCommand('setContext', 'mdContext', true);
        }
        else {
            vscode.commands.executeCommand('setContext', 'mdContext', false);
        }
        this.update();
    }
    /**
     * @param realIndex starts from 1
     */
    getTreeItem(realIndex) {
        return this.getTreeItemByIdx(realIndex - 1);
    }
    getChildren(realIndex) {
        if (this.toc == null) {
            return [];
        }
        else if (realIndex == undefined) {
            return this.toc.filter(h => {
                return h.level === 1;
            }).map((h) => {
                return this.toc.indexOf(h) + 1;
            });
        }
        else if (realIndex < this.toc.length) {
            let childLevel = this.toc[realIndex - 1].level + 1;
            let children = [];
            for (var i = realIndex; i < this.toc.length; i++) {
                if (this.toc[i].level === childLevel) {
                    children.push(i + 1);
                }
                else if (this.toc[i].level < childLevel) {
                    break;
                }
            }
            return children;
        }
        else {
            return [];
        }
    }
    isMdEditor(editor) {
        return editor && editor.document && editor.document.uri.scheme === 'file' && editor.document.languageId === 'markdown';
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildToc();
            this._onDidChangeTreeData.fire();
        });
    }
    buildToc() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editor = vscode.window.activeTextEditor;
            if (this.isMdEditor(this.editor)) {
                const tocProvider = new TocProvider(engine, this.editor.document);
                this.toc = yield tocProvider.getToc();
            }
            else {
                this.toc = null;
            }
        });
    }
    getTreeItemByIdx(idx) {
        let treeItem = new vscode.TreeItem(this.toc[idx].text);
        if (idx === this.toc.length - 1) {
            treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
        }
        else if (this.toc[idx + 1].level > this.toc[idx].level) {
            treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }
        treeItem.command = {
            command: 'revealLine',
            title: '',
            arguments: [{ lineNumber: this.toc[idx].line, at: 'top' }]
        };
        return treeItem;
    }
}
//# sourceMappingURL=toc.js.map
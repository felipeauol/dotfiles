'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// See https://github.com/Microsoft/vscode/tree/master/extensions/markdown/src
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const officialExt = vscode.extensions.getExtension("Microsoft.vscode-markdown");
const TocProvider = require(path.join(officialExt.extensionPath, 'out', 'tableOfContentsProvider')).TableOfContentsProvider;
const hljs = require(path.join(officialExt.extensionPath, 'node_modules', 'highlight.js'));
const mdnh = require(path.join(officialExt.extensionPath, 'node_modules', 'markdown-it-named-headers'));
const mdtl = require('markdown-it-task-lists');
const md = require(path.join(officialExt.extensionPath, 'node_modules', 'markdown-it'))({
    html: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code><div>${hljs.highlight(lang, str, true).value}</div></code></pre>`;
            }
            catch (error) { }
        }
        // return `<pre class="hljs"><code><div>${this.engine.utils.escapeHtml(str)}</div></code></pre>`;
        return str;
    }
}).use(mdnh, {
    slugify: (header) => TocProvider.slugify(header)
}).use(mdtl);
let thisContext;
function activate(context) {
    thisContext = context;
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.printToHtml', () => { print('html'); }));
}
exports.activate = activate;
function deactivate() {
    // disposables.forEach(d => {
    //     d.dispose();
    // });
}
exports.deactivate = deactivate;
function print(type) {
    let editor = vscode.window.activeTextEditor;
    let doc = editor.document;
    if (!editor || doc.languageId != 'markdown') {
        vscode.window.showErrorMessage('No valid Markdown file');
        return;
    }
    if (doc.isDirty || doc.isUntitled) {
        doc.save();
    }
    let statusBarMsg = vscode.window.setStatusBarMessage(`Printing '${path.basename(doc.fileName)}' to ${type.toUpperCase()} ...`, 1000);
    /**
     * Modified from <https://github.com/Microsoft/vscode/tree/master/extensions/markdown>
     * src/previewContentProvider MDDocumentContentProvider provideTextDocumentContent
     */
    let outPath = doc.fileName.replace(/\.md$/, `.${type}`);
    outPath = outPath.replace(/^([cdefghij]):\\/, function (match, p1) {
        return `${p1.toUpperCase()}:\\`; // Capitalize drive letter
    });
    let body = render(doc.getText());
    if (vscode.workspace.getConfiguration("markdown.extension.print", doc.uri).get("absoluteImgPath")) {
        body = body.replace(/(<img[^>]+src=")([^"]+)("[^>]+>)/g, function (match, p1, p2, p3) {
            return `${p1}${fixHref(doc.fileName, p2)}${p3}`;
        });
    }
    let styleSheets = ['markdown.css', 'tomorrow.css', 'checkbox.css'].map(s => getMediaPath(s))
        .concat(getCustomStyleSheets());
    let html = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        ${styleSheets.map(css => `<style>\n${readCss(css)}\n</style>`).join('\n')}
        ${getSettingsOverrideStyles()}
    </head>
    <body>
        ${body}
    </body>
    </html>`;
    switch (type) {
        case 'html':
            fs.writeFile(outPath, html, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
            break;
        case 'pdf':
            break;
    }
}
function render(text) {
    return md.render(text);
}
function getMediaPath(mediaFile) {
    return thisContext.asAbsolutePath(path.join('media', mediaFile));
}
function readCss(fileName) {
    return fs.readFileSync(fileName).toString().replace(/\s+/g, ' ');
}
function getCustomStyleSheets() {
    const styles = vscode.workspace.getConfiguration('markdown')['styles'];
    if (styles && Array.isArray(styles) && styles.length > 0) {
        return styles;
    }
    return [];
}
function fixHref(activeFileName, href) {
    if (href) {
        // Use href if it is already an URL
        if (vscode.Uri.parse(href).scheme) {
            return href;
        }
        // Use href as file URI if it is absolute
        if (isAbsolute(href)) {
            return vscode.Uri.file(href).toString();
        }
        // use a workspace relative path if there is a workspace
        // let rootPath = workspace.rootPath;
        // if (rootPath) {
        //     return Uri.file(path.join(rootPath, href)).toString();
        // }
        // otherwise look relative to the markdown file
        return vscode.Uri.file(path.join(path.dirname(activeFileName), href)).toString();
    }
    return href;
}
function isAbsolute(p) {
    return path.normalize(p + '/') === path.normalize(path.resolve(p) + '/');
}
function getSettingsOverrideStyles() {
    const previewSettings = vscode.workspace.getConfiguration('markdown')['preview'];
    if (!previewSettings) {
        return '';
    }
    const { fontFamily, fontSize, lineHeight } = previewSettings;
    return `<style>
            body {
                ${fontFamily ? `font-family: ${fontFamily};` : ''}
                ${+fontSize > 0 ? `font-size: ${fontSize}px;` : ''}
                ${+lineHeight > 0 ? `line-height: ${lineHeight};` : ''}
            }
        </style>`;
}
//# sourceMappingURL=print.js.map
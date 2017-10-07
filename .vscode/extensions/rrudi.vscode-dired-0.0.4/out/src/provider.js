'use strict';
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const fileItem_1 = require("./fileItem");
class DiredProvider {
    constructor(fixed_window) {
        this._onDidChange = new vscode.EventEmitter();
        this._fixed_window = fixed_window;
    }
    dispose() {
        this.clear();
        this._onDidChange.dispose();
    }
    /**
     * clear provider information but not disposed.
     */
    clear() {
        this._files = [];
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    setDirName(dirname) {
        return new Promise((resolve) => {
            if (fs.lstatSync(dirname).isDirectory()) {
                try {
                    this.readDir(dirname);
                }
                catch (err) {
                    vscode.window.showErrorMessage(`Could not read ${dirname}: ${err}`);
                }
            }
            this._dirname = dirname;
            resolve(dirname);
        });
    }
    enter() {
        const f = this.getFile();
        if (!f) {
            return;
        }
        const uri = f.uri(this._fixed_window);
        if (!uri) {
            return;
        }
        if (uri.scheme !== DiredProvider.scheme) {
            this.showFile(uri);
            return;
        }
        this.setDirName(f.path)
            .then((dirname) => {
            this._onDidChange.fire(uri);
        });
    }
    reload() {
        const f = this._files[0]; // must "."
        const uri = f.uri(this._fixed_window);
        this._onDidChange.fire(uri);
    }
    render() {
        const lines = [
            this._dirname + ":",
        ];
        return lines.concat(this._files.map((f) => {
            return f.line(1);
        })).join('\n');
    }
    showFile(uri) {
        vscode.workspace.openTextDocument(uri).then(doc => {
            vscode.window.showTextDocument(doc);
        });
        // TODO: show warning when open file failed
        // vscode.window.showErrorMessage(`Could not open file ${uri.fsPath}: ${err}`);
    }
    provideTextDocumentContent(uri) {
        if (fs.lstatSync(this._dirname).isFile()) {
            this.showFile(uri);
            return "";
        }
        const at = vscode.window.activeTextEditor;
        if (!at) {
            return "";
        }
        at.options = {
            cursorStyle: vscode.TextEditorCursorStyle.Underline,
        };
        return this.render();
    }
    readDir(dirname) {
        // TODO: Promisify readdir
        const files = [".", ".."].concat(fs.readdirSync(dirname));
        this._files = files.map((filename) => {
            const p = path.join(dirname, filename);
            try {
                const stat = fs.statSync(p);
                return new fileItem_1.default(dirname, filename, stat);
            }
            catch (err) {
                vscode.window.showErrorMessage(`Could not get stat of ${p}: ${err}`);
                return null;
            }
        }).filter((fileItem) => {
            if (fileItem) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    createDir(dirname) {
        const p = path.join(this._dirname, dirname);
        fs.mkdirSync(p);
        this.reload();
        vscode.window.showInformationMessage(`${p} is created.`);
    }
    rename(newName) {
        const f = this.getFile();
        if (!f) {
            return;
        }
        const n = path.join(this._dirname, newName);
        this.reload();
        vscode.window.showInformationMessage(`${f.fileName} is renamed to ${n}`);
    }
    copy(newName) {
        const f = this.getFile();
        if (!f) {
            return;
        }
        const n = path.join(this._dirname, newName);
        vscode.window.showInformationMessage(`${f.fileName} is copied to ${n}`);
    }
    select() {
        const f = this.getFile();
        if (!f) {
            return;
        }
        f.toggleSelect();
        this.render();
        const uri = f.uri(this._fixed_window);
        this._onDidChange.fire(uri);
    }
    goUpDir() {
        if (this._dirname === "/") {
            return;
        }
        const p = path.join(this._dirname, "..");
        try {
            const stats = fs.lstatSync(p);
            const f = new fileItem_1.default(this._dirname, "..", stats);
            const uri = f.uri(this._fixed_window);
            this.setDirName(p)
                .then((dirname) => {
                this._onDidChange.fire(uri);
            });
        }
        catch (err) {
            vscode.window.showInformationMessage(`Could not get stat of ${p}: ${err}`);
        }
    }
    /**
     * get file from cursor position.
     */
    getFile() {
        const at = vscode.window.activeTextEditor;
        if (!at) {
            return null;
        }
        const cursor = at.selection.active;
        if (cursor.line < 1) {
            return null;
        }
        return this._files[cursor.line - 1]; // 1 means direpath on top;
    }
}
DiredProvider.scheme = 'dired'; // ex: dired://<directory>
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DiredProvider;
//# sourceMappingURL=provider.js.map
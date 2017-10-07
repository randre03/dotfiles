'use strict';
const vscode = require("vscode");
const path = require("path");
var Mode = require('stat-mode');
const idResolver_1 = require("./idResolver");
const utils_1 = require("./utils");
class FileItem {
    constructor(dir, filename, stats) {
        this._stats = stats;
        this._dirname = dir;
        this._filename = filename;
        this._mode = new Mode(this._stats);
    }
    toggleSelect() {
        if (this._selected) {
            this._selected = false;
        }
        else {
            this._selected = true;
        }
    }
    get path() {
        return path.join(this._dirname, this._filename);
    }
    get fileName() {
        return this._filename;
    }
    line(column) {
        const u = FileItem._resolver.username(this._stats.uid);
        const g = FileItem._resolver.groupname(this._stats.gid);
        const size = this.pad(this._stats.size, 8, " ");
        const month = this.pad(this._stats.ctime.getMonth() + 1, 2, "0");
        const day = this.pad(this._stats.ctime.getDay(), 2, "0");
        const hour = this.pad(this._stats.ctime.getHours(), 2, "0");
        const min = this.pad(this._stats.ctime.getMinutes(), 2, "0");
        let se = " ";
        if (this._selected) {
            se = "*";
        }
        return `${se} ${this._mode.toString()} ${u} ${g} ${size} ${month} ${day} ${hour}:${min} ${this._filename}`;
    }
    uri(fixed_window) {
        const p = path.join(this._dirname, this._filename);
        if (this._mode.isDirectory()) {
            return utils_1.encodeLocation(p, fixed_window);
        }
        else if (this._mode.isFile()) {
            return vscode.Uri.parse(`file://${p}`);
        }
        return undefined;
    }
    pad(num, size, p) {
        var s = num + "";
        while (s.length < size)
            s = p + s;
        return s;
    }
}
FileItem._resolver = new idResolver_1.IDResolver();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileItem;
//# sourceMappingURL=fileItem.js.map
'use strict';
const vscode = require("vscode");
const fs = require("fs");
const readline = require("readline");
class IDResolver {
    constructor() {
        this._user_cache = new Map();
        this._group_cache = new Map();
        this.create(true);
        this.create(false);
    }
    username(uid) {
        return this._user_cache.get(uid);
    }
    groupname(uid) {
        return this._group_cache.get(uid);
    }
    create(user) {
        let path;
        if (user) {
            path = '/etc/passwd';
        }
        else {
            path = '/etc/group';
        }
        if (fs.existsSync(path) === false) {
            vscode.window.showErrorMessage(`Could not get stat of ${path}`);
            return;
        }
        const rl = readline.createInterface({
            input: fs.createReadStream(path),
        });
        rl.on('line', (line) => {
            const l = line.split(":", 3);
            const name = l[0];
            const uid = parseInt(l[2], 10);
            if (user) {
                this._user_cache.set(uid, name);
            }
            else {
                this._group_cache.set(uid, name);
            }
        });
    }
    createOnMac() {
        // dscl . -list /Users UniqueID
        // dscl . -list /Groups gid
    }
}
exports.IDResolver = IDResolver;
//# sourceMappingURL=idResolver.js.map
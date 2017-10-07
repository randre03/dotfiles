'use strict';
const vscode = require("vscode");
const provider_1 = require("./provider");
const FIXED_WINDOW_AUTHORITY = "fixed_window";
exports.FXIED_URI = vscode.Uri.parse('dired://fixed_window');
function encodeLocation(dir, fixed_window) {
    if (fixed_window) {
        return exports.FXIED_URI;
    }
    else {
        return vscode.Uri.parse(`${provider_1.default.scheme}://${dir}`);
    }
}
exports.encodeLocation = encodeLocation;
function decodeLocation(uri) {
    const line = 0; // TODO
    const character = 0;
    if (uri.authority === FIXED_WINDOW_AUTHORITY) {
        const [dir] = JSON.parse(uri.query);
        return [dir, new vscode.Position(line, character)];
    }
    else {
        return [uri.fsPath, new vscode.Position(line, character)];
    }
}
exports.decodeLocation = decodeLocation;
//# sourceMappingURL=utils.js.map
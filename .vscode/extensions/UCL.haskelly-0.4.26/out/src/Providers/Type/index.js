"use strict";
const InteroSpawn_1 = require("../InteroSpawn");
const other_1 = require("../../utils/other");
const document_1 = require("../../utils/document");
class TypeProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            const wordInfo = other_1.getNearWord(position, document.getText());
            let filePath = document_1.normalizePath(document.uri.fsPath);
            InteroSpawn_1.default.getInstance().requestType(filePath, position, wordInfo)
                .then(hover => {
                resolve(hover);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeProvider;
//# sourceMappingURL=index.js.map
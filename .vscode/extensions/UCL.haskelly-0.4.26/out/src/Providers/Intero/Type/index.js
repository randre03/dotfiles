"use strict";
const InteroSpawn_1 = require("../InteroSpawn");
const other_1 = require("../../utils/other");
class TypeProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            const word = other_1.getNearWord(position, document.getText());
            let filePathBeginning = document.uri.fsPath.slice(0, 3);
            if (filePathBeginning === 'c:\\') {
                filePathBeginning = 'C:\\';
            }
            const filepath = filePathBeginning + document.uri.fsPath.slice(3, document.uri.fsPath.length);
            InteroSpawn_1.default.getInstance().requestType(filepath, position, word)
                .then(hover => {
                resolve(hover);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeProvider;
//# sourceMappingURL=index.js.map
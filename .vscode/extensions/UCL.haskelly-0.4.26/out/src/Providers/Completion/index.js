"use strict";
const vscode = require("vscode");
const InteroSpawn_1 = require("../InteroSpawn");
const other_1 = require("../../utils/other");
const document_1 = require("../../utils/document");
const fs = require('fs');
class CompletionProvider {
    constructor(context) {
        const snippetsConf = vscode.workspace.getConfiguration('haskelly')['snippets'];
        if (snippetsConf && snippetsConf['important']) {
            fs.readFile(`${context.extensionPath}/languages/snippets/haskell.json`, 'utf8', (err, data) => {
                if (err)
                    console.log(err);
                else
                    this.snippets = JSON.parse(data);
            });
        }
        else {
            this.snippets = [];
        }
    }
    getCompletionsAtPosition(position, document) {
        return new Promise((resolve, reject) => {
            const word = other_1.getWord(position, document.getText());
            let filePath = document_1.normalizePath(document.uri.fsPath);
            // Request completions
            InteroSpawn_1.default.getInstance().requestCompletions(filePath, position, word)
                .then((suggestions) => {
                let filteredSuggestions = [];
                // No snippets
                if (this.snippets.length == 0) {
                    filteredSuggestions = suggestions;
                }
                else {
                    // Filter suggestions from snippets
                    suggestions.forEach(suggestion => {
                        if (!this.snippets[suggestion.label]) {
                            filteredSuggestions.push(suggestion);
                        }
                    });
                }
                resolve(filteredSuggestions);
            })
                .catch(err => reject(err));
        });
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            this.getCompletionsAtPosition(position, document).then((completions) => {
                resolve(completions);
            }).catch(e => console.error(e));
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompletionProvider;
//# sourceMappingURL=index.js.map
'use strict';
const vscode = require("vscode");
const provider_1 = require("./provider");
const utils_1 = require("./utils");
const path = require("path");
function activate(context) {
    const fixed_window = true; // TODO: configurable
    const provider = new provider_1.default(fixed_window);
    const providerRegistrations = vscode.Disposable.from(vscode.workspace.registerTextDocumentContentProvider(provider_1.default.scheme, provider));
    const commandOpen = vscode.commands.registerCommand("extension.dired.open", () => {
        const at = vscode.window.activeTextEditor;
        if (!at) {
            return;
        }
        const doc = at.document;
        const dir = path.dirname(doc.fileName);
        return provider.setDirName(dir)
            .then(() => provider.reload())
            .then(() => vscode.workspace.openTextDocument(utils_1.FXIED_URI))
            .then(doc => vscode.window.showTextDocument(doc, 0));
    });
    const commandEnter = vscode.commands.registerCommand("extension.dired.enter", () => {
        provider.enter();
    });
    const commandCreateDir = vscode.commands.registerCommand("extension.dired.createDir", () => {
        vscode.window.showInputBox()
            .then((dirName) => {
            if (!dirName) {
                return;
            }
            provider.createDir(dirName);
        });
    });
    const commandRename = vscode.commands.registerCommand("extension.dired.rename", () => {
        vscode.window.showInputBox()
            .then((newName) => {
            provider.rename(newName);
        });
    });
    const commandCopy = vscode.commands.registerCommand("extension.dired.copy", () => {
        vscode.window.showInputBox()
            .then((newName) => {
            provider.copy(newName);
        });
    });
    const commandGoUpDir = vscode.commands.registerCommand("extension.dired.goUpDir", () => {
        provider.goUpDir();
    });
    const commandRefresh = vscode.commands.registerCommand("extension.dired.refresh", () => {
        provider.reload();
    });
    const commandSelect = vscode.commands.registerCommand("extension.dired.select", () => {
        provider.select();
    });
    const commandClose = vscode.commands.registerCommand("extension.dired.close", () => {
        provider.clear();
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
    context.subscriptions.push(provider, commandOpen, commandEnter, commandCreateDir, commandRename, commandCopy, commandGoUpDir, commandRefresh, commandClose, commandSelect, providerRegistrations);
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor.document.uri.scheme === provider_1.default.scheme) {
            vscode.commands.executeCommand('setContext', 'dired.open', true);
        }
        else {
            vscode.commands.executeCommand('setContext', 'dired.open', false);
        }
    });
    return {
        DiredProvider: provider,
    };
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
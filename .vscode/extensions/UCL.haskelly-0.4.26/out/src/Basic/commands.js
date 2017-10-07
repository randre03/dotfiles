"use strict";
const vscode = require("vscode");
const testCode_1 = require("../helpers/testCode");
const workDir_1 = require("../utils/workDir");
const fs = require('fs');
const path = require('path');
const uuidV4 = require('uuid/v4');
let reuseTerminal = vscode.workspace.getConfiguration('haskelly')['exec']['reuseTerminal'];
let terminal;
function getTerminal(name) {
    console.log(reuseTerminal);
    if (reuseTerminal) {
        if (terminal) {
            terminal.dispose();
        }
        terminal = vscode.window.createTerminal(name);
        return terminal;
    }
    else {
        return vscode.window.createTerminal(name);
    }
}
/* GHCi */
function loadGHCi(extPath, src) {
    const term = getTerminal('Haskell GHCi');
    const folder = path.dirname(src);
    const file = path.basename(src);
    term.sendText(`cd "${folder}"`);
    term.show();
    term.sendText(`stack ghci --ghci-options ${file}`);
}
/* Run Haskell */
function runHaskell(extPath, src) {
    const term = getTerminal('Haskell Run');
    term.show();
    term.sendText(`stack runhaskell "${src}"`);
}
/* Stack Build */
function stackBuild(stackWd) {
    const term = getTerminal('Stack Build');
    term.sendText(`cd "${stackWd}"`);
    term.sendText(`stack build --fast`);
    term.show();
}
/* Stack Run */
function stackRun(stackWd) {
    const term = getTerminal('Stack Run');
    term.sendText(`cd "${stackWd}"`);
    term.sendText(`stack run`);
    term.show();
}
/* Stack test */
function stackTest(stackWd) {
    const term = getTerminal('Stack Run');
    term.sendText(`cd "${stackWd}"`);
    term.sendText(`stack test`);
    term.show();
}
/* QuickCheck */
function showTestError(error, extPath) {
    vscode.window.showErrorMessage('VS Code can\'t execute this file. Check the terminal.');
    let errorFilePath = `${extPath}/${uuidV4()}.txt`;
    fs.writeFile(errorFilePath, '-------- Error --------\n' + error + '------------------------', 'utf-8', err => {
        const term = vscode.window.createTerminal('Haskell Tests');
        // Windows
        if (/^win/.test(process.platform)) {
            errorFilePath = errorFilePath.replace(/\//g, "\\");
            term.sendText(`type ${errorFilePath}`);
        }
        else {
            term.sendText(`cat ${errorFilePath}`);
        }
        term.show();
        setTimeout(() => fs.unlinkSync(errorFilePath), 3000);
    });
}
function showTestOutput(passed, failed) {
    if (failed.length > 0) {
        if (failed.length === 1) {
            vscode.window.showErrorMessage(`${failed[0].name} test failed!`);
        }
        else {
            vscode.window.showErrorMessage(`${failed.length} tests failed!`);
        }
    }
    else if (passed.length > 0) {
        vscode.window.showInformationMessage('All tests passed!');
    }
    else {
        vscode.window.showErrorMessage('No tests were found!');
    }
}
function testHaskell(extPath, src, stackWd) {
    let counter = -1;
    let doneTesting = false;
    const loader = () => {
        counter = (counter + 1) % 4;
        const sign = ['|', '/', '-', '\\'][counter];
        if (!doneTesting)
            setTimeout(loader, 200);
        const text = stackWd ? 'Stack test' : 'QuickCheck';
        vscode.window.setStatusBarMessage(`${sign}  Running ${text}`, 200);
    };
    loader();
    testCode_1.testHaskellFile(src, stackWd).then(testResults => {
        doneTesting = true;
        showTestOutput(testResults['passedTests'], testResults['failedTests']);
    }).catch(error => {
        doneTesting = true;
        showTestError(error, extPath);
    });
}
function initCommands(context) {
    const documentPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath
        : vscode.workspace.textDocuments[0].uri.fsPath;
    let stackWd = workDir_1.getWorkDir(documentPath)["cwd"];
    let isStack = stackWd !== undefined;
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            stackWd = workDir_1.getWorkDir(editor.document.uri.fsPath)["cwd"];
            isStack = stackWd !== undefined;
        }
    });
    /* Register Commands */
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.ghci', editor => {
        editor.document.save()
            .then(() => {
            vscode.window.setStatusBarMessage('Loading module in GHCi...', 1000);
            loadGHCi(context.extensionPath, editor.document.uri.fsPath);
        });
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.runHaskell', editor => {
        editor.document.save()
            .then(() => {
            if (isStack) {
                vscode.window.showErrorMessage('Not supported inside a Stack project.');
            }
            else {
                vscode.window.setStatusBarMessage('Running your code...', 1000);
                runHaskell(context.extensionPath, editor.document.uri.fsPath);
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.runQuickCheck', editor => {
        editor.document.save()
            .then(() => {
            if (isStack) {
                vscode.window.showErrorMessage('Not supported inside a Stack project.');
            }
            else {
                testHaskell(context.extensionPath, editor.document.uri.fsPath, undefined);
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.stackBuild', editor => {
        editor.document.save()
            .then(() => {
            if (isStack) {
                stackBuild(stackWd);
            }
            else {
                vscode.window.showErrorMessage('No Stack project was found.');
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.stackRun', editor => {
        editor.document.save()
            .then(() => {
            if (isStack) {
                stackRun(stackWd);
            }
            else {
                vscode.window.showErrorMessage('No Stack project was found.');
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('editor.stackTest', editor => {
        editor.document.save()
            .then(() => {
            if (isStack) {
                stackTest(stackWd);
            }
            else {
                vscode.window.showErrorMessage('No Stack project was found.');
            }
        });
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initCommands;
//# sourceMappingURL=commands.js.map
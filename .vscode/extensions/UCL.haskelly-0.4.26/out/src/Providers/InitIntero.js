"use strict";
const child_process_1 = require("child_process");
const StreamSplitter = require('stream-splitter');
class SyncSpawn {
    constructor(commands, options, isStack, callback) {
        this.spawnCallback = callback;
        this.isStack = isStack;
        this.shell = child_process_1.spawn(commands[0], commands.slice(1, commands.length), options);
        this.runSyncCommand(":set prompt  \"lambda> \"");
        this.readOutput();
    }
    killProcess() {
        this.shell.stdin.pause();
        this.shell.kill();
    }
    readOutput() {
        const splitter = this.shell.stdout.pipe(StreamSplitter("\n"));
        splitter.encoding = 'utf8';
        let stackOutput = "";
        let intent = 0;
        splitter.on('token', (line) => {
            stackOutput += line;
        });
        const endSplitter = this.shell.stdout.pipe(StreamSplitter("lambda>"));
        endSplitter.on('token', (line) => {
            this.analyseInitOutput(stackOutput, intent);
            intent++;
        });
        const errSplitter = this.shell.stderr.pipe(StreamSplitter("\n"));
        errSplitter.on('token', (line) => {
            stackOutput += line;
        });
    }
    analyseInitOutput(output, intent) {
        if (output.indexOf('Failed') > 0) {
            this.killProcess();
            if (this.isStack) {
                this.spawnCallback(true);
            }
            else {
                if (intent === 0) {
                    this.spawnCallback(true);
                }
                else {
                    this.callback(true);
                }
            }
        }
        else {
            if (this.isStack) {
                this.spawnCallback(false);
            }
            else {
                if (intent === 0) {
                    this.spawnCallback(false);
                }
                else {
                    this.callback(false);
                }
            }
        }
    }
    runCommand(command, callback) {
        this.callback = callback;
        this.shell.stdin.write(command + '\n');
    }
    runSyncCommand(command) {
        this.shell.stdin.write(command + '\n');
    }
    getShell() {
        return this.shell;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SyncSpawn;
//# sourceMappingURL=InitIntero.js.map
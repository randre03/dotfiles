"use strict";
const child_process_1 = require("child_process");
const StreamSplitter = require('stream-splitter');
class SyncSpawn {
    constructor(commands, positiveOutput, negativeOutput, options, callback) {
        this.positiveOutput = positiveOutput;
        this.negativeOutput = negativeOutput;
        this.shell = child_process_1.spawn(commands[0], commands.slice(1, commands.length), options);
        this.callback = callback;
        this.readOutput();
    }
    readOutput() {
        const splitter = this.shell.stdout.pipe(StreamSplitter("\n"));
        splitter.encoding = 'utf8';
        splitter.on('token', (line) => {
            // console.log(line);
            if (line.indexOf(this.positiveOutput) !== -1) {
                this.callback(line);
            }
            else if (line.indexOf(this.negativeOutput) !== -1) {
                this.killProcess();
                this.callback(line, true);
            }
        });
        splitter.on('done', () => {
            console.log("Sync shell terminated.");
        });
        splitter.on('error', (error) => {
            console.log("Error: ", error);
            this.killProcess();
            this.callback(error, true);
        });
    }
    runCommand(command, positiveOutput, negativeOutput, callback) {
        this.positiveOutput = positiveOutput;
        this.negativeOutput = negativeOutput;
        this.callback = callback;
        this.shell.stdin.write(command + '\n');
    }
    runSyncCommand(command) {
        this.shell.stdin.write(command + '\n');
    }
    getShell() {
        return this.shell;
    }
    killProcess() {
        this.shell.stdin.pause();
        this.shell.kill();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SyncSpawn;
//# sourceMappingURL=syncSpawn.js.map
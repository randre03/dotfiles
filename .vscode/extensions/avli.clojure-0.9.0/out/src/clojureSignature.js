"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cljConnection_1 = require("./cljConnection");
const cljParser_1 = require("./cljParser");
const nreplClient_1 = require("./nreplClient");
const PARAMETER_OPEN = `[`;
const PARAMETER_CLOSE = `]`;
const PARAMETER_REST = `&`;
const SPECIAL_FORM_PARAMETER_REST = `*`;
const SPECIAL_FORM_CUSTOM_ARGLISTS = new Map([
    [`fn`, `([name? params exprs*] [name? & [params & expr]])`],
    [`set!`, `([var-symbol expr] [[. instance-expr instanceFieldName-symbol] expr] [[. Classname-symbol staticFieldName-symbol] expr])`],
    [`.`, `([instance instanceMember args*] [Classname instanceMember args*] [instance -instanceField] [Classname staticMethod args*] [. Classname staticField])`],
    [`new`, `([Classname args*])`],
]);
class ClojureSignatureProvider {
    provideSignatureHelp(document, position, token) {
        if (!cljConnection_1.cljConnection.isConnected())
            return Promise.reject('No nREPL connected.');
        const textToGetInfo = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const exprInfo = cljParser_1.cljParser.getExpressionInfo(textToGetInfo);
        if (!exprInfo)
            return Promise.reject('No expression found.');
        const ns = cljParser_1.cljParser.getNamespace(document.getText());
        return cljConnection_1.cljConnection.sessionForFilename(document.fileName).then(session => {
            return nreplClient_1.nreplClient.info(exprInfo.functionName, ns, session.id).then(info => {
                if (!info.name)
                    return Promise.reject('No signature info found.');
                if (!!info['special-form'])
                    return Promise.resolve(getSpecialFormSignatureHelp(info, exprInfo.parameterPosition));
                return Promise.resolve(getFunctionSignatureHelp(info, exprInfo.parameterPosition));
            });
        });
    }
}
exports.ClojureSignatureProvider = ClojureSignatureProvider;
function getSpecialFormSignatureHelp(info, parameterPosition) {
    const signatureLabel = `*special form* ${info.name}`;
    let arglists = SPECIAL_FORM_CUSTOM_ARGLISTS.get(info.name);
    if (!arglists) {
        const forms = info['forms-str'];
        const [functionName, ...parameters] = forms.substring(3, forms.length - 1).split(' ');
        arglists = `([${parameters.join(' ')}])`;
    }
    return getSignatureHelp(signatureLabel, info.doc, arglists, parameterPosition);
}
function getFunctionSignatureHelp(info, parameterPosition) {
    const arglists = info['arglists-str'];
    if (!arglists)
        return;
    const signatureLabel = `${info.ns}/${info.name}`;
    return getSignatureHelp(signatureLabel, info.doc, arglists, parameterPosition);
}
function getSignatureHelp(signatureLabel, signatureDoc, arglists, parameterPosition) {
    const signatures = getSignatureInfos(signatureLabel, signatureDoc, arglists);
    signatures.sort((sig1, sig2) => sig1.parameters.length - sig2.parameters.length);
    let activeSignature = signatures.findIndex(signature => signature.parameters.length >= parameterPosition + 1);
    if (activeSignature === -1) {
        activeSignature = signatures.findIndex(signature => signature.parameters.some(param => param.label.startsWith(PARAMETER_REST)));
        if (activeSignature === -1)
            activeSignature = signatures.findIndex(signature => signature.parameters.slice(-1)[0].label.endsWith(SPECIAL_FORM_PARAMETER_REST));
        if (activeSignature !== -1)
            parameterPosition = signatures[activeSignature].parameters.length - 1;
    }
    if (activeSignature === -1)
        activeSignature = 0;
    const signatureHelp = new vscode.SignatureHelp();
    signatureHelp.signatures = signatures;
    signatureHelp.activeParameter = parameterPosition;
    signatureHelp.activeSignature = activeSignature;
    return signatureHelp;
}
function getSignatureInfos(signatureLabel, signatureDoc, arglists) {
    const sigParamStarts = [];
    const sigParamStops = [];
    let nestingLevel = 0;
    for (let i = 0; i < arglists.length; i++) {
        if (arglists[i] === PARAMETER_OPEN) {
            if (nestingLevel === 0)
                sigParamStarts.push(i);
            nestingLevel++;
        }
        if (arglists[i] === PARAMETER_CLOSE) {
            nestingLevel--;
            if (nestingLevel === 0)
                sigParamStops.push(i);
        }
    }
    return sigParamStarts
        .map((sigParamStart, index) => arglists.substring(sigParamStart, sigParamStops[index] + 1))
        .map(signatureParameter => {
        const parameterInfos = getParameterInfos(signatureParameter);
        const sigInfo = new vscode.SignatureInformation(`${signatureLabel} [${parameterInfos.map(pi => pi.label).join(`\n`)}]`);
        sigInfo.documentation = signatureDoc;
        sigInfo.parameters = parameterInfos;
        return sigInfo;
    });
}
function getParameterInfos(signatureParameter) {
    signatureParameter = signatureParameter.substring(1, signatureParameter.length - 1); // removing external brackets
    const paramStarts = [];
    const paramStops = [];
    let insideParameter = false;
    let bracketsNestingLevel = 0;
    for (let i = 0; i < signatureParameter.length; i++) {
        const char = signatureParameter[i];
        if (!insideParameter) {
            insideParameter = true;
            paramStarts.push(i);
            if (char === PARAMETER_OPEN)
                bracketsNestingLevel++;
            if (char === PARAMETER_REST)
                break;
        }
        else {
            if (char === PARAMETER_OPEN)
                bracketsNestingLevel++;
            if (char === PARAMETER_CLOSE)
                bracketsNestingLevel--;
            if (char === PARAMETER_CLOSE && bracketsNestingLevel === 0) {
                paramStops.push(i);
                insideParameter = false;
            }
            if (cljParser_1.cljParser.R_CLJ_WHITE_SPACE.test(char) && bracketsNestingLevel === 0) {
                paramStops.push(i);
                insideParameter = false;
            }
        }
    }
    paramStops.push(signatureParameter.length);
    return paramStarts
        .map((paramStart, index) => signatureParameter.substring(paramStart, paramStops[index] + 1))
        .map(parameter => new vscode.ParameterInformation(parameter));
}
//# sourceMappingURL=clojureSignature.js.map
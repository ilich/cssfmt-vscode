"use strict";

import vscode = require("vscode");
import cssfmt = require("./cssfmt");

export function activate(context: vscode.ExtensionContext) {
	let cssfmtCommand = vscode.commands.registerTextEditorCommand("cssfmt", (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
		var engine = new cssfmt.CssEngine(textEditor, edit);
		engine.format();
	});

	let compressCommand = vscode.commands.registerTextEditorCommand("compresscss", (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
		var engine = new cssfmt.CssEngine(textEditor, edit);
		engine.compress();
	});

	context.subscriptions.push(cssfmtCommand);
	context.subscriptions.push(compressCommand);
}
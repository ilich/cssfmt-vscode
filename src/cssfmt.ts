"use strict";

import vscode = require("vscode");
import css = require("css");

const TARGET_LANGUAGE_ID = "css";

interface TransformFunc {
	(stylesheet: css.Stylesheet): string;
}

export class CssEngine {
	private textEditor: vscode.TextEditor;
	private edit: vscode.TextEditorEdit;

	constructor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		this.textEditor = textEditor;
		this.edit = edit;
	}

	public format() {
		this.modifyStyles((stylesheet: string) => {
			let settings = vscode.workspace.getConfiguration("cssfmt");
			let options: css.StringifyOptions = {};
			if (settings.get("useTabs", false)) {
				options.indent = "\t";
			} else {
				let size = settings.get("indent", 4);
				options.indent = "";
				for (let i = 0; i < size; i++) {
					options.indent += " ";
				}
			}

			return css.stringify(stylesheet, options);
		});
	}

	public compress() {
		this.modifyStyles((stylesheet: css.Stylesheet) => {
			return css.stringify(stylesheet, { compress: true });
		});
	}

	private modifyStyles(transform: TransformFunc) {
		if (this.textEditor.document.languageId !== TARGET_LANGUAGE_ID) {
			return;
		}

		let document = this.textEditor.document;

		// Apply transformation
		let target = document.getText();
		let stylesheet = css.parse(target);
		let result = transform(stylesheet);

		// Replace document's content
		let lastLine = document.lineAt(document.lineCount - 1);
		let selectAll = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);
		this.edit.replace(selectAll, result);
	}
}
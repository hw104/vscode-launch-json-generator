import * as vscode from "vscode";
import { handler } from "./commands/generate";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("launch-json-generator.generate", handler)
  );
}

export function deactivate() {}

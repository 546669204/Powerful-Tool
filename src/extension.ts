import * as vscode from 'vscode';
import WordCounter from './wordCounter';
import Chat from './chat';
//初始化
export function activate(context: vscode.ExtensionContext) {

  var counter = new WordCounter();
  var chat = new Chat();

  context.subscriptions.push(counter);
  context.subscriptions.push(chat);
}

export function deactivate() {}


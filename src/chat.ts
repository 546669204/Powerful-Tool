import * as vscode from "vscode";

class Chat {
  public panel:vscode.WebviewPanel
  public disposable: any;
  constructor() {
    this.panel = {} as vscode.WebviewPanel;

    let disposableStart = vscode.commands.registerCommand('powerfultool.chat.start', () => {
      this.panel = vscode.window.createWebviewPanel(
        "catCoding", // Identifies the type of the webview. Used internally
        "Cat Coding", // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
      );
      this.panel.webview.html = this.getWebviewContent();
    });

    this.disposable = vscode.Disposable.from(disposableStart);
  }
  getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
      <img src="https://www.baidu.com/img/baidu_jgylogo3.gif" width="300" />
  </body>
  </html>`;
  }
  dispose() {
    this.panel.dispose();
    this.disposable.dispose();
  }
}

export default Chat;
// module.exports = Chat;

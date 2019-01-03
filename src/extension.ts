import * as vscode from 'vscode';

//初始化
export function activate(context: vscode.ExtensionContext) {


  var WordCounter = require('./wordCounter.js');
  var counter = new WordCounter();

  //需要释放的资源都在这里依次push到这个数组里面
  //注意，这些非托管的资源，都含有dispose方法，自己封装的对象，如果有需要手动释放的资源，请也实现dispose方法吧

  context.subscriptions.push(counter);
}

export function deactivate() {}


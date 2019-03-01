import * as vscode from "vscode";
import * as os from "os";
import * as fs from 'fs';
import * as path from 'path';
import * as bigInteger from 'big-integer';
import myDate from './Date';

interface Analysis{
  Characters:bigInteger.BigInteger, //字
  Words:bigInteger.BigInteger, //词
  Chinese:bigInteger.BigInteger, //汉字
  Paragraphs:bigInteger.BigInteger, //行
  Time:Number
}


class WordCounter {
  public analysis: Analysis;
  public statusBar: any;
  public disposable: any;
  public editor: vscode.TextEditor;
  public lastWordMap: { [key: string]: {[key:string]:number} };
  public lastWordsMap: { [key: string]: number };
  public lastChineseMap: { [key: string]: number };

  constructor() {
    //构造函数，传入vscode对象
    this.lastWordMap = {};
    this.lastWordsMap = {};
    this.lastChineseMap = {};
    this.analysis = {} as Analysis;
    this.editor = {} as vscode.TextEditor;
    this.resetData();
    this.init();
  }

  init() {
    //初始化
    // var vscode = this.vscode;
    var StatusBarAlignment = vscode.StatusBarAlignment;
    this.readData();
    //statusBar，是需要手动释放的
    this.statusBar = vscode.window.createStatusBarItem(StatusBarAlignment.Left);

    //跟注册事件相配合的数组，事件的注册，也是需要释放的
    var disposable:vscode.Disposable[] = [];
    
    //事件在注册的时候，会自动填充一个回调的dispose到数组
    vscode.window.onDidChangeTextEditorSelection(this.updateText, this, disposable);
    vscode.workspace.onDidOpenTextDocument(this.saveData,this,disposable);
    vscode.workspace.onDidSaveTextDocument(this.saveData,this,disposable);
    vscode.workspace.onDidCloseTextDocument(this.saveData,this,disposable);
    vscode.window.onDidChangeWindowState(this.forcusHandler,this,disposable)

    let disposableCount = vscode.commands.registerCommand('extension.word_counter_count', () => {
      let out = vscode.window.createOutputChannel("myTimer");
      if (vscode.env.language == "zh-cn"){
        out.append(`从${new myDate(this.analysis.Time).format("yyyy-MM-DD HH:mm:ss")}起\n您已经敲了\n${this.analysis.Characters.toString()}个字符\n${this.analysis.Words.toString()}个词语\n${this.analysis.Chinese.toString()}个汉字\n${this.analysis.Paragraphs.toString()}行代码\n`);
      }else{
        out.append(`From ${new myDate(this.analysis.Time).format("yyyy-MM-DD HH:mm:ss")} \nYou have already knocked\n${this.analysis.Characters.toString()} characters\n${this.analysis.Words.toString()} words\n${this.analysis.Chinese.toString()} Chinese characters\n${this.analysis.Paragraphs.toString()} lines of code\n`);
      }
      out.show();
      out.dispose();
    });
    
    let disposableReset = vscode.commands.registerCommand('extension.word_counter_reset', () => {
      this.resetData();
      this.saveData();
    });
    let disposableSave = vscode.commands.registerCommand('extension.word_counter_save', () => {
      this.saveData();
    });

    disposable.push(disposableCount,disposableReset,disposableSave);

    //保存需要释放的资源
    this.disposable = vscode.Disposable.from(...disposable);

    this.updateText();
    this.statusBar.show();
// vscode.workspace.getConfiguration("") // 获取配置项

  

  

  }
  selectionToIndex(content:string,line:number,character:number):number{

    return 0
  }

  updateText() {
    var window = vscode.window;

    if (window.activeTextEditor && window.activeTextEditor.document) {
      this.editor = window.activeTextEditor;
      var content = this.editor.document.getText();
      let oneId = this.editor.document.uri.toString();
      // let line = this.editor.selection.active.line;
      // let character = this.editor.selection.active.character;
      var selectionIndex = this.editor.document.offsetAt(this.editor.selection.active.translate());

      if(!this.lastWordMap[oneId]){
        this.lastWordMap[oneId] = {length:content.length,offset:selectionIndex}
        return 
      }
      
      if (content.length == this.lastWordMap[oneId].length){
        this.lastWordMap[oneId].offset = selectionIndex;
        return 
      }

      
      
      let oldSelectionIndex = this.lastWordMap[oneId].offset;
      if (selectionIndex <= oldSelectionIndex){
        return 
      }
      let changeContent = content.substring(oldSelectionIndex,selectionIndex);

      let wordContent = changeContent;
      let chinaContent = content.replace(/[\r\n\s]+/g, "").match(/[\u4e00-\u9fa5]/gi) || [];
      let wordsContent = [];
      content.replace(/[\r\n\s]+/g, " ").split(" ").forEach((v:any) => {
        if (v)wordsContent.push(v)
      });

      this.lastWordMap[oneId] = {length:content.length,offset:selectionIndex};

      this.analysis.Characters = this.analysis.Characters.add(bigInteger(wordContent.replace(/[\r\n\s]+/g, "").length));
      if (vscode.env.language == "zh-cn"){
        this.statusBar.text = `从中华元年开始。您已经敲了${this.analysis.Characters.toString()}个字符了`;
      }else{
        this.statusBar.text = `${this.analysis.Characters.toString()} characters`;

      }

      let temp = null;
      temp = wordContent.match(/\n/gi)
      this.analysis.Paragraphs = this.analysis.Paragraphs.add(bigInteger(temp&&temp.length||0)); // 换行 计数

      if(!this.lastChineseMap[oneId])this.lastChineseMap[oneId] = chinaContent.length;

      if(chinaContent.length - this.lastChineseMap[oneId] >0){
        this.analysis.Chinese = this.analysis.Chinese.add(bigInteger(chinaContent.length - this.lastChineseMap[oneId])); // 汉字 计数
      }
      this.lastChineseMap[oneId] = chinaContent.length;


      if(!this.lastWordsMap[oneId])this.lastWordsMap[oneId] = wordsContent.length;

      if(wordsContent.length - this.lastWordsMap[oneId] >0){
        this.analysis.Words = this.analysis.Words.add(bigInteger(wordsContent.length - this.lastWordsMap[oneId])); // 词组 计数
      }
      this.lastWordsMap[oneId] = wordsContent.length;


      
    }
  }
  resetData(){
    this.analysis = {
      Characters:bigInteger.zero,
      Words:bigInteger.zero,
      Chinese:bigInteger.zero,
      Paragraphs:bigInteger.zero,
      Time:new Date().getTime()
    }
  }
  readData(){
    let dataJson = String(fs.readFileSync(path.join(this.getUserHomeDir()+"/.myTimer.cf")));
    if(dataJson){
      try {
        this.analysis = JSON.parse(dataJson);
      } catch (error) {
        this.resetData();
        return
      }
      this.analysis.Characters = bigInteger(this.analysis.Characters);
      this.analysis.Words = bigInteger(this.analysis.Words);
      this.analysis.Chinese = bigInteger(this.analysis.Chinese);
      this.analysis.Paragraphs = bigInteger(this.analysis.Paragraphs);
    }
  }
  saveData(){
    fs.writeFileSync(path.join(os.homedir()+"/.myTimer.cf"),JSON.stringify(this.analysis))
  }
  forcusHandler(res:vscode.WindowState){
    if(!res.focused){
      this.saveData();
    }else{
      this.readData();
    }
  }
  getUserHomeDir() {
    return (
      process.env[os.type() === "Windows_NT" ? "USERPROFILE" : "HOME"] || ""
    );
  }
  dispose() {
    //实现dispose方法
    this.disposable.dispose();
    this.statusBar.dispose();
  }
}

// module.exports = WordCounter;
export default WordCounter;

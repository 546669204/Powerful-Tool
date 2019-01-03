class MyDate {
  private _date:Date = new Date;
  constructor(str:any){
    if(typeof str == 'string'){
      str = str.replace(/-/gi,"/");
      this._date = new Date(str);
    }else if(typeof str == 'number'){
      this._date = new Date(str);
    }else if(typeof str == 'object' && str instanceof Date){
      this._date = str;
    }else{
      throw `初始化失败 typeof ${typeof(str)} ${str}`;
    }
  }
  format(str:string):string{
    // yyyy  年  Year  1996; 96  
    // MM  年中的月份  Month  July; Jul; 07  
    // ww  年中的周数  Number  27  
    // WW  月份中的周数  Number  2  
    // DD  年中的天数  Number  189  
    // dd  月份中的天数  Number  10  
    // FF  月份中的星期  Number  2  
    // EE  星期中的天数  Text  Tuesday; Tue  
    // aa  Am/pm 标记  Text  PM  
    // HH  一天中的小时数（0-23）  Number  0  
    // kk  一天中的小时数（1-24）  Number  24  
    // KK  am/pm 中的小时数（0-11）  Number  0  
    // hh  am/pm 中的小时数（1-12）  Number  12  
    // mm  小时中的分钟数  Number  30  
    // ss  分钟中的秒数  Number  55  
    // SS  毫秒数  Number  978  
    str = str.replace(/yyyy/g,String(this._date.getFullYear()));
    str = str.replace(/ww/g,String(this.format_ww()));
    str = str.replace(/WW/g,String(this.format_FF()));
    str = str.replace(/DD/g,String(this.format_DD()));
    str = str.replace(/dd/g,String(this._date.getDate()));
    str = str.replace(/FF/g,String(this.format_FF()));
    str = str.replace(/EE/g,String(this._date.getDay()==0?7:this._date.getDay()));
    str = str.replace(/aa/g,((this._date.getHours()+1)<12)?"am":"pm");
    str = str.replace(/KK/g,String((this._date.getHours()+1<12)?this._date.getHours():this._date.getHours()-13));
    str = str.replace(/kk/g,String(this._date.getHours()+1));
    str = str.replace(/HH/g,String(this._date.getHours()));
    str = str.replace(/hh/g,String((this._date.getHours()+1<12)?this._date.getHours()+1:this._date.getHours()-12));
    str = str.replace(/MM/g,String(this._date.getMonth()+1));
    str = str.replace(/mm/g,String(this._date.getMinutes()));
    str = str.replace(/SS/g,String(this._date.getMilliseconds()));
    str = str.replace(/ss/g,String(this._date.getSeconds()));
    return str
  }
  countdown(str:string):string{
    var tmp:number = this._date.getTime()/1000;
    ['dd','HH','mm','ss'].map((v)=>{
      return str.indexOf(v) != -1 ?v:undefined;
    }).forEach((v)=>{
      switch (v) {
        case 'dd':
          var c = Math.floor(tmp / 86400);
          tmp = tmp % 86400;
          str = str.replace(/dd/g,String(c));
          break;
        case 'HH':
          var c = Math.floor(tmp / 3600);
          tmp = tmp % 3600;
          str = str.replace(/HH/g,String(c));
          break;
        case 'mm':
          var c = Math.floor(tmp / 60);
          tmp = tmp % 60;
          str = str.replace(/mm/g,String(c));
          break;
        case 'ss':
          var c = Math.floor(tmp);
          str = str.replace(/ss/g,String(c));
          break;
        default:
          break;
      }
    })

    return str;
  }
  private format_DD():number{
    var DD:number = 0;
    var month = this._date.getMonth();
    var year = this._date.getFullYear();
    for (let i = 1; i <= month+1; i++) {
      var t = new Date(year,i,-1);
      if(i == month+1){
        DD += this._date.getDate();
      }else{
        DD += t.getDate();
      }
    }
    return DD;
  }
  private format_FF():number{
    var day = this._date.getDate();
    var month = this._date.getMonth();
    var year = this._date.getFullYear();
    var t = new Date(year,month,1);
    return Math.ceil((day + t.getDay() + 1)/7);
  }
  private format_ww():number{
    var year = this._date.getFullYear();
    var t = new Date(year,0,1);
    return Math.ceil((this.format_DD() + t.getDay() + 1)/7);
  }
}

console.log(new MyDate(10000*1000).countdown("mm分ss秒"))


export default MyDate





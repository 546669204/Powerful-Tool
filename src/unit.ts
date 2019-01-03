import * as bigInteger from 'big-integer';

class Unit {
  public data:any
  constructor(int:number){
    this.data = int;
  }
  toString(){
    return bigInteger(this.data).toString();
    let a:string[] = '千|万|十万|百万|千万|亿|十亿|百亿|千亿兆|十兆|百兆|千兆|京|十京|百京|千京|垓|十垓|百垓|千垓|秭|十秭|百秭|千秭|穰|十穰|百穰|千穰|沟|十沟|百沟|千沟|涧|十涧|百涧|千涧|正|十正|百正|千正|载|十载|百载|千载|极|十极|百极|千极|恒河沙|十恒河沙|百恒河沙|千恒河沙|阿僧祗|十阿僧祗|百阿僧祗|千阿僧祗|那由他|十那由他|百那由他|千那由他|不可思议|十不可思议|百不可思议|千不可思议|无量|十无量|百无量|千无量|大数|十大数|百大数|千大数'.split("|");
    let b:string = String(this.data);
    for (let i = 0; i < a.length; i++) {
      if (this.data>=Math.pow(10,1*(i+1)+2)){
        b = Math.floor(this.data/Math.pow(10,1*(i+1)+2)) + a[i];
      }else{
        break
      }
    }
    return b
  }
}
export default Unit
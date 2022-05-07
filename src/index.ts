import "./style.css";
import { Application } from "./demo2";

const app = new Application(document.body);

function aa (arg:number, callback:(a:{b:number, c:Application})=>{g:number}):boolean{
  return true;
}

let r = aa(1, (v)=>{
  return {g: 1}});

interface ISomething{
  m: ()=>void
}

interface IB{
  b: ()=>void
}

class A1<T> implements ISomething, IB{
  constructor(a:T){

  }

  m(){

  };
  
  b(){

  }
}

class B1<T> implements ISomething, IB{
  constructor(a:T){

  }
  
  m(){

  };
  
  b(){

  }
}

interface AB<T extends number | string = number>{
  new (a:T):(IB & ISomething);
}

function bbb(a:(IB & ISomething), b: AB<string>){
  new b('4');
}

bbb(new A1<boolean>(true), B1)






class MyLogger{
  mode: string;
  logs: Array<string>

  constructor(mode:string){
    this.mode = mode;
  }

  log(msg:string){
    if (this.mode == 'prod'){
      this.logs.push(msg);
    } else {
      console.log(msg);
    }
  }

  sendCrush(e: any){

  }
}

const logger = new MyLogger('prod');

try {
  logger.log('fd');

  logger.log('ffdgfd');

  logger.log('ffdd');
} catch(e){
  logger.sendCrush(e);
}

interface IStorage{
  setItem: (name: string, value:string)=>Promise<boolean>;
  getItem: (name: string)=>Promise<string>;
}

class MyAnyStorage implements IStorage{
  private mode: string;

  setItem(name: string, value: string){
    if (this.mode == 'server'){
      return fetch(`http://url/set?name=${name}&value=${value}`).then(res=> res.json()).then(result => result.status == true);
    } else {
      try{
        localStorage.setItem(name, value);
        return Promise.resolve(true);
      } catch(e){
        return Promise.resolve(false);
      }
    }
  }

  getItem(name: string){
    if (this.mode == 'server'){
      return fetch(`http://url/get?name=${name}`).then(res => res.text());
    } else {
      return Promise.resolve(localStorage.getItem(name))
    }
  }
}

class MyLocalStorage implements IStorage{
  constructor(mode:string){

  }
  setItem(name: string, value: string){
    try{
      localStorage.setItem(name, value);
      return Promise.resolve(true);
    } catch(e){
      return Promise.resolve(false);
    }
  }

  getItem(name: string){
    return Promise.resolve(localStorage.getItem(name))
  }
}

class MyServerStorage implements IStorage{
  constructor(mode:string){

  }
  setItem(name: string, value: string){
    return fetch(`http://url/set?name=${name}&value=${value}`).then(res=> res.json()).then(result => result.status == true);
  }

  getItem(name: string){
    return fetch(`http://url/get?name=${name}`).then(res => res.text());
  }
}

interface IStorageConstructor{
  new (mode:string): IStorage;
}


class StorageUser{
  storage: IStorage;

  constructor(storageService: IStorage){
   // this.storage = new MyLocalStorage();
   this.storage = storageService;
  }

  method(){
    this.storage.setItem('fd', 'gfds');
  }
}

interface IAppData{
  data1: number,
  data2: boolean
}

class AppState{
  private storage: IStorage;

  private data: IAppData;

  public onChange: (data:IAppData)=>void;

  constructor(storageService: IStorage, initialState:IAppData){
   this.storage = storageService;
   this.data = initialState;
  }

  loadFromStorage(): Promise<IAppData>{
    return this.storage.getItem('appdata').then(res=>{
       return this.setState(JSON.parse(res));
    });
  }

  getState(): IAppData{
    //return this.storage.getItem('appdata');
    //this.data;
    return this.data;
  }

  setState(newData: IAppData | ((last:IAppData)=>IAppData)){
    if (typeof newData === "function"){
      let data = newData(this.data);
      return this.storage.setItem('appdata', JSON.stringify(data)).then(res=>{
        this.data = data;
        this.onChange(this.data);
        return this.data;
      });
      //this.data = newData(this.data);
    } else {
      //this.data = newData
      return this.storage.setItem('appdata', JSON.stringify(newData)).then(res=>{
        this.data = newData;
        this.onChange(this.data);
        return this.data;
      });
    }
    
  }
}
const appState = new AppState(new MyServerStorage('fds'), {data1: null, data2: null});
/*.then(data=>{
  //const appView = 
})*/
let view = new AppView(appState.getState());
appState.onChange = (data)=>{
  view.update(data);
}
appState.loadFromStorage()

function initApp(StorageConstructor: IStorageConstructor){
  let stor = new StorageConstructor('dfs')
  new StorageUser(stor)
}

initApp(MyAnyStorage)
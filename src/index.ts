import "./style.css";
import Control from "./control";
import Signal from "./signal";

class App extends Control{
  private lastFrameId: number;
  private lTime: number = 0;

  private counter:number = 0;
  private objects: Array<GameObject> = [];
  private scoreView: Control<HTMLElement>;

  private _score: number = 0;
  spawner: ObjectSpawner;
  set score(value:number){
    this._score = value;
    this.scoreView.node.textContent = this._score.toFixed(0);
  }

  get score(){
    return this._score;
  }

  constructor(parentNode:HTMLElement){
    super(parentNode);
    this.scoreView = new Control(this.node);
    this.scoreView.node.style.padding = "20px";
    this.score = 0;
    const handleScore = (score:number)=>{ 
      console.log(score, this.score);
      this.score += score
    }
    this.spawner = new ObjectSpawner(this.node, handleScore, ()=>this.objects);
  }

  private render(delta: number){
    this.counter+= delta;
    
    if (this.counter> 1000){
      const object = this.spawner.spawn();
      this.objects.push(object);
      this.counter = 0;
    }

    this.objects.forEach(obj => {
      obj.tick(delta);
      if (obj.counter<0){
        obj.destroy();
      }
    });

    this.objects = this.objects.filter(obj=>{
      return !obj.isDestroyed;
    })

    this.lastFrameId = requestAnimationFrame((time=>{
      if (!this.lTime){
        this.lTime = time;
      }
      const nextDelta = time - this.lTime;
      this.lTime = time;
      this.render(nextDelta);
    }));
  }

  public stop(){
    cancelAnimationFrame(this.lastFrameId);
  }

  public start(){
    this.render(null);
  }
}

class ObjectSpawner{
  private node: HTMLElement;
  private onScore: (score: number) => void;
  private getObjects: () => Array<GameObject>;

  constructor(node:HTMLElement, onScore:(score:number)=>void, getObjects: ()=>Array<GameObject>){
    this.node = node;
    this.onScore = onScore;
    this.getObjects = getObjects;
  }

  spawn(){
    const rand = Math.random();
    let object: GameObject = null;
    if (rand< 0.3){
      object = new GameObject(this.node, this.onScore);
    }
    else if (rand <0.5) {
      object = new GreenObject(this.node, this.onScore);
    }
    else {
      object = new RedObject(this.node, this.onScore);
    }
    object.onClick = ()=>{
      object.clickHandler(this.getObjects());
    }
    return object;
  }
}

class GameObject extends Control{
  private _counter: number;
  public isDestroyed: boolean = false;
  public onClick: ()=>void = ()=>{};
  setScore: (score:number) => void;

  set counter(value:number){
    this._counter = value;
    this.node.textContent = this.counter.toFixed(0);
  }

  get counter(){
    return this._counter;
  }

  constructor(parentNode:HTMLElement, onScore:(score:number)=>void){
    super(parentNode);
    this.counter = 3000;
    this.node.onclick = ()=>{
      this.onClick();
    }
    this.setScore = (score:number) => onScore(score);
  }

  tick(delta:number){
    this.counter-=delta;
  }

  clickHandler(objects:Array<GameObject>){

  }

  destroy(): void {
    this.isDestroyed = true;
    super.destroy();
  }

  
}

class RedObject extends GameObject{
  constructor(parentNode:HTMLElement, onScore: (score:number)=>void){
    super(parentNode, onScore);
    this.counter = 15000;
    this.node.style.backgroundColor = "#f00";
  }

  clickHandler(objects: GameObject[]): void {
    super.clickHandler(objects);
    this.counter -= 10000;
  }

  destroy(): void {
    this.setScore(1)
    super.destroy();
  }
}

class GreenObject extends GameObject{
  constructor(parentNode:HTMLElement, onScore: (score:number)=>void){
    super(parentNode, onScore);
    this.counter = 15000;
    this.node.style.backgroundColor = "#090";
  }

  clickHandler(objects: GameObject[]): void {
    console.log(objects.length)
    super.clickHandler(objects);
    objects.forEach(obj=>{
      obj.counter -= 10000;
    })
  }
}

const app = new App(document.body);
app.start();



///Не надо так делать!!!
class AA{
  constructor(){

  }
  a = 43;
  makeA(){
    console.log(this.a);
    document.querySelector('a').classList.add('asdf');
    (document.querySelector('a').parentElement.parentElement.children[0].children[0] as HTMLElement).style.padding = '';
    let a:number | null = null;
    if (true){
      a = 43;
    }
    (a as number) = 6543;
  }
  makeB(){
    
    document.body.append(document.createElement('a'))

  }
  makeC(){
     document.addEventListener('click', ()=>{

     }) 
  }
}

let res = new AA();
function addAll(){
res.makeA();
res.makeB();
res.makeC();
}
addAll();


///Дальше правильно

class Server{
  onRequest: (request: {url:string}) => any;
  constructor(){

  }
}

interface IEnpointProps{

}

function handleGet(props:IEnpointProps){
  return ''
}

function handleSetName(props:IEnpointProps){
  return ''
}

/*function createServer(){
  const serv = new Server();
  serv.onRequest = (request)=>{
    switch(request.url){
      case 'get':
        return handleGet({})
      break;
      case 'setName':
        return handleSetName({})
      break;
      case 'loadFile':
        return '3'
      break;
    }
  }
}*/

function createServer(){
  const serv = new Server();
  const endpoints: Record<string, (props:IEnpointProps)=>string> = {
    'get': handleGet,
    'setName': handleSetName,
    'loadFile': (props:IEnpointProps)=>{
      return ''
    },
    'endpoint1': ()=>{
      return ''
    }
  }
  serv.onRequest = (request)=>{
    const current = endpoints[request.url];
    if (current){
      return current({});
    }
    return '404';
  }
}

///////

function showModal(onClose: (data:string)=>void){
  const a = new Control(document.body);
  const input = new Control<HTMLInputElement>(a.node);
  a.node.onclick = ()=>{
    onClose(input.node.value);
    a.destroy();
  }
}

showModal((data)=>{
  console.log(data);
});

function showModalA(): [Promise<string>, ()=>void]{
  let close:(data:string)=>void = null;
  const cancell = ()=>{
    close('');
  }
  const op: Promise<string> = new Promise((onClose)=>{
    close = onClose;
    const a = new Control(document.body);
    const input = new Control<HTMLInputElement>(a.node);
    a.node.onclick = ()=>{
      onClose(input.node.value);
      a.destroy();
    }
  });
  return [op, cancell];
}

const [modalOperation, cancelModal] = showModalA();
modalOperation.then((data)=>{
  console.log(data);
});
onclick = ()=>{
  return cancelModal();
}

(window as any).app = new Control(document.body);


class ServiceA{
  a(user:string){

  }
  b(user:string){

  }
}

class ServiceB{
  a1(user:string){

  }
  b(user:string){
    
  }
  c(){

  }
}

class MyService{
  private serviceA: ServiceA;
  private serviceB: ServiceB;
  private user: string;

  constructor(user:string){
    this.serviceA = new ServiceA();
    this.serviceB = new ServiceB();
    this.user = user;
  }

  a(){
    this.serviceA.a(this.user)
  }
  a1(){
    this.serviceB.a1(this.user);
  }
  b(){
    this.serviceA.b(this.user);
  }
  b1(){
    this.serviceB.b(this.user);
  }
}

const s = new MyService('fdgfd');


const globalWasteBin: Array<any> = [];

function a11(){
  globalWasteBin.push({id:323, value:43});
}

function a111(){
  let shitItem = globalWasteBin.find((it)=> it.id === 323);
  console.log(shitItem);
}

function b11(){
  //globalWasteBin.push({id:323, value:43});
  return {id:323, value:43};
}

function b111(item:any){
  //let shitItem = globalWasteBin.find((it)=> it.id === 323);
  console.log(item);
}

const item = b11();
b111(item);

class User{
  public name: string;
  public email: string;

  constructor(name: string, email:string){
    this.name = name;
    this.email = email;
  }

  static fromJson(data: any){
    if (data == null || typeof data !== 'object'){
      throw new Error('');
    }
    if (typeof data.name !== 'string'){
      throw new Error('');
    }
    if (typeof data.email !== 'string'){
      throw new Error('');
    }
    return new User(data.name, data.email);
  }

  toJson(){
    return this;
  }

  sendMessage(msg:string){

  }
}

function loadUserFromLocal(){
  try {
    let us111 = User.fromJson(JSON.parse(localStorage.getItem('fg')));
    return us111;
  } catch(e){
    return new User('defName', 'defEmail');
  }
}

class Player extends User{
  public score: number;

  auth(){

  }
}

interface IRequest{
  data: string;
  type: string;
}

function send(msg: IRequest){

}

function receive():IRequest{
  return {data: '', type:''}
}

const user = new User('', '');
const player = new Player('fd', 'gfd');

send({data: JSON.stringify(user.toJson()), type: "User"});
send({data: JSON.stringify(player.toJson()), type: "Player"});

const received = receive();

interface IReceivable<Target = any> {
  new (name:string, email:string): Target;
  fromJson: (data:any) => Target;
}

const DTOMap: Record<string, IReceivable> = {
  "User": User,
  "Player": Player
}

interface TypeMap{
  "User": User,
  "Player": Player
}

function instanciateReceived<Target>(dto:IRequest){
  const Contructor: IReceivable<Target> = DTOMap[dto.type];
  if(!Contructor){
    throw new Error('');
  }
  return Contructor.fromJson(JSON.parse(dto.data));
}

class Receiver{
  public onReceive: (dto:IRequest) => void;
  public send(msg:IRequest){

  };
}

const rUser = instanciateReceived<User>(received)

class MyReceiver{
  private receiver: Receiver;
  public onUser: (res: User)=>void;
  public onPlayer: (res: Player)=>void;
  constructor(){
    this.receiver = new Receiver();
    this.receiver.onReceive = (dto:IRequest)=>{
      switch(dto.type){
        case 'User':
          this.onUser(instanciateReceived<User>(received));
          break;
        case "Player":
          this.onPlayer(instanciateReceived<Player>(received));
          break;
      }
      
    }
  }
}

let myReceiver = new MyReceiver();
//myReceiver.onPlayer({})
myReceiver.onPlayer = (res)=>{

}

myReceiver.onUser = (res)=>{

}


/*switch(received.type){
  case 'User':
    User.fromJson(JSON.parse(receive().data));
    break;
  case "Player":
    Player.fromJson(JSON.parse(receive().data));
    break;
}*/
//const rUser = 
//const rPlayer = Player.fromJson(JSON.parse(receive().data));


class R{
  public onReceive: (dto: {type: string, data:any})=>void;

  constructor(){

  }

  send(data:string):Promise<any>{
    return Promise.resolve();
  }
}

let om = {
  'a':0,
  'b':0
}

function keyRemover<G extends string>(a:Array<G>):<T = unknown>(ob:T) => Omit<T, G>{
  //Object.keys(ob).forEach()
  return (obj)=>{
    /*const copy:any = {...obj}
    Object.keys(copy).forEach(key=>{
      delete copy[key];
    });*/
    const copy:any = {};
   // const ar = Object.keys(obj);
    //ar.forEach(key=>{
    for (let key in obj){
      if (!a.includes(key as any)){
        copy[key] = obj[key];
      }
    }
   // })
    return copy
  }
}

let remover = keyRemover(['a', 'b']);
let res1 = remover({a:34, b:453, c:453});

interface TMap{
  'a':GameObject,
  'b': RedObject
}

function addListener<T extends keyof TMap>(type: T, lst:(ev:TMap[T])=>void){

}

addListener('a', (ev)=>{
  ev
})

addListener('b', (ev)=>{
  ev
})

const asdf: "a" | "b" = "a";
const fdddf: keyof TMap = 'b'


const func = ()=>{
  const df = 5;
  const func1 = ()=>{
    const df = 6;
  }
}

import Control from "./control";

interface IData{
  userId: number;
  id: number;
  title: string;
  body: string;
}

class DataItem implements IData{
  userId: number;
  id: number;
  title: string;
  body: string;

  constructor(DataItemDTO: IData){
    if (typeof DataItemDTO.userId != "number"){
      throw new Error('User id is not number');
    }
    if (typeof DataItemDTO.id != "number"){
      throw new Error('Item id is not number');
    }
    if (typeof DataItemDTO.title != "string"){
      this.title = "Unnamed";
    }
    if (typeof DataItemDTO.body != "string"){
      this.body = "Empty body";
    }
  }
}

export class DataModel{
  public data: Array<IData>

  constructor(){

  }

  public load(){
    return fetch('http://jsonplaceholder.typicode.com/posts').then(res=>res.json()).then(res=>{
      if (!Array.isArray(res)){
        throw new Error('Data loading error, result is not array');
      }
      this.data = res;
      return this;
    });
  }
}

class DataItemView extends Control{
  private id: Control<HTMLElement>;
  private userId: Control<HTMLElement>;
  private title: Control<HTMLElement>;
  private body: Control<HTMLElement>;

  constructor(parentNode: HTMLElement){
    super(parentNode);

    this.id = new Control(this.node);
    this.userId = new Control(this.node);
    this.title = new Control(this.node);
    this.body = new Control(this.node);
  }

  update(data: IData){
    this.id.node.textContent = data.id.toString();
    this.userId.node.textContent = data.userId.toString();
    this.title.node.textContent = data.title.toString();
    this.body.node.textContent = data.body.toString();
  }

  destroy(): void {
    super.destroy();
  }
}

export class Application extends Control{
  constructor(parentNode: HTMLElement){
    super(parentNode);
    const model = new DataModel();
    model.load().then(loaded=>{
      loaded.data.map(itemData=>{
        const itemView = new DataItemView(this.node);
        itemView.update(itemData);
      });
    })
  }
}
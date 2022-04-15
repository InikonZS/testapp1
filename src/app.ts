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
    this.userId = DataItemDTO.userId;

    if (typeof DataItemDTO.id != "number"){
      throw new Error('Item id is not number');
    }
    this.id = DataItemDTO.id;

    if (typeof DataItemDTO.title != "string"){
      this.title = "Unnamed";
    } else {
      this.title = DataItemDTO.title;
    }
    
    if (typeof DataItemDTO.body != "string"){
      this.body = "Empty body";
    } else {
      this.body = DataItemDTO.body;
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
      this.data = res.map(it=> new DataItem(it));
      return this;
    });
  }
}

class DataItemView extends Control{
  private id: Control<HTMLElement>;
  private userId: Control<HTMLElement>;
  private title: Control<HTMLElement>;
  private body: Control<HTMLElement>;

  public onOpen: ()=>void;

  constructor(parentNode: HTMLElement){
    super(parentNode);
    const dataContainer = new Control(this.node);
    this.id = new Control(dataContainer.node);
    this.userId = new Control(dataContainer.node);
    this.title = new Control(dataContainer.node);
    this.body = new Control(dataContainer.node);

    const buttons = new Control(this.node);
    const openButton = new Control(buttons.node, 'button', '', 'open');
    openButton.node.onclick = ()=>{
      this.onOpen();
    }
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

class PopUp extends Control{
  private id: Control<HTMLElement>;
  private userId: Control<HTMLElement>;
  private title: Control<HTMLElement>;
  private body: Control<HTMLElement>;

  public onClose: ()=>void;

  constructor(parentNode: HTMLElement, data:IData){
    super(parentNode);
    const overlay = new Control(this.node, 'div', 'popup_overlay');
    const dataContainer = new Control(overlay.node, 'div', 'popup_wrapper');
    this.id = new Control(dataContainer.node, 'div', '', data.id.toString());
    this.userId = new Control(dataContainer.node, 'div', '', data.userId.toString());
    this.title = new Control(dataContainer.node, 'div', '', data.title);
    this.body = new Control(dataContainer.node, 'div', '', data.body);

    const buttons = new Control(dataContainer.node);
    const closeButton = new Control(buttons.node, 'button', '', 'close');
    closeButton.node.onclick = ()=>{
      this.onClose();
    }
  }
}

export class Application extends Control{
  constructor(parentNode: HTMLElement){
    super(parentNode);
    const model = new DataModel();
    model.load().then(loaded=>{
      loaded.data.map(itemData=>{
        const itemView = new DataItemView(this.node);
        itemView.onOpen = ()=>{
          //console.log(itemData);
          const popup = new PopUp(this.node, itemData);
          popup.onClose = ()=>{
            popup.destroy();
          }
        }
        itemView.update(itemData);
      });
    })
  }
}
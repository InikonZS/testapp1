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
  private data: Array<IData>

  private currentPage: number = 0;

  public currentData: Array<IData> = [];
  onUpdate: (page:number, data:Array<IData>)=>void;

  constructor(){

  }

  setPage(pageIndex:number){
    console.log(pageIndex);
    this.currentPage = pageIndex;
    this.currentData = this.data.slice(this.currentPage, this.currentPage+5);
    this.onUpdate(this.currentPage, this.currentData);
  }

  getCurrentPage(){
    return this.currentPage;
  }
  
  public load(){
    return fetch('http://jsonplaceholder.typicode.com/posts').then(res=>res.json()).then(res=>{
      if (!Array.isArray(res)){
        throw new Error('Data loading error, result is not array');
      }
      this.data = res.map(it=> new DataItem(it));
      this.setPage(0);
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
      dataContainer.node.classList.remove('popup_wrapper__open');
      dataContainer.node.ontransitionend = ()=>{
        this.onClose();
      }
    }

    requestAnimationFrame(()=>{requestAnimationFrame(()=>{
      dataContainer.node.classList.add('popup_wrapper__open');
    })})
  }
}

export class Application extends Control{
  constructor(parentNode: HTMLElement){
    super(parentNode);
    const model = new DataModel();
    const dataView = new Control(this.node);

    const viewList: Array<DataItemView> = [];

    /*model.load().then(loaded=>{
      loaded.currentData.map(itemData=>{
        const itemView = new DataItemView(dataView.node);

        viewList.push(itemView);
        itemView.onOpen = ()=>{
          //console.log(itemData);
          const popup = new PopUp(this.node, itemData);
          popup.onClose = ()=>{
            popup.destroy();
          }
        }
        itemView.update(itemData);
      });
    })*/

    model.onUpdate = (page, data)=>{
      viewList.forEach(it=>it.destroy());
      data.map(itemData=>{
        const itemView = new DataItemView(dataView.node);
        viewList.push(itemView);
        itemView.onOpen = ()=>{
          //console.log(itemData);
          const popup = new PopUp(this.node, itemData);
          popup.onClose = ()=>{
            popup.destroy();
          }
        }
        itemView.update(itemData);
      });
    }

    const buttons = new Control(this.node);
    const leftButton = new Control(buttons.node, 'button', '', 'left');
    leftButton.node.onclick = ()=>{
      model.setPage(model.getCurrentPage() - 1);
    }

    const rightButton = new Control(buttons.node, 'button', '', 'right');
    rightButton.node.onclick = ()=>{
      model.setPage(model.getCurrentPage() + 1);
    }

    model.load();
  }
}
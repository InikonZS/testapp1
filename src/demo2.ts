import Control from "./control";

export class Page extends Control{
  onExpand: ()=>void;

  constructor(parentNode: HTMLElement){
    super(parentNode, 'div', 'grid_item');
    const expandButton = new Control(this.node, 'button', '', 'E');
    expandButton.node.onclick = ()=>{
      this.onExpand();
    }
  }
}

export class Application extends Control{
  private pages: Page[];
  mainGrid: Control<HTMLElement>;

  constructor(parentNode: HTMLElement){
    super(parentNode);
    this.mainGrid = new Control(this.node, 'div', 'grid');
    this.pages = [1,2,3,4,5].map(it=>{
      const page = new Page(this.mainGrid.node);
      page.onExpand = ()=>{

      }
      return page;
    });
  }
}
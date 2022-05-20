import Control from '../control';
import { KeyboardState  } from '../keyboardState';

export class Key extends Control{
  //private onInput: (char:string)=>void;
  private keyCode: string;
  protected keyboardState: KeyboardState;
  constructor(parentNode: HTMLElement, state:KeyboardState, keyCode:string){
    super(parentNode, 'div', 'keyboard_key', keyCode);
    this.keyboardState = state;
    //this.onInput = onInput;
    this.keyCode = keyCode;
    this.node.onmousedown = ()=>{
      this.node.classList.add('keyboard_key__down');
      window.addEventListener('mouseup', ()=>{
        this.node.classList.remove('keyboard_key__down');
        //this.onInput(this.keyCode);
        this.input();
      }, {once: true});
    }

    //this.node.onmouseup = ()=>{
    

    this.node.onmouseenter = ()=>{
      this.node.classList.add('keyboard_key__hover');
    }

    this.node.onmouseleave = ()=>{
      this.node.classList.remove('keyboard_key__hover');
    }
  }

  setCaption(caption:string){
    this.node.textContent = caption;
  }

  handleDown(){
    this.node.classList.add('keyboard_key__down');
  }

  handleUp(){
    this.node.classList.remove('keyboard_key__down');
    this.input();
    //this.onInput(this.keyCode);
  }

  input(){
    const state = this.keyboardState;
    state.setContent((last=>{
      return last + state.getLanguage()[this.keyCode]
    }));
    //this.onInput(this.keyCode);
  }
}

export class KeyLang extends Key{
  input(){
    this.keyboardState.nextLanguage();
  }
}

export class KeyBackSpace extends Key{
  constructor(parentNode: HTMLElement, state:KeyboardState, keyCode:string){
    super(parentNode, state, keyCode);
    this.node.classList.add('keyboard_key__twice');
  }
  input(){
    const state = this.keyboardState;
    state.setContent((last=>{
      return last.slice(0, -1);
    }));
  }
}

export class KeySpace extends Key{
  constructor(parentNode: HTMLElement, state:KeyboardState, keyCode:string){
    super(parentNode, state, keyCode);
    this.node.classList.add('keyboard_key__space');
  }
}

export class KeyEnter extends Key{
  constructor(parentNode: HTMLElement, state:KeyboardState, keyCode:string){
    super(parentNode, state, keyCode);
    this.node.classList.add('keyboard_key__twice');
  }
}

export class KeyShift extends Key{
  constructor(parentNode: HTMLElement, state:KeyboardState, keyCode:string){
    super(parentNode, state, keyCode);
    this.node.classList.add('keyboard_key__twice');
  }
}

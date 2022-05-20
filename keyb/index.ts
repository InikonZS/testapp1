import Control from "./control";
import './style.css';
import {layout, en, ru} from './langs/langs';
import {KeyboardState} from './keyboardState';
import {Key, KeyBackSpace, KeyLang, KeySpace, KeyEnter, KeyShift} from './keys/key';

const keyClassMap: Record<string, typeof Key> = {
  'Backspace': KeyBackSpace,
  'Lang': KeyLang,
  'Space': KeySpace,
  'Enter': KeyEnter,
  'ShiftLeft': KeyShift,
  'ShiftRight': KeyShift,
}

class App extends Control{
  output: Output;
  keyboard: Keyboard;
  keyboardState: KeyboardState;
  constructor(parentNode: HTMLElement ){
    super(parentNode, 'div', '',);
    this.output = new Output(this.node);
    this.keyboardState = new KeyboardState();
    this.keyboardState.onLanguageChange.add((lang)=>{
      this.keyboard.setLanguage(lang);
    })
    this.keyboardState.onContentChange.add((content)=>{
      this.output.update(content);
    })
    this.keyboard = new Keyboard(this.node, this.keyboardState, layout, (char)=>{
      //this.output.node.textContent += char;
    });

    document.addEventListener('keydown', (ev)=>{
      this.keyboard.handleDown(ev.code);
    });
    document.addEventListener('keyup', (ev)=>{
      this.keyboard.handleUp(ev.code);
    });
  }
}

class Output extends Control{
  constructor(parentNode: HTMLElement){
    super(parentNode, 'div', 'keyboard_output');
    this.node.onselectstart = (e)=>{
      console.log(e);
    }
//    const dupa: "dupa"|"жопа" = "dupa"
  }

  update(content:string){
    const highlightMap: Record<string, number> = {
      ' class ': 1,
      ' for ': 1,
      ' if ': 1
    }
    let result = content;
    result = result.split('\n').map((line, index)=>{
      return `
        <div class="codeLine">
          <div class="lineIndex">${index}</div>
          <div class="">${line}</div>
        </div>
      `
    }).join('');
    for (let keyWord in highlightMap){
      result = result.split(keyWord).join(`<span class="hl_${highlightMap[keyWord].toString()}">${keyWord}</span>`);
    }
    this.node.innerHTML = result;
    //this.node.innerHTML = content.split('\n').join('<br>');
  }
}

class Keyboard extends Control{
  //private onInput: (char:string)=>void;
  private keyMap: Record<string, Key> = {};
  constructor(parentNode: HTMLElement, state:KeyboardState, layoutConfig: Array<Array<string>>, onInput:(char:string)=>void){
    super(parentNode);
    //this.onInput = onInput;
    layoutConfig.forEach(row => {
      const rowView = new Control(this.node, 'div', 'keyboard_row');
      row.forEach(keyCode => {
        /*let key: Key = null;
        switch (keyCode){
          case "Lang":
            key = new KeyLang(rowView.node, state, keyCode);
            break;
          case "Backspace":
            key = new KeyBackSpace(rowView.node, state, keyCode);
            break;
          default:
            key = new Key(rowView.node, state, keyCode);  
        }*/
        const KeyConstructor = keyClassMap[keyCode] || Key;
        const key = new KeyConstructor(rowView.node, state, keyCode);
        this.keyMap[keyCode] = key;
        
      })
    });
    this.setLanguage(en);
  }

  setLanguage(langConfig: Record<string, string>){
    for (let keyCode in langConfig){
      const key = this.keyMap[keyCode];
      if(key){
        key.setCaption(langConfig[keyCode] || keyCode);
      }
    }
  }

  handleDown(keyCode:string){
    const currentKey = this.keyMap[keyCode];
    if(currentKey){
      currentKey.handleDown();
    }
  }

  handleUp(keyCode:string){
    const currentKey = this.keyMap[keyCode];
    if(currentKey){
      currentKey.handleUp();
    }
  }
}

new App(document.body);
//, layout);
/*let conf: Record<string, string> = {};
let ar: Array<string> = [];
document.onkeydown = (e) => {
  conf[e.code] = '';
  ar.push(e.code);
}

(window as any).conf = conf;
(window as any).ar = ar;*/

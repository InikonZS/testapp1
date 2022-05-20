import Signal from './signal';
import {en, ru} from './langs/langs';

export class KeyboardState{
  private languageIndex: number = 0;
  private languages: Array<Record<string, string>> = [
    en,
    ru
  ]
  private language: Record<string, string>;
  onLanguageChange = new Signal<Record<string, string>>();

  private content: string = '';
  onContentChange = new Signal<string>();

  constructor(initialLanguageIndex:number = 0){
    this.languageIndex = initialLanguageIndex;
    this.language = this.languages[initialLanguageIndex];
  }

  getLanguage(){
    return this.language;
  }

  nextLanguage(){
    this.languageIndex = (this.languageIndex + 1) % this.languages.length;
    this.setLanguage(this.languages[this.languageIndex]);
  }

  private setLanguage(language: Record<string, string>){
    this.language = language;
    this.onLanguageChange.emit(this.language);
  }

  getContent(){
    return this.content;
  }

  setContent(content:string | ((last:string)=>string)){
    if (typeof content == "function"){
      this.content = content(this.content);
    } else {
      this.content = content;
    }
    this.onContentChange.emit(this.content);
  }
}
import { registerHandler2 } from "./hooks.js";

const test = (num)=>{
  const handleClick = ()=>{
    console.log(num);
  }
  const handler = registerHandler2(handleClick);
  //console.log(ha)
  return `
  <button onclick="${handler}">${num}</button>
  `
}

for (let i=0; i< 10; i++){
  document.body.innerHTML+= test(i);
}
/*
Array.prototype.dsfd=function(){

}*/
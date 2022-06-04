const handlerMap = [];

export const registerHandler = (handler)=>{
  handlerMap.push(handler);
  return handlerMap.length - 1;
}

export const registerHandler2 = (handler)=>{
  handlerMap.push(handler);
  //return handlerMap.length - 1;
  const handlerId = handlerMap.length - 1;
  return `callHandler(${handlerId})`
}

const callHandler = (id)=>{
  handlerMap[id]();
}

window.callHandler = callHandler;
window.handlerMap = handlerMap;
window.registerHandler = registerHandler;

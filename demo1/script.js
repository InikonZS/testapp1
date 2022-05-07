//1
//2
//543

function handleClose(){
  console.log('close___');
  blackout.classList.add('overlay_closed');
}

let blackout = document.querySelector('.overlay');
blackout.onclick = (e)=>{
  if (e.target === blackout){
    handleClose();
  }
}

blackout.onmouseover = (e)=>{
  if (e.target === blackout){
    //console.log('hover');
    button.classList.add('close_button_hover');
  }
}

blackout.onmouseout = (e)=>{
  console.log(e);
  if (e.target === blackout){
    button.classList.remove('close_button_hover');
    //console.log('leave');
  }
}

let button = blackout.querySelector('.close_button');
button.onclick = (e)=>{
  handleClose();
}

button.onmouseenter = ()=>{
  button.classList.add('close_button_hover');
}

button.onmouseleave = ()=>{
  button.classList.remove('close_button_hover');
}
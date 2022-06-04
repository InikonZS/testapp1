const fs = require('fs/promises');
const path = require('path');

const gens = 20;

const generateInputs = (count=0)=>{
  const inputs = [];

  for (let i=0; i<count; i++){  
    const indexEven = i%2==0? '' : 'a';
    const indexName = Math.floor(i / 2).toFixed(0) + indexEven;
    inputs.push(`<input type="checkbox" id="i${indexName}" />`);
  }
  return inputs;
}

/**
 * @param {number} index
 * @param {number} count
 * @returns {string}
 * @description generate card
 */
const generateCard = (index, count=0)=>{
  const resetters = [];
  const indexEven = index%2==0? '' : 'a';
  const indexName = Math.floor(index / 2).toFixed(0) + indexEven;
  resetters.push(`<label for="i${indexName}" class="l set${Math.floor(index / 2).toFixed(0)}"></label>`);
  for (let i=0; i<count; i++){
    if ((index === i) || (index === i + 1)){
      continue;
    }
    const even = i%2==0? '' : 'a';
    const name = Math.floor(i / 2).toFixed(0) + even;
    resetters.push(`<label for="i${name}" class="l reset${name}"></label>`);
  }
  return `
    <div class="card iwr${Math.floor(index / 2).toFixed(0)} iwra${indexName}">
      <div class="card_side card_back" id="i${indexName}back">
        ${resetters.join('\n')}
      </div>
      <div class="card_side card_front i${Math.floor(index / 2).toFixed(0)}" id="i${indexName}front">

      </div>
    </div>
  `
}

const generateCards = (count)=>{
  const cards = [];

  for (let i=0; i<count; i++){  
    cards.push(generateCard(i, count));
  }
  return cards.join('\n');
}

const res = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./generated.css">
  </head>

  <body>
  <form>
    ${generateInputs(gens).join('\n')}
    <div class="view">
      ${generateCards(gens)}
    </div>
    <button type="reset">reset</button>
  </form>
  </body>

  </html>
`;
fs.writeFile(path.join(__dirname, './generated.html'), res);

const generateSetterHider = (index, count)=>{
  const hiders = [];
  for (let i=0; i<Math.floor(count / 2); i++){
    if ((index === i)){
      continue;
    }
    hiders.push(`
    #i${index}:checked ~ #i${index}a:not(:checked) ~ .view .set${i}{
      display: none; 
    }
    #i${index}:not(:checked) ~ #i${index}a:checked ~ .view .set${i}{
      display: none; 
    }
    `);
  }
  return hiders;
}

const generateStyleBlock = (index, count) =>{
  //const index = Math.floor(indexDouble / 2);
  //const count = Math.floor(countDouble /2);
  return `
  .reset${index}{
    display:none;
  }
  .reset${index}a{
    display:none;
  }
  #i${index}:checked ~ .view #i${index}back{
    transform: rotateY(180deg);
  }
  #i${index}:checked ~ .view #i${index}front{
    transform: rotateY(0deg);
  }
  #i${index}a:checked ~ .view #i${index}aback{
    transform: rotateY(180deg);
  }
  #i${index}a:checked ~ .view #i${index}afront{
    transform: rotateY(0deg);
  }
  #i${index}:checked ~ .view .reset${index}{
    display: block; 
  }
  #i${index}a:checked ~ .view .reset${index}a{
    display: block; 
  }
  
  ${generateSetterHider(index, count).join('\n')}

  .iwra${index}{
    order: ${Math.floor(Math.random()*count *3)}
  }
  .iwra${index}a{
    order: ${Math.floor(Math.random()*count *3)}
  }
  #i${index}:checked ~ #i${index}a:checked ~ .view .iwr${index}{
    transform: scale(0.2);
    transition-duration: 600ms;
    transition-delay:400ms;
  }
  #i${index}:checked ~ #i${index}a:checked ~ .view .i${index}back{
    display: none; 
  }
  #i${index}:checked ~ #i${index}a:checked ~ .view .reset${index}{
    display: none; 
  }
  #i${index}:checked ~ #i${index}a:checked ~ .view .reset${index}a{
    display: none; 
  }
  `
}

const generateStyles = (count)=>{
  const cards = [];

  for (let i=0; i<Math.floor(count / 2); i++){  
    cards.push(generateStyleBlock(i, count));
  }
  return cards.join('\n');
}

const res1 = `
input{
  display:none;
}
.view{
  display: flex;
  flex-wrap: wrap;
}

.card{
  width:100px;
  height:100px;
  margin:1px;
  position: relative;
  perspective: 600px;
}

.card_side{
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition-duration: 400ms;
}

.card_back{
  transform: rotateY(0deg);
  background-color: #ccc;
}

.card_front{
  position: absolute;
  top:0px;
  left:0px;
  transform: rotateY(180deg);

}
.i0{
  background-color:#f00;
}

.i1{
  background-color:#00f;
}

.i2{
  background-color:#090;
}

.i3{
   background-color:#ff0;
}

.i4{
   background-color:#f0f;
}

.i5{
   background-color:#09f;
}

.i6{
  background-color:#f9f;
}

.i7{
  background-color:#99f;
}

.i8{
  background-color:#9f0;
}

.i9{
   background-color:#f70;
}

.i10{
   background-color:#944;
}


.l{
  display:block;
  width:100%;
  height:100%;
}

${generateStyles(20)}
`
fs.writeFile(path.join(__dirname, './generated.css'), res1);

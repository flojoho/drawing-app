const thumbTemplate = document.getElementById('thumb-template');
const imageList = document.getElementById('image-list');
const addLink = document.getElementById('add-link');

const ctx = canvas.getContext('2d');




const renderNewThumbDiv = (id) => {
  const newThumb = thumbTemplate.cloneNode(true);
  newThumb.id = id;

  imageList.appendChild(newThumb);

  //verstecken des klons deaktivieren
  //> draw thumbnail on respective canvas (localData.getPaths(id))

  drawPaths(document.getElementById(id).querySelector('canvas').getContext('2d'), localData.getPaths(id));
}




for(id in localData.getDrawings()){
  renderNewThumbDiv(id);
}


const openedImage = (() => {
  //openedImage.hasUnsavedChanges
  let id;
  let thumbDiv;
  let thumbCtx;

  return {
    getId(){
      return id;
    },

    getThumbCtx(){
      return thumbCtx;
    },

    change(newId){
      id = newId;
      thumbDiv = document.getElementById(newId);
      thumbCtx = thumbDiv.querySelector('canvas').getContext('2d');
    }
  }
})();







function drawPaths(context, paths){ //can't i leave out the context since i'm always drawing to the main canvas?
  context.lineJoin = 'round';
  context.lineCap = 'round';
  
  context.strokeStyle = '#000000';
  context.lineWidth = 10;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
  
  for (const path of paths){
    for (let i = 1; i < path.length; i++){
      context.beginPath();
      context.moveTo(path[i - 1].x, path[i - 1].y);
      context.lineTo(path[i].x, path[i].y);
      context.stroke();
    }
  }
}


openedImage.change(0);
drawPaths(ctx, localData.getPaths(openedImage.getId()));







imageList.addEventListener('click', e => {
  if(e.target.className === 'open-button' || e.target.tagName.toLowerCase() === 'canvas'){
    openedImage.change(e.target.parentElement.parentElement.id);
    drawPaths(ctx, localData.getPaths(openedImage.getId()));
  }else if(e.target.className === 'delete-button'){
    alert('sorry, the feature for deleting drawings is going to be added soon');
  }
});





addLink.addEventListener('click', () => {
  const newId = localData.createDrawing();
  renderNewThumbDiv(newId);

  drawPaths(ctx, []);
  openedImage.change(newId);
  //openedImage.getThumbCtx() = thumbTemplate.querySelector('canvas').getContext('2d');
});








let mouseIsDown = false;

let lastX;
let lastY;
let currentPath = [];

canvas.addEventListener('mousedown', e => {
  mouseIsDown = true;
  lastX = e.offsetX;
  lastY = e.offsetY;

  currentPath.push({ x: e.offsetX,
                     y: e.offsetY });
});

canvas.addEventListener('mouseup', () => {
  mouseIsDown = false;

  localData.addPathToDrawing(openedImage.getId(), currentPath);
  currentPath = [];

});

canvas.addEventListener('mousemove', e => {
  if(mouseIsDown){
    currentPath.push({ x: e.offsetX,
                       y: e.offsetY });

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    openedImage.getThumbCtx().drawImage(canvas, 0, 0);
    
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});
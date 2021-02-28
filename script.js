const thumbTemplate = document.getElementById('thumb-template');
const imageList = document.getElementById('image-list');
const addLink = document.getElementById('add-link');

const ctx = canvas.getContext('2d');




const renderNewThumbDiv = (id) => {
  const newThumb = thumbTemplate.cloneNode(true);
  newThumb.id = id;

  imageList.appendChild(newThumb);
  const thumbCanvasCtx = document.getElementById(id).querySelector('canvas').getContext('2d');
  drawPaths(thumbCanvasCtx, localData.getPaths(id));
}




for(const id in localData.getDrawings()) {
  renderNewThumbDiv(id);
}


const openedImage = (() => {
  let id;
  let thumbDiv;
  let thumbCtx;

  return {
    getId() {
      return id;
    },

    getThumbCtx() {
      return thumbCtx;
    },

    change(newId) {
      id = newId;
      thumbDiv = document.getElementById(newId);
      thumbCtx = thumbDiv.querySelector('canvas').getContext('2d');
    }
  }
})();







function drawPaths(context, paths) { // can't i leave out the context since i'm always drawing to the main canvas?
  context.lineJoin = 'round';
  context.lineCap = 'round';
  
  context.strokeStyle = '#000000';
  context.lineWidth = 10;

  context.fillStyle = 'white';
  context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
  
  for (const path of paths){
    for (let i = 1; i < path.length; i++) {
      context.beginPath();
      context.moveTo(path[i - 1].x, path[i - 1].y);
      context.lineTo(path[i].x, path[i].y);
      context.stroke();
    }
  }
}


const drawings = localData.getDrawings();
openedImage.change(Object.keys(drawings)[0]);
drawPaths(ctx, localData.getPaths(openedImage.getId()));







imageList.addEventListener('click', e => {
  const clickedImageId = e.target.parentElement.parentElement.id;

  if(e.target.className === 'open-button' || e.target.tagName.toLowerCase() === 'canvas') {
    openedImage.change(clickedImageId);
    drawPaths(ctx, localData.getPaths(openedImage.getId()));
    return;
  }

  if(e.target.className === 'delete-button') {
    const drawings = localData.getDrawings();

    if(Object.keys(drawings).length > 1) {
      if(confirm('Are you sure you want to delete this drawing?')) {
        delete drawings[clickedImageId];
        localData.updateDrawings(drawings);
        document.getElementById(clickedImageId).remove();

        openedImage.change(Object.keys(drawings)[0]);
        drawPaths(ctx, localData.getPaths(openedImage.getId()));
      }
    } else {
      alert('Sorry, but there has to be at least one drawing!');
    }
  }
});





addLink.addEventListener('click', () => {
  const newId = localData.createDrawing();
  renderNewThumbDiv(newId);

  drawPaths(ctx, []);
  openedImage.change(newId);
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
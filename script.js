const thumbTemplate = document.getElementById('thumb-template');
const imageList = document.getElementById('image-list');
const addLink = document.getElementById('add-link');

const ctx = canvas.getContext('2d');


function makeCanvasFullScreen() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
  makeCanvasFullScreen()
});
makeCanvasFullScreen()


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
  currentPath = [];

});

canvas.addEventListener('mousemove', e => {
  if(mouseIsDown) {
    currentPath.push({ x: e.offsetX,
                       y: e.offsetY });
                       
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});


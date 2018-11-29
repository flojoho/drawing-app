const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let mouseIsDown = false;
let lastX;
let lastY;

let paths = [];
let currentPath = [];


ctx.strokeStyle = '#000000';
ctx.lineWidth = 10;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';


const localData = localStorage.getItem('drawing app');

if (typeof localData === 'string'){
  paths = JSON.parse(localData);
  for (const path of paths){
    for (let i = 1; i < path.length; i++){
      ctx.beginPath();
      ctx.moveTo(path[i-1].x, path[i-1].y);
      ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();
    }
  }
}

canvas.addEventListener('mousedown', e => {
  mouseIsDown = true;
  lastX = e.offsetX;
  lastY = e.offsetY;

  currentPath.push({ x: e.offsetX,
                     y: e.offsetY });
});

canvas.addEventListener('mouseup', () => {
  mouseIsDown = false;

  paths.push(currentPath);
  currentPath = [];
  localStorage.setItem('drawing app', JSON.stringify(paths));
});

canvas.addEventListener('mousemove', e => {
  if(mouseIsDown){
    currentPath.push({ x: e.offsetX,
                       y: e.offsetY });

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});
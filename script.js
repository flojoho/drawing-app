
const image = document.getElementById('image');

const redrawPath = (currentPath) => {
  const { svgPath, points } = currentPath;

  const pathString = 'M ' + points.map(point => `${point.x} ${point.y}`).join(' L ');

  svgPath.setAttributeNS(null, 'd', pathString);
  svgPath.setAttributeNS(null, 'stroke', 'black');
  svgPath.setAttributeNS(null, 'fill', 'none');
  svgPath.setAttributeNS(null, 'stroke-linecap', 'round');
  image.appendChild(svgPath);
}

const addPointToPath = (currentPath, mouseX, mouseY) => {

  console.log(image.getBoundingClientRect())

  const { width, height } = image.getBoundingClientRect();
  
  svgX = mouseX * 160 / width;
  svgY = mouseY * 90 / height;

  currentPath.points.push({
    x: svgX,
    y: svgY
  });
}

let mouseIsDown = false;

let lastX;
let lastY;
const paths = [];
let currentPath = {
  points: []
};

image.addEventListener('mousedown', e => {
  mouseIsDown = true;
  lastX = e.offsetX;
  lastY = e.offsetY;

  addPointToPath(currentPath, e.offsetX, e.offsetY);
                     
  const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  currentPath.svgPath = svgPath;
});

image.addEventListener('mouseup', () => {
  mouseIsDown = false;
  currentPath = {
    points: []
  };

});

image.addEventListener('mousemove', e => {
  if(mouseIsDown) {
    addPointToPath(currentPath, e.offsetX, e.offsetY)
    
    redrawPath(currentPath);
    
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});

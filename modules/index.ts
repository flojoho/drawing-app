import { Path, lineWidth } from './Path.js';

const svgImage = document.getElementById('svg-image')!;

const coordinateTransformation = (mouseX: number, mouseY: number) => {
  const { width, height } = svgImage.getBoundingClientRect();

  const svgX = mouseX * 1920 / width;
  const svgY = mouseY * 1080 / height;

  return { x: svgX, y: svgY };
}

let mouseIsDown = false;

const paths = [];
let currentPath = new Path(svgImage);

const drawDot = (x: number, y: number) => {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttributeNS(null, 'cx', String(x));
  circle.setAttributeNS(null, 'cy', String(y));
  circle.setAttributeNS(null, 'r', String(lineWidth/2));
  circle.setAttributeNS(null, 'style', 'fill: white; stroke: none' );
  svgImage.appendChild(circle);
}

svgImage.addEventListener('mousedown', e => {
  mouseIsDown = true;

  const {x, y} = coordinateTransformation(e.offsetX, e.offsetY);
  drawDot(x, y);
  currentPath.addPoint(x, y);
});

svgImage.addEventListener('mouseup', () => {
  mouseIsDown = false;
  currentPath = new Path(svgImage);

});

svgImage.addEventListener('mousemove', e => {
  if(mouseIsDown) {
    const {x, y} = coordinateTransformation(e.offsetX, e.offsetY);
    currentPath.addPoint(x, y);
  }
});

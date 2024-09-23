import Vector from './Vector.js';

const svgImage = document.getElementById('svg-image')!;

const lineWidth = 10;

type CurrentPath = {
  points: Vector[],
  svgPath?: SVGPathElement
}

const curveFromPoints = (points: Vector[]) => {
  const controlFactor = 0.3;

  const segments = [];
  for(let i = 0; i < points.length - 1; i++) {

    const point1 = points[i];
    const point2 = points[i + 1];
    let relativeControlPoint1, relativeControlPoint2;

    if(i === 0) {
      relativeControlPoint1 = point1.to(point2);
      relativeControlPoint2 = (points[i + 2] || point1).to(point1).scale(0.5);
    } else if(i === points.length - 2) {
      relativeControlPoint1 = points[points.length - 3].to(point2).scale(0.5);
      relativeControlPoint2 = point2.to(point1);
    } else {
      relativeControlPoint1 = points[i-1].to(point2).scale(0.5);
      relativeControlPoint2 = points[i+2].to(point1).scale(0.5);
    }

    segments.push({
      point1,
      point2,
      controlPoint1: relativeControlPoint1.scale(controlFactor).plus(point1),
      controlPoint2: relativeControlPoint2.scale(controlFactor).plus(point2)
    });
  }

  return segments.map(segment => {
    const { point1, point2, controlPoint1, controlPoint2} = segment;

    return `M ${point1.x} ${point1.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point2.x} ${point2.y}`;
  }).join(' ');

}

const redrawPath = (currentPath: CurrentPath) => {
  const { svgPath, points } = currentPath;

  const pathString = curveFromPoints(points);

  svgPath.setAttributeNS(null, 'd', pathString);
  svgPath.setAttributeNS(null, 'stroke', 'white');
  svgPath.setAttributeNS(null, 'fill', 'none');
  svgPath.setAttributeNS(null, 'stroke-width', `${lineWidth}px`);
  svgPath.setAttributeNS(null, 'stroke-linecap', 'round');
  svgPath.setAttributeNS(null, 'stroke-linejoin', 'round');
  svgImage.appendChild(svgPath);
}

// redrawPath({
//   points: [new Vector(40, 40), new Vector(80, 40), new Vector(80, 80), new Vector(120, 80)],
//   svgPath: document.createElementNS('http://www.w3.org/2000/svg', 'path')
// })

const coordinateTransformation = (mouseX: number, mouseY: number) => {
  const { width, height } = svgImage.getBoundingClientRect();

  const svgX = mouseX * 1920 / width;
  const svgY = mouseY * 1080 / height;

  return { x: svgX, y: svgY }
}

const addPointToPath = (currentPath: CurrentPath, mouseX: number, mouseY: number) => {
  
  const {x, y} = coordinateTransformation(mouseX, mouseY);

  currentPath.points.push(new Vector(x, y));
}

let mouseIsDown = false;

const paths = [];
let currentPath: CurrentPath = {
  points: []
};

const drawDot = (mouseX: number, mouseY: number) => {
  const {x, y} = coordinateTransformation(mouseX, mouseY);
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttributeNS(null, 'cx', String(x));
  circle.setAttributeNS(null, 'cy', String(y));
  circle.setAttributeNS(null, 'r', String(lineWidth/2));
  circle.setAttributeNS(null, 'style', 'fill: white; stroke: none' );
  svgImage.appendChild(circle);
}

svgImage.addEventListener('mousedown', e => {
  mouseIsDown = true;

  drawDot(e.offsetX, e.offsetY);

  addPointToPath(currentPath, e.offsetX, e.offsetY);
                     
  const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  currentPath.svgPath = svgPath;
});

svgImage.addEventListener('mouseup', () => {
  mouseIsDown = false;
  currentPath = {
    points: []
  };

});

svgImage.addEventListener('mousemove', e => {
  if(mouseIsDown) {
    addPointToPath(currentPath, e.offsetX, e.offsetY)
    
    redrawPath(currentPath);
  }
});

import Vector from './Vector.js';
import Path from './Path.js';
const svgImage = document.getElementById('svg-image');
const lineWidth = 10;
const curveFromPoints = (points) => {
    const controlFactor = 0.3;
    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];
        let relativeControlPoint1, relativeControlPoint2;
        if (i === 0) {
            relativeControlPoint1 = point1.to(point2);
            relativeControlPoint2 = (points[i + 2] || point1).to(point1).scale(0.5);
        }
        else if (i === points.length - 2) {
            relativeControlPoint1 = points[points.length - 3].to(point2).scale(0.5);
            relativeControlPoint2 = point2.to(point1);
        }
        else {
            relativeControlPoint1 = points[i - 1].to(point2).scale(0.5);
            relativeControlPoint2 = points[i + 2].to(point1).scale(0.5);
        }
        segments.push({
            point1,
            point2,
            controlPoint1: relativeControlPoint1.scale(controlFactor).plus(point1),
            controlPoint2: relativeControlPoint2.scale(controlFactor).plus(point2)
        });
    }
    return segments.map(segment => {
        const { point1, point2, controlPoint1, controlPoint2 } = segment;
        return `M ${point1.x} ${point1.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point2.x} ${point2.y}`;
    }).join(' ');
};
const redrawPath = (path) => {
    const { svgPath, points, parentSvg } = path;
    const pathString = curveFromPoints(points);
    svgPath.setAttributeNS(null, 'd', pathString);
    svgPath.setAttributeNS(null, 'stroke', 'white');
    svgPath.setAttributeNS(null, 'fill', 'none');
    svgPath.setAttributeNS(null, 'stroke-width', `${lineWidth}px`);
    svgPath.setAttributeNS(null, 'stroke-linecap', 'round');
    svgPath.setAttributeNS(null, 'stroke-linejoin', 'round');
    parentSvg.appendChild(svgPath);
};
const coordinateTransformation = (mouseX, mouseY) => {
    const { width, height } = svgImage.getBoundingClientRect();
    const svgX = mouseX * 1920 / width;
    const svgY = mouseY * 1080 / height;
    return { x: svgX, y: svgY };
};
const addPointToPath = (path, x, y) => {
    path.points.push(new Vector(x, y));
};
let mouseIsDown = false;
const paths = [];
let currentPath = new Path(svgImage);
const drawDot = (x, y) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'cx', String(x));
    circle.setAttributeNS(null, 'cy', String(y));
    circle.setAttributeNS(null, 'r', String(lineWidth / 2));
    circle.setAttributeNS(null, 'style', 'fill: white; stroke: none');
    svgImage.appendChild(circle);
};
svgImage.addEventListener('mousedown', e => {
    mouseIsDown = true;
    const { x, y } = coordinateTransformation(e.offsetX, e.offsetY);
    drawDot(x, y);
    addPointToPath(currentPath, x, y);
});
svgImage.addEventListener('mouseup', () => {
    mouseIsDown = false;
    currentPath = new Path(svgImage);
});
svgImage.addEventListener('mousemove', e => {
    if (mouseIsDown) {
        const { x, y } = coordinateTransformation(e.offsetX, e.offsetY);
        addPointToPath(currentPath, x, y);
        redrawPath(currentPath);
    }
});

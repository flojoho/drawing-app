import Vector from './Vector.js';
export const lineWidth = 10;
export class Path {
    constructor(parentSvg) {
        this.points = [];
        this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.parentSvg = parentSvg;
    }
    addPoint(x, y) {
        this.points.push(new Vector(x, y));
        this.redraw();
    }
    redraw() {
        const pathString = this.curveFromPoints();
        this.svgPath.setAttributeNS(null, 'd', pathString);
        this.svgPath.setAttributeNS(null, 'stroke', 'white');
        this.svgPath.setAttributeNS(null, 'fill', 'none');
        this.svgPath.setAttributeNS(null, 'stroke-width', `${lineWidth}px`);
        this.svgPath.setAttributeNS(null, 'stroke-linecap', 'round');
        this.svgPath.setAttributeNS(null, 'stroke-linejoin', 'round');
        this.parentSvg.appendChild(this.svgPath);
    }
    curveFromPoints() {
        const controlFactor = 0.3;
        const segments = [];
        for (let i = 0; i < this.points.length - 1; i++) {
            const point1 = this.points[i];
            const point2 = this.points[i + 1];
            let relativeControlPoint1, relativeControlPoint2;
            if (i === 0) {
                relativeControlPoint1 = point1.to(point2);
                relativeControlPoint2 = (this.points[i + 2] || point1).to(point1).scale(0.5);
            }
            else if (i === this.points.length - 2) {
                relativeControlPoint1 = this.points[this.points.length - 3].to(point2).scale(0.5);
                relativeControlPoint2 = point2.to(point1);
            }
            else {
                relativeControlPoint1 = this.points[i - 1].to(point2).scale(0.5);
                relativeControlPoint2 = this.points[i + 2].to(point1).scale(0.5);
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
    }
}
export default Path;

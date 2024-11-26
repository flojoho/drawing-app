import Vector from './Vector.js';

class Path {
  points: Vector[];
  svgPath: SVGPathElement;
  parentSvg: HTMLElement;

  constructor(parentSvg: HTMLElement) {
    this.points = [];
    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.parentSvg = parentSvg;
  }
}

export default Path;
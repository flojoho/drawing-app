<script lang="ts">
  import Vector from './Vector.js';

  export const lineWidth = 10;

  let currentPath: Path | null = null;

  export class Path {
    points: Vector[];
    svgPath: SVGPathElement;
    parentSvg: SVGElement;

    constructor(parentSvg: SVGElement) {
      this.points = [];
      this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.parentSvg = parentSvg;
    }

    addPoint(x: number, y: number) {
      this.points.push(new Vector(x, y));
      this.redraw();
    }

    private redraw() {
      const pathString = this.curveFromPoints();
    
      this.svgPath.setAttributeNS(null, 'd', pathString);
      this.svgPath.setAttributeNS(null, 'stroke', 'white');
      this.svgPath.setAttributeNS(null, 'fill', 'none');
      this.svgPath.setAttributeNS(null, 'stroke-width', `${lineWidth}px`);
      this.svgPath.setAttributeNS(null, 'stroke-linecap', 'round');
      this.svgPath.setAttributeNS(null, 'stroke-linejoin', 'round');
    
      this.parentSvg.appendChild(this.svgPath);
    }

    private curveFromPoints() {
      const controlFactor = 0.3;

      const segments = [];
      for(let i = 0; i < this.points.length - 1; i++) {

        const point1 = this.points[i];
        const point2 = this.points[i + 1];
        let relativeControlPoint1, relativeControlPoint2;

        if(i === 0) {
          relativeControlPoint1 = point1.to(point2);
          relativeControlPoint2 = (this.points[i + 2] || point1).to(point1).scale(0.5);
        } else if(i === this.points.length - 2) {
          relativeControlPoint1 = this.points[this.points.length - 3].to(point2).scale(0.5);
          relativeControlPoint2 = point2.to(point1);
        } else {
          relativeControlPoint1 = this.points[i-1].to(point2).scale(0.5);
          relativeControlPoint2 = this.points[i+2].to(point1).scale(0.5);
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
  }

  let svgImage = $state<SVGElement | null>(null);

  const coordinateTransformation = (mouseX: number, mouseY: number) => {
    const { width, height } = svgImage!.getBoundingClientRect();

    const svgX = mouseX * 1920 / width;
    const svgY = mouseY * 1080 / height;

    return { x: svgX, y: svgY };
  }

  let mouseIsDown = false;

  const drawingPaths = [];

  const drawDot = (x: number, y: number) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'cx', String(x));
    circle.setAttributeNS(null, 'cy', String(y));
    circle.setAttributeNS(null, 'r', String(lineWidth/2));
    circle.setAttributeNS(null, 'style', 'fill: white; stroke: none' );
    svgImage!.appendChild(circle);
  }

  const mouseDownHandler = (e: MouseEvent) => {
    mouseIsDown = true;

    currentPath = new Path(svgImage!);

    const {x, y} = coordinateTransformation(e.offsetX, e.offsetY);
    drawDot(x, y);
    currentPath.addPoint(x, y);
  }

  const mouseUpHandler = (e: Event) => {
    mouseIsDown = false;
    currentPath = new Path(svgImage!);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if(mouseIsDown) {
      const { x, y } = coordinateTransformation(e.offsetX, e.offsetY);
      currentPath.addPoint(x, y);
    }
  };
</script>

<div class="left">
  <main>
    <svg
      bind:this={svgImage}
      xmlns="http://www.w3.org/2000/svg"  
      viewBox="0 0 1920 1080"
      id="svg-image"
      preserveAspectRatio="xMinYMin slice"
      onmousedown={mouseDownHandler}
      onmouseup={mouseUpHandler}
      onmousemove={mouseMoveHandler}
    >
      <rect width="100%" height="100%" fill="black" />
    </svg>
  </main>
  <footer>
    <button>test</button>
  </footer>
</div>
<aside class="right">
  test
</aside>

<style>
  #svg-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .left {
    flex: 1;
    display: flex;
    height: 100vh;
    max-height: 100vh;
    flex-direction: column;
  }

  .right {
    width: 20rem;
    background-color: green;
  }

  footer {
    background-color: var(--black);
    border-top: 2px var(--gray) solid;
    padding: 0.6rem;
  }

  button {
    background-color: transparent;
    border-radius: 0.4rem;
    padding: 1rem;
    border: none;
  }
  button:hover {
    background-color: var(--dark-gray);
    cursor: pointer;
  }
</style>

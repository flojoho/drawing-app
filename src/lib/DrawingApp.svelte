<script lang="ts">
  import { Path, lineWidth } from './Path.js';

  let currentPath: Path | null = null;

  let svgImage = $state<SVGSVGElement | null>(null);

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

  const pointerDownHandler = (e: MouseEvent) => {
    mouseIsDown = true;

    currentPath = new Path(svgImage!);

    const {x, y} = coordinateTransformation(e.offsetX, e.offsetY);
    drawDot(x, y);
    currentPath.addPoint(x, y);
  }

  const pointerUpHandler = (e: Event) => {
    mouseIsDown = false;
    currentPath = null;
  };

  const pointerMoveHandler = (e: MouseEvent) => {
    if(mouseIsDown) {
      const { x, y } = coordinateTransformation(e.offsetX, e.offsetY);
      currentPath!.addPoint(x, y);
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
      onpointerdown={pointerDownHandler}
      onpointerup={pointerUpHandler}
      onpointermove={pointerMoveHandler}
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

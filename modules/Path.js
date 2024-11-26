class Path {
    constructor(parentSvg) {
        this.points = [];
        this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.parentSvg = parentSvg;
    }
}
export default Path;

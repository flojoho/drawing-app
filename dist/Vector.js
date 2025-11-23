class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    to(vector) {
        return new Vector(vector.x - this.x, vector.y - this.y);
    }
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
    plus(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
}
export default Vector;

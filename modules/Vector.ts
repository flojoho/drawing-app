
class Vector {
  public x: number;
  public y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  to(vector: Vector) {
    return new Vector(vector.x - this.x, vector.y - this.y);
  }

  scale(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }

  plus(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
}

export default Vector;
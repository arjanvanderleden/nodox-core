export class Point implements Point {
    x: number;
    y: number;

    public constructor (x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    add (p: Point): Point {
      return new Point(this.x + p.x, this.y + p.y);
    }

    snapTo (gridX: number, gridY: number): Point {
      const x = Math.round(this.x / gridX) * gridX;
      const y = Math.round(this.y / gridY) * gridY;
      return new Point(x, y);
    }

    scale (factor: number): Point {
      return new Point(this.x * factor, this.y * factor);
    }

    scaleRelativeTo (point: Point, factor: number): Point {
      return this.subtract(point).scale(factor).add(point);
    }

    subtract (p: Point): Point {
      return new Point(this.x - p.x, this.y - p.y);
    }

    assign (p: Point): Point {
      this.x = p.x;
      this.y = p.y;
      return this;
    }

    clone (): Point {
      return new Point(this.x, this.y);
    }
}

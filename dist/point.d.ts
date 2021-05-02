export declare class Point implements Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(p: Point): Point;
    snapTo(gridX: number, gridY: number): Point;
    scale(factor: number): Point;
    scaleRelativeTo(point: Point, factor: number): Point;
    subtract(p: Point): Point;
    assign(p: Point): Point;
    clone(): Point;
}

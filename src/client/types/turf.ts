import { Color } from "three";

export class Turf{
    name: string = '';
    color: Color;
    visible: boolean = true;

    maxElevation: number = Number.MAX_VALUE;
    minElevation: number = Number.MAX_VALUE;

    constructor(name: string, maxElevation: number, minElevation: number, color: Color, visible: boolean ){
        this.name = name;
        this.maxElevation = maxElevation;
        this.minElevation = minElevation;
        this.color = color;
        this.visible = visible;
    }
}
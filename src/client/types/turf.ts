import { Color } from "three";

export class Turf{
    name: string = '';
    color: Color;
    visible: boolean = true;

    minElevation: number = -1;
    maxElevation: number = 1;

    constructor(name: string, minElevation: number, maxElevation: number,  color: Color, visible: boolean ){
        this.name = name;
        this.minElevation = minElevation;
        this.maxElevation = maxElevation;
        this.color = color;
        this.visible = visible;
    }
}
import { Turf } from "./turf";

export class Biome {
    name: string = "";

    minTemperature: number = -1 ;
    maxTemperature: number = 1;

    turfs: Turf[];

    constructor(name: string, minTemperature: number, maxTemperature: number, turfs: Turf[] ){
        this.name = name;
        this.minTemperature = minTemperature;
        this.maxTemperature = maxTemperature;
        this.turfs = turfs;
    }
}
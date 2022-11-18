import { Turf } from "./turf";

export class Biome {
    name: string = "";
    maxTemperature: number = Number.MAX_VALUE;
    minTemperature: number = -1 ;

    turfs: Turf[];

    constructor(name: string, maxTemperature: number, minTemperature: number, turfs: Turf[] ){
        this.name = name;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.turfs = turfs;
    }
}
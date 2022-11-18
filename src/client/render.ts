import * as THREE from 'three'

import { Color, Vector3 } from 'three';

import { NoiseConfig } from './types/noiseConfig';

const THREE_Noise = require('three-noise');
const { Perlin, FBM } = THREE_Noise;

export function renderPlane(dimensions: Vector3, offset: Vector3, noiseConfig: NoiseConfig){
	const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial(
    //{color: 0x00ff00,wireframe: true}
    );
    const count = dimensions.x * dimensions.y * dimensions.z;
	const mesh = new THREE.InstancedMesh(geometry, material, count);
	const dummy = new THREE.Object3D();
	mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
	
	const noise3D = GenerateFbm(dimensions, offset, noiseConfig)
	let i = 0;
	for(let z = 0; z < dimensions.z; z++){
		for(let x = 0; x < dimensions.x; x++){ 
			for(let y = 0; y < dimensions.y; y++){
					dummy.position.x = x - dimensions.x / 2;
					dummy.position.z = y - dimensions.y / 2;
					dummy.position.y = z - dimensions.z / 2;

					const noisePoint = noise3D[z][x][y];
					const color = getTerrainColor(noisePoint)
					dummy.updateMatrix();
					mesh.setMatrixAt(i, dummy.matrix);
					mesh.setColorAt(i, color);
					i++;
				}
			}			
		}
	
	mesh.instanceMatrix.needsUpdate = true;

    return mesh;
}

function GenerateFbm(dimensions: Vector3, offset: Vector3, noiseConfig: NoiseConfig){
	const noiseMap = [];
	// const fbm = new FBM({
	// 	seed: Math.random(),
	// 	scale: 0.06,
    //     octaves: 6,
    //     persistance: 0.5,
    //     lacunarity: 2,
    //     redistribution: 1,
    //     height: 0,
	// })

	// const fbm = new FBM({
	// 	seed: seed ? seed :  Math.random(),
	// 	scale: 0.03,
    //     octaves: 5,
    //     persistance: 0.5,
    //     lacunarity: 2,
        // redistribution: 1,
        // height: 0,
	// })

	const fbm = new FBM({
		seed: noiseConfig.seed ? noiseConfig.seed :  Math.random(),
		scale: noiseConfig.scale,
		octaves: noiseConfig.octaves,
		persistance: noiseConfig.persistance,
		lacunarity: noiseConfig.lacunarity,
		// redistribution: 1,
		// height: 0,
	})

	for(let z = 0; z < dimensions.z; ++z){
		let column = [];
		for(let x = 0; x < dimensions.x; ++x){
			let row = []
			for(let y = 0; y < dimensions.y; ++y){
				
				const samplePosX = x + offset.x;
				const samplePosY = y + offset.y;
				const samplePosZ = z + offset.z;
				let noisePoint = 0;
				// loop through each wave

				const vector3 = new THREE.Vector3(samplePosX, samplePosY, samplePosZ )
				noisePoint = fbm.get3(vector3);

				row.push(noisePoint);
			}
			column.push(row)
		}
		noiseMap.push(column)
	}

	return noiseMap;
}

function getTerrainColor(fbmNoiseValue: number){
	if( fbmNoiseValue < -0.5){
		//water floor
		return new THREE.Color(0x5fade2);
	}
	if(fbmNoiseValue < -0.35){
		//dirt floor
		return new THREE.Color(0x873600);
	}
	if(fbmNoiseValue < -0.1){
		//sand/rock	floor
		return new THREE.Color(0xb2babb);
	} else{
		//solid rock
		return new THREE.Color(0x5d6d7e);					
	}
}

function inRange(x: number, min: number, max: number) {
  return x >= min && x <= max;
}
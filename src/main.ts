import * as THREE from 'three'
import * as dat from 'dat.gui';

import { Vector2 } from 'three';

const {OrbitControls} = require('three-orbitcontrols');
const {Perlin, FBM} = require('three-noise');


//Renderer initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement )

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 50

//Renderer frame
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}
animate();

const wave = [
	{
	seed: 3,
	frequency: 1,
	amplitude: 1,
	},
	{
		seed: 56,
		frequency: 3,
		amplitude: 0.2,
	}
]


//GUI
var FizzyText: any = function (this: any) {
    this.width = 50;
    this.height = 50;
	this.elevation = 1;
	this.offsetX = 2;
	this.offsetY = 1;
	this.generateMap = ()=>{
		// render()
		scene.clear();
		const offset = new THREE.Vector2(this.offsetX, this.offsetY); 
		renderPlane(this.width, this.height, offset);
		// colorSimplexNoise(objects, this.elevation, wave, offset);
	};
};

var gui = new dat.GUI();
var text = new FizzyText();
var width = gui.add(text, 'width', 0, 1000);
var height = gui.add(text, 'height', 0, 1000);
var elevation = gui.add(text, 'elevation', 0, 10);
var generateMap = gui.add(text, 'generateMap');
var offsetX = gui.add(text, 'offsetX', 0);
var offsetY = gui.add(text, 'offsetY', 0);

/* Slide validator/fixer */
var resetSliders = function (name: any) {
    for (var i = 0; i < gui.__controllers.length; i++) {
        // if (!gui.__controllers.property == name)
            gui.__controllers[i].setValue(0);
    }
};

// Events on sliders
height.onChange(function (value) {
    resetSliders('height');
});

width.onChange(function (value) {
    resetSliders('width');
});

function renderPlane(width: number, height: number, offset: Vector2){
	const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshToonMaterial();
	const mesh = new THREE.InstancedMesh(geometry, material, width * height);
	const dummy = new THREE.Object3D();
	mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
	scene.add(mesh);
	
	const noise2D = GenerateFbm(width, height, offset)
	console.log(noise2D)
	let i = 0;
	for(let x = 0; x < width; x++){
			for(let y = 0; y < height; y++){
				dummy.position.x = x - width / 2;
				dummy.position.z = y - height / 2;
				dummy.position.y = 0;

				const noisePoint = noise2D[x][y];
				const color = getTerrainColor(noisePoint)
				
				dummy.updateMatrix();
				mesh.setMatrixAt(i, dummy.matrix);
				mesh.setColorAt(i, color);

              	i++;

			}			
		}
	
	mesh.instanceMatrix.needsUpdate = true;
	// return objects;
}

function GenerateFbm(width: number, height: number, offset: Vector2){
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

	const fbm = new FBM({
		seed: Math.random(),
		scale: 0.03,
        octaves: 5,
        persistance: 0.5,
        lacunarity: 2,
        // redistribution: 1,
        // height: 0,
	})

	for(let x = 0; x < width; ++x){
		let row = []
		for(let y = 0; y < height; ++y){
			const samplePosX = x + offset.x;
            const samplePosY = y + offset.y;
			let noisePoint = 0;
            // loop through each wave

			const vector2 = new THREE.Vector2(samplePosX, samplePosY )
			noisePoint = fbm.get2(vector2);


			row.push(noisePoint);
		}
		noiseMap.push(row)
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
import * as THREE from 'three'

import { Color, Vector3 } from 'three';

import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const THREE_Noise = require('three-noise');
const { Perlin, FBM } = THREE_Noise;

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.z = 50
camera.position.y = 50

const geometry = new THREE.Vector3(50, 50, 50);
const offset = new THREE.Vector3();
const randomness = {seed: 0};

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const geometryFolder = gui.addFolder('Geometry')
geometryFolder.add(geometry, 'x', 0, 1000)
geometryFolder.add(geometry, 'y', 0, 1000)
geometryFolder.add(geometry, 'z', 0, 1000)
geometryFolder.add({ GenerateGeometry : ()=>{ 
    scene.clear();
    renderPlane(geometry, offset)
}}, 'GenerateGeometry').name('Generate Geometry')
geometryFolder.open()
const noiseFolder = gui.addFolder('Noise')
noiseFolder.add(randomness, 'seed', 0, 99999)
noiseFolder.add(offset, 'x', 0, 10)
noiseFolder.add(offset, 'y', 0, 10)
noiseFolder.add(offset, 'z', 0, 10)
noiseFolder.open()

function animate() {
    requestAnimationFrame(animate)
    controls.update();
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()

function renderPlane(dimensions: Vector3, offset: Vector3){
	const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial(
    //{color: 0x00ff00,wireframe: true}
    );
    const count = dimensions.x * dimensions.y;
	const mesh = new THREE.InstancedMesh(geometry, material, count);
	const dummy = new THREE.Object3D();
	mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
	scene.add(mesh);
	
	const noise2D = GenerateFbm(dimensions, offset)
	let i = 0;
	for(let x = 0; x < dimensions.x; x++){ 
			for(let y = 0; y < dimensions.y; y++){
				dummy.position.x = x - dimensions.x / 2;
				dummy.position.z = y - dimensions.y / 2;
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
}

function GenerateFbm(dimensions: Vector3, offset: Vector3){
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
		seed: randomness.seed ? randomness.seed :  Math.random(),
		scale: 0.03,
        octaves: 5,
        persistance: 0.5,
        lacunarity: 2,
        // redistribution: 1,
        // height: 0,
	})

	for(let x = 0; x < dimensions.x; ++x){
		let row = []
		for(let y = 0; y < dimensions.y; ++y){
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



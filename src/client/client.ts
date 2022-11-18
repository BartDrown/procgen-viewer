import * as THREE from 'three'

import { Biome } from './types/biome'
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { renderPlane } from './render'

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
    const mesh = renderPlane(geometry, offset, randomness.seed);
	scene.add(mesh);
}}, 'GenerateGeometry').name('Generate Geometry')
geometryFolder.open()
const noiseFolder = gui.addFolder('Noise')
noiseFolder.add(randomness, 'seed', 0, 99999)
noiseFolder.add(offset, 'x', 0, 10)
noiseFolder.add(offset, 'y', 0, 10)
noiseFolder.add(offset, 'z', 0, 10)
noiseFolder.open()


const biomesFolder = gui.addFolder('Biomes')
const biomes: Biome[] =[]; 

biomesFolder.add({ AddBiome : ()=>{ 
    const biomeName = `Biome ${biomes.length + 1}`;
    biomes.push(new Biome(biomeName, 1000, -10, []));
    biomesFolder.addFolder(biomeName);
}}, 'AddBiome').name('Add Biome')

biomesFolder.add({ RemoveBiome : ()=>{ 
    const biomeName = `Biome ${biomes.length}`;
    if(biomes.length != 0){
        biomes.pop();
        biomesFolder.removeFolder(biomesFolder.__folders[biomeName])
    }

}}, 'RemoveBiome').name('Remove Biome')



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

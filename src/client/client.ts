import * as THREE from 'three'

import { Biome } from './types/biome'
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Turf } from './types/turf'
import { Vector3 } from 'three'
import { renderPlane } from './render'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.z = 50
camera.position.y = 50


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

const geometry = new THREE.Vector3(50, 50, 50);
const offset = new THREE.Vector3();
const randomness = {seed: 0};

gui.useLocalStorage = true;
gui.remember(geometry)
gui.remember(offset)
gui.remember(randomness)

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
const biomesData = localStorage.getItem('biomesData');
const biomes: Biome[] = biomesData ? JSON.parse(biomesData) as Biome[] : []; 

biomesFolder.add({ AddBiome : ()=>{ 
    addBiomeControls();
}}, 'AddBiome').name('Add Biome')

biomesFolder.add({ RemoveBiome : ()=>{ 
    const biomeToDelete = biomes.pop();
    if(biomeToDelete){
        biomesFolder.removeFolder(biomesFolder.__folders[biomeToDelete.name])
    }
}}, 'RemoveBiome').name('Remove Biome')

biomes.forEach((biome, index)=>{
    addBiomeControls(index, biome);
})

gui.add({ SaveAll : ()=>{ 
    localStorage.setItem('biomesData', JSON.stringify(biomes));
}}, 'SaveAll').name('Save Biomes Data')

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

function addBiomeControls(indexParam?: number, biomeParam?: Biome){
    const index = indexParam !== undefined ? indexParam : biomes.length
    const biomeName = biomeParam?.name ? biomeParam.name : `Biome ${index + 1}`;
    const biome = biomeParam ? biomeParam : new Biome(biomeName, 10, -10, []);
    const newFolder = biomesFolder.addFolder(biomeName);

    if(biomeParam === undefined){
        biomes.push(biome);
    }

    newFolder.add(biome, 'maxTemperature', -1000, 1000);
    newFolder.add(biome, 'minTemperature', -1000, 1000);
    
    
    newFolder.add({ AddTurf : ()=>{ 
        addTurfControls(newFolder, biome);
    }}, 'AddTurf').name('Add Turf')


    newFolder.add({ RemoveTurf : ()=>{ 
        const turfName = `Turf ${biome.turfs.length}`;
        if(biome.turfs.length != 0){
            biome.turfs.pop();
            newFolder.removeFolder(newFolder.__folders[turfName]);
        }
    }}, 'RemoveTurf').name('Remove Turf')

    biome.turfs.forEach((turf, index)=>{
        addTurfControls(newFolder, biome, index, turf);
    })
}

function addTurfControls(folder: GUI, biome: Biome , indexParam?: number, turfParam?: Turf){
    const index = indexParam !== undefined ? indexParam : biome.turfs.length;
    const turfName = turfParam?.name ? turfParam.name : `Turf ${index + 1}`;
    const turf = turfParam ? turfParam : new Turf(turfName, 10, -10, new THREE.Color(0xffffff), true);
    const turfFolder = folder.addFolder(turfName);

    if(turfParam === undefined){
        biome.turfs.push(turf);
    }

    turfFolder.add(turf, 'maxElevation', -1000, 1000);
    turfFolder.add(turf, 'minElevation', -1000, 1000);
    turfFolder.addColor(turf, 'color');
    turfFolder.add(turf, 'visible');

}
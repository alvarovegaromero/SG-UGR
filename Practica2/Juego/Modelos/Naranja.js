import * as THREE from '../../libs/three.module.js'
import { PedunculoNaranja } from './PedunculoNaranja.js'

class Naranja extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    var pedunculoNaranja = new PedunculoNaranja();
    pedunculoNaranja.scale.set(0.5,0.5,0.5)
    pedunculoNaranja.position.y += 3;

    var naranja = this.createNaranja();
    
    var naranjaEntera = new THREE.Object3D();       // crear la manzana como el conjunto de la propia manzana y su rabo
    naranjaEntera.add(pedunculoNaranja, naranja);
    
    this.add (naranjaEntera);
  }

  createNaranja()
  {
    // Un Mesh se compone de geometría y material
    var sphereGeom = new THREE.SphereGeometry( 1.5, 100, 100 ); //radio, paralelos y meridianos (norte a sur)
    // Como material se crea uno a partir de un color
    var texture = new THREE.TextureLoader().load('./Imagenes/naranja.jpg'); //añadirle textura de naranja
    var sphereMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0,
    });

    // Ya podemos construir el Mesh
    this.sphere = new THREE.Mesh (sphereGeom, sphereMat);
    // Y añadirlo como hijo del Object3D (el this)

    this.sphere.position.y = 1.5;

    return this.sphere;
  }

  
  
  update () {
  }
}

export { Naranja }

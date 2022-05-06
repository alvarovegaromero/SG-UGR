import * as THREE from '../../libs/three.module.js'
//import { Pedunculo } from './Pedunculo.js'

class Naranja extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    var naranja = this.createNaranja();
    
    this.add (naranja);
  }

  createNaranja()
  {
    // Un Mesh se compone de geometría y material
    var sphereGeom = new THREE.SphereGeometry( 1.5, 100, 100 ); //radio, paralelos y meridianos (norte a sur)
    // Como material se crea uno a partir de un color
    var texture = new THREE.TextureLoader().load('./Imagenes/naranja.jpg');
    var sphereMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0,
      reflectivity: 0.35
    });

    // Ya podemos construir el Mesh
    this.sphere = new THREE.Mesh (sphereGeom, sphereMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.sphere);

    this.sphere.position.y = 1.5;
  }

  
  
  update () {
  }
}

export { Naranja }

import * as THREE from '../../libs/three.module.js'
//import { Pedunculo } from './Pedunculo.js'

class Uva extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    var uva = this.createUva(); //Uva realmente es un racimo de uvas
    
    this.add (uva);
  }

  createUva()
  {
    // Un Mesh se compone de geometría y material
    var sphereGeom = new THREE.SphereGeometry( 1.5, 100, 100 ); //radio, paralelos y meridianos (norte a sur)
    // Como material se crea uno a partir de un color
    var texture = new THREE.TextureLoader().load('./Imagenes/uva.jpg'); //añadirle textura de naranja
    var sphereMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: 0xad00ad,
      roughness: 0, 
      reflectivity: 0.35
    });

    // Ya podemos construir el Mesh
    this.sphere = new THREE.Mesh (sphereGeom, sphereMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.sphere);

    this.sphere.scale.y = 1.25;
    this.sphere.scale.set(0.5, 0.7, 0.5);
    this.sphere.position.y = 1;
  }
  
  
  update () {
  }
}

export { Uva }

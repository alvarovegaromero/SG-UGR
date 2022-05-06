import * as THREE from '../../libs/three.module.js'
//import { Pedunculo } from './Pedunculo.js'

class Naranja extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);

    var naranja = this.createNaranja(); //Uva realmente es un racimo de uvas
    
    this.add (naranja);
  }

  createNaranja()
  {
    // Un Mesh se compone de geometría y material
    var sphereGeom = new THREE.SphereGeometry( 1.5, 100, 100 ); //radio, paralelos y meridianos (norte a sur)
    // Como material se crea uno a partir de un color
    var sphereMat = new THREE.MeshPhongMaterial({
      color: 0xFF9300,
      flatShading: true,
    });

    // Ya podemos construir el Mesh
    this.sphere = new THREE.Mesh (sphereGeom, sphereMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.sphere);

    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura
    this.sphere.position.y = 1.5;
  }
  
  createGUI (gui,titleGui) {

  }
  
  
  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Naranja }

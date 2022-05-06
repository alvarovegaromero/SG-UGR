import * as THREE from '../../libs/three.module.js'
import { Pedunculo } from './Pedunculo.js'

class Manzana extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);

    // Se crea el pedunculo, pero no se añade a la escena, solamente se crea un mesh resultante de geometría y material
    var pedunculo = new Pedunculo();

    pedunculo.meshPedunculo.position.y = 3.5;  // subir el rabo
    this.add(pedunculo.meshPedunculo);

    var manzana_sin_rabo = this.createManzana();

    var manzana = new THREE.Object3D();       // crear la manzana como el conjunto de la propia manzana y su rabo
    manzana.add(manzana_sin_rabo, pedunculo);
    
    this.add (manzana);
  }

  createManzana()
  {
    var texture = new THREE.TextureLoader().load('./Imagenes/manzana.jpg');
    var material_manzana = new THREE.MeshPhysicalMaterial({map: texture, roughness: 0, reflectivity: 0.35});

    var shapeManzana = new THREE.Shape();
    shapeManzana.moveTo(0, 2);
    shapeManzana.quadraticCurveTo(2, -1, 4.5, 2);
    shapeManzana.quadraticCurveTo(7.5, 5, 6, 7.5);
    shapeManzana.quadraticCurveTo(3, 12, 0, 7);

    var puntos = shapeManzana.extractPoints(10).shape;
    var manzanaGeometry = new THREE.LatheGeometry(puntos, 24);
    manzanaGeometry.scale(0.8, 1, 0.8);  // reducir su ancho
    manzanaGeometry.scale(0.5, 0.5, 0.5);  // reducirla en general

    var meshManzana = new THREE.Mesh(manzanaGeometry, material_manzana);

    meshManzana.position.y -= 0.25;

    return meshManzana;
  }
  
  createGUI (gui,titleGui) {
  }
  
  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Manzana }

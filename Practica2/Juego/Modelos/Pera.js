import * as THREE from '../../libs/three.module.js'
import { Pedunculo } from './Pedunculo.js'

class Pera extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea el pedunculo, pero no se añade a la escena, solamente se crea un mesh resultante de geometría y material
    var pedunculo = new Pedunculo();

    pedunculo.meshPedunculo.position.y = 4.5;  // subir el rabo
    pedunculo.meshPedunculo.scale.set(0.6,0.5,0.6);
    this.add(pedunculo.meshPedunculo);

    var pera_sin_rabo = this.createPera();

    var pera = new THREE.Object3D();       // crear la pera como el conjunto de la propia pera y su rabo
    pera.add(pera_sin_rabo, pedunculo);
    
    this.add (pera);
  }

  createPera()
  {
    var texture = new THREE.TextureLoader().load('./Imagenes/pera.jpg');
    var material_pera = new THREE.MeshPhysicalMaterial({map: texture, roughness: 0, reflectivity: 0.35});

    var shapePera = new THREE.Shape();
    shapePera.lineTo(1, 0);
    shapePera.quadraticCurveTo(2.7, 0.5, 3.5, 1.5);
    shapePera.quadraticCurveTo(7, 4.6, 4, 7);
    shapePera.quadraticCurveTo(4, 7, 1.7, 10);
    shapePera.quadraticCurveTo(1, 11, 0, 10.5);

    var puntos = shapePera.extractPoints(10).shape;
    var peraGeometry = new THREE.LatheGeometry(puntos, 24);
    peraGeometry.scale(0.65, 0.9, 0.65);  // reducir su ancho
    peraGeometry.scale(0.5, 0.5, 0.5);  // reducirla en general

    var meshPera = new THREE.Mesh(peraGeometry, material_pera);

    meshPera.position.y -= 0.25;

    return meshPera;
  }
  
  
  update () {
  }
}

export { Pera }

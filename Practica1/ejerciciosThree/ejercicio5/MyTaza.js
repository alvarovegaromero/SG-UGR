import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyTaza extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshNormalMaterial({color: 0xCF0000});

    material.flatShading = true;
    material.needsUpdate = true;

    //geometrías a usar:
    var cilindroExterior = new THREE.CylinderGeometry (5, 5, 10, 50, 1); //radio top y bottom, altura, segmentos radiales y num caras a lo largo del cilindro
    var cilindroInterior = new THREE.CylinderGeometry (4.7, 4.7, 10, 50, 1); //mismo cilindro pero menos radio
    var asa = new THREE.TorusGeometry (3, 0.5, 24, 24);

    //se posicionan y orientan
    cilindroInterior.translate(0,0.3,0); //Que taza tenga parte de abajo - no podemos hacer .position.y porque no esta credo el mesh
    asa.translate(-5,0,0);

    //construir Meshes
    var cilindroInteriorMesh = new THREE.Mesh(cilindroInterior, material);
    var cilindroExteriorMesh = new THREE.Mesh(cilindroExterior, material);
    var asaMesh = new THREE.Mesh(asa, material);

    //Creamos objeto CSG y operamos con él
    var csg = new CSG();
    csg.union ([cilindroExteriorMesh, asaMesh]); //Juntamos asa y cilindro de la taza
    csg.subtract([cilindroInteriorMesh]); //Al resultado le quitamos (diferencia) la parte interior

    this.taza = csg.toMesh();

    this.add(this.taza);

    this.taza.position.y += 5;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.taza.rotation.y += 0.01;
  }
}

export { MyTaza };

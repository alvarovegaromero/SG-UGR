import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyPieza extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshNormalMaterial({color: 0xCF0000});

    material.flatShading = true;
    material.needsUpdate = true;

    // Se crea la geometría, se transforma y orienta
    var caja_a_perforar = new THREE.BoxGeometry (5, 5, 2); //ancho alto y profundo
    var cilinderGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 32); //0.5 de radio y 3 de altura
    var piezaGeom = new THREE.BoxGeometry(5, 4, 2); //Quitar todo menos una parte a la izq
    var piezaGeom2 = new THREE.BoxGeometry(5, 4.5, 2); //Quitar todo menos una parte arriba

    var cilindro_aguj_arriba = new THREE.CylinderGeometry(0.35, 0.35, 1, 32); //Agujero de radio 0.5 y altura 1 para poder ver bien
    var cilindro_aguj_arriba_tronco = new THREE.CylinderGeometry(0.35, 0.6, 0.25, 32);

    var cilindro_aguj_izq = new THREE.CylinderGeometry(0.35, 0.35, 1, 32); //Agujero de radio 0.5 y altura 1 para poder ver bien
    var cilindro_aguj_izq_tronco = new THREE.CylinderGeometry(0.35, 0.6, 0.25, 32);

    //se posicionan y orientan
    caja_a_perforar.translate(0,2.5,0); //La ponemos sobre plano XZ
    piezaGeom.translate(0.5,2,0); //La movemos 0.5 a la derecha y ponemos sobre plano XZ
    piezaGeom2.translate(1,2.25,0); //La ponemos sobre plano XZ y movemos a la derecha
    cilinderGeom.rotateX(Math.PI/2); //Giramos cilindro
    cilinderGeom.translate(-1.5,4,0); //Hacemos la curva

    cilindro_aguj_arriba.translate(1.5, 0.5+4.5,0);

    cilindro_aguj_arriba_tronco.translate(1.5, 0.125+4.5, 0);


    cilindro_aguj_izq.rotateZ(Math.PI/2);
    cilindro_aguj_izq.translate(-2, 0.35+1.15,0);

    cilindro_aguj_izq_tronco.rotateZ(Math.PI/2);
    cilindro_aguj_izq_tronco.translate(-2.12, 0.6+0.9,0);

    //construir Meshes
    var caja_a_perforarMesh = new THREE.Mesh(caja_a_perforar, material);
    var cilinderGeomMesh = new THREE.Mesh(cilinderGeom, material);
    var piezaGeomMesh = new THREE.Mesh(piezaGeom, material);
    var piezaGeom2Mesh = new THREE.Mesh(piezaGeom2, material);

    var cilindro_aguj_arribaMesh = new THREE.Mesh(cilindro_aguj_arriba, material);
    var cilindro_aguj_izqMesh = new THREE.Mesh(cilindro_aguj_izq, material);
    var cilindro_aguj_arriba_troncoMesh = new THREE.Mesh(cilindro_aguj_arriba_tronco, material);
    var cilindro_aguj_izq_troncoMesh = new THREE.Mesh(cilindro_aguj_izq_tronco, material);

    //Creamos objeto CSG y operamos con él
    var csg_a_quitar = new CSG();
      csg_a_quitar.union([piezaGeomMesh, piezaGeom2Mesh,
            cilindro_aguj_arriba_troncoMesh, cilinderGeomMesh,
            cilindro_aguj_arribaMesh, cilindro_aguj_izqMesh,
            cilindro_aguj_izq_troncoMesh]);

    var csg = new CSG();
    csg.subtract([caja_a_perforarMesh, csg_a_quitar.toMesh()]);

    this.pieza = csg.toMesh();

    this.add(this.pieza);
    //this.add(cilindro_aguj_izq_troncoMesh);
    this.pieza.position.x -= -2.5
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.pieza.rotation.y += 0.01;
  }
}

export { MyPieza };

import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class MyTuerca extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //Una idea podría ser: forma de hexagono (moveTo y LineTo) y
    //  extruirlo sin bisel.
    //Luego, hacer varios cilindros de varios radios, unirlos y hacer
    //  la diferencia entre hexagono extruido y los cilindros

    //La opcion usada aqui es quedarme con la interseccion de esfera y cilindros
    //  para tener los border aplanados y luego, hacer varios toros/cilindros que
    //  quiten un poco mas del agujero central y asi hacer las muescas

    var material = new THREE.MeshNormalMaterial({color: 0xCF0000});

    material.flatShading = true;
    material.needsUpdate = true;

    //Creamos las geometrías
    var cilindro_tuerca = new THREE.CylinderGeometry(4, 4, 3, 6);
    var esfera_bordes_tuerca = new THREE.SphereGeometry(4.15, 16, 16);

    var cilindro_agujero_central = new THREE.CylinderGeometry(2, 2, 3, 32);

    // Creamos los Mesh
    var cilindro_tuercaMesh = new THREE.Mesh(cilindro_tuerca, material);
    var esfera_bordes_tuercaMesh = new THREE.Mesh(esfera_bordes_tuerca, material);
    var cilindro_agujero_centralMesh = new THREE.Mesh(cilindro_agujero_central, material);

    // Operamos
    var csg = new CSG();
    csg.intersect([cilindro_tuercaMesh, esfera_bordes_tuercaMesh]);
    csg.subtract([cilindro_agujero_centralMesh]);

    for(var i = 0; i < 10 ; i++)
    {
       var toro = new THREE.TorusGeometry(2, 0.15, 16, 16);
       toro.rotateX(Math.PI/2);
       toro.translate(0, 1.5-0.15-0.3*i, 0);
       var toroMesh = new THREE.Mesh(toro, material);
       csg.subtract([toroMesh]);
    }

    this.tuerca = csg.toMesh();
    this.add(this.tuerca);

    this.tuerca.position.y += 1.5;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.tuerca.rotation.y += 0.01;
  }
}

export { MyTuerca };

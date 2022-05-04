import * as THREE from '../libs/three.module.js'

class MyPica extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0x0000FF}); //Azul

    var geopica = new THREE.Shape();

    geopica.moveTo( 0, 0 ); //Punto de abajo del corazon - abajo
    geopica.quadraticCurveTo( 3, 3, 1.5, 4); //PC1 y B
    geopica.quadraticCurveTo( 0.75, 5, 0, 3); //PC2 y C
    geopica.quadraticCurveTo( -0.75, 5, -1.5, 4); //PC3 y D
    geopica.quadraticCurveTo( -3, 3, 0, 0); //PC4 y A
    //Corazon y le damos la vuelta

    var extrudeSettings = { //Opciones de la extrusion. Ver corazon para ver que son los parametros
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 1
    };

    //Añadir la base/pie////////////////////////////////////////////////////////
    this.puntospie = []; //Contorno para revolucion y hacer el pie
    this.puntospie.push(new THREE.Vector3(0.001, 0.0, 0.0));
    this.puntospie.push(new THREE.Vector3(1.5, 0.0, 0.0));
    this.puntospie.push(new THREE.Vector3(0.2, 0.5, 0.0));
    this.puntospie.push(new THREE.Vector3(0.2, 3, 0.0));
    this.puntospie.push(new THREE.Vector3(0.001, 3, 0.0));

    this.geopie = new THREE.LatheGeometry(this.puntospie, 40, 0, 2*Math.PI); //
    this.pie = new THREE.Mesh(this.geopie, material);

    this.add(this.pie);
    ////////////////////////////////////////////////////////////////////////////

    var geometry = new THREE.ExtrudeGeometry( geopica, extrudeSettings );

    // Ya podemos construir el Mesh
    this.pica = new THREE.Mesh( geometry, material );

    //this.objeto.rotation.z = Math.PI;
    this.add( this.pica );

    this.pica.scale.set(0.6, 0.6, 0.6);
    this.pica.rotation.z += Math.PI; //Girar 180º
    this.pica.position.y += 4;
    this.pica.position.z -= 0.1;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.pica.rotation.y += 0.01;
  }
}

export { MyPica };

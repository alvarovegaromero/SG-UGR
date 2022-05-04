import * as THREE from '../libs/three.module.js'

class MyTrebol extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0x0000FF}); //Azul

    var geotrebol = new THREE.Shape();

    geotrebol.moveTo(0, 6); //Punto inicial - Parte de abajo (en medio) del trebol
    geotrebol.quadraticCurveTo(0, 0, -6, 0); //Punto 0,0 como "apoyo" hasta -6,0
    geotrebol.quadraticCurveTo(-12, 0, -12, 6); //Fijamos otro punto (a la misma distancia del otro y en mismo eje)
    geotrebol.quadraticCurveTo(-12, 12, -6, 12); //-6,12 es punto de arriba a la izq en medio
    geotrebol.moveTo(-6,15);
    geotrebol.quadraticCurveTo(-6, 21, 0, 21); //0,21 es el punto de más arriba -6 de dista para el otor punto
    geotrebol.quadraticCurveTo(6, 21, 6, 15); //La inversa del anterio
    geotrebol.moveTo(6,12);
    geotrebol.quadraticCurveTo(12, 12, 12, 6); //Fijamos 12,12 y vamos al 12,6
    geotrebol.quadraticCurveTo(12, 0, 6, 0);
    geotrebol.quadraticCurveTo(0, 0, 0, 6); //Vuelta al punto original

    var extrudeSettings = { //Opciones de la extrusion. Ver corazon para ver que son los parametros
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };

    //Añadir la base/pie////////////////////////////////////////////////////////
    this.puntospie = []; //Contorno para puntos del pie
    this.puntospie.push(new THREE.Vector3(0.001, 0.0, 0.0));
    this.puntospie.push(new THREE.Vector3(1.5, 0.0, 0.0));
    this.puntospie.push(new THREE.Vector3(0.2, 0.5, 0.0));
    this.puntospie.push(new THREE.Vector3(0.2, 3, 0.0));
    this.puntospie.push(new THREE.Vector3(0.001, 3, 0.0));

    this.geopie = new THREE.LatheGeometry(this.puntospie, 40, 0, 2*Math.PI); //
    this.pie = new THREE.Mesh(this.geopie, material);

    ////////////////////////////////////////////////////////////////////////////

    var geometry = new THREE.ExtrudeGeometry( geotrebol, extrudeSettings );

    // Ya podemos construir el Mesh
    this.trebol = new THREE.Mesh( geometry, material );

    //this.objeto.rotation.z = Math.PI;

    this.trebol.scale.set(0.25, 0.25, 0.25);
    this.trebol.position.y += 2;
    this.trebol.position.z -= 0.1;

    this.trebool = new THREE.Object3D(); //Estructura con todas las partes
    this.trebool.add(this.pie);
    this.trebool.add(this.trebol);

    this.add(this.trebool)
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.trebool.rotation.y += 0.01;
  }
}

export { MyTrebol };

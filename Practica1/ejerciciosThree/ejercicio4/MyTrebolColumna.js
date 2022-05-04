import * as THREE from '../libs/three.module.js'

class MyTrebolColumna extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0x00F000}); //Azul

    var geotrebol = new THREE.Shape();

    geotrebol.moveTo(0, 3); //Punto inicial - Parte de abajo (en medio) del trebol
    geotrebol.quadraticCurveTo(0, 0, -3, 0); //Punto 0,0 como "apoyo" hasta -6,0
    geotrebol.quadraticCurveTo(-6, 0, -6, 3); //Fijamos otro punto (a la misma distancia del otro y en mismo eje)
    geotrebol.quadraticCurveTo(-6, 6, -3, 6); //-6,12 es punto de arriba a la izq en medio
    geotrebol.moveTo(-3,7.5);
    geotrebol.quadraticCurveTo(-3, 10.5, 0, 10.5); //0,21 es el punto de más arriba -6 de dista para el otor punto
    geotrebol.quadraticCurveTo(3, 10.5, 3, 7.5); //La inversa del anterio
    geotrebol.moveTo(3,6);
    geotrebol.quadraticCurveTo(6, 6, 6, 3); //Fijamos 12,12 y vamos al 12,6
    geotrebol.quadraticCurveTo(6, 0, 3, 0);
    geotrebol.quadraticCurveTo(0, 0, 0, 3); //Vuelta al punto original

    var trayectoria_barrido = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( 0, -12, 0 ),
        new THREE.Vector3(-2, -4, 0 ),
        new THREE.Vector3( 2, 4, 0 ),
        new THREE.Vector3( 0, 12, 0 ),
    ]);

    var barridoSettings = { //barrido
        steps: 20,
        depth: 2,
        bevelEnabled: false,
        extrudePath: trayectoria_barrido //trayectoria que sigue
    };

    //OJO, columna no tiene pie

    var geometry = new THREE.ExtrudeGeometry( geotrebol, barridoSettings );

    // Ya podemos construir el Mesh
    this.trebol = new THREE.Mesh( geometry, material );

    //this.objeto.rotation.z = Math.PI;
    this.add( this.trebol );

    this.trebol.scale.set(0.15, 0.3, 0.15);
    this.trebol.position.y += 2;
    this.trebol.position.z -= 0.25;
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    //Podriamos añadir una rotacion a la columna
  }
}

export { MyTrebolColumna };

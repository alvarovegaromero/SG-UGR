import * as THREE from '../libs/three.module.js'

class MyCorazonColumna extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0x00F000});

    var geocorazon = new THREE.Shape();

    geocorazon.moveTo( 0, 0 ); //Punto de abajo del corazon - abajo
    geocorazon.quadraticCurveTo( 3, 3, 1.5, 4); //PC1 y B
    geocorazon.quadraticCurveTo( 0.75, 5, 0, 3); //PC2 y C
    geocorazon.quadraticCurveTo( -0.75, 5, -1.5, 4); //PC3 y D
    geocorazon.quadraticCurveTo( -3, 3, 0, 0); //PC4 y A

    /*
    var path = new THREE.CatmullRomCurve3 (pts) ; //la trayectoria
    var options = { steps : 50, curveSegments : 4 ,extrudePath : path } ;
    var geometry = new THREE.ExtrudeBufferGeometry (shape, options) ;
    */

    var trayectoria_barrido = new THREE.CatmullRomCurve3( [ //Trayectoria del barrido
        new THREE.Vector3( 0, -10, 0 ),
        new THREE.Vector3(-1, -2.5, 0 ),
        new THREE.Vector3( 1, 2.5, 0 ),
        new THREE.Vector3( 0, 10, 0 ),
    ]);

    var extrudeSettings = { //barrido
        steps: 20,
        depth: 2,
        bevelEnabled: false,
        extrudePath: trayectoria_barrido //trayectoria que sigue
    };

    /*
      Para rotar figura de shape antes de camino, **hacer giro de la figura** y hacer luego en barrido y esas cosas tipica

      rotateShape (aShape, angle, resolucion = 6) {
        var points = aShape.extractPoints (resolucion).shape;
        var center = points[0];
        points.forEach ((p) => {
          p.rotateAround (center,angle);
        });
        return new THREE.Shape (points);
      }
    */

    var geometry = new THREE.ExtrudeGeometry( geocorazon, extrudeSettings );

    // Ya podemos construir el Mesh
    this.corazon = new THREE.Mesh( geometry, material );
    //this.objeto.rotation.z = Math.PI;
    this.add( this.corazon );
    this.position.y += 3;
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

export { MyCorazonColumna };

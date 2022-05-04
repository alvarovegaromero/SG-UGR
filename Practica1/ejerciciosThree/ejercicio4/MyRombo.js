import * as THREE from '../libs/three.module.js'

class MyRombo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0xCF0000});

    var georombo = new THREE.Shape();

    //georombo.moveTo( 0, 0 ); //Punto de abajo del corazon - abajo
    georombo.lineTo(1,2.5);
    georombo.lineTo(0,5);
    georombo.lineTo(-1,2.5);
    georombo.lineTo(0,0);

    var extrudeSettings = {
        steps: 1,
        depth: 1,
        /* Sin bisel
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
        */
    };

    var geometry = new THREE.ExtrudeGeometry( georombo, extrudeSettings );

    // Ya podemos construir el Mesh
    this.rombo = new THREE.Mesh( geometry, material );
    //this.objeto.rotation.z = Math.PI;
    this.add( this.rombo );
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.rombo.rotation.y += 0.01;
  }
}

export { MyRombo };

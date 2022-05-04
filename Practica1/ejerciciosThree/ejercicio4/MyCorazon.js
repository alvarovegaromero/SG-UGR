import * as THREE from '../libs/three.module.js'

class MyCorazon extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    //this.createGUI(gui,titleGui); - Ahora no tenemos interfaz

    // Un Mesh se compone de geometría y material
    // Como material se crea uno a partir de un color
    var material = new THREE.MeshPhysicalMaterial({color: 0xCF0000});

    var geocorazon = new THREE.Shape();

    // Ojo, si son transformaciones constantes a la figura, es mejor hacerlas a la geometría

    /*
    Opciones para el extrude:

    moveTo(x,y)
    lineTo(x,y)
    quadraticCurveTo(PCx, PCY, x,y)
    bezierCurveTo(PC1x, PC1y, PC2x, PC2y, x ,y)
    splineThru(pts) -> spline por lo puntos indicados. Hacer linea con puntos

    shape: Un objeto Shape con el contorno
    options: Puede tener los siguientes parámetros opcionales
      F depth: La cantidad de estrusión. Por defecto, 100
      F bevelEnabled: Añadido del bisel. Por defecto, true
      F bevelThickness: En la dirección de extrusión. Por defecto, 6
      F bevelSize: En el plano del Shape. Por defecto, bevelThickness - 2
      F bevelSegments: Segmentos para suavizar el bisel. Por defecto, 3
      F curveSegments: Segmentos para las curvas del Shape
      F steps: Segmentos de la parte extruída. Por defecto, 1
      F extrudePath: En caso de que se quiera seguir un camino libre.
      F Si no se especifica, se extruye por el eje Z
    */

    geocorazon.moveTo( 0, 0 ); //Punto de abajo del corazon - abajo
    geocorazon.quadraticCurveTo( 3, 3, 1.5, 4); //PC1 y B
    geocorazon.quadraticCurveTo( 0.75, 5, 0, 3); //PC2 y C
    geocorazon.quadraticCurveTo( -0.75, 5, -1.5, 4); //PC3 y D
    geocorazon.quadraticCurveTo( -3, 3, 0, 0); //PC4 y A

    var barridoSettings = { //Extrusión
        steps: 10, //Segmentos de parte extruida
        depth: 0.5, //Cantidad de extruccion
        bevelEnabled: true, //Bisel?
        bevelThickness: 1, // En direccion del shape
        bevelSize: 1, // Tamaño en el plano del shape
        bevelSegments: 5 // Segmentos para suavizar bizsel
    };


    var geometry = new THREE.ExtrudeGeometry( geocorazon, barridoSettings );

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

    this.corazon.rotation.y += 0.01;
  }
}

export { MyCorazon };

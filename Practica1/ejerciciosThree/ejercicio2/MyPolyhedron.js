import * as THREE from '../libs/three.module.js'

class MyPolyhedron extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.verticesOfCube = [
        -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
        -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ];

    this.indicesOfFaces = [
        2,1,0,    0,3,2,
        0,4,7,    7,3,0,
        0,1,5,    5,4,0,
        1,2,6,    6,5,1,
        2,3,7,    7,6,2,
        4,5,6,    6,7,4
    ];

    // Un Mesh se compone de geometría y material
    var polyhedronGeom = new THREE.PolyhedronGeometry( this.verticesOfCube, this.indicesOfFaces, 1, 2 ); //vertices, caras, radio de la figura final y 2 subdetalles

    const edges = new THREE.EdgesGeometry( polyhedronGeom ); //bordes
    this.line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) ); //añadir las lineas porque yolo
    this.add( this.line );

    // Como material se crea uno a partir de un color
    var polyhedronMat = new THREE.MeshNormalMaterial({color: 0xCF0000});

    polyhedronMat.flatShading = true;
    polyhedronMat.needsUpdate = true;

    // Ya podemos construir el Mesh
    this.polyhedron = new THREE.Mesh (polyhedronGeom, polyhedronMat); //añado this para que pueda verlo en todos los metodos al ser atributo
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.polyhedron);

    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura
    this.polyhedron.position.y = 1;
    this.line.position.y = 1; //subir las lineas
  }

  crearNuevo()
  {
    this.line.geometry.dispose();
    this.polyhedron.geometry.dispose();
    var nuevaGeometria = new THREE.PolyhedronGeometry(this.verticesOfCube, this.indicesOfFaces, this.guiControls.radius, this.guiControls.detail );
    this.line.geometry = nuevaGeometria;
    this.polyhedron.geometry = nuevaGeometria;
  }

  createGUI (gui,titleGui) {
  // Controles para el tamaño, la orientación y la posición de la caja
  this.guiControls = new function () {
    this.radius = 1.0;
    this.detail = 2.0;
  }

  // Se crea una sección para los controles de la caja
  var folder = gui.addFolder (titleGui);
  var that = this;
  // Estas lineas son las que añaden los componentes de la interfaz
  // Las tres cifras indican un valor mínimo, un máximo y el incremento
  // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
  folder.add (this.guiControls, 'radius', 0.5, 6.0, 0.5).name ('Radio : ').listen().onChange(function(value){that.crearNuevo()});
  folder.add (this.guiControls, 'detail', 1, 5, 1).name ('Detalle : ').listen().onChange(function(value){that.crearNuevo()});   //this alude a function(value). ALTERNATIVA ES (value) en vez de funtion(value) y this.crearNuevo();
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.polyhedron.rotation.z += 0.1;
    this.line.rotation.z += 0.1;
    this.polyhedron.rotation.y += 0.1;
    this.line.rotation.y += 0.1;
  }
}

export { MyPolyhedron };

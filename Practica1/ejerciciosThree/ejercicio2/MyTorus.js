import * as THREE from '../libs/three.module.js'

class MyTorus extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Un Mesh se compone de geometría y material
    var torusGeom = new THREE.TorusGeometry(0.8, 0.3, 8, 100); //radio, tubo, segmentos radiales y segmentos tubulares
    // Como material se crea uno a partir de un color
    var torusMat = new THREE.MeshNormalMaterial({color: 0xCF0000});

    torusMat.flatShading = true;
    torusMat.needsUpdate = true;

    // Ya podemos construir el Mesh
    this.torus = new THREE.Mesh (torusGeom, torusMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.torus);

    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura
    this.torus.position.y = 1.1;
  }
  crearNuevo()
  {
    this.torus.geometry.dispose();
    var nuevaGeometria = new THREE.TorusGeometry(this.guiControls.radius,this.guiControls.tube,this.guiControls.segmentos_radiales, this.guiControls.segmentos_tubulares);
    this.torus.geometry = nuevaGeometria;
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.radius = 0.8;
      this.tube = 0.3;
      this.segmentos_radiales = 8;
      this.segmentos_tubulares = 100;
    }

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    var that = this; //hace falta noc porque
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 0.1, 5.0, 0.1).name ('Radio : ').listen().onChange(function(value){that.crearNuevo()});  //this alude a function(value). ALTERNATIVA ES (value) en vez de funtion(value) y this.crearNuevo();
    folder.add (this.guiControls, 'tube', 0.1, 3, 0.1).name ('Tubos : ').listen().onChange(function(value){that.crearNuevo()});;
    folder.add (this.guiControls, 'segmentos_radiales', 4, 30, 1).name ('Segmentos Radiales : ').listen().onChange(function(value){that.crearNuevo()});;
    folder.add (this.guiControls, 'segmentos_tubulares', 4, 100, 1).name ('Segmentos Tubulares : ').listen().onChange(function(value){that.crearNuevo()});;

  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    //this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    //this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    //this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);

    this.torus.rotation.z += 0.1;
    this.torus.rotation.y += 0.1;
  }
}

export { MyTorus };

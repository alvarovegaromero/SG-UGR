import * as THREE from '../libs/three.module.js'

class MySphere extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Un Mesh se compone de geometría y material
    var sphereGeom = new THREE.SphereGeometry( 1.5, 32, 16 ); //radio, paralelos y meridianos (norte a sur)
    // Como material se crea uno a partir de un color
    var sphereMat = new THREE.MeshNormalMaterial({color: 0xCF0000});

    sphereMat.flatShading = true;
    sphereMat.needsUpdate = true;

    // Ya podemos construir el Mesh
    this.sphere = new THREE.Mesh (sphereGeom, sphereMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.sphere);

    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura
    this.sphere.position.y = 1.5;
  }

    crearNuevo()
    {
      this.sphere.geometry.dispose();
      var nuevaGeometria = new THREE.SphereGeometry(this.guiControls.radius,this.guiControls.paralelos,this.guiControls.meridianos);
      this.sphere.geometry = nuevaGeometria;
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.radius = 1.5;
        this.paralelos = 32;
        this.meridianos = 16;
      }

      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      var that = this; //hace falta noc porque
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      folder.add (this.guiControls, 'radius', 0.1, 5.0, 0.1).name ('Radio : ').listen().onChange((value) => {this.crearNuevo()});  //this alude a function(value). ALTERNATIVA ES (value) en vez de funtion(value) y this.crearNuevo();
      folder.add (this.guiControls, 'paralelos', 4, 50, 1).name ('Paralelos : ').listen().onChange(function(value){that.crearNuevo()});;
      folder.add (this.guiControls, 'meridianos', 4, 50, 1).name ('Meridianos : ').listen().onChange(function(value){that.crearNuevo()});;

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

    this.sphere.rotation.z += 0.1;
    this.sphere.rotation.y += 0.1;
  }
}

export { MySphere };

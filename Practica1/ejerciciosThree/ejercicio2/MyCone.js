import * as THREE from '../libs/three.module.js'

class MyCone extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Un Mesh se compone de geometría y material
    var coneGeom = new THREE.ConeGeometry( 1, 3, 32 ); //radio, altura y  segmentos radiales
    //radios, height y radialSegments
    // Como material se crea uno a partir de un color
    var coneMat = new THREE.MeshNormalMaterial({color: 0xCF0000});

    coneMat.flatShading = true;
    coneMat.needsUpdate = true;

    // Ya podemos construir el Mesh
    this.cone = new THREE.Mesh (coneGeom, coneMat);
    // Y añadirlo como hijo del Object3D (el this)
    this.add (this.cone);

    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura
    this.cone.position.y = 1.5;
  }

    crearNuevo()
    {
      this.cone.geometry.dispose()
      var nuevaGeometria = new THREE.ConeBufferGeometry(this.guiControls.radius,this.guiControls.height,this.guiControls.segmentos_radiales);
      this.cone.geometry = nuevaGeometria;
    }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.radius = 1.0;
      this.height = 3.0;
      this.segmentos_radiales = 32.0;
    }

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    var that = this;
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 0.1, 5.0, 0.1).name ('Radio : ').listen().onChange(function(value){that.crearNuevo()});  //this alude a function(value). ALTERNATIVA ES (value) en vez de funtion(value) y this.crearNuevo();
    folder.add (this.guiControls, 'height', 0.1, 5.0, 0.1).name ('Altura : ').listen().onChange(function(value){that.crearNuevo()});;
    folder.add (this.guiControls, 'segmentos_radiales', 10, 50, 1).name ('Segmentos Radiales : ').listen().onChange(function(value){that.crearNuevo()});;

  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.cone.rotation.z += 0.1;
    this.cone.rotation.y += 0.1;
  }
}

export { MyCone };

import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyAuricular extends THREE.Object3D {
  constructor(gui, titleGui, points){
      super();
      //this.createGUI(gui,titleGui);

      var mat = new THREE.MeshNormalMaterial();
      //this.material.side = THREE.DoubleSide;
      mat.flatShading = true;
      mat.needsUpdate = true;

      var sphereGeom = new THREE.SphereGeometry(2, 20, 20 ); //radio, paralelos y meridianos (norte a sur)
      sphereGeom.translate(0,2,0);

      var cilindro_altavozgeo = new THREE.CylinderGeometry (1.3, 2, 6, 30); //radio top y bottom, altura, segmentos radiales y num caras a lo largo del cilindro
      
      var cilindro_palogeo = new THREE.CylinderGeometry (0.5, 0.5, 5, 30); //radio top y bottom, altura, segmentos radiales y num caras a lo largo del cilindro
      
      var cilindro_agujerogeo = new THREE.CylinderGeometry (0.9, 0.9, 2, 30); //radio top y bottom, altura, segmentos radiales y num caras a lo largo del cilindro


      this.sphere = new THREE.Mesh (sphereGeom, mat);
      this.sphere.scale.set(1,1.5,1);
      //this.sphere.position.y += 2;

      this.cilindro_altavoz = new THREE.Mesh(cilindro_altavozgeo, mat);
      this.cilindro_altavoz.scale.set(1,1,1.5);
      this.cilindro_altavoz.rotation.x = (Math.PI/2);
      this.cilindro_altavoz.position.y += 3;
      this.cilindro_altavoz.position.z += 3;

      this.cilindro_palo = new THREE.Mesh(cilindro_palogeo, mat);
      this.cilindro_palo.position.y -= 1.5;
      this.cilindro_palo.position.x += 1;

      this.cilindro_agujero = new THREE.Mesh(cilindro_agujerogeo, mat);
      this.cilindro_agujero.scale.set(1,1,1.5);
      this.cilindro_agujero.rotation.x = (Math.PI/2);
      this.cilindro_agujero.position.z += 6.75;
      this.cilindro_agujero.position.y += 3;


      //this.add(this.sphere)
      //this.add(this.cilindro_altavoz)

      //this.add(this.cilindro_agujero);

      var csg = new CSG();

      csg.union ([this.sphere, this.cilindro_altavoz]); //Juntamos asa y cilindro de la taza
      csg.union([this.cilindro_palo]);
      csg.subtract([this.cilindro_agujero]);

      this.auricular = csg.toMesh();
      this.auricular.scale.set(0.25,0.25,0.25);
    
      this.nuevoauricular = new THREE.Object3D(); //Estructura con todas las partes
      this.nuevoauricular.add(this.auricular);

      this.nuevoauricular.rotateY(-Math.PI/2);
      this.nuevoauricular.rotateX(Math.PI/2);
      
      this.spline = new THREE.CatmullRomCurve3( [
        new THREE.Vector3(0,-2.5,0),
        new THREE.Vector3(-2,-2,0), 
        new THREE.Vector3(-5.5,0,0), 
        new THREE.Vector3(-8,2,0), 
        new THREE.Vector3(-7.5,3,0),
        new THREE.Vector3(-6.5,3.5,0),  
        new THREE.Vector3(0,2,0),  // la mitad del recorrido
        new THREE.Vector3(6.5,3.5,0),  
        new THREE.Vector3(7.5,3,0),
        new THREE.Vector3(8,2,0), 
        new THREE.Vector3(5.5,0,0),
        new THREE.Vector3(2,-2,0),
        new THREE.Vector3(0,-2.5,0),
    ] );

    var geometriaLinea = new THREE.BufferGeometry(); //Crea geometria - es como geometria para definir 
    geometriaLinea.setFromPoints( this.spline.getPoints(100) ); 
    //Tomar vertices del spline - 100 es eñ número de puntos que consideres necesario para que la línea se aproxime 
    var material = new THREE.LineBasicMaterial( { color: 0x0F0F0F, linewidth: 5} ); //Darle material
    this.recorrido = new THREE.Line(geometriaLinea, material); //Crear malla con geometría y mat
    this.add(this.recorrido); //Añadir el recorrido
    
    var origen = {p: 0}; //Definir los tramos. P es %
    var destino = {p: 1};

    var posicion = this.spline.getPoint(origen.p); //Colocamos objeto en punto p del spline
    this.nuevoauricular.position.copy(posicion);
    var tangente = this.spline.getTangentAt(origen.p); //Orientamos el obj
    posicion.add(tangente); 
    this.nuevoauricular.lookAt(posicion);
    this.nuevoauricular.rotateX(Math.PI/2);
    
    var movimiento = new TWEEN.Tween(origen).to(destino,10000) //10s
    .easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
      posicion = this.spline.getPoint(origen.p); //Modificar la pos a la nueva de origen
      this.nuevoauricular.position.copy(posicion); 
      var tangente = this.spline.getTangentAt(origen.p); //Orientamos el obj
      posicion.add(tangente); 
      this.nuevoauricular.lookAt(posicion);
      this.nuevoauricular.rotateX(Math.PI/2);
      //this.auricular.rotation.x += 0.01;
    })
    .start()
    .repeat(Infinity) 
    
    this.add(this.nuevoauricular);
  }

  createGUI (gui,titleGui) {
  }

  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.auricular.rotation.y += 0.01;
    TWEEN.update();
  }
}

export { MyAuricular };

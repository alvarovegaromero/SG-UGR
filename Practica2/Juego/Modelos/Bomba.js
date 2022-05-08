import * as THREE from '../../libs/three.module.js'
import { Pedunculo } from './Pedunculo.js' //Uso pedunculo como "mecha"

class Bomba extends THREE.Object3D {
  constructor() {
    super();
    
    var color = new THREE.Color(0xFFFFFF);
    // Se crea el pedunculo, pero no se añade a la escena, solamente se crea un mesh resultante de geometría y material
    var pedunculo = new Pedunculo(color);
    pedunculo.meshPedunculo.scale.set(0.75,1,0.75);
    pedunculo.meshPedunculo.position.y = 2.5;  // subir el rabo

    var bomba = this.createBomba();

    var bombaEntera = new THREE.Object3D();       // crear la manzana como el conjunto de la propia manzana y su rabo
    bombaEntera.add(bomba, pedunculo.meshPedunculo);
    
    this.add (bombaEntera);
  }

  createBomba()
  {
    var material_bomba = new THREE.MeshPhysicalMaterial({color: 0x1e1f1f, roughness: 0, reflectivity: 0.9});

    //Obtener los puntos con la ecuacion de la esfera de x^2 + y^2 = r^2
    this.puntos = []; //radio de 1.5
    this.puntos.push (new THREE.Vector3(0.001,-1.5,0));
    this.puntos.push (new THREE.Vector3(0.25,-1.45,0));
    this.puntos.push (new THREE.Vector3(0.5,-1.4,0));
    this.puntos.push (new THREE.Vector3(0.75,-1.3,0));
    this.puntos.push (new THREE.Vector3(1,-1.1,0));
    this.puntos.push (new THREE.Vector3(1.25,-0.8,0));
    this.puntos.push (new THREE.Vector3(1.35,-0.65,0));
    this.puntos.push (new THREE.Vector3(1.45,-0.3,0));
    this.puntos.push (new THREE.Vector3(1.5,0,0));
    this.puntos.push (new THREE.Vector3(1.45,0.3,0));
    this.puntos.push (new THREE.Vector3(1.35,0.65,0));
    this.puntos.push (new THREE.Vector3(1.25,0.8,0));
    this.puntos.push (new THREE.Vector3(1,1.1,0));
    this.puntos.push (new THREE.Vector3(0.75,1.3,0));
    this.puntos.push (new THREE.Vector3(0.5,1.4,0));
    this.puntos.push (new THREE.Vector3(0.25,1.45,0));
    this.puntos.push (new THREE.Vector3(0.001,1.5,0));

    var geoBomba = new THREE.LatheGeometry(this.puntos, 24, 0, 2*Math.PI); //Array de perfil, segmentos, angulo inicial y longitud del gir
    //Me apetecia hacer la esfera con puntos porque soy un chulo sorry xd

    var bomba = new THREE.Mesh(geoBomba, material_bomba);
    bomba.position.y += 1.5;

    return bomba;
  }
  
  
  update () {
  }
}

export { Bomba }
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyRecorrido extends THREE.Object3D{
    constructor(gui) {
        super();
        

        // Parte del cono -  creacion, textura, creacion de maya, transformaciones y añadirlo
        var geometriaCono = new THREE.ConeGeometry(1.0,2.0,3);
        var textura = new THREE.TextureLoader().load('../imgs/textura-ajedrezada.jpg');
        var material = new THREE.MeshPhongMaterial( { map: textura } );
        this.cono = new THREE.Mesh(geometriaCono, material);
        this.cono.rotateX(0.5 * Math.PI);
        this.nave = new THREE.Object3D;
        this.nave.add(this.cono);

        this.add(this.nave);
        ///////////////////////////////////////////////////////////////////////////////////////
    
        // Definir camino que queremos que siga el cono
        this.spline = new THREE.CatmullRomCurve3( [
            new THREE.Vector3(0,3,0),
            new THREE.Vector3(5,2.5,1),
            new THREE.Vector3(6,5,-1),
            new THREE.Vector3(0,4,0),  // la mitad del recorrido
            new THREE.Vector3(-4,3,3),
            new THREE.Vector3(-5,4,2.5),
            new THREE.Vector3(0,3,0),
        ] );
    
        var geometriaLinea = new THREE.BufferGeometry(); //Crea geometria - es como geometria para definir 
        geometriaLinea.setFromPoints( this.spline.getPoints(100) ); 
        //Tomar vertices del spline - 100 es eñ número de puntos que consideres necesario para que la línea se aproxime 
        var material = new THREE.LineBasicMaterial( { color: 0x0F0F0F, linewidth: 5} ); //Darle material
        this.recorrido = new THREE.Line(geometriaLinea, material); //Crear malla con geometría y mat
        this.add(this.recorrido); //Añadir el recorrido
    
        var origen1 = {p: 0.0}; //Definir los tramos. P es %
        var destino1 = {p: 0.5};
    
        var origen2 = {p: 0.5};
        var destino2 = {p: 1};
        
        var posicion = this.spline.getPoint(origen1.p); //Colocamos objeto en punto p del spline
        this.nave.position.copy(posicion);
        var tangente = this.spline.getTangentAt(origen1.p); //Orientamos el obj
        posicion.add(tangente); 
        this.nave.lookAt(posicion);
    
        //Definicion dde la animacion: origen, destino, tiempo, y aceleracion al 
        // empezar y desaceleracion al acabar. onUpdate es update pero llamado solo cuando animacion este activa
        // es decir, para que haga la animacion, hace falta ese update 
        var movimiento1 = new TWEEN.Tween(origen1).to(destino1,3000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(()=>{
            posicion = this.spline.getPoint(origen1.p); //Modificar la pos a la nueva de origen
            this.nave.position.copy(posicion);
            tangente = this.spline.getTangentAt(origen1.p); //Modif orientacion
            posicion.add(tangente);
            this.nave.lookAt(posicion);
        });
    
        var movimiento2 = new TWEEN.Tween(origen2).to(destino2,3000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
            posicion = this.spline.getPoint(origen2.p);
            this.nave.position.copy(posicion);
            tangente = this.spline.getTangentAt(origen2.p);
            posicion.add(tangente);
            this.nave.lookAt(posicion);
        }).onComplete(()=>{movimiento1.start();}); //al terminar, repetir mov1

    
        movimiento1.chain(movimiento2); 
        movimiento1.start(); 
        //Estructura: primero 1, luego 2, luego 3 e iniciar movimientos
    
      }
    
      update() 
      {
        TWEEN.update(); //Actualizar los movimientos tween
      }
    }

export {MyRecorrido}

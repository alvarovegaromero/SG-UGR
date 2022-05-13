import * as THREE from '../libs/three.module.js'
import {Direcciones} from './Escena.js'

class Snake extends THREE.Object3D{
    
    constructor(dimensionesX, dimensionesY, tamMatrizX, tamMatrizY) {
        super();

        ///////////////////////////////
        // Definimos los tamaños de los cubos de la serpiente
        this.tamX = 1;
        this.tamY = 1;
        this.tamZ = 1;

        ///////////////////////////////
        // Control del inicio / fin del juego
        this.finJuego = false; // Booleano para avisar si se ha perdido el juego
        this.inicioJuego = true; // Esperamos que usuario de a un botón para jugar al juego

        ///////////////////////////////
        // Propiedades iniciales de la serpiente
        this.direccion = Direcciones.IZQUIERDA; // Inicialmente, la serpiente empieza mirando a la derecha
        this.velocidadSerpiente = 2; //Velocidad de la serpiente
        
        ///////////////////////////////
        //Crear estructuras para la gestion de la serpiente
        //Son como "pilas invertida" (el más antiguo - la cabeza, tiene el indice mas alto)
        this.segmentosSnake = []; //Guarda cada mesh que forma un segmento en el snake
    
        this.crearMatriz(tamMatrizX, tamMatrizY);

        ///////////////////////////////
        // Para controlar el movimiento de la serpiente
        this.reloj = new THREE.Clock(); 
        this.contadorSegundos = 1;

        ///////////////////////////////
        // CREAR LA CABESA - PIEZA INICIAL

        var cabezaGeometria = new THREE.BoxGeometry(this.tamX, this.tamY, this.tamZ);
        var cabezaMaterial = new THREE.MeshPhongMaterial({color: 0x2f89c2});
        var cabeza = new THREE.Mesh(cabezaGeometria, cabezaMaterial);

        cabeza.position.set(dimensionesX/2-this.tamX/2, dimensionesY/2-this.tamY/2, 0); //Colocarlo abajo e izquierda del centro. Posicion inicial
        
        this.add(cabeza);

        // Añadir cabeza a segmentosSnake y poner a TRUE que esta ocupada esa poisicion
        this.segmentosSnake.push(cabeza);
        this.matriz[this.conviertePosicionEnIndice(cabeza.position.x)][this.conviertePosicionEnIndice(cabeza.position.y)] = true;
    }

    conviertePosicionEnIndice(posicion){
        return (Math.trunc(posicion)-1);
    }

    crearMatriz(tamMatrizX, tamMatrizY){
        //Tendremos una matriz con booleanos. True es que hay un segmento de la serpiente ocupando esa casilla y false si no
        this.matriz = new Array(tamMatrizX);

        for(var i=0; i < this.matriz.length ; i++){
            this.matriz[i] = new Array(tamMatrizY);

            for(var j = 0 ; j < this.matriz[i].length ; j++){
                this.matriz[i][j] = false;
            }
        }
    }

    moverSerpiente() {

        var cabeza = this.segmentosSnake[this.segmentosSnake.length-1];

        console.log(cabeza.position.y);

        // Vamos de más a menos
        for(var i = this.segmentosSnake; i > 0 ; i--){
            // Mover los segmentos detras de la serpiente
        }

        //NOTA

        if (this.direccion == Direcciones.DERECHA)
            cabeza.position.x += this.tamX;

        if (this.direccion == Direcciones.IZQUIERDA)
            cabeza.position.x -= this.tamX;

        if (this.direccion == Direcciones.ARRIBA)
            cabeza.position.y += this.tamY;

        if (this.direccion == Direcciones.ABAJO)
            cabeza.position.y -= this.tamY;
    }

    empezarJuego(){
        this.inicioJuego = true;
    }

    perderJuego(){
        this.finJuego = true;
    }

    incrementarTamanio() { // Fruta asociada = Manzana
        
    }

    decrementarTamanio() { // Fruta asociada = Uva

    }

    aumentarVelocidad() { // Fruta asociada = Pera
        this.velocidadSerpiente += 0.1;
    }

    reducirVelocidad() {  // Fruta asociada = Naranja
        this.velocidadSerpiente -= 0.1; 
    }
    
    cambiarDireccion(direccion_elegida){

        // Evitar que el jugador quiera moverse en la misma dirección en la que se está
        // moviendo pero en diferente sentido. Es decir si:

        // Se está moviendo hacia arriba y le da hacia abajo, no hacer nada
        // Se está moviendo hacia derecha y le da hacia la izquierda, no hacer nada
        // Se está moviendo hacia abajo y le da hacia arriba, no hacer nada
        // Se está moviendo hacia izquierda y le da hacia la derecha, no hacer nada

        if (this.direccion == Direcciones.ARRIBA && direccion_elegida != Direcciones.ABAJO)
            this.direccion = direccion_elegida
            
        if (this.direccion == Direcciones.DERECHA && direccion_elegida != Direcciones.IZQUIERDA)
            this.direccion = direccion_elegida
            
        if (this.direccion == Direcciones.ABAJO && direccion_elegida != Direcciones.ARRIBA)
            this.direccion = direccion_elegida
            
        if (this.direccion == Direcciones.IZQUIERDA && direccion_elegida != Direcciones.DERECHA)
            this.direccion = direccion_elegida
    }

    comprobarChoqueSerpiente(){

    }

    comprobarChoqueMuro(){

    }

    update () {

        if(this.inicioJuego){ //Si se ha iniciado el juego
            if(!this.finJuego){ //Si no es fin del juego
                var segundosTranscurridos = this.reloj.getDelta(); //seg desde ultima llamada
    
                if(this.reloj.getElapsedTime()*this.velocidadSerpiente > this.contadorSegundos) 
                //Cada segundo (o más o menos en funcion de la velocidad), mueve la serpiente
                {
                    this.contadorSegundos += 1;
                    this.moverSerpiente();
                }
            }
        }

        //this.aguja.rotation.y -= this.guiControls.velocidad * (this.tam_marca * segundosTranscurridos);      
    }
}

export { Snake }

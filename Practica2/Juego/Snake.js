import * as THREE from '../libs/three.module.js'

class Snake extends THREE.Object3D{
    
    constructor(dimensionesX, dimensionesZ) {
        super();

        // Definimos los tamaños de los cubos de la serpiente
        this.tamX = 2.7;
        this.tamY = 1;
        this.tamZ = 2.8;
        
        // Enumerado para gestionar las direcciones del Snake
        this.Direcciones = {
            ARRIBA: 0,
            DERECHA: 1,
            ABAJO: 2,
            IZQUIERDA: 3
        }

        // Control del inicio / fin del juego
        this.finJuego = false; // Booleano para avisar si se ha perdido el juego
        this.inicioJuego = false; // Esperamos que usuario de a un botón para jugar al juego

        // Propiedades de la serpiente
        this.direccion = this.Direcciones.DERECHA; // Inicialmente, la serpiente empieza mirando a la derecha
        this.velocidadSerpiente = 1; //Velocidad de la serpiente
        
        //Posicion
        this.listaPosiciones = []; //Inicialmente solo tenemos la cabeza. Será como una "pila invertida" (el más antiguo, tiene el indice mas alto)

        this.segmentosSnake = 1; //Inicialmente solo tenemos un segmento, que es la cabeza. Conforme crezca, se incrementa
        
        this.crearMatriz(dimensionesX, dimensionesZ);

        ///////////////////////////////
        // CREAR LA CABESA - PIEZA INICIAL

        var cabezaGeometria = new THREE.BoxGeometry(this.tamX, this.tamY, this.tamZ);
        var cabezaMaterial = new THREE.MeshPhongMaterial({color: 0x2f89c2});
        cabezaGeometria.translate(-this.tamX/2, this.tamY/2, this.tamZ/2);
        var cabeza = new THREE.Mesh(cabezaGeometria, cabezaMaterial);
        this.add(cabeza);

        this.listaPosiciones.push([]);

        ///////////////////////////////

        this.reloj = new THREE.Clock(); // Para controlar el timing

    }

    crearMatriz(dimensionesX, dimensionesZ){
        //Tendremos una matriz con booleanos. True es que hay un segmento de la serpiente ocupando esa casilla y false si no
        this.matriz = new Array(dimensionesX+2); //+2 para el borde

        for(var i=0; i < this.matriz.length ; i++){
            this.matriz[i] = new Array(dimensionesZ+2); //+2 para el borde

            for(var j = 0 ; j < this.matriz[i].length ; j++){
                this.matriz[i][j] = false;
            }
        }
    }

    moverSerpiente() {

        var cabeza = this.listaPosiciones[this.segmentosSnake-1];

        for(var i = this.segmentosSnake-1; i > 0 ; i--) {
            this.listaPosiciones[i].position.x = 

        }

        if (this.direccion == this.Direcciones.DERECHA)
            this.listaPosiciones[0] += this.tamX;

        if (this.direccion == this.Direcciones.IZQUIERDA)
            this.listaPosiciones[0] -= this.tamX;

        if (this.direccion == this.Direcciones.ARRIBA)
            this.listaPosiciones[0] -= this.tamZ;

        if (this.direccion == this.Direcciones.ABAJO)
            this.listaPosiciones[0] += this.tamZ;
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

        if (this.direccion == this.Direcciones.ARRIBA && direccion_elegida != this.Direcciones.ABAJO)
            this.direccion = direccion_elegida
            
        if (this.direccion == this.Direcciones.DERECHA && direccion_elegida != this.Direcciones.IZQUIERDA)
            this.direccion = direccion_elegida
            
        if (this.direccion == this.Direcciones.ABAJO && direccion_elegida != this.Direcciones.ARRIBA)
            this.direccion = direccion_elegida
            
        if (this.direccion == this.Direcciones.IZQUIERDA && direccion_elegida != this.Direcciones.DERECHA)
            this.direccion = direccion_elegida
    }

    comprobarChoqueSerpiente(){

    }

    comprobarChoqueMuro(){

    }

    update () {

        if(!this.finDelJuego){ //Si no es fin del juego, que siga
            var segundosTranscurridos = this.reloj.getDelta(); //seg desde ultima llamada
        }
        //this.aguja.rotation.y -= this.guiControls.velocidad * (this.tam_marca * segundosTranscurridos);      
    }
}

export { Snake }

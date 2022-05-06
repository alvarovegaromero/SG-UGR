import * as THREE from '../libs/three.module.js'

class Snake extends THREE.Object3D{
    
    constructor() {
        super();

        // Definimos los tamaños de los cubos de la serpiente
        this.tamX = 5.5;
        this.tamY = 5.5;
        
        // Enumerado para gestionar las direcciones del Snake
        this.Direcciones = {
            ARRIBA: 0,
            DERECHA: 1,
            ABAJO: 2,
            IZQUIERDA: 3
        }

        // Control del inicio / fin del juego
        this.finDelJuego = false; // Booleano para avisar si se ha perdido el juego
        this.InicioDelJuego = false; // Esperamos que usuario de a un botón para jugar al juego

        // Propiedades de la serpiente
        this.direccion = this.Direcciones.DERECHA; // Inicialmente, la serpiente empieza mirando a la derecha
        this.velocidadSerpiente = 1; //Velocidad de la serpiente
        
        //Posicion
        this.listaPosiciones = []; //Inicialmente solo tenemos la cabeza

        this.numPosiciones = 1; //Inicialmente solo tenemos un segmento, que es la cabeza.
        


        ///////////////////////////////
        // CREAR LA CABESA - PIEZA INICIAL

        var cabezaGeometria = new THREE.BoxGeometry(this.tamX, this.tamY, 5);
        var cabezaMaterial = new THREE.MeshPhongMaterial({color: 0x2f89c2});
        cabezaGeometria.translate(-this.tamX/2,0,-this.tamX/2);
        var cabeza = new THREE.Mesh(cabezaGeometria, cabezaMaterial);
        this.add(cabeza);

        this.listaPosiciones.push(cabeza);

        ///////////////////////////////

        this.reloj = new THREE.Clock(); // Para controlar el timing

    }

    moverSerpiente() {

        if (this.direccion == this.Direcciones.DERECHA)
            this.listaPosiciones[0] += this.tamX;

        if (this.direccion == this.Direcciones.IZQUIERDA)
            this.listaPosiciones[0] -= this.tamX;

        if (this.direccion == this.Direcciones.ARRIBA)
            this.listaPosiciones[0] -= this.tamZ;

        if (this.direccion == this.Direcciones.ABAJO)
            this.listaPosiciones[0] += this.tamZ;
    }

    incrementarTamanio() { // Fruta asociada = Manzana
        
    }

    decrementarTamanio() { // Fruta asociada = Uva

    }

    aumentarVelocidad() { // Fruta asociada = Pera

    }

    reducirVelocidad() {  // Fruta asociada = Naranja
        
    }

    morir() { //Si la serpiente se choca con una pared o come una fruta prohibida, muere - Fruta asociada = Bomba
        
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

    update () {

        if(!this.finDelJuego){ //Si no es fin del juego, que siga
            var segundosTranscurridos = this.reloj.getDelta(); //seg desde ultima llamada
        }
        //this.aguja.rotation.y -= this.guiControls.velocidad * (this.tam_marca * segundosTranscurridos);      
    }
}

export { Snake }

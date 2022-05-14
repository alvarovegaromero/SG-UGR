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

        //Guardamos los tamaños de la matriz del tablero
        this.tamMatrizX = tamMatrizX;
        this.tamMatrizY = tamMatrizY;

        ///////////////////////////////
        // Control del inicio / fin del juego
        this.finJuego = false; // Booleano para avisar si se ha perdido el juego
        this.inicioJuego = true; // Esperamos que usuario de a un botón para jugar al juego
        //OJO INICIO A TRUE PARA PRUEBAS


        ///////////////////////////////
        // Propiedades iniciales de la serpiente
        this.direccion = Direcciones.DERECHA; // Inicialmente, la serpiente empieza mirando a la derecha
        this.velocidadSerpiente = 1; //Velocidad de la serpiente
        
        ///////////////////////////////
        //Crear estructuras para la gestion de la serpiente
        this.segmentosSnake = []; //Guarda cada mesh que forma un segmento en el snake
    
        // IMPORTANTE, la y es la fila, x la columna
        this.crearMatriz();

        ///////////////////////////////
        // Para controlar el movimiento de la serpiente
        this.reloj = new THREE.Clock(); 
        this.contadorSegundos = 1; //Velocidad inicial de la serpiente

        ///////////////////////////////
        // CREAR y COLOCAR LA CABESA - PIEZA INICIAL

        var cabezaGeometria = new THREE.BoxGeometry(this.tamX, this.tamY, this.tamZ);
        var cabezaMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00});
        var cabeza = new THREE.Mesh(cabezaGeometria, cabezaMaterial);

        cabeza.position.set(dimensionesX/2-this.tamX/2, dimensionesY/2-this.tamY/2, 0); //Colocarlo abajo e izquierda del centro. Posicion inicial
        
        this.add(cabeza);

        // Añadir cabeza a segmentosSnake y poner a TRUE que esta ocupada esa poisicion
        this.segmentosSnake.push(cabeza); //Metemos la cabeza lo primero

        //Marcamos la pos inicial como ocupada
        this.matriz[this.conviertePosicionEnIndice(cabeza.position.y)][this.conviertePosicionEnIndice(cabeza.position.x)] = true; 
    }

    // Destruir todos los meshes, geometrías y materiales de todos los segmentos de la serpiente
    eliminarSerpiente(){

        for (var i=0; i<this.segmentosSnake; i++){
            this.segmentosSnake[i].geometry.dispose();
            this.segmentosSnake[i].material.dispose();
        }
    }

    //Dada una posición con decimales, le eliminamos los decimales para convertirlo a entero y le restamos uno para ver su correspondencia en la matriz
    conviertePosicionEnIndice(posicion){
        return (Math.trunc(posicion)-1);
    }

    //Crea una matriz de booleanos. Una celda vale True si hay un segmento de la serpiente ocupando esa casilla y false si no.
    // IMPORTANTE, la y es la fila, x la columna
    crearMatriz(){
        this.matriz = new Array(this.tamMatrizY);

        for(var i = 0; i < this.tamMatrizY ; i++){
            this.matriz[i] = new Array(this.tamMatrizX);

            for(var j = 0 ; j < this.tamMatrizX ; j++){
                this.matriz[i][j] = false;
            }
        }
    }

    //Permite obtener la columna ocupada en la matriz por la cabeza
    getColumnaCabeza(){
        return this.conviertePosicionEnIndice(this.segmentosSnake[0].position.x);
    }
    
    //Permite obtener la fila ocupada en la matriz por la cabeza
    getFilaCabeza(){
        return this.conviertePosicionEnIndice(this.segmentosSnake[0].position.y);
    }

    
    enseniaMatriz(){
        for(var j = 0; j < this.tamMatrizX; j++){
            if(this.matriz[7][j] === true)
                console.log('1 -[',7,'][',j,'] ');
        }
    }
    
    
    // Permite mover a la serpiente en la posición que le indique el parámetro dirección
    moverSerpiente() {

        var cabeza = this.segmentosSnake[0];
        var cola = this.segmentosSnake[this.segmentosSnake.length-1];

        //Poner la última casilla como no usada (se quedará vacia)
        this.matriz[this.conviertePosicionEnIndice(cola.position.y)][this.conviertePosicionEnIndice(cola.position.x)] = false; 

        // Desplazar todas las casillas hacia la izquierda, haciendo que sigan la cabeza
        for(var i = this.segmentosSnake.length-1; i > 0; i--){
            this.segmentosSnake[i].position.x = this.segmentosSnake[i-1].position.x; 
            this.segmentosSnake[i].position.y = this.segmentosSnake[i-1].position.y;
        }

        if (this.direccion == Direcciones.DERECHA) 
            cabeza.position.x += this.tamX;

        else if (this.direccion == Direcciones.IZQUIERDA) 
            cabeza.position.x -= this.tamX;

        else if (this.direccion == Direcciones.ARRIBA)
            cabeza.position.y += this.tamY;

        else if (this.direccion == Direcciones.ABAJO)
            cabeza.position.y -= this.tamY;

        console.log(this.conviertePosicionEnIndice(cabeza.position.y)," ", this.conviertePosicionEnIndice(cabeza.position.x));

        this.matriz[this.conviertePosicionEnIndice(cabeza.position.y)][this.conviertePosicionEnIndice(cabeza.position.x)] = true; 
        this.enseniaMatriz();

            /*
        console.log(this.conviertePosicionEnIndice(cabeza.position.x)," - ", this.conviertePosicionEnIndice(cabeza.position.y));
        console.log(this.matriz[this.conviertePosicionEnIndice(cabeza.position.x)][this.conviertePosicionEnIndice(cabeza.position.y)]);
        console.log(this.matriz[this.conviertePosicionEnIndice(cabeza.position.x)+1][this.conviertePosicionEnIndice(cabeza.position.y)+1]);
*/
        //Marcar la nueva casilla como usada
    }

    empezarJuego(){
        this.inicioJuego = true;
    }

    perderJuego(){
        this.finJuego = true;
    }

    // Incrementa el tamaño del snake.
    incrementarTamanio() { // Fruta asociada = Manzana
        var cola = this.segmentosSnake[this.segmentosSnake.length-1];

        var geometria = new THREE.BoxGeometry(this.tamX, this.tamY, this.tamZ);
        var material = new THREE.MeshPhongMaterial({color: 0x0000FF});
        var segmento = new THREE.Mesh(geometria, material);

        segmento.position.set(cola.position.x, cola.position.y, 0); //Colocarlo abajo e izquierda del centro. Posicion inicial
        
        this.add(segmento);

        //Marcar como ocupado
        this.matriz[this.conviertePosicionEnIndice(segmento.position.y)][this.conviertePosicionEnIndice(segmento.position.x)] = true; 

        // Añadir cabeza a segmentosSnake y poner a TRUE que esta ocupada esa poisicion
        this.segmentosSnake.push(segmento); //Metemos la cabeza lo primero
    }

    // Decrementa el tamaño del snake. En caso de ser muy pequeño, se pierde la partida
    decrementarTamanio() { // Fruta asociada = Uva
        
        // Evitar no decrementar demasiado la serpiente
        var tam_segmentosSnake = this.segmentosSnake.length;
        if (tam_segmentosSnake>1){
            
            // Eliminar geometría, material y el propio objeto
            this.segmentosSnake[tam_segmentosSnake-1].geometry.dispose();
            this.segmentosSnake[tam_segmentosSnake-1].material.dispose();
            this.remove(this.segmentosSnake[tam_segmentosSnake-1]);
            this.segmentosSnake.pop();
        }
        else{ // Si la serpiente solo tiene la cabeza se acaba el juego
            this.perderJuego();
        }
    }

    //Aumenta la velocidad del Snake
    aumentarVelocidad() { // Fruta asociada = Pera
        if(this.velocidadSerpiente < 5) //Solo si es hay algo de velocidad, permitir reducirla
            this.velocidadSerpiente += 0.5;
    }

    //Reduce la velocidad del Snake
    reducirVelocidad() {  // Fruta asociada = Naranja
        if(this.velocidadSerpiente > 0.5) //Solo si es hay algo de velocidad, permitir reducirla
            this.velocidadSerpiente -= 0.5;
    }
    
    //Permite cambiar la dirección a la que se dirige el snake
    cambiarDireccion(direccion_elegida){

        // Evita que el jugador quiera moverse en la misma dirección en la que se está
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

    //Comprueba si la posicion a la que va a ir está ocupada por otra ficha del snake. Si está ocupada, devuelve true
    comprobarChoqueSerpiente(){

    }

    //Comprueba si la posicion a la que va a ir la cabeza, es un muro. Si es muro, devuelve true
    comprobarChoqueMuro(fila, columna){
        if((fila < 0) || (fila > this.tamMatrizX)){
            return true; //Hay choque horizontalmente
        }
        else if((columna < 0) || (columna > this.tamMatrizY)){
            return true;
        }
        else{ 
            return false;
        }
    }

    update () {

        if(this.inicioJuego && !this.finJuego){ //Si se ha iniciado el juego y no ha terminado
            if(this.reloj.getElapsedTime()*this.velocidadSerpiente > this.contadorSegundos) 
            //Cada segundo (o más o menos en funcion de la velocidad), mueve la serpiente
            {
                this.contadorSegundos += 1;
                this.moverSerpiente();

                
                if(this.comprobarChoqueMuro( this.getFilaCabeza(),this.getColumnaCabeza() ))
                    console.log("CHOQUEEEE");
            
                if (this.contadorSegundos > 3 && this.contadorSegundos <= 4)
                    this.incrementarTamanio();

                else if (this.contadorSegundos > 4 && this.contadorSegundos <= 5)
                    this.incrementarTamanio();

                else if (this.contadorSegundos > 5 && this.contadorSegundos <= 6)
                    this.incrementarTamanio();    
/*                        
                else if (this.contadorSegundos > 6 && this.contadorSegundos <= 7)
                    this.incrementarTamanio();
                
                else if (this.contadorSegundos > 7 && this.contadorSegundos <= 8)
                    this.incrementarTamanio();   
*/
            }
        }
    }
}

export { Snake }

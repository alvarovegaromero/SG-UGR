import * as THREE from '../libs/three.module.js'
import {Direcciones} from './Escena.js'
import {ValoresMatriz} from './Escena.js'

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
        this.finPartida = false; // Booleano para avisar si se ha perdido el juego
        //OJO INICIO A TRUE PARA PRUEBAS


        ///////////////////////////////
        // Propiedades iniciales de la serpiente
        this.direccion = Direcciones.DERECHA; // Inicialmente, la serpiente empieza mirando a la derecha
        this.velocidadSerpiente = 0.5; //Velocidad de la serpiente
        
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
        this.matriz[this.conviertePosicionEnIndice(cabeza.position.y)][this.conviertePosicionEnIndice(cabeza.position.x)] = ValoresMatriz.SERPIENTE; 
    }

    clearMessage(){
        document.getElementById ("Messages").innerHTML = "";
    }

    setMessage (str) {
        document.getElementById ("Messages").innerHTML += "<h2>"+str+"</h2>";
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
                this.matriz[i][j] = ValoresMatriz.VACIO;
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
    
    // Permite mover a la serpiente en la posición que le indique el parámetro dirección
    moverSerpiente() {

        var cabeza = this.segmentosSnake[0];
        var cola = this.segmentosSnake[this.segmentosSnake.length-1];

        //Poner la última casilla como no usada (se quedará vacia)

        if(!this.hecreadosegmento)
            this.matriz[this.conviertePosicionEnIndice(cola.position.y)][this.conviertePosicionEnIndice(cola.position.x)] = ValoresMatriz.VACIO; 

        // Desplazar todas las casillas hacia la izquierda, haciendo que sigan la cabeza
        for(var i = this.segmentosSnake.length-1; i > 0; i--){
            this.segmentosSnake[i].position.x = this.segmentosSnake[i-1].position.x; 
            this.segmentosSnake[i].position.y = this.segmentosSnake[i-1].position.y;
        }

        //En función de la dirección, mover la cabeza hacia ese sitio.
        if (this.direccion == Direcciones.DERECHA) 
            cabeza.position.x += this.tamX;

        else if (this.direccion == Direcciones.IZQUIERDA) 
            cabeza.position.x -= this.tamX;

        else if (this.direccion == Direcciones.ARRIBA)
            cabeza.position.y += this.tamY;

        else if (this.direccion == Direcciones.ABAJO)
            cabeza.position.y -= this.tamY;

    }

    //Una vez se ha movido la cabeza. Comprobar si todo ha ido bien, y si es así, marca la casilla de la cabeza como ocupada
    procesarCasilla(){
        //console.log(this.matriz[this.getFilaCabeza()][this.getColumnaCabeza()]);
        console.log(this.getFilaCabeza(),this.getColumnaCabeza());

        if(this.comprobarChoqueMuro(this.getFilaCabeza(), this.getColumnaCabeza()))
            this.perderJuego();
        else if (this.comprobarCasillaOcupada(this.getFilaCabeza(), this.getColumnaCabeza()))
            this.perderJuego();
        else if (this.getCeldaMatriz(this.getFilaCabeza(), this.getColumnaCabeza()) != ValoresMatriz.VACIO)
            console.log("MMMM QUE RICO");
        else
            this.matriz[this.getFilaCabeza()][this.getColumnaCabeza()] = ValoresMatriz.SERPIENTE;   
    }

    //Comprueba si la posicion a la que va a ir la cabeza, es un muro. Si es muro, devuelve true
    comprobarChoqueMuro(fila, columna){
        if((fila < 0) || (fila >= this.tamMatrizX)){
            return true; //Hay choque horizontalmente
        }
        else if((columna < 0) || (columna >= this.tamMatrizY)){
            return true;
        }
        else{ 
            return false;
        }
    }

    perderJuego(){ //Además, pieza asociada = bomba
        this.finPartida = true;

        this.clearMessage();
        this.setMessage("¡HAS PERDIDO!");
        this.setMessage("Pulsa R para reiniciar");
    }

    // Comprueba si una casilla de la matriz está ocupada. Si lo está, detectamos que ha habido un choque
    comprobarCasillaOcupada(fila, columna){
        if(this.matriz[fila][columna] === ValoresMatriz.VACIO)
            return false;
        else
            return true;
    }

    // Incrementa el tamaño del snake.
    incrementarTamanio() { // Fruta asociada = Manzana
        var cola = this.segmentosSnake[this.segmentosSnake.length-1];

        var geometria = new THREE.BoxGeometry(this.tamX, this.tamY, this.tamZ);
        var material = new THREE.MeshPhongMaterial({color: 0x0000FF});
        var segmento = new THREE.Mesh(geometria, material); 
        
        segmento.position.set(cola.position.x, cola.position.y, 0); //Colocarlo abajo e izquierda del centro. Posicion inicial
        
        //Marcar como ocupado
        this.matriz[this.conviertePosicionEnIndice(segmento.position.y)][this.conviertePosicionEnIndice(segmento.position.x)] = ValoresMatriz.SERPIENTE;

        this.add(segmento);

        this.hecreadosegmento = true;

        // Añadir cabeza a segmentosSnake y poner a TRUE que esta ocupada esa poisicion
        this.segmentosSnake.push(segmento); //Metemos la cabeza lo primero
    }

    // Decrementa el tamaño del snake. En caso de ser muy pequeño, se pierde la partida
    decrementarTamanio() { // Fruta asociada = Uva
        var cola = this.segmentosSnake[this.segmentosSnake.length-1];
        
        if (this.segmentosSnake.length>1){
            
            this.matriz[this.conviertePosicionEnIndice(cola.position.y)][this.conviertePosicionEnIndice(cola.position.x)] = ValoresMatriz.VACIO; 
            
            // Eliminar geometría, material y el propio objeto
            cola.geometry.dispose();
            cola.material.dispose();
            this.remove(cola);
            this.segmentosSnake.pop();
        }
        else{ // Si la serpiente solo tiene la cabeza se acaba el juego
            this.perderJuego();
        }
    }

    //Aumenta la velocidad del Snake
    aumentarVelocidad() { // Fruta asociada = Pera
        if(this.velocidadSerpiente < 2) //Solo si es hay algo de velocidad, permitir reducirla
            this.velocidadSerpiente += 0.25;
    }

    //Reduce la velocidad del Snake
    reducirVelocidad() {  // Fruta asociada = Naranja
        if(this.velocidadSerpiente > 0.25) //Solo si es hay algo de velocidad, permitir reducirla
            this.velocidadSerpiente -= 25;
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

    /*
    Comprueba si la posicion a la que va a ir está ocupada por otra segmento del snake. Si está ocupada, devuelve true
    comprobarChoqueSerpiente(fila, columna){   
        var choque = false;
        for (var i = 1; i < this.segmentosSnake.length && !choque; i++){           
            if ((fila===this.segmentosSnake[i].position.y) && (columna===this.segmentosSnake[i].position.x))
                choque = true;
        }
        return choque;
    }
    */

    setCeldaMatriz(fila, columna, valor){
        this.matriz[fila][columna] = valor;
    }

    getCeldaMatriz(fila, columna){
        return this.matriz[fila][columna];
    }

    comprobarComerComida(){
        // Obtener posición de la cabeza
        // Comprobar si en dicha posición, en la matriz, se encuentra una fruta
        // - Si hay fruta, eliminarla de la matriz y ejecutar la función correspondiente

        var pos_x = this.getFilaCabeza();
        var pos_y = this.getColumnaCabeza();

        if (this.getCeldaMatriz(pos_x, pos_y) != (ValoresMatriz.VACIO && ValoresMatriz.SERPIENTE))
            console.log("MMMM QUE RICO");
    }


    update () {

        if(!this.finPartida){ //Si no se ha terminado la partida actual
            if(this.reloj.getElapsedTime()*this.velocidadSerpiente > this.contadorSegundos) 
            //Cada 0.1 segundos (o más o menos en funcion de la velocidad), mueve la serpiente
            {
                this.contadorSegundos += 0.1;
            
                /*
                if (this.contadorSegundos > 3 && this.contadorSegundos <= 4)
                {
                    this.incrementarTamanio();
                }

                else if (this.contadorSegundos > 4 && this.contadorSegundos <= 5)
                {
                    this.incrementarTamanio();
                }
      
                else if (this.contadorSegundos > 5 && this.contadorSegundos <= 6)
                {
                    this.incrementarTamanio();
                    
                }

                else if (this.contadorSegundos > 6 && this.contadorSegundos <= 7)
                {
                    this.incrementarTamanio();
                }

                else if (this.contadorSegundos > 7 && this.contadorSegundos <= 8)
                {
                    this.hecreadosegmento = false;
                    //this.decrementarTamanio();
                }
                
                else if (this.contadorSegundos > 15 && this.contadorSegundos <= 16)
                {
                    this.decrementarTamanio();
                }                
                else if (this.contadorSegundos > 15 && this.contadorSegundos <= 16)
                    this.decrementarTamanio();   */

                this.moverSerpiente();
                this.procesarCasilla();
            }
        }
    }
}

export { Snake }

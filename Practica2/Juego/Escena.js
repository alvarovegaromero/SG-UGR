
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

// Clases de mi proyecto

import { Manzana } from './Modelos/Manzana.js'
import { Uva } from './Modelos/Uva.js'
import { Naranja } from './Modelos/Naranja.js'
import { Pera } from './Modelos/Pera.js'
import { Bomba } from './Modelos/Bomba.js'
import { Snake } from './Snake.js'

//import { PedunculoNaranja } from './Modelos/pedunculoNaranja.js' - Hacemos import en naranja

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

  const factor_conversion_mapa = 1.0125;

 class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor (myCanvas) { 
    super();

    this.tamTableroX = 17;
    this.tamTableroY = 17;
    
    this.numeroCasillasX = 16;
    this.numeroCasillasY = 16;

    this.renderer = this.createRenderer(myCanvas);
    
    this.gui = this.createGUI ();
    
    this.createLights ();
    
    this.createCamera ();

    this.createAudio ();
    
    this.createGround ();
    
    /* Ejes de coordenadas. No los usaremos pero los dejo para referencias futuras
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
    */
    
    this.inicioJuego = false;

    this.clearMessage();
    this.setMessage("Pulsa R para iniciar el juego");
    this.setMessage("Creado por: David Correa y Álvaro Vega");

    /*
    //this.snake = new Snake(this.tamTableroX, this.tamTableroY, this.numeroCasillasX, this.numeroCasillasY);
    //this.add(this.snake);

    //this.model = new Bomba();
    //this.model = new Naranja();
    //this.model = new Uva();
    //this.model = new Manzana();
    //this.model = new Pera();
    
    //this.add (this.model);
    */
  }

  // Enseñar un mensaje por pantalla
  clearMessage(){
    document.getElementById ("Messages").innerHTML = "";
  }

  setMessage (str) {
    document.getElementById ("Messages").innerHTML += "<h2>"+str+"</h2>";
  }

  createAudio(){
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    var that = this;
    this.sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./Musica/CancionSnake.mp3',
    function (buffer){
      that.sound.setBuffer(buffer);
      that.sound.setLoop(true);
      that.sound.setVolume(0.5);
    });
  }

  cambiarMusica(){
    if (this.sound.isPlaying)
      this.sound.pause();
    else
      this.sound.play();
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    //this.camera.position.set (this.tamTableroX/2, this.tamTableroY/2, 22.5); //Colocarlo en el eje y para ver el mapa desde arriba
    this.camera.position.set (8, 8, 22.5); //Colocarlo en el eje y para ver el mapa desde arriba

    // Y hacia dónde mira
    //var look = new THREE.Vector3 (this.tamTableroX/2,this.tamTableroY/2,0);
    var look = new THREE.Vector3 (8,8,0);

    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    
    /* Para poder mover la cam. Lo comento para quitarlo
    Pero lo dejo por si tuvieramos que ver algo */
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
    
  }

  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (this.tamTableroX,this.tamTableroY, 0.2); 
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('./Imagenes/cesped3.0.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.z = -0.1;

    ground.position.x += this.tamTableroX/2;
    ground.position.y += this.tamTableroY/2;


    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante una   new function()
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.4,
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz ambiental');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 0, 0, 60 ); //Desde la camara a abajo
    this.add (this.spotLight);
  }
  
  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
    
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update(); //- Comentado no permite hacer zoom con rueda

    if(this.inicioJuego) //Si ha iniciado, haz el update del snake
    {
      this.procesarComida();
      this.snake.update();
    }
    
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }

  leerTeclado (evento) {
    var x = evento.which || evento.keyCode; //Ver que tecla se pulsó

    if (x == '77')
      this.cambiarMusica();

    if(this.inicioJuego) //Si se ha iniciado el juego (y hay una snake), permitir que se pueda modificar la dirección del snake
    {
      if(x == '87'){ //Pulsar la W
        this.snake.cambiarDireccion(Direcciones.ARRIBA);
      }
      else if(x == '83'){ //Pulsar la S
        this.snake.cambiarDireccion(Direcciones.ABAJO);
      }
      else if(x == '65'){ //Pulsar la A
        this.snake.cambiarDireccion(Direcciones.IZQUIERDA);
      }
      else if(x == '68'){ // Pulsar la D
        this.snake.cambiarDireccion(Direcciones.DERECHA);
      }
    }
    
    if(x == '82'){ // Pulsar la R. Permite iniciar y reiniciar el juego

      if (this.inicioJuego){ //Si ya habia una partida antes, borrala las cosas que habia
        this.snake.eliminarSerpiente();
        this.remove(this.snake); // Borrar de DOM

        this.eliminarFrutas(); //Eliminar material y geometría de las frutas

        /////////////////////////////////////////////////////////////////// 
        this.renderer.renderLists.dispose(); // PREGUNTAR SI ESTA BIEN Y SI ES NECESARI ESTA LIN    A  //Borrar de memoria
        ///////////////////////////////////////////////////////////////////
      }      

      this.clearMessage();
      this.setMessage("Las posibles frutas son:");
      
      this.setMessage("-Manzana: Aumentar tamaño");
      this.setMessage("-Pera: Aumentar velocidad");

      this.setMessage("-Uva: Reducir tamaño");
      this.setMessage("-Naranja: Reducir velocidad");
      this.setMessage("-Bomba: Game Over");
      
      this.inicioJuego = true;
      this.snake = new Snake(this.tamTableroX, this.tamTableroY, this.numeroCasillasX, this.numeroCasillasY);

      this.crearFrutas();
      
      this.add(this.snake);
    }
  }

  procesarComida(){
    var fila_cabeza = this.snake.getFilaCabeza();
    var columna_cabeza = this.snake.getColumnaCabeza();

    var casilla = this.snake.getCeldaMatriz(fila_cabeza, columna_cabeza);

    if (casilla === ValoresMatriz.MANZANA){
        this.snake.incrementarTamanio();
        this.snake.setCeldaMatriz(fila_cabeza, columna_cabeza, ValoresMatriz.VACIO);
        this.manzana.destruirManzana();
        this.remove(this.manzana);

        var celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
        this.crearManzana(celda.pos_y, celda.pos_x);
    }
    else if (casilla === ValoresMatriz.UVA){
      this.snake.decrementarTamanio();
      this.snake.setCeldaMatriz(fila_cabeza, columna_cabeza, ValoresMatriz.VACIO);
      this.uva.destruirUva();
      this.remove(this.uva);

      var celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
      this.crearUva(celda.pos_y, celda.pos_x);
    }
    else if (casilla === ValoresMatriz.PERA){
      this.snake.aumentarVelocidad();
      this.snake.setCeldaMatriz(fila_cabeza, columna_cabeza, ValoresMatriz.VACIO);
      this.pera.destruirPera();
      this.remove(this.pera);

      var celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
      this.crearPera(celda.pos_y, celda.pos_x);
    }
    else if (casilla === ValoresMatriz.NARANJA){
      this.snake.reducirVelocidad();
      console.log(this.snake.velocidadSerpiente);
      this.snake.setCeldaMatriz(fila_cabeza, columna_cabeza, ValoresMatriz.VACIO);
      this.naranja.destruirNaranja();
      this.remove(this.naranja);

      var celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
      this.crearNaranja(celda.pos_y, celda.pos_x);
    }
    else if (casilla === ValoresMatriz.BOMBA){
      this.snake.setCeldaMatriz(fila_cabeza, columna_cabeza, ValoresMatriz.VACIO);
      this.snake.perderJuego();
      this.bomba.destruirBomba();
      this.remove(this.bomba);
    }
  }

  //Obtiene una celda vacia, dada un limite de x y limite de y
  obtenerCeldaRandomVacia(max1, max2){
    
    do {
      var pos_x = Math.floor(Math.random() * max1);
      var pos_y = Math.floor(Math.random() * max2);
    } while (this.snake.getCeldaMatriz(pos_y, pos_x) != ValoresMatriz.VACIO); // obtener casilla aleatoria que no esté ocupada 


    return {pos_x, pos_y}; // floor devuelve entero
  }

  // Crea todas las frutas en posiciones aleatorias
  crearFrutas(){

    // NOTA IMPORTANTE: Recordamos que la y para nosotros son las filas y la x
    // son las columnas, por eso invertimos los parámetros
    var celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
    this.crearManzana(celda.pos_y, celda.pos_x);
    
    celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
    this.crearPera(celda.pos_y, celda.pos_x);

    celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
    this.crearUva(celda.pos_y, celda.pos_x);

    celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
    this.crearNaranja(celda.pos_y, celda.pos_x);

    celda = this.obtenerCeldaRandomVacia(this.numeroCasillasY, this.numeroCasillasX);
    this.crearBomba(celda.pos_y, celda.pos_x);
  }
  
  eliminarFrutas(){
      this.manzana.destruirManzana();
      this.remove(this.manzana);
      
      this.pera.destruirPera();
      this.remove(this.pera);

      this.uva.destruirUva();
      this.remove(this.uva);

      this.naranja.destruirNaranja();
      this.remove(this.naranja);

      this.bomba.destruirBomba();
      this.remove(this.bomba);
  }

  crearManzana(fila, columna){
    // Reflejar en la matriz que se ha añadido la fruta
    console.log(fila,columna);
    this.snake.setCeldaMatriz(fila, columna, ValoresMatriz.MANZANA);
    console.log(this.snake.getCeldaMatriz(fila, columna));

    this.manzana = new Manzana();
    
    this.manzana.position.set(factor_conversion_mapa*columna, factor_conversion_mapa*fila, 0);

    this.add (this.manzana);
  }

  crearUva(fila, columna){
    this.snake.setCeldaMatriz(fila, columna, ValoresMatriz.UVA);

    this.uva = new Uva();
    this.uva.position.set(factor_conversion_mapa*columna, factor_conversion_mapa*fila, 0);

    this.add (this.uva);
  }

  crearPera(fila, columna){
    this.snake.setCeldaMatriz(fila, columna, ValoresMatriz.PERA);

    this.pera = new Pera();
    this.pera.position.set(factor_conversion_mapa*columna, factor_conversion_mapa*fila, 0);

    this.add(this.pera);
  }

  crearBomba(fila, columna){
    this.snake.setCeldaMatriz(fila, columna, ValoresMatriz.BOMBA);

    this.bomba = new Bomba();
    this.bomba.position.set(factor_conversion_mapa*columna, factor_conversion_mapa*fila, 0);

    this.add(this.bomba);
  }

  crearNaranja(fila, columna){
    this.snake.setCeldaMatriz(fila, columna, ValoresMatriz.NARANJA);

    this.naranja = new Naranja();
    this.naranja.position.set(factor_conversion_mapa*columna, factor_conversion_mapa*fila, 0);


    this.add (this.naranja);
  }
}

// Matriz de Snake con enteros
// 0 - libre
// 1 - serpentina
// this.snake.metodo cambiar matriz y ahi la vaina
// 2 - manzana
// 3 - naranja
// 4 - pera
// 5 - uva
// 6 - bomba

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener ("keydown", (event) => scene.leerTeclado(event)); //Cuando se pulse la tecla, salta el listener

  // Que no se nos olvide, la primera visualización.
  scene.update();
});

///////////////////////////////
// Enumerado para gestionar las direcciones del Snake
var Direcciones = {
    ARRIBA: 0,
    DERECHA: 1,
    ABAJO: 2,
    IZQUIERDA: 3
}

// Representa el significado de un valor en la matriz del tablero.
var ValoresMatriz = {
  VACIO: 0,
  SERPIENTE: 1,
  MANZANA: 2,
  NARANJA: 3,
  PERA: 4,
  UVA : 5,
  BOMBA : 6
}

export { Direcciones, ValoresMatriz}
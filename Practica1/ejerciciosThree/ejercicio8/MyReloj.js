import * as THREE from '../libs/three.module.js'

class MyReloj extends THREE.Object3D{
    constructor(gui, titleGui){
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Creamos primero esta parte ya que otros métodos usan las variables que se definen para la interfaz

        this.createGUI(gui, titleGui);

        // Materiales a usar
        // Rojo
        var mat_rojo = new THREE.MeshPhongMaterial({color: 0xFF0000});
        // Verde
        var mat_verde = new THREE.MeshPhongMaterial({color: 0x00FF00 });

        //Crear geometría de las esferas (las distintas bolas que aparecen)
        var geoesferas_verdes = new THREE.SphereGeometry(1,20,20); //radio, segmentos al ancho y segmentos al largo
        geoesferas_verdes.translate(13, 0, 0); //Un poco de más separacion contra la esfera roja

        var geoesfera_roja = new THREE.SphereGeometry(1,20,20); //distinta geometría para añadirle la traslacion y tener un solo nodo para la rotacion
        geoesfera_roja.translate(10, 0, 0); //Pegarlo a la esfera de la derecha

        // Creamos la aguja y la añadimos
        this.aguja = new THREE.Mesh(geoesfera_roja, mat_rojo); //Esfera de color rojo que se mueve
        this.add(this.aguja);

        this.tam_marca = (Math.PI * 2 / 12); //rotacion para una marca

        // Creamos las "horas" y las posicionamos
        for(var i = 0; i < 12; i++)
        {
            var marca = new THREE.Mesh(geoesferas_verdes, mat_verde);
            marca.rotation.y = (i * tam_marca);
            //Rotarla sobre el eje Y, hacer una doceava parte de una vuelta y multiplicarlo por la "zona" (i) que le corresponda
            this.add(marca);
        }

        // Para Velocidad independiente del objeto
        this.reloj = new THREE.Clock();

        // Otra forma
        //this.tiempoAnterior = Date.now();

    }

    createGUI(gui, titleGui){

        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function (){
            this.velocidad = 1; //1 marca por s
        }

        var folder1 = gui.addFolder (titleGui);

        folder1.add(this.guiControls, 'velocidad', -12.0, 12, 1.0).name ('Velocidad marcas/s: ').listen(); //entre -12/+12 marcas/se, aumentando en +-1 m/s

    }

    update(){
        //  Con independencia de cómo se escriban las 3 lineas siguientes, el orden en el que se aplican las transformaciones es:
        //  1º. Escalado
        //  2º. Rotación en Z
        //  3º. Rotación en Y
        //  4º. Rotación en X
        //  5º. Traslaciones

        // La otra forma
        //var tiempoActual = Date.now();
        //var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        var segundosTranscurridos = this.reloj.getDelta(); //seg desde ultima llamada  - para velocidad comun independiente del procesamiento de frames
        this.aguja.rotation.y -= this.guiControls.velocidad * (this.tam_marca * segundosTranscurridos);
        //se supone que en 1s recorre una marca, pero como puede ser menos o más, hay que ver cuanto recorre en ese tiempo
        //- porque es sentido de las agujas del reloj
        //espacio = velocidad x tiempo


        //this.tiempoAnterior = tiempoActual;
    }
}

export {MyReloj}

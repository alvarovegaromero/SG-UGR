import * as THREE from '../libs/three.module.js'

class MyPendulo extends THREE.Object3D{
    constructor(gui, titleGui){
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Creamos primero esta parte ya que otros métodos usan las variables que se definen para la interfaz

        this.createGUI(gui, titleGui);

        // Materiales a usar
        this.materialrojo = new THREE.MeshPhongMaterial({color: 0xFF0000});
        this.materialverde = new THREE.MeshPhongMaterial({color: 0x00FF00 });
        this.materialazul = new THREE.MeshPhongMaterial({color: 0x0000FF});
        this.materialamarillo = new THREE.MeshPhongMaterial({color: 0xFFFF00});

        // Grosor y anchura de las cajas

        var boxGeomP = new THREE.BoxGeometry(4.0, 1.0, 1.0); //Ancho, largo y profundo - Geometría del rectangulo del fondo
        var boxGeomS = new THREE.BoxGeometry(2.0, 1.0, 1.0); //Geometria del rectangulo azul

        // Ponemos la parte de arriba de las geometrias en el plano XZ. OJO Al escalar, lo hace para abajo
        boxGeomP.translate(0, -0.5, 0);
        boxGeomS.translate(0, -0.5, 0);

        // Construimos el pendulo principal
        this.PPpartearriba = new THREE.Mesh(boxGeomP, this.materialverde);
        this.PPpartearriba.scale.y = 4.0; //Altura de 4 para las partes constantes - la de arriba se mantiene su posicion

        this.PPpartemedio = new THREE.Mesh(boxGeomP, this.materialrojo);
        this.PPpartemedio.scale.y = 1.0 * this.guiControls.PPlongitud; //Escalarlo tanto como la variable de la GUI diga
        this.PPpartemedio.position.y = -4.0; //Quitarle la altura de la parte arriba para que este siempre debajo

        this.PPparteabajo = new THREE.Mesh(boxGeomP, this.materialverde);
        this.PPparteabajo.scale.y = 4.0;
        this.PPparteabajo.position.y = -4.0 - 1.0 * this.guiControls.PPlongitud; //Quitarle la altura de la parte de arriba y de la del medio

        // Su punto de giro
        var ejeGeomPP = new THREE.CylinderGeometry(1.0, 1.0, 1.5, 20); //radio inf y sup, altura y segmentos
        ejeGeomPP.rotateX(Math.PI/2); //Que mire al eje "Z"
        ejeGeomPP.translate(0,-2, 0); //Colocarlo en medio de la parte de arriba
        this.PPeje = new THREE.Mesh(ejeGeomPP, this.materialamarillo); //Construirlo

        // Montamos la figura - Pendulo principal
        this.PPnodo = new THREE.Object3D(); //Estructura con todas las partes
        this.PPnodo.add(this.PPpartearriba); //Juntar en un nodo la PP
        this.PPnodo.add(this.PPparteabajo);
        this.PPnodo.add(this.PPpartemedio);
        this.PPnodo.add(this.PPeje);

        // Segundo péndulo
        this.PSparteprincipal = new THREE.Mesh(boxGeomS, this.materialazul); //La parte azul
        this.PSparteprincipal.scale.y = 1.0 * this.guiControls.PSlongitud; //La escalamos por el valor que hayamos puesto en la interfaz
        this.PSparteprincipal.position.z = 1.0; //Lo ponemos delante del otro pendulo (el otro tenía longitud z fija a 1)

        // Su punto de giro (el circulo amarillo)
        var ejeGeomPS = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 20);
        ejeGeomPS.rotateX(Math.PI/2);
        ejeGeomPS.translate(0, -1, 0.125+1.5); //0.125 - pasar eje Y, 1.5 - 1 de PS y 0.5 de PP
        this.PSeje = new THREE.Mesh(ejeGeomPS, this.materialamarillo);

        // Monto la figura 2
        this.PSnodo = new THREE.Object3D(); //Juntar en un nodo el eje y la parte azul
        this.PSnodo.add(this.PSparteprincipal);
        this.PSnodo.add(this.PSeje);

        // Ajusto la colocación
        this.PSnodo.position.y += 1.0; //Colocar algo sobre zona verde de arriba - lo hacemos aqui por el orden de aplicar transformaciones (en siguiente escalamos)

        this.PSaux = new THREE.Object3D(); //nuevo nodo para mover la y del secundario entre el 10% y 90% de PP
        this.PSaux.add(this.PSnodo);
        //this.PSaux.position.y = ((this.guiControls.PSposicion/100)*this.guiControls.PPlongitud); //

        // Añadimos el nodo Secundario al primario
        this.PPnodo.add(this.PSaux);

        this.add(this.PPnodo); //Añadimos al modelo el nodo principal
        this.PPnodo.position.y += 2; //Sumamos 2 a todo (ahora todo esta en el PP XD)
    }

    createGUI(gui, titleGui){

        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function ()
        { //Estas son las variables que usaremos
            this.PPlongitud = 5; //valores iniciales
            this.PPgiro = 0;

            this.PSlongitud = 10;
            this.PSposicion = 10;
            this.PSgiro = 0;

            // Boton para dejarlo todo en su estado incial - Al pulsarlo ejecuta la funcion inferior
            this.reset = function(){
                this.PPlongitud = 5;
                this.PPgiro = 0;

                this.PSlongitud = 10;
                this.PSposicion = 10; //empieza en 10%
                this.PSgiro= 0;
            }
        }

        // Creamos una sección para los controles de la caja
        var folder = gui.addFolder ("Primer Péndulo"); //Seccion para el primer péndulo

        // Estas líneas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método listen() permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
        folder.add(this.guiControls, 'PPlongitud', 5.0, 10.0, 0.1).name ('Longitud : ').listen(); //Longitud entre 5 y 10 y pasando de 0.1 en 0.1
        folder.add(this.guiControls, 'PPgiro', -Math.PI/4, Math.PI/4, 0.1).name ('Rotación superior : ').listen(); //-45º y 45º


        var folder2 = gui.addFolder("Segundo Péndulo");

        folder2.add (this.guiControls, 'PSlongitud', 10.0, 20.0, 0.1). name('Longitud : ').listen();
        folder2.add (this.guiControls, 'PSposicion', 10, 90, 0.1).name ('Posicion (%): ').listen(); //entre 10 y 90%
        folder2.add (this.guiControls, 'PSgiro', -Math.PI/4, Math.PI/4, 0.1).name ('Rotacion inferior: ').listen();

        gui.add(this.guiControls, 'reset').name ('[ Restaurar ]');

    }

    update(){
        //  Con independencia de cómo se escriban las 3 lineas siguientes, el orden en el que se aplican las transformaciones es:
        //  1º. Escalado
        //  2º. Rotación en Z
        //  3º. Rotación en Y
        //  4º. Rotación en X
        //  5º. Traslaciones

        this.PPpartemedio.scale.y = 1.0 * this.guiControls.PPlongitud; //Las variables originales, las actualizamos por los valores de la gui
        this.PPparteabajo.position.y = -4.0 - 1.0 * this.guiControls.PPlongitud;
        this.PSparteprincipal.scale.y = 1.0 * this.guiControls.PSlongitud;
        this.PSaux.position.y =  - 4.0 - ((this.guiControls.PSposicion/100) * this.guiControls.PPlongitud); //Mover todo el PS

        this.PSaux.rotation.z = this.guiControls.PSgiro; //Rotar pendulo S
        this.rotation.z = this.guiControls.PPgiro; //Rotar todo lo que cuelgue
    }
}

export {MyPendulo}

class Aliado extends ObjetoDinamico {
    sprite;
    enemigo;
    distanciaParaLlegar = 300;
    // tengoAlgunEnemigoAdelante;
    // enemigoMasCerca;
    constructor(x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        this.fuerza = 1;

        // this.tengoAlgunEnemigoAdelante = false;
        // this.enemigoMasCerca = null;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        //this.estoyMuerto = false

        this.generarNombreAleatorio();
        this.generarSpriteDe(sprite);
        //console.log(this.nombreCompleto, "se ha generado, siendo un " , this.constructor.name ," con un nivel de ira de", this.nivelDeIraReal, ".")
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.container.x = this.x;
        this.container.y = this.y;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.scale.x = this.scaleX;

        //Añadir el sprite dentro del stage:
        this.container.addChild(this.sprite);
    }

    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    mensajeDeMuerte() {
        return console.log("El aliado ", this.nombreCompleto," ha muerto")
    }

    direccionDeAvance() {
        return 1;
    }

    obtenerLista() {
        return this.juego.enemigos;
    }

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto()
    }

    tick() {
        this.verificarSiMori();
        this.decidirAtacarOAvanzar();
        this.aplicarFisica();
        this.render();
    }
}
class Avion extends ObjetoDinamico {
    constructor (x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX) {
        super(x, y, juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;
        this.container.x = x;
        this.container.y = y;

        //this.tipo = tipo || Math.floor(Math.random() * 2) + 1; por si tenemos imagenes en donde sólo varien el nombre 
        //this.container.label = "aliado" + this.id;

        this.generarSpriteDe(sprite);
    }

    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.zIndex = 200

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.scale.x = this.scaleX;

        //Añadir el sprite dentro del stage:
        // this.juego.containerPrincipal.addChild(this.sprite);
        // this.juego.pixiApp.stage.addChild(this.sprite);
        this.container.addChild(this.sprite);
        this.juego.containerPrincipal.addChild(this.container);
    }

    //ACTUALIZACION DE LA POSICION:

    //actualiza la posicion del contenedor segun la posicion del objeto dinamico
    actualizarPosDelContainerSegunPosDelObjeto() {
        if (!this.container) return;
        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
    }

    // actualizarPosDelSpriteSegunPosDelObjeto(){
    //     this.sprite.x = this.posicion.x;
    //     this.sprite.y = this.posicion.y;
    // }

    terminoViaje() {
        //if(this.posicion.x >= this.screen.width) {
            
        //}
        return(this.posicion.x >= (this.juego.width + 50))
    }


    //Sistema de actualización de zindex del sprite (no funciona y no es necesario)
    encontrarEnemigoMásActual() {
        this.enemigos = this.juego.enemigos
        this.enemigoMasActual = this.enemigos[this.enemigos.length - 1]
    }
    
    actualizarZindex() {
        //this.enemigos = this.juegoPrincipal.enemigos
        if (!this.juego.enemigos) {
            this.sprite.zIndex = 200
        }
        else {
            this.encontrarEnemigoMásActual()
            console.log(this.enemigoMasActual)
            this.sprite.zIndex = this.enemigoMasActual.sprite._zIndex + 1
            console.log("z index del enemigo más actual ", this.enemigoMasActual.sprite._zIndex)
        }

        console.log("z index del avion:", this.sprite.zIndex)
    }

    render() {
        // this.actualizarPosDelSpriteSegunPosDelObjeto();
        this.actualizarPosDelContainerSegunPosDelObjeto();
        //this.actualizarZindex();
    }

    tick() {
        //if (this.estoyMuerto()) return;
        if (this.estoyMuerto) return;
        this.aceleracion.x = 1;
        this.terminoViaje();
        this.aplicarFisica();
        this.render();
    }
}
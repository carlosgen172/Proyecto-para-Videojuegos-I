class Enemigo extends ObjetoDinamico {
    sprite;
    enemigoDeBandoContrario;
    distanciaParaLlegar = 300;
    constructor(x, y, juego, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX) {
        super(x, y, juego, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

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

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.scale.x = this.scaleX;

        //Añadir el sprite dentro del stage:
        this.juego.stage.addChild(this.sprite);
    }

    actualizarPosDelSpriteSegunPosDelObjeto(){
        this.sprite.x = this.posicion.x;
        this.sprite.y = this.posicion.y;
    }

    asignarTargetA(alguien) {
        this.enemigo = alguien
    }

    detenerAlEncontrarEnemigo() {
        if (!this.enemigoDeBandoContrario) return ;
        if (!this.enemigoDeBandoContrario in this.juego.enemigos) return ;
        const distanciaDeEnemigo = calcularDistancia(this, this.enemigoDeBandoContrario)
        if(distanciaDeEnemigo > this.radioVision) return ;

        // Decaimiento exponencial: va de 1 a 0 a medida que se acerca
        let factor = Math.pow(dist / this.distanciaParaLlegar, 3);

        const difX = this.target.posicion.x - this.posicion.x;
        const difY = this.target.posicion.y - this.posicion.y;

        let vectorTemporal = {
            x: -difX,
            y: -difY,
        };
        vectorTemporal = limitarVector(vectorTemporal, 1);

        this.aceleracion.x += -vectorTemporal.x * factor;

        this.aplicarFriccion()
    }

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto()
        this.aplicarFisica();
    }

    tick() {
        this.render();
        this.detenerAlEncontrarEnemigo()
    }
}
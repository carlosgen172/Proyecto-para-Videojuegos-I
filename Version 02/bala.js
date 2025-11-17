class Bala extends ObjetoDinamico {
    constructor (x, y, juegoPrincipal, width, height, sprite, radioColision, radioVision, velocidad, velMaxima, aceleracion, acelMaxima, scaleX, personaQueEfectuoDisparo) {
        super(juegoPrincipal, width, height);
        this.radioColision = radioColision;
        this.radioVision = radioVision;
        this.velocidad = { x: velocidad, y: velocidad}; // Velocidad en píxeles/frame
        this.velMaxima = velMaxima;
        this.aceleracion = { x: aceleracion, y: aceleracion}; // Aceleración en píxeles/frame²
        this.acelMaxima = acelMaxima;
        this.scaleX = scaleX || 1; //para hacer más ancho al pj
        this.vida = 1;
        this.personaQueEfectuoDisparo = personaQueEfectuoDisparo; //al disparar, le pasas como parámetro la instancia de persona que efectuo el disparo
        this.x = personaQueEfectuoDisparo.x
        this.y = personaQueEfectuoDisparo.y

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
        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    actualizarPosDelSpriteSegunPosDelObjeto(){
        this.sprite.x = this.posicion.x;
        this.sprite.y = this.posicion.y;
    }

    seFueDePantalla() { //condición para que se vea también de eliminar el objeto al llegarse a salir de pantalla.
        return(this.posicion.x >= (this.juego.width + 10))
    }

    haColisionadoConAlgúnEnemigo() {
        let tengoAlgunEnemigoAdelante = false;
        let enemigoMasCerca = null;
        for (const enemigo of this.juego.personas) { //para que haya fuego amigo (se puede cambiar a que no haya y se fije según el equipo de la persona que efectuó el disparo)
            const distanciaDeEnemigo = calcularDistancia(this.posicion, enemigo.posicion)
            if (distanciaDeEnemigo < Math.random() * 5) {
                tengoAlgunEnemigoAdelante = true;
                enemigoMasCerca = enemigo;
                if(enemigoMasCerca.verificarSiMori()) {
                    tengoAlgunEnemigoAdelante = false
                    enemigoMasCerca = null
                }
                break;
            }
        }
    }

    analizarTrayectoriaDeDisparo() {
        if(this.personaQueEfectuoDisparo in this.juego.aliados) {
            this.aceleracion.y = 1;
        }
        else if(this.personaQueEfectuoDisparo in this.juego.enemigos) {
            this.aceleracion.x = -1;
        }
    }
    

    render() {
        this.actualizarPosDelSpriteSegunPosDelObjeto();
    }

    verificarSiMori() {
        if (this.vida <= 0 || this.seFueDePantalla() || this.haColisionadoConAlgúnEnemigo()) {
            this.morir();
            return ;
        }
    }

    tick() {
        if (this.estoyMuerto) return;
        this.analizarTrayectoriaDeDisparo();
        this.seFueDePantalla();
        this.haColisionadoConAlgúnEnemigo();
        this.aplicarFisica();
        this.render();
    }
}
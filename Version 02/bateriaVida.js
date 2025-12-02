class BateriaVida extends GameObject {
    width;
    height;
    x;
    y;
    juego;
    sprite;
    estado;
    texturaActual;
    bateriaActual;
    limiteDeEnemigos = 100;
    contadorEnemigos = 0;

    constructor(width, height, x, y, juego, sprite, segundoSprite, tercerSprite, cuartoSprite) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        // this.posicion = {x: x, y: y};
        this.width = width;
        this.height = height;
        this.juego = juego;

        this.sprites = {
            1: sprite, //full vida
            2: segundoSprite,
            3: tercerSprite,
            4: cuartoSprite //vida vacía
        }
    }

    async init() {
        this.texturaActual = this.sprites[1];
        await this.generarSpriteDe(this.bateriaActual);

        this.bateriaActual = this.sprite;
    }

    async generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);

        //Ajustes de anchura
        this.sprite.anchor.set(0.5);

        //Ajuste de ubicacion
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.zIndex = 1100;

        //Añadir el sprite dentro del stage:
        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    actualizarSpriteSegunSaludDelJugador() {

        this.verificacionDeCantidadDeEnemigosInvasores();

        if (this.contadorEnemigos < 33) {
            this.bateriaActual.texture = this.sprites[1];
        }
        else if (this.contadorEnemigos < 66) {
            this.bateriaActual.texture = this.sprites[2];
        }
        else if (this.contadorEnemigos < 99) {
            this.bateriaActual.texture = this.sprites[3];
        }
        else if (this.contadorEnemigos >= this.limiteDeEnemigos){
            this.bateriaActual.texture = this.sprites[4];
        }
    }

    verificacionDeCantidadDeEnemigosInvasores() {
        
        for (const enemigo of this.juego.enemigos) {
            if (enemigo.container.x < - 50 && !enemigo.yaContado) {
                this.contadorEnemigos++;
                enemigo.yaContado = true;
            }
        }
    }

    tick() {
        this.juego.gameOver();
        this.actualizarSpriteSegunSaludDelJugador();
    }
}
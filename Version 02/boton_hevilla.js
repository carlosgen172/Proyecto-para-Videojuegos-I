class BotonHevilla extends Boton {
    spriteActual;
    keys = {};
    

    constructor(width, height, x, y, sprite, urlSprite, direccion, juego) {
        super(width, height, x, y, juego, sprite);
        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));
        this.direccion = direccion;
        this.segundoSprite = urlSprite;
        this.sprites = {
            //1 : "imagenes/hevilla_" + this.direccion + ".png",
            //2 : "imagenes/hevilla_" + this.direccion + "_pres.png"
            1 : sprite,
            2 : urlSprite
        }
        this.spriteActual = this.sprites[1];
        //console.log(this.spriteActual);

        this.generarSpriteDe(urlSprite);
        this.generarSpriteDe(this.spriteActual);
    }

    keysDown(letra){
        this.keys[letra.key.toLowerCase()] = true;
        this.cambiarSpriteAInteractuadoPor(letra);
    }

    keysUp(letra){
        this.keys[letra.key.toLowerCase()] = false;
        this.cambiarSpriteANoInteractuadoPor(letra);
    }

    cambiarSpriteAInteractuadoPor(letra) {
        if(letra.key.toLowerCase() === "q" && this.direccion == "izq" || letra.key.toLowerCase() === "e" && this.direccion == "der") {
            //this.haSidoInteractuado = !this.haSidoInteractuado
            this.spriteActual = this.sprites[2];
            this.generarSpriteDe(this.spriteActual);
            console.log("el sprite de la hevilla con dirección: ", this.direccion , "ha cambiado a: ", this.spriteActual);
        }
        //console.log(this.keys);
        //this.generarSpriteDe(this.spriteActual);
    }
    cambiarSpriteANoInteractuadoPor(letra) {
        if(letra.key.toLowerCase() === "q" || letra.key.toLowerCase() === "e") {
            this.spriteActual = this.sprites[1];
            this.generarSpriteDe(this.spriteActual);
            console.log("el sprite de la hevilla con dirección: ", this.direccion, "ha cambiado a: ", this.spriteActual)
       }
        /*
        if(letra.key.toLowerCase() === "q" || letra.key.toLowerCase() === "e") {
            //this.haSidoInteractuado = !this.haSidoInteractuado
        }
        */
       //console.log(this.spriteActual);
       //console.log(this.keys);
       //this.generarSpriteDe(this.spriteActual);
    }

    tick() {
        //this.cambiarCondicionSiCorresponde();
        //this
        //this.cambiarSpriteAInteractuadoPor(unaLetra);
        //this.cambiarSpriteANoInteractuado();
        //this.generarSpriteDe(this.spriteActual);
        //console.log(this.spriteActual);
    }
}
class BotonHevilla extends Boton {
    spriteActual;
    keys = {};
    

    constructor(width, height, x, y, sprite, urlSprite, direccion, juego) {
        super(width, height, x, y, juego, sprite);
        this.direccion = direccion;
        this.segundoSprite = urlSprite;
        this.sprites = {
            1 : sprite,
            2 : urlSprite
        }
        this.spriteActual = this.sprites[1];
        //console.log(this.spriteActual);
        //console.log("poderes del jugador: ", this.juego)
        console.log("poder actual: ", this.juego.poderActual)

        //this.generarSpriteDe(urlSprite);
        this.generarSpriteDe(this.spriteActual);
    }

    // keysDown(letra){
    //     this.keys[letra.key.toLowerCase()] = true;
    //     //this.cambiarSpriteAInteractuadoPor(letra);
    // }

    // keysUp(letra){
    //     this.keys[letra.key.toLowerCase()] = false;
    //     //this.cambiarSpriteANoInteractuadoPor(letra);
    // }

    // cambiarSpriteAInteractuadoPor(letra) {
    //     if(letra.key.toLowerCase() === "q" && this.direccion == "izq" || letra.key.toLowerCase() === "e" && this.direccion == "der") {
    //         //this.haSidoInteractuado = !this.haSidoInteractuado
    //         this.spriteActual = this.sprites[2];
    //         this.generarSpriteDe(this.spriteActual);
    //         this.cambiarPoderaALaIzq();
    //         console.log("el sprite de la hevilla con dirección: ", this.direccion , "ha cambiado a: ", this.spriteActual);
    //     }
    //     //console.log(this.keys);
    //     //this.generarSpriteDe(this.spriteActual);
    // }
    // cambiarSpriteANoInteractuadoPor(letra) {
    //     if(letra.key.toLowerCase() === "q" || letra.key.toLowerCase() === "e") {
    //         this.spriteActual = this.sprites[1];
    //         this.generarSpriteDe(this.spriteActual);
    //         this.cambiarPoderALaDer()
    //         console.log("el sprite de la hevilla con dirección: ", this.direccion, "ha cambiado a: ", this.spriteActual.name)
    //     }
    //     /*
    //     if(letra.key.toLowerCase() === "q" || letra.key.toLowerCase() === "e") {
    //         //this.haSidoInteractuado = !this.haSidoInteractuado
    //     }
    //     */
    //    //console.log(this.spriteActual);
    //    //console.log(this.keys);
    //    //this.generarSpriteDe(this.spriteActual);
    // }


    rolarPoderHacia_(direccion) {
        //if(this.juego.poderActual == this.juego.poderes[0]) return;
        let indicePoderActual = this.juego.poderes.indexOf(this.juego.poderActual) + direccion;
        console.log("índice poder actual antes de ajuste:", indicePoderActual)
        if(indicePoderActual < 0) {
            indicePoderActual = this.juego.poderes.length - 1;
            console.log("dando la vuelta a los poderes:", indicePoderActual)
        }
        else if(indicePoderActual >= this.juego.poderes.length) {
            indicePoderActual = 0;
            console.log("dando la vuelta a los poderes parte 2:", indicePoderActual)
        }
        this.juego.poderActual = this.juego.poderes[indicePoderActual]
        console.log("poderes disponibles: ", this.juego.poderes)
        console.log("poder actual:", this.juego.poderActual)

        this.juego.actualizarVisibilidadDePoderActual();
        if(direccion == 1) {
            this.juego.botonDer.spriteActual = this.juego.botonDer.sprites[2];
            this.juego.botonDer.generarSpriteDe(this.spriteActual);
        }
        else if(direccion == -1) {
            this.juego.botonIzq.spriteActual = this.juego.botonIzq.sprites[2];
            this.juego.botonIzq.generarSpriteDe(this.spriteActual);
        }
    }

    // cambiarPoderALaDer() {
    //     if(this.juego.poderActual == this.juego.poderes[-1]) return ;
    //     this.juego.poderActual = this.juego.poderes[this.juego.poderActual + 1]
    //     console.log("poderes disponibles: ", this.juego.poderes)
    //     console.log("poder actual:", this.juego.poderActual)
    // }

    tick() {
        //this.cambiarCondicionSiCorresponde();
        //this.cambiarSpriteAInteractuadoPor(unaLetra);
        //this.cambiarSpriteANoInteractuado();
        //this.generarSpriteDe(this.spriteActual);
        //console.log(this.spriteActual);
    }
}
class Menu extends GameObject {
    width;
    height;
    x;
    y;
    sprite;
    juego;
    /*
    ordenPresentacion = {
        1: "inicio",
        2: "explicación mecánicas",
        3: "final"
    }
    */

    presentacionTextual = [
        'LIBERTY',
        'Bienvenido a Liberty, en este juego tomas el papel de Pancho, el líder de un grupo rebelde, el cual se encagará de poner fin a la malvada dictadura de su padre, el señor Maidana.',
        'Para esto, deberás derrotas a su temible horda de enemigos, oleada por oleada.',
        'Consigue la mayor cantidad de enemigos derrotados y avanza hacia la victoria!!'
        
        ]

    indiceActual = 0
    
    constructor(width, height, x, y, juego, juegoPrincipal, sprite) {
        super();
        this.width = width;
        this.height = height;
        this.x = x
        this.y = y
        this.posicion = {x: x, y: y};

        this.juego = juego;
        this.juegoPrincipal = juegoPrincipal
        //this.cantClicks = 0

        //this.generarSpriteDe(sprite);
        this.generarTexto();
        //this.textoActual.interactive = true
        console.log("texto a mostrar:", this.textoActual)
        this.textoActual.zIndex = 300000

        //console.log("indice actual",indiceActual)
    }

    async generarTexto() {
        /*
        const presentacionTextual = [
        'LIBERTY',
        'Bienvenido a Liberty, en este juego tomas el papel de Pancho, el líder de un grupo rebelde, el cual se encagará de poner fin a la malvada dictadura de su padre, el señor Maidana.',
        'Fin de la presentación.'
        ]

        let indiceActual = 0
        */
        this.textoActual = new PIXI.Text(
            this.presentacionTextual[this.indiceActual], 
            //presentacionTextual[indiceActual],
            {
                fontSize: 50,
                fill: "white"
            }
        )
        this.textoActual.anchor.set(0.5);
        this.textoActual.x = this.juego.screen.width / 2;
        this.textoActual.y = this.juego.screen.height / 2;
        this.juego.stage.addChild(this.textoActual);
    }


    generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);
        this.sprite.anchor.set(0.5);
        //Ajuste de ubicacion
        //this.sprite.x = this.juego.mouse.posicion.x;
        //this.sprite.y = this.juego.mouse.posicion.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        //Ajuste de tamaño
        this.sprite.width = this.width;
        this.sprite.height = this.height;

        this.juego.stage.addChild(this.sprite);
    }

    

    realizarPresentacion() {
        //if(this.juegoPrincipal.mouse.apretado == false) {
            if (!this.textoActual) return;
            if(this.textoActual == null) return;
            if(this.indiceActual >= 3) {
                setTimeout(() => {
                // Elimina el elemento del contenedor padre (por ejemplo, app.stage)
                this.juego.stage.removeChild(this.textoActual);
                // Opcionalmente, puedes desvincularlo de la escena para liberar memoria
                //this.destroy();
                },1); 
            }
            this.indiceActual = (this.indiceActual + 1) % this.presentacionTextual.length
            
            //this.indiceActual = (this.indiceActual + 1).Math.min(this.presentacionTextual.length)
            //this.indiceActual = this.indiceActual + 1
            this.textoActual.text = this.presentacionTextual[this.indiceActual] 
            this.textoActual.fontSize = 20
            //console.log("funciona?")
        //} 
    }
    
    /*
    realizarPresentacion() {
        //console.log(this.juego)
        if(this.juegoPrincipal.mouse.apretado == false) {
            this.cantClicks += 1
        }
        if (!this.textoExplicativo && this.cantClicks > 0) return;
        this.juego.stage.removeChild(this.textoExplicativo)
        if (this.cantClicks == 0) {
            this.textoExplicativo = new PIXI.Text(
                'LIBERTY',
                {
                    fontSize: 50,
                    fill: 'white'
                }
            )
        }
        else if (this.cantClicks == 1) {
            this.textoExplicativo = new PIXI.Text(
                'Bienvenido a Liberty, en este juego...',
                {
                    fontSize: 50,
                    fill: 'white'
                }
            )
        }
        else if (this.cantClicks == 2) {
            this.textoExplicativo = new PIXI.Text(
                'Mecánicas',
                {
                    fontSize: 50,
                    fill: 'white'
                }
            )
        }
        else {
            this.textoExplicativo = new PIXI.Text(
                'Fin de explicación',
                {
                    fontSize: 50,
                    fill: 'white'
                }
            )
        }


        this.textoExplicativo.anchor.set(0.5);
        this.textoExplicativo.x = this.juego.screen.width / 2;
        this.textoExplicativo.y = this.juego.screen.height / 2;
        this.juego.stage.addChild(this.textoExplicativo);
        //... configuraciones del texto que van a aparecer progresivamente al presionar la tecla Q
        /*
        setTimeout(() => {
            // Elimina el elemento del contenedor padre (por ejemplo, app.stage)
            this.juego.stage.removeChild(this.textoExplicativo);
            // Opcionalmente, puedes desvincularlo de la escena para liberar memoria
            this.destroy();
        }, 5000); 
        /
    }
    */

    tick() {
        //this.realizarPresentacion()
    }
}
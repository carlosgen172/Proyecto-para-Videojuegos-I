class Menu extends GameObject {
    x;
    y;
    juego;
    width;
    height;
    sprite;
    pantallaActual;
    puedeCambiarPasandoMousePorArriba = true;

    presentacionTextual = [
        'LIBERTY',
        'Bienvenido a Liberty, en este juego tomas el papel de Pancho, el líder de un grupo rebelde, el cual se encagará de poner fin a la malvada dictadura de su padre, el señor Maidana.',
        'Para esto, deberás derrotas a su temible horda de enemigos, oleada por oleada.',
        'Consigue la mayor cantidad de enemigos derrotados y avanza hacia la victoria!!'

    ];

    constructor(x, y, juego) {
        super(x, y, juego);
        this.x = x;
        this.y = y;
        this.juego = juego;
        // this.width = width;
        // this.height = height;
        this.posicion = { x: x, y: y };

        //this.cantClicks = 0

        //this.generarTexto();
        //this.textoActual.interactive = true
        //this.textoActual.zIndex = 2900

        // this.container = new PIXI.Container();
        // this.container.name = this.container.name;
        // this.container.x = x;
        // this.container.y = y;
        
        // this.juego.pixiApp.stage.addChild(this.container);
    }

    async init() {
        //se hace textura para poder manejar la visibilidad de las pantallas

        this.sprite = this.juego.pantallas[0];
        await this.generarSpriteDe(this.sprite);

        this.pantallaActual = this.sprite;

        this.indiceActual = 0;
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
        this.juego.pixiApp.stage.addChild(this.textoActual);
    }


    async generarSpriteDe(unSprite) {
        this.sprite = new PIXI.Sprite(unSprite);

        this.sprite.anchor.set(0.5);
        //Ajuste de ubicacion

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.juego.pixiApp.stage.addChild(this.sprite);
        // this.container.addChild(this.sprite);
        // this.juego.pixiApp.stage.addChild(this.container);
    }

    cambiarPantalla(indiceDestino) {
        this.indiceActual = indiceDestino; // con esto vamos a la pantalla deseada
        const nuevaPantalla = this.juego.pantallas[indiceDestino]; // guardamos la nueva pantalla a ir
        this.pantallaActual.texture = nuevaPantalla; //cambiamos la textura de la pantalla actual
        console.log("Pantalla actual:", indiceDestino);
    }

    ocultarPantalla() {
        this.pantallaActual.visible = false;
    }

    mostrarPantalla() {
        this.pantallaActual.visible = true;
    }

    moverPantallaAdelante() {
        this.pantallaActual.zIndex = 5500;
    }

    realizarPresentacion() {
        //if(this.juegoPrincipal.mouse.apretado == false) {
        if (!this.textoActual) return;
        if (this.textoActual == null) return;
        if (this.indiceActual >= 3) {
            setTimeout(() => {
                // Elimina el elemento del contenedor padre (por ejemplo, app.stage)
                this.juego.stage.removeChild(this.textoActual);
                // Opcionalmente, puedes desvincularlo de la escena para liberar memoria
                //this.destroy();
            }, 1);
        }
        this.indiceActual = (this.indiceActual + 1) % this.presentacionTextual.length

        //this.indiceActual = (this.indiceActual + 1).Math.min(this.presentacionTextual.length)
        //this.indiceActual = this.indiceActual + 1
        this.textoActual.text = this.presentacionTextual[this.indiceActual]
        this.textoActual.fontSize = 20
        //console.log("funciona?")
        //} 
    }

    tick() {

    }
}
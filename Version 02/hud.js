class HUD {

    constructor(juego){
        this.margen = 8
        this.juego = juego
        this.container = new PIXI.Container();
        this.juego.pixiApp.stage.addChild(this.container)
        this.posX = this.juego.width - (this.juego.width/5)
        this.fuenteTexto = {
            fontSize: 30,
            fontFamily: "PixelifySans",
            fill: 0xffffff,
            fontWeight: "bold",
            stroke: { color: 0x444444, width: 3 },
            align: "center",
            //zIndex: 1100
        }
        this.crearTextoEnemigosAbatidos();
        this.resize();
    }
    
    async generarIcono() {
        const texturaIcono = await PIXI.Assets.load("imagenes/enemigos_eliminados_final.png")
        this.sprite = new PIXI.Sprite(texturaIcono);
        
        this.sprite.anchor.set(0.5);
        
        //Ajuste de ubicacion
        this.sprite.x = this.posX;
        this.sprite.y = this.margen;
        this.sprite.zIndex = 1100

        //Ajuste de tamaño
        this.sprite.width = 36;
        this.sprite.height = 36;
        this.sprite.scale.x = 1;

        //Añadir el sprite dentro del stage:
        this.juego.pixiApp.stage.addChild(this.sprite);
    }

    crearTextoEnemigosAbatidos() {
        this.textoEnemigosAbatidos = new PIXI.Text({text: "",  style: this.fuenteTexto})
        this.textoEnemigosAbatidos.anchor.set(1, 0)
        this.container.addChild(this.textoEnemigosAbatidos)
    }

    resize() {
        //this.textoEnemigosAbatidos.x = this.juego.width - (this.juego.width/5)
        this.textoEnemigosAbatidos.x = this.posX
        this.textoEnemigosAbatidos.y = this.margen
        //this.textoEnemigosAbatidos.zIndex = 2900;
        this.container.zIndex = 2900
    }

    actualizarContadorDeEnemigosMuertos() {
        //console.log("La fuente que está siendo usada: ", this.fuenteTexto)
        // if(!this.juego.enemigos) {
        //     this.textoEnemigosAbatidos = 0
        // } else {
        // this.textoEnemigosAbatidos.text = this.juego.enemigos[0].cantEnemigosMuertos.toString();
        this.textoEnemigosAbatidos.text = this.juego.enemigosMuertos.length.toString()
        //}
        //console.log( this.juego.enemigos[0].cantEnemigosMuertos)
        //console.log("Los enemigos abatidos: ", this.textoEnemigosAbatidos.toString())
    }

    tick() {
        if (!this.textoEnemigosAbatidos) return; 
        this.actualizarContadorDeEnemigosMuertos()
    }
}
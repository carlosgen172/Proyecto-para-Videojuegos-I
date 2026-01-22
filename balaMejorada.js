class BalaMejorada extends GameObject {
    radioColision;
    delayMuerte = 2000; //tiempo que se calcula para la desaparición automática de la bala. :J
    constructor(x, y, juego, width, height, velocidad, scaleX, personaQueEfectuoDisparo) {
        super(x, y, juego);
        this.posicion = { x: x, y: y };
        this.width = width;
        this.height = height;
        this.vida = 1;
        this.estoyMuerto = false;

        //Radio de colision para el sistema de colisiones y de daño:
        this.radioColision = 32;

        //Velocidad y aceleración:
        this.velocidad = { x: velocidad, y: velocidad }; // Velocidad en píxeles/frame

        //sistema de escala:
        this.scaleX = scaleX || 1; //para hacer más ancho al pj

        //Valores que se les pasa a la bala para saber que persona efectuó el disparo:
        this.personaQueEfectuoDisparo = personaQueEfectuoDisparo;
        this.x = this.personaQueEfectuoDisparo.posicion.x
        this.y = this.personaQueEfectuoDisparo.posicion.y

        this.posicion = { x: this.x, y: this.y };

        this.dañoAInflingir = this.personaQueEfectuoDisparo.verCuantaFuerzaTengo();

        //se crea el contenedor del sprite:
        this.container = new PIXI.Container();
        this.container.name = this.constructor.name;

        //Nombre del disparador y condicionales en base a la misma:
        this.seleccionarColorSegunEquipo();

        //Generación del sprite:
        this.generarSprite();

        //Y agregado del container al escenario:
        this.juego.containerPrincipal.addChild(this.container);

        // //Selección de dirección de propulsión:
        // this.salirPropulsado();
        this.morirPorTiempo();
    }

    seleccionarColorSegunEquipo() {
        this.nombreDelDisparador = this.personaQueEfectuoDisparo.constructor.name
        if (this.nombreDelDisparador == "Aliado") {
            this.color = "green";
        } else if (this.nombreDelDisparador == "Jugador") {
            this.color = "blue";
        } else {
            this.color = "red";
        }
    }

    morirPorTiempo() {
        setTimeout(() => {this.morir()}, this.delayMuerte);
    }

    haColisionadoConAlguien() {
        if (this.estoyMuerto) return;

        const listaObjetivos = this.personaQueEfectuoDisparo.obtenerLista();
        //debugger;
        for (let posibleObjetivo of listaObjetivos) {
            const distanciaDeEnemigo = calcularDistancia(this.posicion, posibleObjetivo.posicion)
            if (distanciaDeEnemigo < this.radioColision) {
                posibleObjetivo.recibirDaño();
                this.morir();
                // this.objetivoColisionado = posibleObjetivo;
                // this.pegarAlObjetivoColisionado();
                break;
            }
        }
    }

    pegarAlObjetivoColisionado() {
        this.objetivoColisionado.vida = Math.max(this.objetivoColisionado.vida - this.dañoAInflingir, 0);
        this.morir();
    }

    seFueDePantalla() { //condición para que se vea también de eliminar el objeto al llegarse a salir de pantalla.
        return (((this.posicion.x >= (this.juego.width + 5)) && (this.nombreDelDisparador == "Aliado"))
            ||
            ((this.posicion.x <= (this.juego.width - (this.juego.width + 5))) && (this.nombreDelDisparador == "Enemigo")));
    }

    salirPropulsado() {
        if (this.estoyMuerto) return;
        this.velocidad.y = 0;
        // this.aceleracion.x = this.personaQueEfectuoDisparo.direccionDeAvance();
        if (this.nombreDelDisparador == "Aliado" || this.nombreDelDisparador == "Jugador") {
            this.velocidad.x = 2.5;
        }
        else {
            this.velocidad.x = -2.5;
        }
        this.posicion.x += this.velocidad.x;
    }

    generarAreaDeColision() {
        //se crea un area invisible:
        this.areaColision = new PIXI.Graphics();

        //linea de color negro:
        this.areaColision.lineStyle(1.5, 0x000000);

        //color sólido según equipo:
        this.areaColision.beginFill(this.color, 0.3);

        // Dibujar un círculo con punto central en la posición x e y de nuestro pj, 
        // con un radio general según el radio de colisión:
        this.areaColision.drawCircle(0, 0, this.radioColision);

        this.areaColision.x = this.posicion.x;
        this.areaColision.y = this.posicion.y;

        // Finalizar el relleno
        this.areaColision.endFill();

        //Y lo añade al container:
        //this.juegoPrincipal.pixiApp.stage.addChild(this.areaColision);
        this.container.addChild(this.areaColision);
    }

    generarSprite() {
        //se crea un area invisible:
        this.sprite = new PIXI.Graphics();

        //linea de color negro:
        this.sprite.lineStyle(1.5, 0x000000);

        //color sólido según equipo:
        this.sprite.beginFill(this.color, 1.0);

        // Dibujar un círculo con punto central en la posición x e y de nuestro pj, 
        // con un radio general según el radio de colisión:
        this.sprite.drawCircle(0, 0, this.width / 2);

        this.sprite.x = this.posicion.x;
        this.sprite.y = this.posicion.y;

        // Finalizar el relleno
        this.sprite.endFill();

        //Y lo añade al container:
        //this.juegoPrincipal.pixiApp.stage.addChild(this.areaColision);
        this.container.addChild(this.sprite);
        this.container.pivot.set(this.sprite.x, this.sprite.y);
        this.container.x = this.container.pivot.x
        this.container.y = this.container.pivot.y
    }

    //se actualiza la posición del contenedor según la posición del objeto (se usa en el render)
    actualizarPosDelContainerSegunPosDelObjeto() {
        if (this.estoyMuerto) return;
        this.container.x = this.posicion.x;
        this.container.y = this.posicion.y;
    }

    render() {
        this.actualizarPosDelContainerSegunPosDelObjeto()
    }

    //SISTEMA DE MUERTE:

    verificarSiMori() {
        if (this.estoyMuerto) return;

        if (this.seFueDePantalla()) {
            this.morir();
        }
    }

    mensajeDeMuerte() {
        return "Una entidad ha muerto."
    }

    morir() {
        //PARA ELIMINAR CORRECTAMENTE UN ELEMENTO EN PANTALLA:

        //Haces la vida igual a 0;
        // this.vida = 0;
        //debugger;
        //if (this == undefined) return;

        if (this.estoyMuerto) return;
        
        //0. Le haces daño al objetivo colisionado (en caso de existir):
        //this.pegarAlObjetivoColisionado();

        //1. hacer invisible el sprite:
        this.sprite.visible = false;

        //2. remover el sprite del contenedor:
        this.sprite.parent.removeChild(this.sprite);

        //3. destruir el sprite para liberar memoria:
        this.sprite.destroy({
            texture: false,
            baseTexture: false
        });

        //4. eliminar la referencia al sprite:
        this.sprite = null;
        eliminarElElemento_DeLaLista_(this, this.personaQueEfectuoDisparo.balas);

        //5. Cambia su estado a "muerto", para que ya no responda a ninguna acción del ticker:
        this.estoyMuerto = true;
    }

    //cada tick se efectua en la clase juego en el método realizarTickPorCadaBala()
    // llamado desde el tick principal del objeto.
    tick() {
        //this.verificarSiMori();
        if(this.estoyMuerto) return;
        this.salirPropulsado();
        this.haColisionadoConAlguien();
        this.render();
    }
}


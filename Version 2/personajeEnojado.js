class personajeEnojado extends Estado {
    enter() { //setea la animación de ataque y resetea el cooldown
        const dueño = this.dueño;
        if (dueño?.cambiarAnimacion) dueño.cambiarAnimacion(dueño._animKey('atacar'));
        dueño.delayAtaque = 0;
    }

    update(dt) { //actualiza el estado del pj
        //obtengo al pj
        const dueño = this.dueño;
        if (!dueño) return;
        
        //Busco la posición del jugador/pj. 
        const pos = obtenerPosDePersonaje(dueño);
        if (!pos) {
            this.fsm.setear("IDLE")
            return;
        }

        const d2 = calcularDistancia(dueño.posicion.x, dueño.posicion.y, pos.x, pos.y)

        //si esta lejos, sólo actua normal (cambia el estado a IDLE). 
        if (d2 > dueño.rangoDeAtaqueRadialJugador * 1.2) {
            this.fsm.setear("IDLE")
            return;
        }

        //Si está cerca:
        // Mirar hacia el jugador (no es necesario, el ángulo no es dirigido al jugador, sino siempre el mismo)
        // const ang = anguloHacia(dueño.posicion.x, dueño.posicion.y, pos.x, pos.y);
        // dueño.angulo = (ang * 180) / Math.PI;

        
        //Si esta en su rango de ataque, calcula el cooldown.
        dueño.delayAtaque -= dt 
        if (dueño.delayAtaque <= 0) {
            // daño al jugador
            const juego = dueño.juego;
            //const mundo = per.mundo || juego ?. mundo;
            const prota = juego ?. jugador;
            prota?.recibirDañoDe(dueño)?.(dueño.verCuantaFuerzaTengo());
            dueño.delayAtaque = dueño.puedoGolpear();        
        }
    }
}
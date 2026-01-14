class PjEnojado extends Estado {
    enter() { //setea la animación de ataque.
        if (!this.dueño) return;
        if (this.dueño.estoyMuerto) return;

        //Obtengo al dueño:
        const dueño = this.dueño;
        // debugger; // frena la ejecución del código.

        //Guardo su tinte original:
        this.tintOriginal = 0xFFFFFF;

        //Y cambio su animación a la de "atacar":
        if (dueño?.cambiarAnimacion) dueño.cambiarAnimacion("atacar", true);

        //Extra: Le cambio cualquier tinte que tenga a su tinte original:
        dueño.container.tint = dueño.tintOriginal;

        //Le agrego un tinte rojo al pj:
        dueño.container.tint = 'red';

        // console.log("Estoy enojado!");

        //Y le reseteo el cooldown:
        // dueño.delayAtaque = 0;
        // dueño.ultimoGolpe = performance.now();
    }

    evaluarCambioDeEstado() {
        const dueño = this.dueño;
        dueño.tengoAlgunEnemigoAdelante = false;
        //este for busca el enemigo más cercano y lo asigna como target (si es que existe):
        for (const objetoDeLista of dueño.obtenerLista()) {
            dueño.distanciaDeEnemigoEnX = calcularDistanciaEnX(dueño.posicion, objetoDeLista.posicion)
            dueño.distanciaDeEnemigoEnY = calcularDistanciaEnY(dueño.posicion, objetoDeLista.posicion)
            if (dueño.distanciaDeEnemigoEnX < dueño.radioVisionX && dueño.distanciaDeEnemigoEnY < dueño.radioVisionY) {
                dueño.tengoAlgunEnemigoAdelante = true;
                dueño.enemigoMasCerca = objetoDeLista;
                break;
            }
        }

        //Si tengo un enemigo, y este se encuentra cerca (pero no tanto para atacarlo), cambio de estado a "Alerta":
        if (dueño.distanciaDeEnemigoEnX < dueño.radioDeteccionLejanaX && dueño.distanciaDeEnemigoEnY < dueño.radioDeteccionLejanaY) {
            this.fsm.setear('Jugador_Alerta');
            return;
        }

        //Si no tengo uno, el estado pasa a ser el de enemigo marchante: 
        if (!this.tengoAlgunEnemigoAdelante && !this.estoyMuerto) {
            dueño.fsm.setear("Jugador_Marchante");
            return;
        }
    }

    update() { //actualiza el estado del pj
        //obtengo al pj
        const dueño = this.dueño;
        if (!dueño) return;
        if (this.dueño.estoyMuerto) return;

        this.evaluarCambioDeEstado();

        dueño.aceleracion.x = 0;

        //Aumenta su nivel de ira constantemente:
        //dueño.nivelDeIraReal + 1

        //Y efectúa un ataque a su enemigo:
        //dueño.pegar(dueño.enemigoMasCerca);
        // dueño.dispararA(dueño.enemigoMasCerca);
        dueño.dispararAEnemigo();

        //La misma golpea hasta que el enemigo muere, luego vuelve a avanzar:
        //if (dueño.puedeGolpear()) { //Este condicional sirve para que el delay entre ataques funcione y no se "resetee" al eliminar al objetivo actual.
        if (dueño.puedoDisparar()) {
            dueño.tengoAlgunEnemigoAdelante = false;
            dueño.enemigoMasCerca = null;
        }
        //}

    }
}
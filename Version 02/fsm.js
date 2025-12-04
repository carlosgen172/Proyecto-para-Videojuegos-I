class Fsm {
    constructor(dueño) {
        this.dueño = dueño; //se le pasa el dueño de esta desición de estados.
        this.estados = {};
        this.estadoActual = null;
    }

    anadir(nombre, nombreInstancia) { //se le añaden los estados correspondientes
        this.estados[nombre] = nombreInstancia;
        nombreInstancia.fsm = this;
        nombreInstancia.dueño = this.dueño;
    }

    setear(nombre) { //se le setea el estado actual, indicando su estado nuevo y anterior al mismo.
        if (!this.estados [nombre]) {
            throw newError('El Estado con nombre ${nombre}' + " no existe")
        }
        const estadoAnterior = this.estadoActual;
        if (estadoAnterior === nombre) return;
        if (estadoAnterior && this.estados[estadoAnterior] && this.estados[estadoAnterior].exit === "function") {
            this.estados[estadoAnterior].exit(nombre)
        }
        this.estadoActual = nombre;
        
        const estadoNuevo = this.estados[this.estadoActual];
        if (estadoNuevo && typeof estadoNuevo.enter === "function") {
            estadoNuevo.enter(estadoAnterior);
        }
    }

    update() { //se actualiza el estado según el estado actual nuevo que contenga el pj
        const estado = this.estados[this.estadoActual]
        if (estado && typeof estado.update === "function") {
            estado.update();
        }
    }
}
export class RegistroInteraccion  {
    registro_interaccion_id: number;
    timestamp: Date;
    tipo_evento: string;
    datos_evento: string;
    creado_por: number;
    sesion_id: number;
    constructor(){
        this.registro_interaccion_id = 0;
        this.timestamp = new Date();
        this.tipo_evento = "";
        this.datos_evento = "";
        this.creado_por = 0;
        this.sesion_id = 0;
    }
  }
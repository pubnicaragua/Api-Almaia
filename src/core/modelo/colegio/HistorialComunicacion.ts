import { BaseModel } from "../BaseModel";

export class HistorialComunicacion extends BaseModel {
    historial_comunicacion_id: number;
    alumno_id: number;
    apoderado_id: number;
    usuario_id: number;
    fecha_hora: Date;
    asunto: string;
    descripcion: string;
    acciones_acuerdos_tomados: string;
    constructor(){
        super();
        this.historial_comunicacion_id = 0;
        this.alumno_id = 0;
        this.apoderado_id = 0;
        this.usuario_id = 0;
        this.fecha_hora = new Date();
        this.asunto = "";
        this.descripcion = "";
        this.acciones_acuerdos_tomados = "";
    }
  }
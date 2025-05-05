import { BaseModel } from "../BaseModel";

export class Alerta extends BaseModel {
    alumno_alerta_id: number;
    alumno_id: number;
    alerta_regla_id: number;
    fecha_generada: Date;
    fecha_resolucion: Date;
    alerta_origen_id: number;
    prioridad_id: number;
    severidad_id: number;
    accion_tomada?: string;
    leida: boolean;
    responsable_actual_id?: number;
    estado: string;
    alertas_tipo_alerta_tipo_id: number;
    constructor(){
        super();
        this.alumno_alerta_id = 0;
        this.alumno_id = 0;
        this.alerta_regla_id = 0;
        this.fecha_generada = new Date();
        this.fecha_resolucion = new Date();
        this.alerta_origen_id = 0;
        this.prioridad_id = 0;
        this.severidad_id = 0;
        this.accion_tomada = '';
        this.leida = false;
        this.responsable_actual_id = 0;
        this.estado = '';
        this.alertas_tipo_alerta_tipo_id = 0;
    }
  }
  
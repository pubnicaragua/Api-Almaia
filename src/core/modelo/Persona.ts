import { BaseModel } from "./BaseModel";

export class Persona extends BaseModel {
    persona_id: number;
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    genero_id: number;
    estado_civil_id: number;
    constructor(){
        super();
        this.persona_id = 0;
        this.tipo_documento = '';
        this.numero_documento = '';
        this.nombres = '';
        this.apellidos = '';
        this.genero_id = 0;
        this.estado_civil_id = 0;
    }
  }
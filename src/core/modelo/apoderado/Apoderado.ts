import { BaseModel } from "../BaseModel";

export class Apoderado  extends BaseModel {
    apoderado_id: number;
    persona_id: number;
    colegio_id: number;
    telefono_contacto1: string;
    telefono_contacto2: string;
    email_contacto1: string;
    email_contacto2: string;
    profesion_id: number;
    tipo_oficio_id: number;
    constructor(){
        super();
        this.apoderado_id = 0;
        this.persona_id = 0;
        this.colegio_id = 0;
        this.telefono_contacto1 = "";
        this.telefono_contacto2 = "";
        this.email_contacto1 = "";
        this.email_contacto2 = "";
        this.profesion_id = 0;
        this.tipo_oficio_id = 0;
    }
  }
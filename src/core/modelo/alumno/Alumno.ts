import { BaseModel } from "../BaseModel";

export class Alumno extends BaseModel {
    alumno_id: number;
    colegio_id: number;
    url_foto_perfil?: string;
    telefono_contacto1?: string;
    email?: string;
    telefono_contacto2?: string;
    constructor(){
        super();
        this.alumno_id = 0;
        this.colegio_id = 0;
    }
  }
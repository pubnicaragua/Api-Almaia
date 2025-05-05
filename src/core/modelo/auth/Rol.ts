import { BaseModel } from "../BaseModel";

export class Rol extends BaseModel {
    rol_id: number;
    nombre: string;
    descripcion: string;
    constructor(){
        super();
        this.rol_id = 0;
        this.nombre = "";
        this.descripcion = "";
    }
  }
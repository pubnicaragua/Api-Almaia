import { BaseModel } from "../BaseModel";

export class FuncionalidadRol extends BaseModel {
    funcionalidad_rol: number;
    funcionalidad_id: number;
    rol_id: number;
    constructor(){
        super();
        this.funcionalidad_rol = 0;
        this.funcionalidad_id = 0;
        this.rol_id = 0;
    }
  }
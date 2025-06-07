import { BaseModel } from "../BaseModel";

export class Grado extends BaseModel {
  grado_id?: number;
  nombre: string;
  constructor() {
    super();
    this.nombre = "";
  }
}

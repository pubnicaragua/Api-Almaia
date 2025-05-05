import { BaseModel } from "../BaseModel";

export class AlumnoDireccion extends BaseModel {
  alumno_direccion_id: number;
  alumno_id: number;
  descripcion: string;
  ubicaciones_mapa: string;
  comuna_id: number;
  region_id: number;
  pais_id: number;
  constructor() {
    super();
    this.alumno_direccion_id = 0;
    this.alumno_id = 0;
    this.descripcion = "";
    this.ubicaciones_mapa = "";
    this.comuna_id = 0;
    this.region_id = 0;
    this.pais_id = 0;
  }
}

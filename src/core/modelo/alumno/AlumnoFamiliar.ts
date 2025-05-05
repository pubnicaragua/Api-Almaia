import { BaseModel } from "../BaseModel";

export class AlumnoFamiliar extends BaseModel {
  alumno_familiar_id: number;
  alumno_id: number;
  nombre: string;
  parentesco: string;
  edad: number;
  ocupacion: string;
  nivel_educativo: string;
  constructor() {
    super();
    this.alumno_familiar_id = 0;
    this.alumno_id = 0;
    this.nombre = "";
    this.parentesco = "";
    this.edad = 0;
    this.ocupacion = "";
    this.nivel_educativo = "";
  }
}

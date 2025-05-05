// BaseModel.ts
export class BaseModel {
    creado_por: number;
    actualizado_por: number;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    activo: boolean;
     constructor() {
        this.creado_por = 0;
        this.actualizado_por = 0;
        this.fecha_creacion = new Date();
        this.fecha_actualizacion = new Date();
        this.activo = true;
  }
}
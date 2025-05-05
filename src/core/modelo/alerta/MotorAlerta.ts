import { BaseModel } from "../BaseModel";

export class MotorAlerta extends BaseModel {
    motor_alerta_id: number;
    hr_ejecucion: string;
    tipo: string;
    constructor(){
        super();
        this.motor_alerta_id = 0;
        this.hr_ejecucion = "";
        this.tipo = "";
    }
  }
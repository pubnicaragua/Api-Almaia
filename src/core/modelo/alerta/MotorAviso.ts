import { BaseModel } from "../BaseModel";

export class MotorAviso extends BaseModel {
    motor_aviso: number;
    intervalo_min: number;
    constructor(){
        super();
        this.motor_aviso = 0;
        this.intervalo_min = 0;
    }
  }
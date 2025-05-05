import { BaseModel } from "../BaseModel";

export class MotorInforme extends BaseModel {
    motor_informe_id: number;
    freq_meses: number;
    dia_ejecucion: number;
    constructor(){
        super();
        this.motor_informe_id = 0;
        this.freq_meses = 0;
        this.dia_ejecucion = 0;
    }
  }
  
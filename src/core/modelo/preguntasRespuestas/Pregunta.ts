import { BaseModel } from "../BaseModel";

export class Pregunta extends BaseModel {
    pregunta_id: number;
    tipo_pregunta_id: number;
    nivel_educativo_id: number;
    diagnostico: string;
    tipo_respuesta: string;
    sintomas: string;
    grupo_preguntas: string;
    palabra_clave: string;
    horario: string;
    texto_pregunta: string;
    constructor(){
        super();
        this.pregunta_id = 0;
        this.tipo_pregunta_id = 0;
        this.nivel_educativo_id = 0;
        this.diagnostico = "";
        this.tipo_respuesta = "";
        this.sintomas = "";
        this.grupo_preguntas = "";
        this.palabra_clave = "";
        this.horario = "";
        this.texto_pregunta = "";
    }
  }
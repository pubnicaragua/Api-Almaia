import { BaseModel } from "./BaseModel";

export class Usuario extends BaseModel {
    usuario_id: number;
    nombre_social: string;
    email: string;
    encripted_password: string;
    rol_id: number;
    telefono_contacto: string;
    ultimo_inicio_sesion: Date;
    estado_usuario: string;
    intentos_inicio_sesion: number;
    url_foto_perfil?: string;
    persona_id: number;
    idioma_id: number;
    constructor(){
        super();
        this.usuario_id = 0;
        this.nombre_social = "";
        this.email = "";
        this.encripted_password = "";
        this.rol_id = 0;
        this.telefono_contacto = "";
        this.ultimo_inicio_sesion = new Date();
        this.estado_usuario = "";
        this.intentos_inicio_sesion = 0;
        this.url_foto_perfil = undefined;
        this.persona_id = 0;
        this.idioma_id = 0;
    }
  }
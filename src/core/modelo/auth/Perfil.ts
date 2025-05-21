/* eslint-disable @typescript-eslint/no-explicit-any */
export type Perfil = {
  usuario: {
    usuario_id: number;
    nombre_social: string;
    email: string;
    telefono_contacto: string;
    ultimo_inicio_sesion: string;
    estado_usuario: string;
    url_foto_perfil: string | null;
    persona_id: number;
    rol_id: number;
    idioma_id: number;
  };
  persona: {
    persona_id: number;
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    genero_id: number;
    estado_civil_id: number;
    fecha_nacimiento:string;
  };
  rol: {
    rol_id: number;
    nombre: string;
    descripcion: string;
  };
  funcionalidades: any[];
};



import { FuncionalidadRol } from "./FuncionalidadRol";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PersonaEntrada {
  persona_id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  genero_id: number;
  estado_civil_id: number;
  fecha_nacimiento:string;
}

interface RolEntrada {
  funcionalidades_rol: FuncionalidadRol[];
  rol_id: number;
  nombre: string;
  descripcion: string;
}




export interface PerfilEntrada {
  funcionalidades_rol: FuncionalidadRol[];
   usuario_id: number;
  nombre_social: string;
  email: string;
  encripted_password: string;
  rol_id: number;
  telefono_contacto: string;
  ultimo_inicio_sesion: string;
  estado_usuario: string;
  intentos_inicio_sesion: number;
  url_foto_perfil: string | null;
  persona_id: number;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  idioma_id: number;
  auth_id: string;
  personas: PersonaEntrada;
  roles: RolEntrada;
}
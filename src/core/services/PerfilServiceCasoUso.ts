
import { FuncionalidadRol } from "../modelo/auth/FuncionalidadRol";
import { Perfil } from "../modelo/auth/Perfil";
import { PerfilEntrada } from "../modelo/auth/PerfilEntrada";

export function mapearDatos(data: PerfilEntrada): Perfil { 
  return {
    usuario: {
      usuario_id: data.usuario_id,
      nombre_social: data.nombre_social,
      email: data.email,
      telefono_contacto: data.telefono_contacto,
      ultimo_inicio_sesion: data.ultimo_inicio_sesion,
      estado_usuario: data.estado_usuario,
      url_foto_perfil: data.url_foto_perfil,
      persona_id: data.persona_id,
      rol_id: data.rol_id,
      idioma_id: data.idioma_id
    },
    persona: {
      persona_id: data.personas.persona_id,
      tipo_documento: data.personas.tipo_documento,
      numero_documento: data.personas.numero_documento,
      nombres: data.personas.nombres,
      apellidos: data.personas.apellidos,
      genero_id: data.personas.genero_id,
      estado_civil_id: data.personas.estado_civil_id,
      fecha_nacimiento:data.personas.fecha_nacimiento
    },
    rol: {
      rol_id: data.roles.rol_id,
      nombre: data.roles.nombre,
      descripcion: data.roles.descripcion
    },
    funcionalidades:mapearFuncionalidades(data.roles.funcionalidades_roles)
  };
}
export function mapearDatosAlumno(data: PerfilEntrada): Perfil { 
  try{

    return {
      usuario: {
        usuario_id: data.usuario_id,
        nombre_social: data.nombre_social,
        email: data.email,
        telefono_contacto: data.telefono_contacto,
        ultimo_inicio_sesion: data.ultimo_inicio_sesion,
        estado_usuario: data.estado_usuario,
        url_foto_perfil: data.url_foto_perfil,
        persona_id: data.persona_id,
        rol_id: data.rol_id,
        idioma_id: data.idioma_id,
        idioma:data.idiomas,
        colegio:data?.usuarios_colegios[0]?.colegios
      },
      persona: {
        persona_id: data.personas.persona_id,
        tipo_documento: data.personas.tipo_documento,
        numero_documento: data.personas.numero_documento,
        nombres: data.personas.nombres,
        apellidos: data.personas.apellidos,
        genero_id: data.personas.genero_id,
        estado_civil_id: data.personas.estado_civil_id,
        fecha_nacimiento:data.personas.fecha_nacimiento
      },
      rol: {
        rol_id: data.roles.rol_id,
        nombre: data.roles.nombre,
        descripcion: data.roles.descripcion
      },
      funcionalidades:mapearFuncionalidades(data.roles.funcionalidades_roles)
    };
  }catch(error){
    console.log(error);    
  }
}
function mapearFuncionalidades(funcionalidades_roles: FuncionalidadRol[]) {
  return funcionalidades_roles.map(fr => ({
    id: fr.funcionalidad_id,
    nombre: fr.funcionalidades?.descripcion
  }));
}
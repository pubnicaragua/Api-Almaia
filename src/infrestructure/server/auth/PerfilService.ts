/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { mapearDatos } from "../../../core/services/PerfilServiceCasoUso";
export const PerfilService = {
  async obtenerPerfil(req: Request, res: Response) {
    // Datos simulados del usuario

    const { data: usuario_data, error: error_usuario } = await req.supabase
      .from("usuarios")
      .select(
        [
          '*',
          [
            'personas(persona_id',
            'tipo_documento,numero_documento,nombres,apellidos,genero_id,estado_civil_id',
            'docentes(docente_id,especialidad,colegios(colegio_id,nombre,nombre_fantasia,tipo_colegio,dependencia),docentes_cursos(curso_id,ano_escolar,cursos(curso_id,nombre_curso,grado_id)))',
            'fecha_nacimiento)'
          ].join(','),
          'roles(rol_id,nombre,descripcion,funcionalidades_roles(*,funcionalidad_rol_id,funcionalidades(*,funcionalidad_id)))'
        ].join(',')
      )
      .eq("usuario_id", req.user.usuario_id)
      .single();

    if (error_usuario) {
      throw new Error(error_usuario.message);
    }
    const data = mapearDatos(usuario_data as any);
    const usuario = data.usuario;
    const persona = data.persona;
    const rol = data.rol;
    const funcionalidades= data.funcionalidades
    const docentes = data.docentes || [];

    res.json({
      usuario,
      persona,
      rol,
      docentes,
      funcionalidades      
    });
  },
};

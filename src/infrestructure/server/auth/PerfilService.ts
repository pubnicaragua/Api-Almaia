import { Request, Response } from "express";
import { Funcionalidad } from "../../../core/modelo/auth/Funcionalidad";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { mapearDatos } from "../../../core/services/PerfilServiceCasoUso";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const PerfilService = {
  async obtenerPerfil(req: Request, res: Response) {
    // Datos simulados del usuario

    const { data: usuario_data, error: error_usuario } = await client
      .from("usuarios")
      .select(
        "*,personas(persona_id,tipo_documento,numero_documento,nombres,apellidos,genero_id,estado_civil_id,fecha_nacimiento),roles(rol_id,nombre,descripcion,funcionalidades_roles(*,funcionalidad_rol_id,funcionalidades(*,funcionalidad_id)))"
      )
      .eq("usuario_id", req.user.usuario_id)
      .single();
    if (error_usuario) {
      throw new Error(error_usuario.message);
    }
    const data = mapearDatos(usuario_data);
    // Funcionalidades del rol
    const funcionalidades: Funcionalidad[] = [
      {
        funcionalidad_id: 1,
        nombre: "Dashboard",
        descripcion: "Acceso al panel principal",
        creado_por: 22,
        actualizado_por: 2,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        activo: true,
      },
      {
        funcionalidad_id: 2,
        nombre: "Gestión de Usuarios",
        descripcion: "Administrar usuarios del sistema",
        creado_por: 22,
        actualizado_por: 2,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        activo: true,
      },
    ];
    const usuario = data.usuario;
    const persona = data.persona;
    const rol = data.rol;

    res.json({
      usuario,
      persona,
      rol,
      funcionalidades,
    });
  },
};

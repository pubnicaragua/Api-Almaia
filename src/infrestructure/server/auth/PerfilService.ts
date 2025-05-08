import { Request, Response } from "express";
import { Usuario } from "../../../core/modelo/auth/Usuario";
import { Persona } from "../../../core/modelo/Persona";
import { Rol } from "../../../core/modelo/auth/Rol";
import { Funcionalidad } from "../../../core/modelo/auth/Funcionalidad";

export const PerfilService = {
    obtenerPerfil  (req: Request, res: Response)  {
        // Datos simulados del usuario
        const usuario = new Usuario();
        usuario.usuario_id = 1;
        usuario.nombre_social = "Juan Pérez";
        usuario.email = "juan.perez@example.com";
        usuario.telefono_contacto = "+123456789";
        usuario.ultimo_inicio_sesion = new Date();
        usuario.estado_usuario = "ACTIVO";
        usuario.url_foto_perfil = "https://example.com/perfil.jpg";
        usuario.persona_id = 1;
        usuario.rol_id = 1;
        usuario.idioma_id = 1;
      
        // Datos de la persona
        const persona = new Persona();
        persona.persona_id = 1;
        persona.tipo_documento = "DNI";
        persona.numero_documento = "12345678";
        persona.nombres = "Juan";
        persona.apellidos = "Pérez";
        persona.genero_id = 1;
        persona.estado_civil_id = 2;
      
        // Datos del rol
        const rol = new Rol();
        rol.rol_id = 1;
        rol.nombre = "Administrador";
        rol.descripcion = "Acceso completo al sistema";
      
        // Funcionalidades del rol
        const funcionalidades: Funcionalidad[] = [
          { funcionalidad_id: 1, nombre: "Dashboard", descripcion: "Acceso al panel principal", creado_por:22, actualizado_por:2,fecha_creacion: new Date(), fecha_actualizacion: new Date(), activo: true },
          { funcionalidad_id: 2, nombre: "Gestión de Usuarios", descripcion: "Administrar usuarios del sistema",creado_por:22, actualizado_por:2,fecha_creacion: new Date(), fecha_actualizacion: new Date(), activo: true },
        ];
      
         res.json({
          usuario,
          persona,
          rol,
          funcionalidades,
        });
      }
}
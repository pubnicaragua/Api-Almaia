import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlerta } from "../../../core/modelo/alumno/AlumnoAlerta";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
const AlumnoAlertaSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  alerta_regla_id: Joi.number().integer().required(),
  fecha_generada: Joi.string().required(),
  fecha_resolucion: Joi.string().optional(),
  alerta_origen_id: Joi.number().integer().required(),
  prioridad_id: Joi.number().integer().required(),
  severidad_id: Joi.number().integer().required(),
  accion_tomada: Joi.string().max(200).optional(),
  leida: Joi.boolean().required(),
  estado: Joi.string().max(20).required(),
  alertas_tipo_alerta_tipo_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoAlerta> = new DataService("alumnos_alertas");
export const AlumnoAlertaService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoalertaAlerta = await dataService.getAll(["*",
              "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
              "alertas_reglas(alerta_regla_id,nombre)",
              "alertas_origenes(alerta_origen_id,nombre)",
              "alertas_severidades(alerta_severidad_id,nombre)",
              "alertas_prioridades(alerta_prioridad_id,nombre)",
              "alertas_tipos(alerta_tipo_id,nombre)"], where);
            res.json(alumnoalertaAlerta);
        } catch (error) {
            console.error("Error al obtener la alerta del alumnoalerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },    
    async detalle(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const where = { alumno_alerta_id: id }; // Convertir los parámetros de consulta en filtros
            const alumnoalertaAlerta = await dataService.getAll(["*",
              "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
              "alertas_reglas(alerta_regla_id,nombre)",
              "alertas_origenes(alerta_origen_id,nombre)",
              "alertas_severidades(alerta_severidad_id,nombre)",
              "alertas_prioridades(alerta_prioridad_id,nombre)",
              "alertas_tipos(alerta_tipo_id,nombre)"], where);
            res.json(alumnoalertaAlerta);
           /* const alumnoalertas_alertas = [
              {
                "alumnoalerta_alerta_id": 201,
                "alumnoalerta_id": 101,
                "tipo_alerta": "amarilla",  // Nuevo tipo de alerta
                "fecha_generada": "2023-06-15T14:30:00Z",
                "fecha_resolucion": null,
                "estado": "Pendiente",
                "responsable": "Prof. Jefe - Ana López",  // Nuevo campo
                "curso_alumnoalerta": "4° Básico A",  // Nuevo campo
                
                // Detalle completo del alumnoalerta
                "alumnoalerta": {
                  "alumnoalerta_id": 101,
                  "nombre": "Juan Pérez",
                  "email": "juan.perez@colegio.com",
                  
                  // Curso actual (relación adicional)
                  "curso_actual": {
                    "curso_id": 10,
                    "nombre": "4° Básico A",
                    "profesor_jefe": "Ana López"
                  }
                },
                
                // Detalles de prioridad/severidad adaptados
                "prioridad": {
                  "nivel": "media",
                  "color": "#FFD700"  // Amarillo
                },
                
                "evidencias": [  // Ejemplo de evidencias adjuntas
                  {
                    "tipo": "foto",
                    "url": "/evidencias/alertas/201.jpg",
                    "fecha": "2023-06-15T14:25:00Z"
                  }
                ]
              },
              {
                "alumnoalerta_alerta_id": 202,
                "alumnoalerta_id": 102,
                "tipo_alerta": "roja",  // Alerta grave
                "fecha_generada": "2023-06-16T09:15:00Z",
                "fecha_resolucion": "2023-06-16T16:45:00Z",
                "responsable": "Psicóloga - Marta Rojas",
                "curso_alumnoalerta": "5° Básico B",
                "estado": "Escalada",  // Nuevo estado
                "accion_tomada": "Derivado a psicología",
                
                "alumnoalerta": {
                  "alumnoalerta_id": 102,
                  "nombre": "María González",
                  "curso_actual": {
                    "nombre": "5° Básico B",
                    "profesor_jefe": "Carlos Méndez"
                  }
                },
                
                "prioridad": {
                  "nivel": "crítica",
                  "color": "#FF0000"  // Rojo
                }
              },
              // Ejemplo de alerta "sos alma"
              {
                "alumnoalerta_alerta_id": 203,
                "tipo_alerta": "sos alma",  // Alerta especial
                "fecha_generada": "2023-06-17T11:20:00Z",
                "responsable": "Equipo de Convivencia Escolar",
                "curso_alumnoalerta": "3° Medio A",
                "estado": "En seguimiento",
                "protocolo_activado": true  // Campo adicional
              }
            ];
            res.json(alumnoalertas_alertas);*/
        } catch (error) {
            console.error("Error al obtener la alerta del alumnoalerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
     guardar: async (req: Request, res: Response) => {
       try {
         const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
         Object.assign(alumnoalerta, req.body);
         alumnoalerta.creado_por = req.creado_por;
         alumnoalerta.actualizado_por = req.actualizado_por
         let responseSent = false;
         const { error: validationError } = AlumnoAlertaSchema.validate(req.body);
         const { data, error } = await client
           .from("alumnos")
           .select("*")
           .eq("alumno_id", alumnoalerta.alumno_id)
           .single();
         if (error || !data) {
           throw new Error("El colegio no existe");
         } 
         const { data:dataAlertaRegla, error:errorAlertaRegla } = await client
           .from("alertas_reglas")
           .select("*")
           .eq("alerta_regla_id", alumnoalerta.alerta_regla_id)
           .single();
         if (errorAlertaRegla || !dataAlertaRegla) {
           throw new Error("El colegio no existe");
         }
         const { data:dataAlertaOrigen, error:errorAlertaOrigen } = await client
           .from("alertas_origenes")
           .select("*")
           .eq("alerta_origen_id", alumnoalerta.alerta_origen_id)
           .single();
         if (errorAlertaOrigen || !dataAlertaOrigen) {
           throw new Error("El origen no existe");
         }        
          const { data:dataAlertaPrioridad, error:errorAlertaPrioridad } = await client
           .from("alertas_prioridades")
           .select("*")
           .eq("alerta_prioridad_id", alumnoalerta.prioridad_id)
           .single();
         if (errorAlertaPrioridad || !dataAlertaPrioridad) {
           throw new Error("La  prioridad no existe");
         } 
         const { data:dataAlertaSeveridad, error:errorAlertaSeveridad } = await client
           .from("alertas_severidades")
           .select("*")
           .eq("alerta_severidad_id", alumnoalerta.severidad_id)
           .single();
         if (errorAlertaSeveridad || !dataAlertaSeveridad) {
           throw new Error("La  severidad no existe");
         } 
         const { data:dataAlertaTipo, error:errorAlertaTipo } = await client
           .from("alertas_tipos")
           .select("*")
           .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
           .single();
         if (errorAlertaTipo || !dataAlertaTipo) {
           throw new Error("La  severidad no existe");
         }
         if (validationError) {
           responseSent = true;
           throw new Error(validationError.details[0].message);
         }
         if (!responseSent) {
           console.log(alumnoalerta);
           
           const savedAlumnoAlerta = await dataService.processData(alumnoalerta);
           res.status(201).json(savedAlumnoAlerta);
         }
       } catch (err) {
         const error = err as Error;
         console.error("Error al guardar el alumnoalerta:", error);
         res.status(500).json({ message: error.message || 'Error inesperado' });
       }
     },
     async actualizar(req: Request, res: Response) {
       try {
         const id = parseInt(req.params.id);
         const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
         Object.assign(alumnoalerta, req.body);
         alumnoalerta.actualizado_por = req.actualizado_por
         let responseSent = false;
         const { error: validationError } = AlumnoAlertaSchema.validate(req.body);
          const { data, error } = await client
           .from("alumnos")
           .select("*")
           .eq("alumno_id", alumnoalerta.alumno_id)
           .single();
         if (error || !data) {
           throw new Error("El colegio no existe");
         } 
         const { data:dataAlertaRegla, error:errorAlertaRegla } = await client
           .from("alertas_reglas")
           .select("*")
           .eq("alerta_regla_id", alumnoalerta.alerta_regla_id)
           .single();
         if (errorAlertaRegla || !dataAlertaRegla) {
           throw new Error("El colegio no existe");
         }
         const { data:dataAlertaOrigen, error:errorAlertaOrigen } = await client
           .from("alertas_origenes")
           .select("*")
           .eq("alerta_origen_id", alumnoalerta.alerta_origen_id)
           .single();
         if (errorAlertaOrigen || !dataAlertaOrigen) {
           throw new Error("El origen no existe");
         }        
          const { data:dataAlertaPrioridad, error:errorAlertaPrioridad } = await client
           .from("alertas_prioridades")
           .select("*")
           .eq("alerta_prioridad_id", alumnoalerta.prioridad_id)
           .single();
         if (errorAlertaPrioridad || !dataAlertaPrioridad) {
           throw new Error("La  prioridad no existe");
         } 
         const { data:dataAlertaSeveridad, error:errorAlertaSeveridad } = await client
           .from("alertas_severidades")
           .select("*")
           .eq("alerta_severidad_id", alumnoalerta.severidad_id)
           .single();
         if (errorAlertaSeveridad || !dataAlertaSeveridad) {
           throw new Error("La  severidad no existe");
         } 
         const { data:dataAlertaTipo, error:errorAlertaTipo } = await client
           .from("alertas_tipos")
           .select("*")
           .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
           .single();
         if (errorAlertaTipo || !dataAlertaTipo) {
           throw new Error("La  severidad no existe");
         }
         if (validationError) {
           responseSent = true;
           throw new Error(validationError.details[0].message);
         }
         if (!responseSent) {
       
         await dataService.updateById(id, alumnoalerta);
         res.status(200).json({ message: "AlumnoAlerta actualizado correctamente" });
         }
   
       } catch (error) {
         console.error("Error al actualizar el alumnoalerta:", error);
         res.status(500).json({ message: "Error interno del servidor" });
       }
     },
     async eliminar(req: Request, res: Response) {
       try {
         const id = parseInt(req.params.id);
         await dataService.deleteById(id);
         res.status(200).json({ message: "AlumnoAlerta eliminado correctamente" });
       } catch (error) {
         console.error("Error al eliminar el alumnoalerta:", error);
         res.status(500).json({ message: "Error interno del servidor" });
       }
     },


}

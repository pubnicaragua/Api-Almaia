import { Request, Response } from "express";

import { DataService } from "../DataService";
import { AlumnoApoderado } from "../../../core/modelo/apoderado/AlumnoApoderado";

const dataService:DataService<AlumnoApoderado> = new DataService("alumnos_respuestas");
export const AlumnoApoderadoService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoApoderado = await dataService.getAll(["*"],where);
            res.json(alumnoApoderado);*/
            const  alumnos_apoderados = [
                {
                  // Relación alumno-apoderado (entidad principal)
                  "alumno_apoderado_id": 1,
                  "alumno_id": 1001,
                  "apoderado_id": 2001,
                  "tipo_apoderado": "Padre",
                  "observaciones": "Contacto principal para emergencias",
                  "estado_usuario": "Activo",
              
                  // Datos completos del Alumno (incluyendo relación con Persona)
                  "alumno": {
                    "alumno_id": 1001,
                    "colegio_id": 1,
                    "persona_id": 4001, // Nueva clave foránea a Persona
                    "url_foto_perfil": "/fotos/alumnos/1001.jpg",
                    "telefono_contacto1": "+56912345678",
                    "email": "alumno.1001@colegio.edu",
              
                    // Datos de Persona del Alumno
                    "persona": {
                      "persona_id": 4001,
                      "tipo_documento": "RUT",
                      "numero_documento": "12.345.678-9",
                      "nombres": "Carlos Andrés",
                      "apellidos": "Martínez López",
                      "genero_id": 1,
                      "estado_civil_id": 3,
                      "fecha_nacimiento": "2010-05-15"
                    },
              
                    // Datos del Colegio
                    "colegio": {
                      "colegio_id": 1,
                      "nombre": "Colegio San Ignacio",
                      "direccion": "Av. Principal 1234",
                      "comuna_id": 101,
                      "comuna": {
                        "comuna_id": 101,
                        "nombre": "Santiago Centro",
                        "region_id": 13,
                        "region": {
                          "region_id": 13,
                          "nombre": "Región Metropolitana"
                        }
                      }
                    }
                  },
              
                  // Datos completos del Apoderado
                  "apoderado": {
                    "apoderado_id": 2001,
                    "persona_id": 3001,
                    "telefono_contacto1": "+56987654321",
                    "email_contacto1": "juan.perez@email.com",
              
                    // Datos de Persona del Apoderado
                    "persona": {
                      "persona_id": 3001,
                      "nombres": "Juan Esteban",
                      "apellidos": "Pérez González",
                      "tipo_documento": "RUT",
                      "numero_documento": "9.876.543-2",
                      "fecha_nacimiento": "1980-08-20"
                    }
                  }
                },
                {
                  "alumno_apoderado_id": 2,
                  "alumno_id": 1002,
                  "apoderado_id": 2002,
                  "tipo_apoderado": "Madre",
                  "estado_usuario": "Activo",
              
                  "alumno": {
                    "alumno_id": 1002,
                    "persona_id": 4002,
                    "persona": {
                      "persona_id": 4002,
                      "nombres": "María Fernanda",
                      "apellidos": "Silva Rojas"
                    }
                  },
              
                  "apoderado": {
                    "apoderado_id": 2002,
                    "persona_id": 3002,
                    "persona": {
                      "persona_id": 3002,
                      "nombres": "Ana María",
                      "apellidos": "Rojas Méndez"
                    }
                  }
                }
              ];
            res.json(alumnos_apoderados);
        } catch (error) {
            console.error("Error al obtener la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoApoderado: AlumnoApoderado = req.body;
            const savedAlumnoApoderado = await dataService.processData(alumnoApoderado);
            res.status(201).json(savedAlumnoApoderado);
        } catch (error) {
            console.error("Error al guardar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    ,
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoApoderado: AlumnoApoderado = req.body;
            await dataService.updateById(id, alumnoApoderado);
            res.status(200).json({ message: "AlumnoApoderado actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    ,
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "AlumnoApoderado eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
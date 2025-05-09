import { Request, Response } from "express";

import { DataService } from "../DataService";
import { AlumnoRespuesta } from "../../../core/modelo/preguntasRespuestas/AlumnoRespuesta";

const dataService:DataService<AlumnoRespuesta> = new DataService("alumnos_respuestas");
export const AlumnoRespuestaService = {
     async obtener(req: Request, res: Response) {
            try {
                /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
                const alumnorespuesta = await dataService.getAll(["*"],where);
                res.json(alumnorespuesta);*/
                const respuestas = [
                    {
                      alumno: {
                        alumno_id: 45,
                        colegio: {
                          colegio_id: 10,
                          nombre: "Colegio Nacional",
                          nombre_fantasia: "CN",
                          tipo_colegio: "Público",
                          dependencia: "Ministerio de Educación",
                          sitio_web: "https://colegionacional.cl",
                          direccion: "Av. Principal 123",
                          telefono_contacto: "+56 9 1234 5678",
                          correo_electronico: "info@colegionacional.cl",
                          comuna_id: 101,
                          region_id: 5,
                          pais_id: 56
                        },
                        url_foto_perfil: "https://example.com/fotos/45.jpg",
                        telefono_contacto1: "+56 9 1111 1111",
                        telefono_contacto2: "+56 9 2222 2222",
                        email: "alumno45@correo.cl"
                      },
                      pregunta: {
                        pregunta_id: 12,
                        texto_pregunta: "¿Con qué frecuencia tiene dificultad para concentrarse en sus tareas?"
                      },
                      respuesta: "Siempre tengo dificultad",
                      timestamp: "2023-05-15T10:30:00Z"
                    }
                  ];
                res.json(respuestas);                  
            } catch (error) {
                console.error("Error al obtener la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        guardar: async (req: Request, res: Response) => {
            try {
                const alumnorespuesta: AlumnoRespuesta = req.body;
                const savedAlumnoRespuesta = await dataService.processData(alumnorespuesta);
                res.status(201).json(savedAlumnoRespuesta);
            } catch (error) {
                console.error("Error al guardar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        }
        ,
        async actualizar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                const alumnorespuesta: AlumnoRespuesta = req.body;
                await dataService.updateById(id, alumnorespuesta);
                res.status(200).json({ message: "AlumnoRespuesta actualizada correctamente" });
            } catch (error) {
                console.error("Error al actualizar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        async eliminar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                await dataService.deleteById(id);
                res.status(200).json({ message: "Alumno Respuesta eliminada correctamente" });
            } catch (error) {
                console.error("Error al eliminar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
}
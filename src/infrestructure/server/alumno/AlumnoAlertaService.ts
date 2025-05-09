import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlerta } from "../../../core/modelo/alumno/AlumnoAlerta";

const dataService: DataService<AlumnoAlerta> = new DataService("alumnos_alertas");
export const AlumnoAlertaService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoAlerta = await dataService.getAll(["*"], where);
            res.json(alumnoAlerta);*/
            const alumnos_alertas = [
              {
                "alumno_alerta_id": 201,
                "alumno_id": 101,
                "tipo_alerta": "amarilla",  // Nuevo tipo de alerta
                "fecha_generada": "2023-06-15T14:30:00Z",
                "fecha_resolucion": null,
                "estado": "Pendiente",
                "responsable": "Prof. Jefe - Ana López",  // Nuevo campo
                "curso_alumno": "4° Básico A",  // Nuevo campo
                
                // Detalle completo del alumno
                "alumno": {
                  "alumno_id": 101,
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
                "alumno_alerta_id": 202,
                "alumno_id": 102,
                "tipo_alerta": "roja",  // Alerta grave
                "fecha_generada": "2023-06-16T09:15:00Z",
                "fecha_resolucion": "2023-06-16T16:45:00Z",
                "responsable": "Psicóloga - Marta Rojas",
                "curso_alumno": "5° Básico B",
                "estado": "Escalada",  // Nuevo estado
                "accion_tomada": "Derivado a psicología",
                
                "alumno": {
                  "alumno_id": 102,
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
                "alumno_alerta_id": 203,
                "tipo_alerta": "sos alma",  // Alerta especial
                "fecha_generada": "2023-06-17T11:20:00Z",
                "responsable": "Equipo de Convivencia Escolar",
                "curso_alumno": "3° Medio A",
                "estado": "En seguimiento",
                "protocolo_activado": true  // Campo adicional
              }
            ];
            res.json(alumnos_alertas);
        } catch (error) {
            console.error("Error al obtener la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoAlerta: AlumnoAlerta = req.body;
            const savedAlumnoAlerta = await dataService.processData(alumnoAlerta);
            res.status(201).json(savedAlumnoAlerta);
        } catch (error) {
            console.error("Error al guardar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoAlerta: AlumnoAlerta = req.body;
            await dataService.updateById(id, alumnoAlerta);
            res.status(200).json({ message: "Alerta del alumno actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta del alumno eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }


}

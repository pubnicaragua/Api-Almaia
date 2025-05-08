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
           const alumnos_alertas= [
                {
                  "alumno_alerta_id": 201,
                  "alumno_id": 101,
                  "alerta_regla_id": 3,
                  "fecha_generada": "2023-06-15T14:30:00Z",
                  "fecha_resolucion": null,
                  "estado": "Pendiente",
                  "accion_tomada": null,
                  "leida": false,
                  "prioridad_id": 1,
                  "severidad_id": 2,
                  "alertas_tipo_alerta_tipo_id": 4,
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "email": "juan.perez@colegio.com",
                    "colegio": {
                      "colegio_id": 1,
                      "nombre": "Colegio Ejemplo"
                    }
                  },
                  "prioridad": {
                    "alerta_prioridad_id": 1,
                    "nombre": "Alta",
                    "color": "#FF0000"
                  },
                  "severidad": {
                    "alerta_severidad_id": 2,
                    "nombre": "Media",
                    "icono": "warning"
                  },
                  "tipo_alerta": {
                    "alerta_tipo_id": 4,
                    "nombre": "Rendimiento Académico",
                    "descripcion": "Alertas relacionadas con bajo rendimiento"
                  }
                },
                {
                  "alumno_alerta_id": 202,
                  "alumno_id": 102,
                  "alerta_regla_id": 5,
                  "fecha_generada": "2023-06-16T09:15:00Z",
                  "fecha_resolucion": "2023-06-16T16:45:00Z",
                  "estado": "Resuelta",
                  "accion_tomada": "Se contactó al apoderado",
                  "leida": true,
                  "prioridad_id": 2,
                  "severidad_id": 1,
                  "alertas_tipo_alerta_tipo_id": 3,
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "María González",
                    "email": "maria.gonzalez@colegio.com"
                  },
                  "prioridad": {
                    "alerta_prioridad_id": 2,
                    "nombre": "Media",
                    "color": "#FFA500"
                  },
                  "severidad": {
                    "alerta_severidad_id": 1,
                    "nombre": "Baja",
                    "icono": "info"
                  },
                  "tipo_alerta": {
                    "alerta_tipo_id": 3,
                    "nombre": "Asistencia",
                    "descripcion": "Alertas relacionadas con inasistencias"
                  }
                }
              ]
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

import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoMonitoreo } from "../../../core/modelo/alumno/AlumnoMonitoreo";

const dataService: DataService<AlumnoMonitoreo> = new DataService("alumnos_alertas");
export const AlumnoMonitoreoService = {
        
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoMonitoreo = await dataService.getAll(["*"], where);
            res.json(alumnoMonitoreo);*/
            const alumnos_monitoreos= [
                {
                  "monitoreo_id": 1,
                  "fecha": "2023-05-15T10:30:00Z",
                  "observaciones": "El alumno mostró mejoría en su rendimiento",
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "url_foto_perfil": "https://ejemplo.com/fotos/101.jpg",
                    "telefono_contacto1": "+56912345678",
                    "email": "juan.perez@ejemplo.com",
                    "colegio": {
                      "colegio_id": 201,
                      "nombre": "Colegio Ejemplo",
                      "nombre_fantasia": "Colegio Ejemplo S.A.",
                      "direccion": "Calle Principal 123",
                      "telefono_contacto": "+56223456789"
                    }
                  }
                }
              ]
            res.json(alumnos_monitoreos);
        } catch (error) {
            console.error("Error al obtener el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoMonitoreo: AlumnoMonitoreo = req.body;
            const savedAlumnoMonitoreo = await dataService.processData(alumnoMonitoreo);
            res.status(201).json(savedAlumnoMonitoreo);
        } catch (error) {
            console.error("Error al guardar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoMonitoreo: AlumnoMonitoreo = req.body;
            await dataService.updateById(id, alumnoMonitoreo);
            res.status(200).json({ message: "Monitoreo del alumno actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Monitoreo del alumno eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoInforme } from "../../../core/modelo/alumno/AlumnoInforme";

const dataService: DataService<AlumnoInforme> = new DataService("alumnos_alertas");
export const AlumnoInformeService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoInforme = await dataService.getAll(["*"], where);
            res.json(alumnoInforme);*/
            const alumnos_informes = [
                {
                  "alumno_informe_id": 801,
                  "alumno_id": 101,
                  "tipo": "Académico",
                  "fecha": "2023-06-15",
                  "periodo_evaluado": "Primer Semestre 2023",
                  "url_reporte": "https://storage.colegio.com/informes/801.pdf",
                  "url_anexos": [
                    "https://storage.colegio.com/anexos/801-1.pdf"
                  ],
                  "observaciones": "El alumno muestra mejora en matemáticas",
                  "creado_por": "profesor.jimenez@colegio.com",
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "curso_actual": "4° Básico A"
                  },
                  "curso": {
                    "curso_id": 5,
                    "nombre": "4° Básico A",
                    "profesor_jefe": "Ana López"
                  }
                },
                {
                  "alumno_informe_id": 802,
                  "alumno_id": 102,
                  "tipo": "Conductual",
                  "fecha": "2023-05-20",
                  "periodo_evaluado": "Abril 2023",
                  "url_reporte": "https://storage.colegio.com/informes/802.pdf",
                  "observaciones": "Se recomienda seguimiento psicológico",
                  "creado_por": "orientacion@colegio.com",
                  "estado": "Cerrado"
                }
              ]
            res.json(alumnos_informes);
        } catch (error) {
            console.error("Error al obtener el informe del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoInforme: AlumnoInforme = req.body;
            const savedAlumnoInforme = await dataService.processData(alumnoInforme);
            res.status(201).json(savedAlumnoInforme);
        } catch (error) {
            console.error("Error al guardar el informe del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoInforme: AlumnoInforme = req.body;
            await dataService.updateById(id, alumnoInforme);
            res.status(200).json({ message: "Informe del alumno actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el informe del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Informe del alumno eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el informe del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
        
}
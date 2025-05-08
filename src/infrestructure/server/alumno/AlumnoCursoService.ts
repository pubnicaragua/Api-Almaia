import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoCurso } from "../../../core/modelo/alumno/AlumnoCurso";

const dataService: DataService<AlumnoCurso> = new DataService("alumnos_alertas");
export const AlumnoCursoService = {
    async obtener(req: Request, res: Response) {
        try {
           /* const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoCurso = await dataService.getAll(["*"], where);
            res.json(alumnoCurso);*/
           const alumnos_cursos= [
                {
                  "alumno_curso_id": 601,
                  "alumno_id": 101,
                  "curso_id": 5,
                  "ano_escolar": 2023,
                  "fecha_ingreso": "2023-03-01",
                  "fecha_egreso": "2023-12-15",
                  "estado_matricula": "Activa",
                  "promedio_general": 6.2,
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "url_foto_perfil": "https://ejemplo.com/fotos/alumno101.jpg"
                  },
                  "curso": {
                    "curso_id": 5,
                    "nombre_curso": "4°",
                    "nivel_educativo": "Básica",
                    "profesor_jefe": "María González",
                    "colegio": {
                      "colegio_id": 1,
                      "nombre": "Colegio Ejemplo"
                    }
                  }
                },
                {
                  "alumno_curso_id": 602,
                  "alumno_id": 102,
                  "curso_id": 8,
                  "ano_escolar": 2023,
                  "fecha_ingreso": "2023-03-01",
                  "fecha_egreso": null,
                  "estado_matricula": "Transferido",
                  "promedio_general": 5.8,
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "Ana Sánchez"
                  },
                  "curso": {
                    "curso_id": 8,
                    "nombre_curso": "7° B",
                    "nivel_educativo": "Básica"
                  }
                }
              ]
            res.json(alumnos_cursos);
        } catch (error) {
            console.error("Error al obtener el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoCurso: AlumnoCurso = req.body;
            const savedAlumnoCurso = await dataService.processData(alumnoCurso);
            res.status(201).json(savedAlumnoCurso);
        } catch (error) {
            console.error("Error al guardar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoCurso: AlumnoCurso = req.body;
            await dataService.updateById(id, alumnoCurso);
            res.status(200).json({ message: "Curso del alumno actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Curso del alumno eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
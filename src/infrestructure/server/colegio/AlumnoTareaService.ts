import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoTarea } from "../../../core/modelo/colegio/AlumnoTarea";

const dataService: DataService<AlumnoTarea> = new DataService("alumnotareas");
export const AlumnoTareasService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnotareas = await dataService.getAll(["*"], where);
      res.json(alumnotareas);*/
      const tareasAlumnos = [
        {
          alumno_tarea: 1,
          alumno_id: 101,
          fecha_programacion: new Date("2025-05-10T08:00:00"),
          materia_id: 1,
          color: "#FF5733",
          tipo_tarea: "Trabajo Práctico",
          descripcion_tarea: "Investigar sobre la fotosíntesis",
          estado_tarea: "Pendiente"
        },
        {
          alumno_tarea: 2,
          alumno_id: 102,
          fecha_programacion: new Date("2025-05-11T10:30:00"),
          materia_id: 2,
          color: "#33C1FF",
          tipo_tarea: "Evaluación",
          descripcion_tarea: "Examen de matemáticas unidad 2",
          estado_tarea: "Completado"
        },
        {
          alumno_tarea: 3,
          alumno_id: 103,
          fecha_programacion: new Date("2025-05-12T09:00:00"),
          materia_id: 3,
          color: "#8E44AD",
          tipo_tarea: "Lectura",
          descripcion_tarea: "Leer capítulo 5 del libro de historia",
          estado_tarea: "Pendiente"
        }
      ];

        res.json(tareasAlumnos);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async guardar(req: Request, res: Response) {
    try {
      const nuevoAlumnoTarea = req.body;
      const resultado = await dataService.processData(nuevoAlumnoTarea);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoTareaActualizado = req.body;
      const resultado = await dataService.updateById(
        id,
        alumnoTareaActualizado
      );
      res.json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const resultado = await dataService.deleteById(id);
      res.json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

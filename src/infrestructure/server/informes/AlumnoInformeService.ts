import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoInforme } from "../../../core/modelo/alumno/AlumnoInforme";

const dataService: DataService<AlumnoInforme> = new DataService(
  "alumnos_informes"
);
export const AlumnoInformeService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoInforme = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos),alumnos_cursos(alumno_curso_id,ano_escolar,cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre))))",
        ],
        where
      );
      res.json(alumnoInforme);
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
      res
        .status(200)
        .json({ message: "Informe del alumno actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Informe del alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

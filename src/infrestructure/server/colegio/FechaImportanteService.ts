import { Request, Response } from "express";
import { DataService } from "../DataService";
import { CalendarioFechaImportante } from "../../../core/modelo/colegio/CalendarioFechaImportante";

const dataService: DataService<CalendarioFechaImportante> = new DataService(
  "calendariofechaimportantes"
);
export const CalendarioFechaImportantesService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const calendarios = await dataService.getAll(["*"], req.query);
            res.json(calendarios);*/
      const fechasImportantes = [
        {
          calendario_fecha_importante_id: 1,
          colegio_id: 1,
          curso_id: 101,
          calendario_escolar_id: 1,
          titulo: "Reunión de Apoderados",
          descripcion: "Primera reunión de apoderados del año escolar",
          fecha: new Date("2025-03-15"),
          tipo: "Reunión",
        },
        {
          calendario_fecha_importante_id: 2,
          colegio_id: 1,
          curso_id: 102,
          calendario_escolar_id: 1,
          titulo: "Entrega de Informes",
          descripcion: "Entrega de informes del primer trimestre",
          fecha: new Date("2025-06-10"),
          tipo: "Evaluación",
        },
        {
          calendario_fecha_importante_id: 3,
          colegio_id: 2,
          curso_id: 201,
          calendario_escolar_id: 2,
          titulo: "Día del Estudiante",
          descripcion: "Actividades recreativas para estudiantes",
          fecha: new Date("2025-05-11"),
          tipo: "Celebración",
        },
        {
          calendario_fecha_importante_id: 4,
          colegio_id: 3,
          curso_id: 301,
          calendario_escolar_id: 3,
          titulo: "Simulacro de Sismo",
          descripcion: "Ejercicio de evacuación en caso de sismo",
          fecha: new Date("2025-09-22"),
          tipo: "Simulacro",
        },
      ];
      res.json(fechasImportantes);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const calendarioActualizado = req.body;
      const resultado = await dataService.updateById(id, calendarioActualizado);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async guardar(req: Request, res: Response) {
    try {
      const nuevoCalendario = req.body;
      const resultado = await dataService.processData(nuevoCalendario);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const resultado = await dataService.deleteById(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

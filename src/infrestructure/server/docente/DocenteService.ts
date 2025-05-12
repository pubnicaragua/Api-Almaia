import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Docente } from "../../../core/modelo/colegio/Docente";

const dataService: DataService<Docente> = new DataService("docentes");
export const DocentesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const docente = await dataService.getAll(["*",
        "personas(persona_id,nombres,apellidos)",
        "colegios(colegio_id,nombre)"], where);
        res.json(docente);
     
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      //const id = parseInt(req.params.id);
      //const where = { docente_id: id }; // Convertir los parámetros de consulta en filtros
      /*const docente = await dataService.getAll(["*",
        "personas(persona_id,nombres,apellidos)",
        "colegios(colegio_id,nombre)"], where);*/
const docente= 
            {
              "docente_id": 1,
              "persona_id": 1,
              "colegio_id": 1,
              "especialidad": "Matemáticas",
              "estado": "Activo",
              "persona": {
                "persona_id": 1,
                "nombres": "Juan",
                "apellidos": "Pérez",
               },
              "colegio": {
                "colegio_id": 1,
                "nombre": "Colegio San Juan",
              }
            }
      res.json(docente);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const docente: Docente = req.body;
      const savedocente = await dataService.processData(docente);
      res.status(201).json(savedocente);
    } catch (error) {
      console.error("Error al guardar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const docente: Docente = req.body;
      await dataService.updateById(id, docente);
      res.status(200).json({ message: "docente actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "docente eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

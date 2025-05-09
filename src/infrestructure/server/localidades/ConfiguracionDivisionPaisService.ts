import { Request, Response } from "express";
import { DataService } from "../DataService";
import { ConfiguracionDivisionPais } from "../../../core/modelo/localidades/ConfiguracionDivisionPais";

const dataService: DataService<ConfiguracionDivisionPais> = new DataService("configuraciondivisionpaiss");
export const ConfiguracionDivisionPaisService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const configuraciondivisionpais = await dataService.getAll(["*"], where);
      res.json(configuraciondivisionpais);*/
      const configuracionesDivisionesPais = [
        {
          configuracion_division_pais_id: 1,
          pais: {
            nombre: "Chile"
          },
          configuracion_region: {
            configuracion_region_id: 1,
            nombre: "Región Metropolitana"
          },
          configuracion_comuna: {
            configuracion_comuna_id: 1,
            nombre: "Santiago"
          }
        }
      ];
      res.json(configuracionesDivisionesPais);
    } catch (error) {
      console.error("Error al obtener la configuraciondivisionpais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const configuraciondivisionpais: ConfiguracionDivisionPais = req.body;
      const savedconfiguraciondivisionpais = await dataService.processData(configuraciondivisionpais);
      res.status(201).json(savedconfiguraciondivisionpais);
    } catch (error) {
      console.error("Error al guardar la configuraciondivisionpais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const configuraciondivisionpais: ConfiguracionDivisionPais = req.body;
      await dataService.updateById(id, configuraciondivisionpais);
      res.status(200).json({ message: "configuraciondivisionpais actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la configuraciondivisionpais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "configuraciondivisionpais eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la configuraciondivisionpais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

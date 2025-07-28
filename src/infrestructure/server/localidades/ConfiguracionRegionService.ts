import { Request, Response } from "express";
import { DataService } from "../DataService";
import { ConfiguracionRegion } from "../../../core/modelo/localidades/ConfiguracionRegion";

const dataService: DataService<ConfiguracionRegion> = new DataService("configuracionregions");
export const ConfiguracionRegionService = {
  async obtener(req: Request, res: Response) {
    try {
      const configuracionesregiones = [
        {
          "configuracion_region_id": 1,
          "nombre": "Regiones Zona Norte"
        }
      ]
      res.json(configuracionesregiones);
    } catch (error) {
      console.error("Error al obtener la configuracionregion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const configuracionregion: ConfiguracionRegion = req.body;
      const savedconfiguracionregion = await dataService.processData(configuracionregion);
      res.status(201).json(savedconfiguracionregion);
    } catch (error) {
      console.error("Error al guardar la configuracionregion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const configuracionregion: ConfiguracionRegion = req.body;
      await dataService.updateById(id, configuracionregion);
      res.status(200).json({ message: "configuracionregion actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la configuracionregion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "configuracionregion eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la configuracionregion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

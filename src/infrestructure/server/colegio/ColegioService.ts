import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Colegio } from "../../../core/modelo/colegio/Colegio";

const dataService: DataService<Colegio> = new DataService("colegios");
export const ColegiosService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const colegio = await dataService.getAll(["*"], where);
        res.json(colegio);*/
      const colegios = [
        {
          colegio_id: 1,
          nombre: "Colegio Nacional",
          nombre_fantasia: "Nacional",
          tipo_colegio: "Privado",
          dependencia: "Independiente",
          sitio_web: "https://colegionacional.cl",
          direccion: "Av. Siempre Viva 123",
          telefono_contacto: "+56 9 1234 5678",
          correo_electronico: "contacto@colegionacional.cl",
          comuna_id: 101,
          region_id: 10,
          pais_id: 1,
          comuna: {
            comuna_id: 101,
            nombre: "Santiago Centro",
            region_id: 10,
            pais_id: 1,
          },
          region: {
            region_id: 10,
            nombre: "Región Metropolitana",
          },
          pais: {
            pais_id: 1,
            nombre: "Chile",
          },
        },
        {
          colegio_id: 2,
          nombre: "Instituto del Sur",
          nombre_fantasia: "IDS",
          tipo_colegio: "Público",
          dependencia: "Ministerio de Educación",
          sitio_web: "https://institutodelsur.cl",
          direccion: "Calle del Lago 456",
          telefono_contacto: "+56 9 8765 4321",
          correo_electronico: "info@institutodelsur.cl",
          comuna_id: 202,
          region_id: 20,
          pais_id: 1,
          comuna: {
            comuna_id: 202,
            nombre: "Puerto Montt",
            region_id: 20,
            pais_id: 1,
          },
          region: {
            region_id: 20,
            nombre: "Región de Los Lagos",
          },
          pais: {
            pais_id: 1,
            nombre: "Chile",
          },
        },
      ];
      res.json(colegios);
    } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const colegio: Colegio = req.body;
      const savedcolegio = await dataService.processData(colegio);
      res.status(201).json(savedcolegio);
    } catch (error) {
      console.error("Error al guardar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      const colegio: Colegio = req.body;
      const updatedcolegio = await dataService.updateById(colegioId, colegio);
      res.status(200).json(updatedcolegio);
    } catch (error) {
      console.error("Error al actualizar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  eliminar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      await dataService.deleteById(colegioId);
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

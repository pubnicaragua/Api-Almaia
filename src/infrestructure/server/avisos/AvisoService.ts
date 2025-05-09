import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Aviso } from "../../../core/modelo/aviso/Aviso";

const dataService: DataService<Aviso> = new DataService("avisos");
export const AvisosService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const aviso = await dataService.getAll(["*"], where);
      res.json(aviso);*/
      const avisos = [
        {
          aviso_id: 1,
          mensaje: "Reunión de padres el próximo viernes",
          dirigido: "3°A",
          fecha_programada: "2023-06-15T10:00:00Z",
          estado: "pendiente",
          docente: {
            docente_id: 123,
            especialidad: "Lenguaje y Comunicación",
            estado: "Activo",
            persona: {
              persona_id: 77,
              nombres: "Carla",
              apellidos: "Ramírez",
              rut: "12345678-5",
              fecha_nacimiento: "1985-08-12",
              genero: "Femenino",
              direccion: "Av. Central 456",
              telefono: "+56 9 1234 5678",
              correo: "carla.ramirez@colegio.cl"
            },
            colegio: {
              colegio_id: 3,
              nombre: "Colegio Bicentenario",
              nombre_fantasia: "CB",
              tipo_colegio: "Privado Subvencionado",
              dependencia: "Particular Subvencionado",
              sitio_web: "https://bicentenario.cl",
              direccion: "Calle Educación 321",
              telefono_contacto: "+56 9 9876 5432",
              correo_electronico: "contacto@bicentenario.cl",
              comuna_id: 12,
              region_id: 2,
              pais_id: 56
            }
          }
        }
      ];
      res.json(avisos);      
    } catch (error) {
      console.error("Error al obtener la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const aviso: Aviso = req.body;
      const savedaviso = await dataService.processData(aviso);
      res.status(201).json(savedaviso);
    } catch (error) {
      console.error("Error al guardar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const aviso: Aviso = req.body;
      await dataService.updateById(id, aviso);
      res.status(200).json({ message: "aviso actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "aviso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

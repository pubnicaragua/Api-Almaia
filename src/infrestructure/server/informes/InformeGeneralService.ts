import { Request, Response } from "express";
import { DataService } from "../DataService";
import { InformeGeneral } from "../../../core/modelo/InformeGeneral";

const dataService: DataService<InformeGeneral> = new DataService("alumnos_alertas");
export const InformeGeneralService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const informeGeneral = await dataService.getAll(["*"], where);
            res.json(informeGeneral);*/
            const informesGenerales = [
                {
                  "informe_id": 1,
                  "tipo": "Rendimiento Académico",
                  "nivel": "Enseñanza Básica",
                  "fecha_generacion": "2023-11-20T08:30:00Z",
                  "url_reporte": "https://colegioejemplo.cl/informes/rendimiento_basica_2023.pdf",
                  "colegio_id": 101,
                  
                  // Relación con colegio (opcional)
                  "colegios": [
                    {
                      "colegio_id": 101,
                      "nombre": "Colegio Santa María",
                      "tipo_colegio": "Particular Subvencionado"
                    }
                  ]
                },
                {
                  "informe_id": 2,
                  "tipo": "Asistencia Mensual",
                  "nivel": "Todos los niveles",
                  "fecha_generacion": "2023-11-01T09:15:00Z",
                  "url_reporte": "https://colegioejemplo.cl/informes/asistencia_nov_2023.xlsx",
                  "colegio_id": 101
                },
                {
                  "informe_id": 3,
                  "tipo": "Convivencia Escolar",
                  "nivel": "Enseñanza Media",
                  "fecha_generacion": "2023-10-15T14:00:00Z",
                  "url_reporte": "https://colegioejemplo.cl/informes/convivencia_media_2023.pdf",
                  "colegio_id": 101
                },
                {
                  "informe_id": 4,
                  "tipo": "Psicoemocional",
                  "nivel": "Prebásica",
                  "fecha_generacion": "2023-09-30T16:45:00Z",
                  "url_reporte": "https://colegioejemplo.cl/informes/psicoemocional_prekinder_2023.pdf",
                  "colegio_id": 102,
                  "colegios": [
                    {
                      "colegio_id": 102,
                      "nombre": "Colegio San Ignacio",
                      "tipo_colegio": "Particular"
                    }
                  ]
                }
              ];
            res.json(informesGenerales);
        } catch (error) {
            console.error("Error al obtener el informe general:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const informeGeneral: InformeGeneral = req.body;
            const savedInformeGeneral = await dataService.processData(informeGeneral);
            res.status(201).json(savedInformeGeneral);
        } catch (error) {
            console.error("Error al guardar el informe general:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    actualizar: async (req: Request, res: Response) => {
        try {
            const informeId = parseInt(req.params.id);
            const informeGeneral: InformeGeneral = req.body;
            const updatedInformeGeneral = await dataService.updateById(informeId, informeGeneral);
            res.status(200).json(updatedInformeGeneral);
        } catch (error) {
            console.error("Error al actualizar el informe general:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const informeId = parseInt(req.params.id);
            await dataService.deleteById(informeId);
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar el informe general:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
        
}
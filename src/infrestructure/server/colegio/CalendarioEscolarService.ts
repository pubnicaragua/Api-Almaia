import { Request, Response } from "express";
import { DataService } from "../DataService";
import { CalendarioEscolar } from "../../../core/modelo/colegio/CalendarioEscolar";

const dataService: DataService<CalendarioEscolar> = new DataService("calendarioescolars");
export const CalendarioEscolarsService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const calendarios = await dataService.getAll(["*"], req.query);
            res.json(calendarios);*/
            const calendariosEscolares = [
                {
                  calendario_escolar_id: 1,
                  colegio_id: 1,
                  ano_escolar: 2025,
                  fecha_inicio: new Date("2025-03-04"),
                  fecha_fin: new Date("2025-12-15"),
                  dias_habiles: 180
                },
                {
                  calendario_escolar_id: 2,
                  colegio_id: 2,
                  ano_escolar: 2025,
                  fecha_inicio: new Date("2025-02-26"),
                  fecha_fin: new Date("2025-12-10"),
                  dias_habiles: 185
                },
                {
                  calendario_escolar_id: 3,
                  colegio_id: 3,
                  ano_escolar: 2025,
                  fecha_inicio: new Date("2025-03-01"),
                  fecha_fin: new Date("2025-12-20"),
                  dias_habiles: 178
                }
              ];
            res.json(calendariosEscolares);              
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
    }

}
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { CalendarioDiaFestivo } from "../../../core/modelo/colegio/CalendarioDiaFestivo";

const dataService: DataService<CalendarioDiaFestivo> = new DataService("calendariodiafestivos");
export const CalendarioDiaFestivosService = {
    async obtener(req: Request, res: Response) {
        try {
           /* const calendarios = await dataService.getAll(["*"], req.query);
            res.json(calendarios);*/
            const diasFestivos = [
                {
                  calendario_dia_festivo: 1,
                  calendario_escolar_id: 1,
                  dia_festivo: new Date("2025-01-01"),
                  descripcion: "Año Nuevo"
                },
                {
                  calendario_dia_festivo: 2,
                  calendario_escolar_id: 1,
                  dia_festivo: new Date("2025-04-18"),
                  descripcion: "Viernes Santo"
                },
                {
                  calendario_dia_festivo: 3,
                  calendario_escolar_id: 1,
                  dia_festivo: new Date("2025-05-01"),
                  descripcion: "Día del Trabajador"
                },
                {
                  calendario_dia_festivo: 4,
                  calendario_escolar_id: 1,
                  dia_festivo: new Date("2025-09-18"),
                  descripcion: "Fiestas Patrias"
                },
                {
                  calendario_dia_festivo: 5,
                  calendario_escolar_id: 1,
                  dia_festivo: new Date("2025-12-25"),
                  descripcion: "Navidad"
                }
              ];
            res.json(diasFestivos);              
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async actualizar (req: Request, res: Response) {
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
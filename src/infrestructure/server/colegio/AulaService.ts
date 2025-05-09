import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Aula } from "../../../core/modelo/colegio/Aula";

const dataService: DataService<Aula> = new DataService("aulas");
export const AulasService = {
    async obtener(req: Request, res: Response) {
        try {
        /*const aulas = await dataService.getAll(["*"], req.query);
        res.json(aulas);*/
        const aulas = [
            {
              aula_id: 1,
              curso_id: 101,
              colegio_id: 1,
              materia_id: 1,
              docente_id: 501,
              tipo_docente: "Titular"
            },
            {
              aula_id: 2,
              curso_id: 102,
              colegio_id: 1,
              materia_id: 2,
              docente_id: 502,
              tipo_docente: "Suplente"
            },
            {
              aula_id: 3,
              curso_id: 103,
              colegio_id: 1,
              materia_id: 3,
              docente_id: 503,
              tipo_docente: "Apoyo"
            },
            {
              aula_id: 4,
              curso_id: 104,
              colegio_id: 2,
              materia_id: 4,
              docente_id: 504,
              tipo_docente: "Titular"
            }
          ];
        res.json(aulas);          
        } catch (error) {
        res.status(500).json(error);
        }
    },
    
    async guardar(req: Request, res: Response) {
        try {
        const nuevoAula = req.body;
        const resultado = await dataService.processData(nuevoAula);
        res.status(201).json(resultado);
        } catch (error) {
        res.status(500).json(error);
        }
    },
    
    async actualizar(req: Request, res: Response) {
        try {
        const aulaActualizada = req.body;
        const id = parseInt(req.params.id);
        const resultado = await dataService.updateById(id,aulaActualizada);
        res.json(resultado);
        } catch (error) {
        res.status(500).json(error);
        }
    },
    
    async eliminar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        await dataService.deleteById(id);
        res.status(204).send();
        } catch (error) {
        res.status(500).json(error);
        }
    }
}
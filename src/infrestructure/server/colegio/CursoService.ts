import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Curso } from "../../../core/modelo/colegio/Curso";

const dataService: DataService<Curso> = new DataService(
  "cursos"
);
export const CursosService = {
    async obtener(req: Request, res: Response) {
        try {
        /*const calendarios = await dataService.getAll(["*"], req.query);
                res.json(calendarios);*/
        const cursos = [
            {
            curso_id: 1,
            colegio_id: 1,
            nombre: "Primero Básico",
            nivel: "Básico",
            seccion: "A",
            anio_escolar: 2025,
            },
            {
            curso_id: 2,
            colegio_id: 1,
            nombre: "Segundo Básico",
            nivel: "Básico",
            seccion: "B",
            anio_escolar: 2025,
            },
            {
            curso_id: 3,
            colegio_id: 2,
            nombre: "Tercero Medio",
            nivel: "Medio",
            seccion: "C",
            anio_escolar: 2025,
            },
            {
            curso_id: 4,
            colegio_id: 3,
            nombre: "Cuarto Medio",
            nivel: "Medio",
            seccion: "D",
            anio_escolar: 2025,
            },
        ];
        res.json(cursos);
        } catch (error) {
        res.status(500).json(error);
        }
    },

    async guardar(req: Request, res: Response) {
        try {
            const nuevoCurso = req.body;
            const cursoCreado = await dataService.processData(nuevoCurso);
            res.status(201).json(cursoCreado);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const cursoId = parseInt(req.params.id);
            const cursoActualizado = req.body;
            const resultado = await dataService.updateById(cursoId, cursoActualizado);
            res.status(200).json(resultado);
           
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const cursoId = parseInt(req.params.id);
            await dataService.deleteById(cursoId);
            res.status(200).json({ message: "Curso eliminado" });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }    

}
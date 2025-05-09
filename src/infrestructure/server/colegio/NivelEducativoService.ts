import { Request, Response } from "express";
import { DataService } from "../DataService";
import { NivelEducativo } from "../../../core/modelo/colegio/NivelEducativo";

const dataService: DataService<NivelEducativo> = new DataService("niveleducativos");
export const NivelEducativosService = {

    async obtener(req: Request, res: Response) {
        try {
        /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const nivelEducativo = await dataService.getAll(["*"], where);
        res.json(nivelEducativo);*/
        const nivelesEducativos = [
            { nivel_educativo_id: 1, nombre: "1ro Básico" },
            { nivel_educativo_id: 2, nombre: "2do Básico" },
            { nivel_educativo_id: 3, nombre: "3ro Básico" },
            { nivel_educativo_id: 4, nombre: "4to Básico" },
            { nivel_educativo_id: 5, nombre: "5to Básico" },
            { nivel_educativo_id: 6, nombre: "6to Básico" },
            { nivel_educativo_id: 7, nombre: "7mo Básico" },
            { nivel_educativo_id: 8, nombre: "8vo Básico" },
            { nivel_educativo_id: 9, nombre: "1ro Medio" },
            { nivel_educativo_id: 10, nombre: "2do Medio" },
            { nivel_educativo_id: 11, nombre: "3ro Medio" },
            { nivel_educativo_id: 12, nombre: "4to Medio" }
          ];
        res.json(nivelesEducativos);
        } catch (error) {
        res.status(500).json( error);
        }
    },
    
    async guardar(req: Request, res: Response) {
        try {
        const nuevoNivelEducativo = req.body;
        const nivelEducativoCreado = await dataService.processData(nuevoNivelEducativo);
        res.status(201).json(nivelEducativoCreado);
        } catch (error) {
        res.status(500).json(error);
        }
    },
    
    async actualizar(req: Request, res: Response) {
        try {
        const nivelEducativoId = parseInt(req.params.id);
        const nivelEducativoActualizado = req.body;
        const nivelEducativo = await dataService.updateById(nivelEducativoId, nivelEducativoActualizado);
        res.json(nivelEducativo);
        } catch (error) {
        res.status(500).json(error);
        }
    },
    
    async eliminar(req: Request, res: Response) {
        try {
        const nivelEducativoId = parseInt(req.params.id);
        await dataService.deleteById(nivelEducativoId);
        res.status(204).send();
        } catch (error) {
        res.status(500).json(error);
        }
    },
}
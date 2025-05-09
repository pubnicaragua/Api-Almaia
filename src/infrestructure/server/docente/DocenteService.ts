import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Docente } from "../../../core/modelo/colegio/Docente";

const dataService: DataService<Docente> = new DataService("docentes");
export const DocentesService = {
    async obtener(req: Request, res: Response) {
        try {
        /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const docente = await dataService.getAll(["*"], where);
        res.json(docente);*/
        const docentes= [
            {
              "docente_id": 1,
              "persona_id": 1,
              "colegio_id": 1,
              "especialidad": "Matemáticas",
              "estado": "Activo",
              "persona": {
                "persona_id": 1,
                "tipo_documento": "DNI",
                "numero_documento": "12345678",
                "nombres": "Juan",
                "apellidos": "Pérez",
                "genero_id": 1,
                "estado_civil_id": 2
              },
              "colegio": {
                "colegio_id": 1,
                "nombre": "Colegio San Juan",
                "nombre_fantasia": "San Juan",
                "tipo_colegio": "Privado",
                "direccion": "Calle Principal 123",
                "telefono_contacto": "+56912345678",
                "correo_electronico": "contacto@colegiosanjuan.cl",
                "comuna_id": 101,
                "region_id": 13,
                "pais_id": 1
              }
            }
          ]
        res.json(docentes);
        } catch (error) {
        console.error("Error al obtener el docente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
        const docente: Docente = req.body;
        const savedocente = await dataService.processData(docente);
        res.status(201).json(savedocente);
        } catch (error) {
        console.error("Error al guardar el docente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        const docente: Docente = req.body;
        await dataService.updateById(id, docente);
        res.status(200).json({ message: "docente actualizado correctamente" });
        } catch (error) {
        console.error("Error al actualizar el docente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        await dataService.deleteById(id);
        res.status(200).json({ message: "docente eliminado correctamente" });
        } catch (error) {
        console.error("Error al eliminar el docente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
            

}
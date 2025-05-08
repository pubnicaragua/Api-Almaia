import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoDireccion } from "../../../core/modelo/alumno/AlumnoDireccion";

const dataService: DataService<AlumnoDireccion> = new DataService("alumnos_alertas");
export const AlumnoDireccionService = {

    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoDireccion = await dataService.getAll(["*"], where);
            res.json(alumnoDireccion);*/
           const alumnos_direcciones= [
                {
                  "alumno_direccion_id": 701,
                  "alumno_id": 101,
                  "descripcion": "Av. Principal 1234, Depto 501",
                  "es_principal": true,
                  "ubicaciones_mapa": "-33.45694, -70.64827",
                  "comuna_id": 125,
                  "region_id": 13,
                  "pais_id": 1,
                  "fecha_actualizacion": "2023-06-15T10:30:00Z",
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "curso_actual": "4° Básico A"
                  },
                  "comuna": {
                    "comuna_id": 125,
                    "nombre": "Santiago",
                    "region": {
                      "region_id": 13,
                      "nombre": "Metropolitana",
                      "pais": {
                        "pais_id": 1,
                        "nombre": "Chile"
                      }
                    }
                  }
                },
                {
                  "alumno_direccion_id": 702,
                  "alumno_id": 102,
                  "descripcion": "Calle Secundaria 567, Casa B",
                  "es_principal": false,
                  "ubicaciones_mapa": "-33.45872, -70.65011",
                  "comuna_id": 126,
                  "region_id": 13,
                  "pais_id": 1,
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "María González"
                  },
                  "comuna": {
                    "comuna_id": 126,
                    "nombre": "Providencia"
                  }
                }
              ]
            res.json(alumnos_direcciones);
        } catch (error) {
            console.error("Error al obtener la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoDireccion: AlumnoDireccion = req.body;
            const savedAlumnoDireccion = await dataService.processData(alumnoDireccion);
            res.status(201).json(savedAlumnoDireccion);
        } catch (error) {
            console.error("Error al guardar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoDireccion: AlumnoDireccion = req.body;
            await dataService.updateById(id, alumnoDireccion);
            res.status(200).json({ message: "Dirección del alumno actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Dirección del alumno eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
        
}
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { DocenteCurso } from "../../../core/modelo/colegio/DocenteCurso";

const dataService: DataService<DocenteCurso> = new DataService("docentecursos");
export const DocenteCursosService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const docente = await dataService.getAll(["*"], where);
            res.json(docente);*/
            const asignaciones = [
                {
                  id: 1,
                  año: 2023,
                  docente: {
                    docente_id: 1,
                    persona: {
                      persona_id: 1,
                      nombres: "Juan",
                      apellidos: "Pérez",
                      rut: "12345678-9",
                      fecha_nacimiento: "1980-05-15",
                      genero: "Masculino",
                      direccion: "Calle Falsa 123",
                      telefono: "+56 9 8765 4321",
                      correo: "juan.perez@colegio.cl"
                    },
                    colegio: {
                      colegio_id: 1,
                      nombre: "Colegio Nacional",
                      nombre_fantasia: "CN",
                      tipo_colegio: "Público",
                      dependencia: "Ministerio de Educación",
                      sitio_web: "https://colegionacional.cl",
                      direccion: "Av. Principal 123",
                      telefono_contacto: "+56 9 1234 5678",
                      correo_electronico: "info@colegionacional.cl",
                      comuna_id: 101,
                      region_id: 5,
                      pais_id: 56
                    },
                    especialidad: "Matemáticas",
                    estado: "Activo"
                  },
                  curso: {
                    curso_id: 5,
                    nombre: "3° Medio B",
                    nivel: "Media",
                    jornada: "AM",
                    año_escolar: 2023
                  }
                }
              ];
            res.json(asignaciones);              
        } catch (error) {
            console.error("Error al obtener el docente:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const docente: DocenteCurso = req.body;
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
            const docente: DocenteCurso = req.body;
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
    }
}
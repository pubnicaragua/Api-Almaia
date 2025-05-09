import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAsistencia } from "../../../core/modelo/colegio/AlumnoAsistencia";

const dataService: DataService<AlumnoAsistencia> = new DataService("alumnoasistencias");
export const AlumnoAsistenciasService = {
    async obtener(req: Request, res: Response) {
        try {
        /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const alumnoasistencias = await dataService.getAll(["*"], where);
        res.json(alumnoasistencias);*/
        const asistenciasAlumnos = [
            {
              alumno_asistencia_id: 1,
              alumno_id: 101,
              fecha_hora: new Date("2025-05-09T08:00:00"),
              estado: "Presente",
              justificacion: "",
              usuario_justifica: 0
            },
            {
              alumno_asistencia_id: 2,
              alumno_id: 102,
              fecha_hora: new Date("2025-05-09T08:00:00"),
              estado: "Ausente",
              justificacion: "Enfermedad",
              usuario_justifica: 201
            },
            {
              alumno_asistencia_id: 3,
              alumno_id: 103,
              fecha_hora: new Date("2025-05-09T08:00:00"),
              estado: "Atraso",
              justificacion: "Problemas de transporte",
              usuario_justifica: 202
            },
            {
              alumno_asistencia_id: 4,
              alumno_id: 104,
              fecha_hora: new Date("2025-05-09T08:00:00"),
              estado: "Presente",
              justificacion: "",
              usuario_justifica: 0
            }
          ];
        res.json(asistenciasAlumnos);          
        } catch (error) {
        res.status(500).json( error);
        }
    },
    
    async guardar(req: Request, res: Response) {
        try {
        const nuevoAlumnoAsistencia = req.body;
        const resultado = await dataService.processData(nuevoAlumnoAsistencia);
        res.status(201).json(resultado);
        } catch (error) {
        res.status(500).json( error);
        }
    },
    
    async actualizar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        const datosActualizados = req.body;
        const resultado = await dataService.updateById(id, datosActualizados);
        res.json(resultado);
        } catch (error) {
        res.status(500).json( error);
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
    },

}
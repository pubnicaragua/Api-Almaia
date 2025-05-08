import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAntecedenteClinico } from "../../../core/modelo/alumno/AlumnoAntecedenteClinico";

const dataService: DataService<AlumnoAntecedenteClinico> = new DataService("alumnos_antecedentes_clinicos");
export const AlumnoAntecedenteClinicosService = {

    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const antecedentes = await dataService.getAll(["*"], where);
            res.json(antecedentes);*/
            const antecedentes = [
                {
                  "alumno_ant_clinico_id": 401,
                  "alumno_id": 101,
                  "historial_medico": "Vacunas completas, parto normal",
                  "alergias": "Penicilina, polvo",
                  "enfermedades_cronicas": "Asma leve controlado",
                  "condiciones_medicas_relevantes": "Uso de inhalador ocasional",
                  "medicamentos_actuales": "Salbutamol PRN",
                  "diagnosticos_previos": "Bronquitis a los 5 años",
                  "terapias_tratamiento_curso": "Ninguna actualmente",
                  "fecha_actualizacion": "2023-06-15T09:30:00Z",
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "fecha_nacimiento": "2012-05-15",
                    "curso_actual": "4° Básico A"
                  }
                },
                {
                  "alumno_ant_clinico_id": 402,
                  "alumno_id": 102,
                  "historial_medico": "Nacimiento por cesárea",
                  "alergias": "Ninguna conocida",
                  "enfermedades_cronicas": null,
                  "condiciones_medicas_relevantes": "Uso lentes desde 2022",
                  "medicamentos_actuales": null,
                  "diagnosticos_previos": "Varicela a los 3 años",
                  "terapias_tratamiento_curso": "Terapia visual",
                  "fecha_actualizacion": "2023-05-20T14:15:00Z",
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "María González",
                    "fecha_nacimiento": "2011-08-22",
                    "curso_actual": "5° Básico B"
                  }
                }
              ]
            res.json(antecedentes);
        } catch (error) {
            console.error("Error al obtener los antecedentes clínicos:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const antecedente: AlumnoAntecedenteClinico = req.body;
            const savedAntecedente = await dataService.processData(antecedente);
            res.status(201).json(savedAntecedente);
        } catch (error) {
            console.error("Error al guardar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const antecedente: AlumnoAntecedenteClinico = req.body;
            await dataService.updateById(id, antecedente);
            res.status(200).json({ message: "Antecedente clínico actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Antecedente clínico eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }


}
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlertaBitacora } from "../../../core/modelo/alumno/AlumnoAlertaBitacora";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

const dataService: DataService<AlumnoAlertaBitacora> = new DataService(
  "alumnos_alertas_bitacoras"
);
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoAlertaBitacoraService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoAlertaBitacora = await dataService.getAll(["*"], where);
      res.json(alumnoAlertaBitacora);
    } catch (error) {
      console.error("Error al obtener la alerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoAlertaBitacora: AlumnoAlertaBitacora =
        new AlumnoAlertaBitacora();
      Object.assign(alumnoAlertaBitacora, req.body);
        const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoAlertaBitacora.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }        const { data:dataAlumnoAlerta, error:errorAlumnoAlerta } = await client
        .from("alumnos_alertas")
        .select("*")
        .eq("alumno_alerta_id", alumnoAlertaBitacora.alumno_alerta_id)
        .single();
      if (errorAlumnoAlerta || !dataAlumnoAlerta) {
        throw new Error("La Alerta no existe");
      }
      alumnoAlertaBitacora.creado_por = req.creado_por;
      alumnoAlertaBitacora.actualizado_por = req.actualizado_por;
      const savedAlumnoAlertaBitacora = await dataService.processData(
        alumnoAlertaBitacora
      );
      res.status(201).json(savedAlumnoAlertaBitacora);
    } catch (error) {
     res.status(500).json({ message: (error as Error).message });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoAlertaBitacora: AlumnoAlertaBitacora =
        new AlumnoAlertaBitacora();
      Object.assign(alumnoAlertaBitacora, req.body);
      alumnoAlertaBitacora.creado_por = req.creado_por;
      alumnoAlertaBitacora.actualizado_por = req.actualizado_por;
      await dataService.updateById(id, alumnoAlertaBitacora);
      res
        .status(200)
        .json({ message: "Alumno Alerta Bitácora actualizada correctamente" });
    } catch (error) {
     res.status(500).json({ message: (error as Error).message });

    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Alumno Alerta Bitácora eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

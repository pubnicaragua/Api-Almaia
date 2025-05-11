import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { FuncionalidadRol } from "../../../core/modelo/auth/FuncionalidadRol";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<FuncionalidadRol> = new DataService(
  "funcionalidades_roles"
);
const FuncionalidadRolSchema = Joi.object({
  id_rol: Joi.number().integer().required(),
  id_funcionalidad: Joi.number().integer().required(),
});
export const FuncionalidadRolService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const FuncionalidadRol = await dataService.getAll(
        [
          "*",
          "funcionalidades(funcionalidad_id,nombre)",
          "roles(rol_id,nombre)",
        ],
        where
      );
      res.json(FuncionalidadRol);
    } catch (error) {
      console.error("Error al obtener la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const funcionalidadRol: FuncionalidadRol = new FuncionalidadRol();
      Object.assign(funcionalidadRol, req.body);
      funcionalidadRol.creado_por = req.creado_por;
      funcionalidadRol.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = FuncionalidadRolSchema.validate(
        req.body
      );
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      const { data: dataRoles, error: errorRoles } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", funcionalidadRol.rol_id)
        .single();
      if (errorRoles || !dataRoles) {
        throw new Error("El rol no existe");
      }
      const { data: dataFuncionalidades, error: errorFuncionalidades } =
        await client
          .from("funcionalidades")
          .select("*")
          .eq("funcionalidad_id", funcionalidadRol.funcionalidad_id)
          .single();
      if (errorFuncionalidades || !dataFuncionalidades) {
        throw new Error("La funcionalidad no existe");
      }
      if (!responseSent) {
        const savedFuncionalidadRol = await dataService.processData(
          funcionalidadRol
        );
        res.status(201).json(savedFuncionalidadRol);
      }
    } catch (error) {
      console.error("Error al guardar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const funcionalidadRol: FuncionalidadRol = new FuncionalidadRol();
      Object.assign(funcionalidadRol, req.body);
      funcionalidadRol.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = FuncionalidadRolSchema.validate(
        req.body
      );
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      const { data: dataRoles, error: errorRoles } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", funcionalidadRol.rol_id)
        .single();
      if (errorRoles || !dataRoles) {
        throw new Error("El rol no existe");
      }
      const { data: dataFuncionalidades, error: errorFuncionalidades } =
        await client
          .from("funcionalidades")
          .select("*")
          .eq("funcionalidad_id", funcionalidadRol.funcionalidad_id)
          .single();
      if (errorFuncionalidades || !dataFuncionalidades) {
        throw new Error("La funcionalidad no existe");
      }
      if (!responseSent) {
        await dataService.updateById(id, funcionalidadRol);
        res
          .status(200)
          .json({ message: "FuncionalidadRol actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "FuncionalidadRol eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

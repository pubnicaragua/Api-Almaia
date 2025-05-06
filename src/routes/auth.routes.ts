import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
import { RolesService } from '../infrestructure/server/auth/RolesService';
import { FuncionalidadesService } from '../infrestructure/server/auth/Funcionalidades';
import { FuncionalidadRolService } from '../infrestructure/server/auth/FuncionalidadRolService';
const router = express.Router();
const ruta_roles = '/roles';
const ruta_funcionalidades = '/funcionalidades';
const ruta_funcionalidades_roles = '/funcionalidades_roles';
router.post('/', sessionAuth, AuthService.login);
router.post('/', sessionAuth, AuthService.register);
router.post('/', sessionAuth, AuthService.changePassword);
//Roles
router.get(ruta_roles+'/', sessionAuth, RolesService.obtener);
router.post(ruta_roles+'/', sessionAuth, RolesService.guardar);
router.put(ruta_roles+'/:id', sessionAuth, RolesService.actualizar);
router.delete(ruta_roles+'/:id', sessionAuth, RolesService.eliminar);
//Funcionalidades
router.get(ruta_funcionalidades+'/', sessionAuth, FuncionalidadesService.obtener);
router.post(ruta_funcionalidades+'/', sessionAuth, FuncionalidadesService.guardar);
router.put(ruta_funcionalidades+'/:id', sessionAuth, FuncionalidadesService.actualizar);
router.delete(ruta_funcionalidades+'/:id', sessionAuth, FuncionalidadesService.eliminar);
//Funcionalidades roles
router.get(ruta_funcionalidades_roles+'/', sessionAuth, FuncionalidadRolService.obtener);
router.post(ruta_funcionalidades_roles+'/', sessionAuth, FuncionalidadRolService.guardar);
router.put(ruta_funcionalidades_roles+'/:id', sessionAuth, FuncionalidadRolService.actualizar);
router.delete(ruta_funcionalidades_roles+'/:id', sessionAuth, FuncionalidadRolService.eliminar);
export default router;
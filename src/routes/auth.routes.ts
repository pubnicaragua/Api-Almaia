import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
import { RolesService } from '../infrestructure/server/auth/RolesService';
import { FuncionalidadesService } from '../infrestructure/server/auth/Funcionalidades';
const router = express.Router();
const ruta_roles = '/roles';
const ruta_funcionalidades = '/funcionalidades';
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
export default router;
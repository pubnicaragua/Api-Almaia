import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
import { RolesService } from '../infrestructure/server/auth/RolesService';
const router = express.Router();
const ruta_roles = '/roles';
router.post('/', sessionAuth, AuthService.login);
router.post('/', sessionAuth, AuthService.register);
router.post('/', sessionAuth, AuthService.changePassword);
//Roles
router.get(ruta_roles+'/', sessionAuth, RolesService.obtener);
router.post(ruta_roles+'/', sessionAuth, RolesService.guardar);
router.put(ruta_roles+'/:id', sessionAuth, RolesService.actualizar);
router.delete(ruta_roles+'/:id', sessionAuth, RolesService.eliminar);
export default router;
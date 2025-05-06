import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AvisosService } from '../infrestructure/server/avisos/AvisoService';
import { MotorAvisoService } from '../infrestructure/server/avisos/MotorAvisoService';
const router = express.Router();
const ruta_avisos = '/avisos';
const ruta_motor_avisos = '/motor_avisos';

//Avisos
router.get(ruta_avisos+'/', sessionAuth, AvisosService.obtener);
router.post(ruta_avisos+'/', sessionAuth, AvisosService.guardar);
router.put(ruta_avisos+'/:id', sessionAuth, AvisosService.actualizar);
router.delete(ruta_avisos+'/:id', sessionAuth, AvisosService.eliminar);
//Funcionalidades
router.get(ruta_motor_avisos+'/', sessionAuth, MotorAvisoService.obtener);
router.post(ruta_motor_avisos+'/', sessionAuth, MotorAvisoService.guardar);
router.put(ruta_motor_avisos+'/:id', sessionAuth, MotorAvisoService.actualizar);
router.delete(ruta_motor_avisos+'/:id', sessionAuth, MotorAvisoService.eliminar);

export default router;
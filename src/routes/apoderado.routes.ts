import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
const router = express.Router();
import { ApoderadoService } from '../infrestructure/server/apoderado/ApoderadoService';
import { AlumnoApoderadoService } from '../infrestructure/server/apoderado/AlumnoApoderadoService';
import { ApoderadoDireccionService } from '../infrestructure/server/apoderado/ApoderadoDireccionService';

const ruta_apoderados = '/apoderados';
const ruta_alumnos_apoderados = '/alumnos_apoderados';
const ruta_apoderados_direcciones = '/apoderados_direcciones';
router.get(ruta_apoderados+'/', sessionAuth, ApoderadoService.obtener);
router.post(ruta_apoderados+'/', sessionAuth, ApoderadoService.guardar);
router.put(ruta_apoderados+'/:id', sessionAuth, ApoderadoService.actualizar);
router.delete(ruta_apoderados+'/:id', sessionAuth, ApoderadoService.eliminar);

router.get(ruta_alumnos_apoderados+'/', sessionAuth, AlumnoApoderadoService.obtener);
router.post(ruta_alumnos_apoderados+'/', sessionAuth, AlumnoApoderadoService.guardar);
router.put(ruta_alumnos_apoderados+'/:id', sessionAuth, AlumnoApoderadoService.actualizar);
router.delete(ruta_alumnos_apoderados+'/:id', sessionAuth, AlumnoApoderadoService.eliminar);

router.get(ruta_apoderados_direcciones+'/', sessionAuth, ApoderadoDireccionService.obtener);
router.post(ruta_apoderados_direcciones+'/', sessionAuth, ApoderadoDireccionService.guardar);
router.put(ruta_apoderados_direcciones+'/:id', sessionAuth, ApoderadoDireccionService.actualizar);
router.delete(ruta_apoderados_direcciones+'/:id', sessionAuth, ApoderadoDireccionService.eliminar);

export default router;
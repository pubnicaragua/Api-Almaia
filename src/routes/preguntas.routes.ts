import express from 'express';
import { PreguntaService } from "../infrestructure/server/PreguntaService";
import { sessionAuth } from '../middleware/supabaseMidleware';
const router = express.Router();
router.get('/', sessionAuth, PreguntaService.obtener);
router.post('/', sessionAuth, PreguntaService.guardar);
router.put('/:id', sessionAuth, PreguntaService.actualizar);
router.delete('/:id', sessionAuth, PreguntaService.eliminar);
export default router;
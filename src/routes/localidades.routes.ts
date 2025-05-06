import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { PaisService } from '../infrestructure/server/localidades/PaisService';
const router = express.Router();
const ruta_paises = '/paises';
const ruta_regiones = '/regiones';


//Paises
router.get(ruta_paises+'/', sessionAuth, PaisService.obtener);
router.post(ruta_paises+'/', sessionAuth, PaisService.guardar);
router.put(ruta_paises+'/:id', sessionAuth, PaisService.actualizar);
router.delete(ruta_paises+'/:id', sessionAuth, PaisService.eliminar);

// regiones
router.get(ruta_regiones+'/', sessionAuth, PaisService.obtener);
router.post(ruta_regiones+'/', sessionAuth, PaisService.guardar);    
router.put(ruta_regiones+'/:id', sessionAuth, PaisService.actualizar);
router.delete(ruta_regiones+'/:id', sessionAuth, PaisService.eliminar);


export default router;
import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AlertaEvidenciasService } from '../infrestructure/server/alertas/AlertaEvidenciaService';
import { AlertaOrigenesService } from '../infrestructure/server/alertas/AlertaOrigenService';
import { AlertaPrioridadsService } from '../infrestructure/server/alertas/AlertaPrioridadService';
import { AlertaReglasService } from '../infrestructure/server/alertas/AlertaReglaService';
import { AlertaSeveridadesService } from '../infrestructure/server/alertas/AlertaSeveridadService';
import { AlertaTiposService } from '../infrestructure/server/alertas/AlertaTipoService';
import { MotorAlertasService } from '../infrestructure/server/alertas/MotorAlertaService';
import { MotorInformesService } from '../infrestructure/server/alertas/MotorInformeService';
import { MotorPreguntasService } from '../infrestructure/server/alertas/MotorPreguntaService';

const router = express.Router();

const ruta_alertas_evidencias = '/alertas_evidencias';
const ruta_alertas_origenes = '/alertas_origenes';
const ruta_alertas_prioridades = '/alertas_prioridades';
const ruta_alertas_reglas = '/alertas_reglas';
const ruta_alertas_severidades = '/alertas_severidades';
const ruta_alertas_tipos = '/alertas_tipos';
const ruta_motores_alertas = '/motores_alertas';
const ruta_motores_informes = '/motores_informes';
const ruta_motores_preguntas = '/motores_preguntas';



router.get(ruta_alertas_evidencias+'/', sessionAuth, AlertaEvidenciasService.obtener);
router.post(ruta_alertas_evidencias+'/', sessionAuth, AlertaEvidenciasService.guardar);
router.put(ruta_alertas_evidencias+'/:id', sessionAuth, AlertaEvidenciasService.actualizar);
router.delete(ruta_alertas_evidencias+'/:id', sessionAuth, AlertaEvidenciasService.eliminar);


router.get(ruta_alertas_origenes+'/', sessionAuth, AlertaOrigenesService.obtener);
router.post(ruta_alertas_origenes+'/', sessionAuth, AlertaOrigenesService.guardar);
router.put(ruta_alertas_origenes+'/:id', sessionAuth, AlertaOrigenesService.actualizar);
router.delete(ruta_alertas_origenes+'/:id', sessionAuth, AlertaOrigenesService.eliminar);

router.get(ruta_alertas_prioridades+'/', sessionAuth, AlertaPrioridadsService.obtener);
router.post(ruta_alertas_prioridades+'/', sessionAuth, AlertaPrioridadsService.guardar);
router.put(ruta_alertas_prioridades+'/:id', sessionAuth, AlertaPrioridadsService.actualizar);
router.delete(ruta_alertas_prioridades+'/:id', sessionAuth, AlertaPrioridadsService.eliminar);

router.get(ruta_alertas_reglas+'/', sessionAuth, AlertaReglasService.obtener);
router.post(ruta_alertas_reglas+'/', sessionAuth, AlertaReglasService.guardar);
router.put(ruta_alertas_reglas+'/:id', sessionAuth, AlertaReglasService.actualizar);
router.delete(ruta_alertas_reglas+'/:id', sessionAuth, AlertaReglasService.eliminar);

router.get(ruta_alertas_severidades+'/', sessionAuth, AlertaSeveridadesService.obtener);
router.post(ruta_alertas_severidades+'/', sessionAuth, AlertaSeveridadesService.guardar);
router.put(ruta_alertas_severidades+'/:id', sessionAuth, AlertaSeveridadesService.actualizar);
router.delete(ruta_alertas_severidades+'/:id', sessionAuth, AlertaSeveridadesService.eliminar);

router.get(ruta_alertas_tipos+'/', sessionAuth, AlertaTiposService.obtener);
router.post(ruta_alertas_tipos+'/', sessionAuth, AlertaTiposService.guardar);
router.put(ruta_alertas_tipos+'/:id', sessionAuth, AlertaTiposService.actualizar);
router.delete(ruta_alertas_tipos+'/:id', sessionAuth, AlertaTiposService.eliminar);

router.get(ruta_motores_alertas+'/', sessionAuth, MotorAlertasService.obtener);
router.post(ruta_motores_alertas+'/', sessionAuth, MotorAlertasService.guardar);
router.put(ruta_motores_alertas+'/:id', sessionAuth, MotorAlertasService.actualizar);
router.delete(ruta_motores_alertas+'/:id', sessionAuth, MotorAlertasService.eliminar);


router.get(ruta_motores_informes+'/', sessionAuth, MotorInformesService.obtener);
router.post(ruta_motores_informes+'/', sessionAuth, MotorInformesService.guardar);
router.put(ruta_motores_informes+'/:id', sessionAuth, MotorInformesService.actualizar);
router.delete(ruta_motores_informes+'/:id', sessionAuth, MotorInformesService.eliminar);


router.get(ruta_motores_preguntas+'/', sessionAuth, MotorPreguntasService.obtener);
router.post(ruta_motores_preguntas+'/', sessionAuth, MotorPreguntasService.guardar);
router.put(ruta_motores_preguntas+'/:id', sessionAuth, MotorPreguntasService.actualizar);
router.delete(ruta_motores_preguntas+'/:id', sessionAuth, MotorPreguntasService.eliminar);
export default router;
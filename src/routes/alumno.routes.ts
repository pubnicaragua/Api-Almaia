import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AlumnosService } from '../infrestructure/server/alumno/AlumnoService';
import { ActividadsService } from '../infrestructure/server/alumno/ActividadService';
import { AlumnoAlertaService } from '../infrestructure/server/alumno/AlumnoAlertaService';
import { AlumnoAlertaBitacoraService } from '../infrestructure/server/alumno/AlumnoAlertaBitacoraService';
import { AlumnoAntecedenteClinicosService } from '../infrestructure/server/alumno/AlumnoAntecedenteClinicoService';
import { AlumnoAntecedenteFamiliarsService } from '../infrestructure/server/alumno/AlumnoAntecedenteFamiliarService';
import { AlumnoCursoService } from '../infrestructure/server/alumno/AlumnoCursoService';
import { AlumnoDireccionService } from '../infrestructure/server/alumno/AlumnoDireccionService';
import { AlumnoNotificacionService } from '../infrestructure/server/alumno/AlumnoNotificacionService';
import { AlumnoMonitoreoService } from '../infrestructure/server/alumno/AlumnoMonitoreoService';

const router = express.Router();

const ruta_actividades = '/actividades';
const ruta_alumnos_alertas = '/alertas';
const ruta_alumnos_alertas_bitacoras = '/alertas_bitacoras';
const ruta_alumnos_antecedentes_clinicos = '/antecedentes_clinicos';
const ruta_alumnos_antecedentes_familiares = '/antecedentes_familiares';
const ruta_alumnos_cursos = '/cursos';
const ruta_alumnos_direcciones = '/direcciones';
const ruta_alumnos_monitoreos = '/monitoreos';
const ruta_alumnos_notificaciones = '/notificaciones';

/**
 * @swagger
 * tags:
 *   - name: Alumnos
 *     description: Gestión de datos de alumnos
 *   - name: Actividades
 *     description: Gestión de actividades de alumnos
 *   - name: Alertas
 *     description: Gestión de alertas de alumnos
 *   - name: Antecedentes
 *     description: Gestión de antecedentes médicos y familiares
 *   - name: Cursos
 *     description: Gestión de cursos de alumnos
 *   - name: Direcciones
 *     description: Gestión de direcciones de alumnos
 *   - name: Monitoreos
 *     description: Gestión de monitoreos de alumnos
 *   - name: Notificaciones
 *     description: Gestión de notificaciones de alumnos
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Actividad:
 *       type: object
 *       properties:
 *         actividad_id:
 *           type: integer
 *           description: ID único de la actividad
 *         nombre:
 *           type: string
 *           description: Nombre de la actividad
 *       required:
 *         - nombre
 * 
 *     Alumno:
 *       type: object
 *       properties:
 *         alumno_id:
 *           type: integer
 *           description: ID único del alumno
 *         colegio_id:
 *           type: integer
 *           description: ID del colegio asociado
 *         url_foto_perfil:
 *           type: string
 *           description: URL de la foto de perfil del alumno
 *         telefono_contacto1:
 *           type: string
 *           description: Teléfono de contacto principal
 *         email:
 *           type: string
 *           description: Email de contacto
 *         telefono_contacto2:
 *           type: string
 *           description: Teléfono de contacto secundario
 *       required:
 *         - colegio_id
 * 
 *     AlumnoActividad:
 *       type: object
 *       properties:
 *         alumno_actividad_id:
 *           type: integer
 *           description: ID único de la relación alumno-actividad
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno
 *         actividad_id:
 *           type: integer
 *           description: ID de la actividad
 *       required:
 *         - alumno_id
 *         - actividad_id
 * 
 *     AlumnoAlerta:
 *       type: object
 *       properties:
 *         alumno_alerta_id:
 *           type: integer
 *           description: ID único de la alerta
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         alerta_regla_id:
 *           type: integer
 *           description: ID de la regla que generó la alerta
 *         fecha_generada:
 *           type: string
 *           format: date-time
 *           description: Fecha de generación de la alerta
 *         fecha_resolucion:
 *           type: string
 *           format: date-time
 *           description: Fecha de resolución de la alerta
 *         alerta_origen_id:
 *           type: integer
 *           description: ID del origen de la alerta
 *         prioridad_id:
 *           type: integer
 *           description: ID de la prioridad de la alerta
 *         severidad_id:
 *           type: integer
 *           description: ID de la severidad de la alerta
 *         accion_tomada:
 *           type: string
 *           description: Acción tomada para resolver la alerta
 *         leida:
 *           type: boolean
 *           description: Indica si la alerta ha sido leída
 *         responsable_actual_id:
 *           type: integer
 *           description: ID del responsable actual de la alerta
 *         estado:
 *           type: string
 *           description: Estado actual de la alerta
 *         alertas_tipo_alerta_tipo_id:
 *           type: integer
 *           description: ID del tipo de alerta
 *       required:
 *         - alumno_id
 *         - alerta_regla_id
 *         - fecha_generada
 *         - alerta_origen_id
 *         - prioridad_id
 *         - severidad_id
 *         - leida
 *         - estado
 *         - alertas_tipo_alerta_tipo_id
 * 
 *     AlumnoAlertaBitacora:
 *       type: object
 *       properties:
 *         alumno_alerta_bitacora_id:
 *           type: integer
 *           description: ID único de la bitácora
 *         alumno_alerta_id:
 *           type: integer
 *           description: ID de la alerta asociada
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         plan_accion:
 *           type: string
 *           description: Plan de acción definido
 *         fecha_compromiso:
 *           type: string
 *           format: date-time
 *           description: Fecha de compromiso para la acción
 *         fecha_realizacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de realización de la acción
 *         url_archivo:
 *           type: string
 *           description: URL del archivo asociado
 *       required:
 *         - alumno_alerta_id
 *         - alumno_id
 *         - plan_accion
 * 
 *     AlumnoAntecedenteClinico:
 *       type: object
 *       properties:
 *         alumno_ant_clinico_id:
 *           type: integer
 *           description: ID único del antecedente clínico
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         historial_medico:
 *           type: string
 *           description: Historial médico del alumno
 *         alergias:
 *           type: string
 *           description: Alergias conocidas
 *         enfermedades_cronicas:
 *           type: string
 *           description: Enfermedades crónicas
 *         condiciones_medicas_relevantes:
 *           type: string
 *           description: Condiciones médicas relevantes
 *         medicamentos_actuales:
 *           type: string
 *           description: Medicamentos actuales
 *         diagnosticos_previos:
 *           type: string
 *           description: Diagnósticos previos
 *         terapias_tratamiento_curso:
 *           type: string
 *           description: Terapias o tratamientos en curso
 *       required:
 *         - alumno_id
 * 
 *     AlumnoAntecedenteFamiliar:
 *       type: object
 *       properties:
 *         alumno_ent_familiar:
 *           type: integer
 *           description: ID único del antecedente familiar
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         informacion_socio_economica:
 *           type: string
 *           description: Información socioeconómica
 *         composicion_familiar:
 *           type: string
 *           description: Composición familiar
 *         situacion_laboral_padres:
 *           type: string
 *           description: Situación laboral de los padres
 *         recursos_disponibles:
 *           type: string
 *           description: Recursos disponibles
 *         dinamica_familiar:
 *           type: string
 *           description: Dinámica familiar
 *         relaciones_familiares:
 *           type: string
 *           description: Relaciones familiares
 *         apoyo_emocional:
 *           type: string
 *           description: Apoyo emocional
 *         factores_riesgo:
 *           type: string
 *           description: Factores de riesgo
 *         observaciones_entrevistador:
 *           type: string
 *           description: Observaciones del entrevistador
 *         resumen_entrevista:
 *           type: string
 *           description: Resumen de la entrevista
 *         impresiones_recomendaciones:
 *           type: string
 *           description: Impresiones y recomendaciones
 *         procesos_pisicoteurapeuticos_adicionales:
 *           type: string
 *           description: Procesos psicoterapéuticos adicionales
 *         desarrollo_social:
 *           type: string
 *           description: Desarrollo social
 *         fecha_inicio_escolaridad:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de escolaridad
 *         personas_apoya_aprendzaje_alumno:
 *           type: string
 *           description: Personas que apoyan el aprendizaje
 *         higiene_sueno:
 *           type: string
 *           description: Hábitos de higiene de sueño
 *         uso_plantillas:
 *           type: string
 *           description: Uso de plantillas
 *         otros_antecedentes_relevantes:
 *           type: string
 *           description: Otros antecedentes relevantes
 *       required:
 *         - alumno_id
 * 
 *     AlumnoCurso:
 *       type: object
 *       properties:
 *         alumno_curso_id:
 *           type: integer
 *           description: ID único de la relación alumno-curso
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno
 *         curso_id:
 *           type: integer
 *           description: ID del curso
 *         ano_escolar:
 *           type: integer
 *           description: Año escolar
 *         fecha_ingreso:
 *           type: string
 *           format: date
 *           description: Fecha de ingreso al curso
 *         fecha_egreso:
 *           type: string
 *           format: date
 *           description: Fecha de egreso del curso
 *       required:
 *         - alumno_id
 *         - curso_id
 *         - ano_escolar
 * 
 *     AlumnoDireccion:
 *       type: object
 *       properties:
 *         alumno_direccion_id:
 *           type: integer
 *           description: ID único de la dirección
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         descripcion:
 *           type: string
 *           description: Descripción de la dirección
 *         ubicaciones_mapa:
 *           type: string
 *           description: Coordenadas o ubicación en mapa
 *         comuna_id:
 *           type: integer
 *           description: ID de la comuna
 *         region_id:
 *           type: integer
 *           description: ID de la región
 *         pais_id:
 *           type: integer
 *           description: ID del país
 *       required:
 *         - alumno_id
 *         - descripcion
 *         - comuna_id
 *         - region_id
 *         - pais_id
 * 
 *     AlumnoInforme:
 *       type: object
 *       properties:
 *         alumno_informe_id:
 *           type: integer
 *           description: ID único del informe
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del informe
 *         url_reporte:
 *           type: string
 *           description: URL del reporte
 *       required:
 *         - alumno_id
 *         - fecha
 * 
 *     AlumnoMonitoreo:
 *       type: object
 *       properties:
 *         alumno_monitoreo_id:
 *           type: integer
 *           description: ID único del monitoreo
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         fecha_accion:
 *           type: string
 *           format: date-time
 *           description: Fecha de la acción
 *         tipo_accion:
 *           type: string
 *           description: Tipo de acción realizada
 *         descripcion_accion:
 *           type: string
 *           description: Descripción de la acción
 *       required:
 *         - alumno_id
 *         - fecha_accion
 *         - tipo_accion
 * 
 *     AlumnoNotificacion:
 *       type: object
 *       properties:
 *         alumno_notificacion_id:
 *           type: integer
 *           description: ID único de la notificación
 *         alumno_id:
 *           type: integer
 *           description: ID del alumno asociado
 *         tipo:
 *           type: string
 *           description: Tipo de notificación
 *         asunto:
 *           type: string
 *           description: Asunto de la notificación
 *         cuerpo:
 *           type: string
 *           description: Cuerpo del mensaje
 *         enviada:
 *           type: boolean
 *           description: Indica si la notificación fue enviada
 *         fecha_envio:
 *           type: string
 *           format: date-time
 *           description: Fecha de envío
 *       required:
 *         - alumno_id
 *         - tipo
 *         - asunto
 *         - cuerpo
 *         - enviada
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: cookie
 *       name: session
 */

// Rutas principales de Alumnos
/**
 * @swagger
 * /api/v1/alumnos:
 *   get:
 *     summary: Obtener lista de alumnos con filtros avanzados
 *     description: Retorna alumnos registrados en el sistema con posibilidad de filtrar por diversos criterios (sin paginación)
 *     tags: [Alumnos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: alumno_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID específico de alumno
 *         example: 101
 *       - in: query
 *         name: colegio_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de colegio
 *         example: 1
 *       - in: query
 *         name: comuna_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de comuna
 *         example: 125
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de región
 *         example: 13
 *       - in: query
 *         name: pais_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de país
 *         example: 1
 *       - in: query
 *         name: tipo_colegio
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de colegio (Particular/Subvencionado/Público)
 *         example: "Particular"
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo/inactivo
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de alumnos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *             example:
 *               - alumno_id: 101
 *                 colegio_id: 1
 *                 url_foto_perfil: "https://ejemplo.com/fotos/alumno101.jpg"
 *                 telefono_contacto1: "+56912345678"
 *                 email: "alumno101@ejemplo.com"
 *                 telefono_contacto2: "+56987654321"
 *                 activo: true
 *                 colegio:
 *                   colegio_id: 1
 *                   nombre: "Colegio Ejemplo"
 *                   tipo_colegio: "Particular"
 *                   comuna_id: 125
 *                   region_id: 13
 *                   pais_id: 1
 *               - alumno_id: 102
 *                 colegio_id: 1
 *                 url_foto_perfil: "https://ejemplo.com/fotos/alumno102.jpg"
 *                 telefono_contacto1: "+56923456789"
 *                 email: "alumno102@ejemplo.com"
 *                 telefono_contacto2: "+56911223344"
 *                 activo: true
 *                 colegio:
 *                   colegio_id: 1
 *                   nombre: "Colegio Ejemplo"
 *                   tipo_colegio: "Particular"
 *                   comuna_id: 125
 *                   region_id: 13
 *                   pais_id: 1
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetro 'tipo_colegio' debe ser uno de: Particular, Subvencionado, Público"
 *       401:
 *         description: No autorizado - Sesión no válida
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al consultar la base de datos"
 */
router.get('/', sessionAuth, AlumnosService.obtener);
/**
 * @swagger
 * /alumno/{alumnoId}:
 *   get:
 *     summary: Obtener información detallada de un alumno
 *     description: Retorna todos los datos asociados a un alumno específico, incluyendo información personal, ficha clínica, alertas, informes, emociones y apoderados
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: alumnoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno a consultar
 *         example: 123
 *     responses:
 *       200:
 *         description: Detalle completo del alumno obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alumno:
 *                   $ref: '#/components/schemas/Alumno'
 *                 ficha:
 *                   $ref: '#/components/schemas/FichaClinica'
 *                 alertas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alerta'
 *                 informes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Informe'
 *                 emociones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Emocion'
 *                 apoderados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Apoderado'
 *             example:
 *               alumno:
 *                 alumno_id: 123
 *                 colegio_id: 101
 *                 url_foto_perfil: "https://example.com/foto.jpg"
 *                 telefono_contacto1: "+56 9 1234 5678"
 *                 telefono_contacto2: "+56 9 8765 4321"
 *                 email: "alumno.demo@colegio.cl"
 *               ficha:
 *                 alumno_ant_clinico_id: 1
 *                 alumno_id: 123
 *                 historial_medico: "Historial general sin eventos graves."
 *                 alergias: "Ninguna conocida"
 *                 enfermedades_cronicas: "Asma leve"
 *                 condiciones_medicas_relevantes: "Controlado por pediatra"
 *                 medicamentos_actuales: "Salbutamol"
 *                 diagnosticos_previos: "Asma infantil"
 *                 terapias_tratamiento_curso: "Inhalador según necesidad"
 *               alertas:
 *                 - alumno_alerta_id: 1
 *                   alumno_id: 123
 *                   alerta_regla_id: 12
 *                   fecha_generada: "2024-05-20T12:00:00.000Z"
 *                   fecha_resolucion: null
 *                   alerta_origen_id: 3
 *                   prioridad_id: 2
 *                   severidad_id: 1
 *                   accion_tomada: "Conversación con apoderado"
 *                   leida: false
 *                   responsable_actual_id: 7
 *                   estado: "pendiente"
 *                   alertas_tipo_alerta_tipo_id: 4
 *               informes:
 *                 - alumno_informe_id: 1
 *                   alumno_id: 123
 *                   fecha: "2024-12-01T00:00:00.000Z"
 *                   url_reporte: "https://example.com/informe1.pdf"
 *                 - alumno_informe_id: 2
 *                   alumno_id: 123
 *                   fecha: "2025-03-15T00:00:00.000Z"
 *                   url_reporte: "https://example.com/informe2.pdf"
 *               emociones:
 *                 - nombre: "Felicidad"
 *                   valor: 3100
 *                 - nombre: "Tristeza"
 *                   valor: 1500
 *                 - nombre: "Estrés"
 *                   valor: 950
 *                 - nombre: "Ansiedad"
 *                   valor: 2600
 *                 - nombre: "Enojo"
 *                   valor: 750
 *                 - nombre: "Otros"
 *                   valor: 1900
 *               apoderados:
 *                 - alumno_apoderado_id: 1
 *                   alumno_id: 123
 *                   apoderado_id: 1001
 *                   tipo_apoderado: "Padre"
 *                   observaciones: "Siempre disponible"
 *                   estado_usuario: "activo"
 *                 - alumno_apoderado_id: 2
 *                   alumno_id: 123
 *                   apoderado_id: 1002
 *                   tipo_apoderado: "Madre"
 *                   observaciones: "Vive con el alumno"
 *                   estado_usuario: "activo"
 *       404:
 *         description: Alumno no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Alumno no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener datos del alumno"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Alumno:
 *       type: object
 *       properties:
 *         alumno_id:
 *           type: integer
 *           example: 123
 *         colegio_id:
 *           type: integer
 *           example: 101
 *         url_foto_perfil:
 *           type: string
 *           example: "https://example.com/foto.jpg"
 *         telefono_contacto1:
 *           type: string
 *           example: "+56 9 1234 5678"
 *         telefono_contacto2:
 *           type: string
 *           example: "+56 9 8765 4321"
 *         email:
 *           type: string
 *           example: "alumno.demo@colegio.cl"
 * 
 *     FichaClinica:
 *       type: object
 *       properties:
 *         alumno_ant_clinico_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 123
 *         historial_medico:
 *           type: string
 *           example: "Historial general sin eventos graves."
 *         alergias:
 *           type: string
 *           example: "Ninguna conocida"
 *         enfermedades_cronicas:
 *           type: string
 *           example: "Asma leve"
 *         condiciones_medicas_relevantes:
 *           type: string
 *           example: "Controlado por pediatra"
 *         medicamentos_actuales:
 *           type: string
 *           example: "Salbutamol"
 *         diagnosticos_previos:
 *           type: string
 *           example: "Asma infantil"
 *         terapias_tratamiento_curso:
 *           type: string
 *           example: "Inhalador según necesidad"
 * 
 *     Alerta:
 *       type: object
 *       properties:
 *         alumno_alerta_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 123
 *         alerta_regla_id:
 *           type: integer
 *           example: 12
 *         fecha_generada:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T12:00:00.000Z"
 *         fecha_resolucion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         alerta_origen_id:
 *           type: integer
 *           example: 3
 *         prioridad_id:
 *           type: integer
 *           example: 2
 *         severidad_id:
 *           type: integer
 *           example: 1
 *         accion_tomada:
 *           type: string
 *           example: "Conversación con apoderado"
 *         leida:
 *           type: boolean
 *           example: false
 *         responsable_actual_id:
 *           type: integer
 *           example: 7
 *         estado:
 *           type: string
 *           example: "pendiente"
 *         alertas_tipo_alerta_tipo_id:
 *           type: integer
 *           example: 4
 * 
 *     Informe:
 *       type: object
 *       properties:
 *         alumno_informe_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 123
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T00:00:00.000Z"
 *         url_reporte:
 *           type: string
 *           example: "https://example.com/informe1.pdf"
 * 
 *     Emocion:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Felicidad"
 *         valor:
 *           type: integer
 *           example: 3100
 * 
 *     Apoderado:
 *       type: object
 *       properties:
 *         alumno_apoderado_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 123
 *         apoderado_id:
 *           type: integer
 *           example: 1001
 *         tipo_apoderado:
 *           type: string
 *           example: "Padre"
 *         observaciones:
 *           type: string
 *           example: "Siempre disponible"
 *         estado_usuario:
 *           type: string
 *           example: "activo"
 */
router.get('/alumno/:alumnoId', AlumnosService.getAlumnoDetalle);

/**
 * @swagger
 * /api/v1/alumnos:
 *   post:
 *     summary: Crear un nuevo alumno
 *     description: Registra un nuevo alumno en el sistema
 *     tags: [Alumnos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       201:
 *         description: Alumno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       400:
 *         description: Datos inválidos para crear el alumno
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', sessionAuth, AlumnosService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/{id}:
 *   put:
 *     summary: Actualizar datos de alumno
 *     description: Actualiza la información de un alumno existente
 *     tags: [Alumnos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       200:
 *         description: Alumno actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       404:
 *         description: Alumno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', sessionAuth, AlumnosService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/{id}:
 *   delete:
 *     summary: Eliminar alumno
 *     description: Elimina un alumno del sistema
 *     tags: [Alumnos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno a eliminar
 *     responses:
 *       204:
 *         description: Alumno eliminado exitosamente
 *       404:
 *         description: Alumno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', sessionAuth, AlumnosService.eliminar);

// Rutas para Actividades
/**
 * @swagger
 * /api/v1/alumnos/actividades:
 *   get:
 *     summary: Obtener actividades de alumnos
 *     description: Retorna todas las actividades registradas
 *     tags: [Actividades]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actividad'
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_actividades, sessionAuth, ActividadsService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/actividades:
 *   post:
 *     summary: Crear nueva actividad
 *     description: Registra una nueva actividad para alumnos
 *     tags: [Actividades]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actividad'
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actividad'
 *       400:
 *         description: Datos inválidos para crear la actividad
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_actividades, sessionAuth, ActividadsService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/actividades/{id}:
 *   put:
 *     summary: Actualizar actividad
 *     description: Actualiza una actividad existente
 *     tags: [Actividades]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actividad'
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actividad'
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_actividades + '/:id', sessionAuth, ActividadsService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/actividades/{id}:
 *   delete:
 *     summary: Eliminar actividad
 *     description: Elimina una actividad del sistema
 *     tags: [Actividades]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad a eliminar
 *     responses:
 *       204:
 *         description: Actividad eliminada exitosamente
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_actividades + '/:id', sessionAuth, ActividadsService.eliminar);

// Rutas para Alertas
/**
 * @swagger
 * /api/v1/alumnos/alertas:
 *   get:
 *     summary: Obtener alertas de alumnos con relaciones completas
 *     description: Retorna todas las alertas registradas con información detallada del alumno, prioridad, severidad y tipo de alerta
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de alertas obtenida correctamente con todos sus objetos relacionados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAlerta'
 *             example:
 *               - alumno_alerta_id: 201
 *                 alumno_id: 101
 *                 alerta_regla_id: 3
 *                 fecha_generada: "2023-06-15T14:30:00Z"
 *                 fecha_resolucion: null
 *                 estado: "Pendiente"
 *                 accion_tomada: null
 *                 leida: false
 *                 prioridad_id: 1
 *                 severidad_id: 2
 *                 alertas_tipo_alerta_tipo_id: 4
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   email: "juan.perez@colegio.com"
 *                   colegio:
 *                     colegio_id: 1
 *                     nombre: "Colegio Ejemplo"
 *                 prioridad:
 *                   alerta_prioridad_id: 1
 *                   nombre: "Alta"
 *                   color: "#FF0000"
 *                 severidad:
 *                   alerta_severidad_id: 2
 *                   nombre: "Media"
 *                   icono: "warning"
 *                 tipo_alerta:
 *                   alerta_tipo_id: 4
 *                   nombre: "Rendimiento Académico"
 *                   descripcion: "Alertas relacionadas con bajo rendimiento"
 *               - alumno_alerta_id: 202
 *                 alumno_id: 102
 *                 alerta_regla_id: 5
 *                 fecha_generada: "2023-06-16T09:15:00Z"
 *                 fecha_resolucion: "2023-06-16T16:45:00Z"
 *                 estado: "Resuelta"
 *                 accion_tomada: "Se contactó al apoderado"
 *                 leida: true
 *                 prioridad_id: 2
 *                 severidad_id: 1
 *                 alertas_tipo_alerta_tipo_id: 3
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "María González"
 *                   email: "maria.gonzalez@colegio.com"
 *                 prioridad:
 *                   alerta_prioridad_id: 2
 *                   nombre: "Media"
 *                   color: "#FFA500"
 *                 severidad:
 *                   alerta_severidad_id: 1
 *                   nombre: "Baja"
 *                   icono: "info"
 *                 tipo_alerta:
 *                   alerta_tipo_id: 3
 *                   nombre: "Asistencia"
 *                   descripcion: "Alertas relacionadas con inasistencias"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *             example:
 *               error: "No autorizado"
 *               mensaje: "Token de autenticación inválido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "Ocurrió un error al procesar la solicitud"
 *               detalles: "Error de conexión con la base de datos"
 */
router.get(ruta_alumnos_alertas, sessionAuth, AlumnoAlertaService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/alertas:
 *   post:
 *     summary: Crear nueva alerta
 *     description: Registra una nueva alerta para un alumno
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAlerta'
 *     responses:
 *       201:
 *         description: Alerta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAlerta'
 *       400:
 *         description: Datos inválidos para crear la alerta
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_alertas, sessionAuth, AlumnoAlertaService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/alertas/{id}:
 *   put:
 *     summary: Actualizar alerta
 *     description: Actualiza una alerta existente
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAlerta'
 *     responses:
 *       200:
 *         description: Alerta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAlerta'
 *       404:
 *         description: Alerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_alertas + '/:id', sessionAuth, AlumnoAlertaService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/alertas/{id}:
 *   delete:
 *     summary: Eliminar alerta
 *     description: Elimina una alerta del sistema
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta a eliminar
 *     responses:
 *       204:
 *         description: Alerta eliminada exitosamente
 *       404:
 *         description: Alerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_alertas + '/:id', sessionAuth, AlumnoAlertaService.eliminar);

// Rutas para Bitácoras de Alertas
/**
 * @swagger
 * /api/v1/alumnos/alertas_bitacoras:
 *   get:
 *     summary: Obtener bitácoras completas de alertas
 *     description: Retorna todas las bitácoras registradas con información detallada de la alerta, alumno y acciones realizadas
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado de la alerta (Pendiente, EnProceso, Resuelta)
 *         example: "EnProceso"
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar bitácoras desde esta fecha (YYYY-MM-DD)
 *         example: "2023-06-01"
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar bitácoras hasta esta fecha (YYYY-MM-DD)
 *         example: "2023-06-30"
 *     responses:
 *       200:
 *         description: Lista detallada de bitácoras con relaciones completas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *             example:
 *               - alumno_alerta_bitacora_id: 301
 *                 alumno_alerta_id: 201
 *                 alumno_id: 101
 *                 plan_accion: "Realizar evaluación psicológica"
 *                 fecha_compromiso: "2023-06-18T00:00:00Z"
 *                 fecha_realizacion: "2023-06-17T15:30:00Z"
 *                 url_archivo: "https://storage.com/informes/evaluacion-301.pdf"
 *                 observaciones: "El alumno mostró buena disposición"
 *                 estado_seguimiento: "Completado"
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   curso_actual: "4° Básico A"
 *                 alerta:
 *                   alumno_alerta_id: 201
 *                   tipo_alerta: "Comportamiento"
 *                   estado: "EnProceso"
 *                   severidad: "Media"
 *               - alumno_alerta_bitacora_id: 302
 *                 alumno_alerta_id: 202
 *                 alumno_id: 102
 *                 plan_accion: "Reunión con apoderados"
 *                 fecha_compromiso: "2023-06-20T00:00:00Z"
 *                 fecha_realizacion: null
 *                 url_archivo: null
 *                 observaciones: "Por coordinar con familia"
 *                 estado_seguimiento: "Pendiente"
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "María González"
 *                   curso_actual: "3° Medio B"
 *                 alerta:
 *                   alumno_alerta_id: 202
 *                   tipo_alerta: "Rendimiento"
 *                   estado: "Pendiente"
 *                   severidad: "Alta"
 *       400:
 *         description: Parámetros de filtrado inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros inválidos"
 *               detalles: "El formato de fecha debe ser YYYY-MM-DD"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *             example:
 *               error: "No autorizado"
 *               mensaje: "Se requiere autenticación"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "No se pudo recuperar las bitácoras"
 *               detalles: "Timeout de conexión a la base de datos"
 */
router.get(ruta_alumnos_alertas_bitacoras, sessionAuth, AlumnoAlertaBitacoraService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/alertas_bitacoras:
 *   post:
 *     summary: Crear nueva bitácora de alerta
 *     description: Registra una nueva bitácora para una alerta de alumno
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *     responses:
 *       201:
 *         description: Bitácora creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *       400:
 *         description: Datos inválidos para crear la bitácora
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_alertas_bitacoras, sessionAuth, AlumnoAlertaBitacoraService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/alertas_bitacoras/{id}:
 *   put:
 *     summary: Actualizar bitácora de alerta
 *     description: Actualiza una bitácora de alerta existente
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bitácora a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *     responses:
 *       200:
 *         description: Bitácora actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *       404:
 *         description: Bitácora no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_alertas_bitacoras + '/:id', sessionAuth, AlumnoAlertaBitacoraService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/alertas_bitacoras/{id}:
 *   delete:
 *     summary: Eliminar bitácora de alerta
 *     description: Elimina una bitácora de alerta del sistema
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bitácora a eliminar
 *     responses:
 *       204:
 *         description: Bitácora eliminada exitosamente
 *       404:
 *         description: Bitácora no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_alertas_bitacoras + '/:id', sessionAuth, AlumnoAlertaBitacoraService.eliminar);

// Rutas para Antecedentes Clínicos
/**
 * @swagger
 * /api/v1/alumnos/antecedentes_clinicos:
 *   get:
 *     summary: Obtener antecedentes clínicos completos
 *     description: Retorna todos los antecedentes médicos registrados con información detallada del alumno
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: alumno_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de alumno
 *         example: 101
 *       - in: query
 *         name: tiene_alergias
 *         schema:
 *           type: boolean
 *         description: Filtrar por alumnos con alergias registradas
 *         example: true
 *     responses:
 *       200:
 *         description: Lista completa de antecedentes clínicos con datos del alumno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *             example:
 *               - alumno_ant_clinico_id: 401
 *                 alumno_id: 101
 *                 historial_medico: "Vacunas completas, parto normal"
 *                 alergias: "Penicilina, polvo"
 *                 enfermedades_cronicas: "Asma leve controlado"
 *                 condiciones_medicas_relevantes: "Uso de inhalador ocasional"
 *                 medicamentos_actuales: "Salbutamol PRN"
 *                 diagnosticos_previos: "Bronquitis a los 5 años"
 *                 terapias_tratamiento_curso: "Ninguna actualmente"
 *                 fecha_actualizacion: "2023-06-15T09:30:00Z"
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   fecha_nacimiento: "2012-05-15"
 *                   curso_actual: "4° Básico A"
 *               - alumno_ant_clinico_id: 402
 *                 alumno_id: 102
 *                 historial_medico: "Nacimiento por cesárea"
 *                 alergias: "Ninguna conocida"
 *                 enfermedades_cronicas: null
 *                 condiciones_medicas_relevantes: "Uso lentes desde 2022"
 *                 medicamentos_actuales: null
 *                 diagnosticos_previos: "Varicela a los 3 años"
 *                 terapias_tratamiento_curso: "Terapia visual"
 *                 fecha_actualizacion: "2023-05-20T14:15:00Z"
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "María González"
 *                   fecha_nacimiento: "2011-08-22"
 *                   curso_actual: "5° Básico B"
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros inválidos"
 *               detalles: "El ID de alumno debe ser un número válido"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso no autorizado"
 *               mensaje: "Token de sesión requerido"
 *       404:
 *         description: No se encontraron antecedentes
 *         content:
 *           application/json:
 *             example:
 *               error: "No encontrado"
 *               mensaje: "No existen antecedentes para el alumno especificado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "Error al acceder a los registros médicos"
 *               detalles: "Base de datos no disponible"
 */
router.get(ruta_alumnos_antecedentes_clinicos, sessionAuth, AlumnoAntecedenteClinicosService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_clinicos:
 *   post:
 *     summary: Crear antecedentes clínicos
 *     description: Registra nuevos antecedentes clínicos para un alumno
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *     responses:
 *       201:
 *         description: Antecedentes clínicos creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *       400:
 *         description: Datos inválidos para crear los antecedentes
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_antecedentes_clinicos, sessionAuth, AlumnoAntecedenteClinicosService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_clinicos/{id}:
 *   put:
 *     summary: Actualizar antecedentes clínicos
 *     description: Actualiza antecedentes clínicos existentes
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de los antecedentes a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *     responses:
 *       200:
 *         description: Antecedentes clínicos actualizados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *       404:
 *         description: Antecedentes no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_antecedentes_clinicos + '/:id', sessionAuth, AlumnoAntecedenteClinicosService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_clinicos/{id}:
 *   delete:
 *     summary: Eliminar antecedentes clínicos
 *     description: Elimina antecedentes clínicos del sistema
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de los antecedentes a eliminar
 *     responses:
 *       204:
 *         description: Antecedentes eliminados exitosamente
 *       404:
 *         description: Antecedentes no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_antecedentes_clinicos + '/:id', sessionAuth, AlumnoAntecedenteClinicosService.eliminar);

// Rutas para Antecedentes Familiares

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_familiares:
 *   get:
 *     summary: Obtener antecedentes familiares completos
 *     description: Retorna todos los antecedentes familiares con información detallada del alumno y composición familiar
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: alumno_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de alumno específico
 *         example: 101
 *       - in: query
 *         name: tiene_factores_riesgo
 *         schema:
 *           type: boolean
 *         description: Filtrar por alumnos con factores de riesgo identificados
 *         example: true
 *     responses:
 *       200:
 *         description: Lista detallada de antecedentes familiares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *             example:
 *               - alumno_ent_familiar: 501
 *                 alumno_id: 101
 *                 informacion_socio_economica: "Clase media, ambos padres trabajan"
 *                 composicion_familiar: "Padres casados, 2 hermanos (8 y 12 años)"
 *                 situacion_laboral_padres: "Padre ingeniero, madre profesora"
 *                 recursos_disponibles: "Casa propia, acceso a internet y computador"
 *                 dinamica_familiar: "Ambiente familiar estable"
 *                 relaciones_familiares: "Buena relación entre hermanos"
 *                 apoyo_emocional: "Fuerte apoyo de ambos padres"
 *                 factores_riesgo: "Antecedentes depresión materna"
 *                 observaciones_entrevistador: "Familia comprometida con educación"
 *                 resumen_entrevista: "Entrevista normal sin observaciones"
 *                 fecha_actualizacion: "2023-06-10T11:20:00Z"
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   curso_actual: "4°A"
 *                   colegio:
 *                     nombre: "Colegio Ejemplo"
 * 
 *               - alumno_ent_familiar: 502
 *                 alumno_id: 102
 *                 informacion_socio_economica: "Clase media-baja, madre soltera"
 *                 composicion_familiar: "Madre y abuela materna"
 *                 situacion_laboral_padres: "Madre trabaja medio tiempo"
 *                 recursos_disponibles: "Departamento arrendado, acceso internet limitado"
 *                 dinamica_familiar: "Relación cercana con abuela"
 *                 factores_riesgo: "Problemas económicos recurrentes"
 *                 procesos_pisicoteurapeuticos_adicionales: "Apoyo psicológico semanal"
 *                 fecha_actualizacion: "2023-05-15T09:45:00Z"
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "María González"
 *                   curso_actual: "3° Medio B"
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Solicitud incorrecta"
 *               detalles: "El parámetro alumno_id debe ser un número"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso no autorizado"
 *               mensaje: "Se requiere autenticación"
 *       404:
 *         description: No se encontraron registros
 *         content:
 *           application/json:
 *             example:
 *               error: "No encontrado"
 *               mensaje: "No existen antecedentes familiares para los criterios especificados"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "No se pudieron recuperar los antecedentes"
 *               detalles: "Error de conexión con la base de datos"
 */
router.get(ruta_alumnos_antecedentes_familiares, sessionAuth, AlumnoAntecedenteFamiliarsService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_familiares:
 *   post:
 *     summary: Crear antecedentes familiares
 *     description: Registra nuevos antecedentes familiares para un alumno
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *     responses:
 *       201:
 *         description: Antecedentes familiares creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *       400:
 *         description: Datos inválidos para crear los antecedentes
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_antecedentes_familiares, sessionAuth, AlumnoAntecedenteFamiliarsService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_familiares/{id}:
 *   put:
 *     summary: Actualizar antecedentes familiares
 *     description: Actualiza antecedentes familiares existentes
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de los antecedentes a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *     responses:
 *       200:
 *         description: Antecedentes familiares actualizados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *       404:
 *         description: Antecedentes no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_antecedentes_familiares + '/:id', sessionAuth, AlumnoAntecedenteFamiliarsService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/antecedentes_familiares/{id}:
 *   delete:
 *     summary: Eliminar antecedentes familiares
 *     description: Elimina antecedentes familiares del sistema
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de los antecedentes a eliminar
 *     responses:
 *       204:
 *         description: Antecedentes eliminados exitosamente
 *       404:
 *         description: Antecedentes no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_antecedentes_familiares + '/:id', sessionAuth, AlumnoAntecedenteFamiliarsService.eliminar);

// Rutas para Cursos
/**
 * @swagger
 * /api/v1/alumnos/cursos:
 *   get:
 *     summary: Obtener relaciones alumno-curso con información completa
 *     description: Retorna todas las matrículas de alumnos en cursos con detalles académicos completos
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: alumno_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de alumno específico
 *         example: 101
 *       - in: query
 *         name: ano_escolar
 *         schema:
 *           type: integer
 *         description: Filtrar por año escolar específico
 *         example: 2023
 *       - in: query
 *         name: curso_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de curso específico
 *         example: 5
 *     responses:
 *       200:
 *         description: Lista detallada de matrículas alumno-curso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoCurso'
 *             example:
 *               - alumno_curso_id: 601
 *                 alumno_id: 101
 *                 curso_id: 5
 *                 ano_escolar: 2023
 *                 fecha_ingreso: "2023-03-01"
 *                 fecha_egreso: "2023-12-15"
 *                 estado_matricula: "Activa"
 *                 promedio_general: 6.2
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   url_foto_perfil: "https://ejemplo.com/fotos/alumno101.jpg"
 *                 curso:
 *                   curso_id: 5
 *                   nombre_curso: "4°"
 *                   nivel_educativo: "Básica"
 *                   profesor_jefe: "María González"
 *                   colegio:
 *                     colegio_id: 1
 *                     nombre: "Colegio Ejemplo"
 * 
 *               - alumno_curso_id: 602
 *                 alumno_id: 102
 *                 curso_id: 8
 *                 ano_escolar: 2023
 *                 fecha_ingreso: "2023-03-01"
 *                 fecha_egreso: null
 *                 estado_matricula: "Transferido"
 *                 promedio_general: 5.8
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "Ana Sánchez"
 *                 curso:
 *                   curso_id: 8
 *                   nombre_curso: "7° B"
 *                   nivel_educativo: "Básica"
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros inválidos"
 *               detalles: "El año escolar debe ser un número de 4 dígitos"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso no autorizado"
 *               mensaje: "Se requiere autenticación válida"
 *       404:
 *         description: No se encontraron matrículas
 *         content:
 *           application/json:
 *             example:
 *               error: "No encontrado"
 *               mensaje: "No existen registros para los criterios especificados"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "Error al consultar matrículas"
 *               detalles: "Error de conexión con la base de datos"
 */
router.get(ruta_alumnos_cursos, sessionAuth, AlumnoCursoService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/cursos:
 *   post:
 *     summary: Crear relación alumno-curso
 *     description: Registra una nueva relación entre un alumno y un curso
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoCurso'
 *     responses:
 *       201:
 *         description: Relación alumno-curso creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoCurso'
 *       400:
 *         description: Datos inválidos para crear la relación
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_cursos, sessionAuth, AlumnoCursoService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/cursos/{id}:
 *   put:
 *     summary: Actualizar relación alumno-curso
 *     description: Actualiza una relación alumno-curso existente
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoCurso'
 *     responses:
 *       200:
 *         description: Relación alumno-curso actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoCurso'
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_cursos + '/:id', sessionAuth, AlumnoCursoService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/cursos/{id}:
 *   delete:
 *     summary: Eliminar relación alumno-curso
 *     description: Elimina una relación alumno-curso del sistema
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación a eliminar
 *     responses:
 *       204:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_cursos + '/:id', sessionAuth, AlumnoCursoService.eliminar);

// Rutas para Direcciones
/**
 * @swagger
 * /api/v1/alumnos/direcciones:
 *   get:
 *     summary: Obtener direcciones completas de alumnos
 *     description: Retorna todas las direcciones registradas con información geográfica detallada
 *     tags: [Direcciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: alumno_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de alumno específico
 *         example: 101
 *       - in: query
 *         name: comuna_id
 *         schema:
 *           type: integer
 *         description: Filtrar por comuna específica
 *         example: 125
 *       - in: query
 *         name: es_principal
 *         schema:
 *           type: boolean
 *         description: Filtrar por dirección principal (true/false)
 *         example: true
 *     responses:
 *       200:
 *         description: Lista completa de direcciones con datos geográficos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoDireccion'
 *             example:
 *               - alumno_direccion_id: 701
 *                 alumno_id: 101
 *                 descripcion: "Av. Principal 1234, Depto 501"
 *                 es_principal: true
 *                 ubicaciones_mapa: "-33.45694, -70.64827"
 *                 comuna_id: 125
 *                 region_id: 13
 *                 pais_id: 1
 *                 fecha_actualizacion: "2023-06-15T10:30:00Z"
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   curso_actual: "4° Básico A"
 *                 comuna:
 *                   comuna_id: 125
 *                   nombre: "Santiago"
 *                   region:
 *                     region_id: 13
 *                     nombre: "Metropolitana"
 *                     pais:
 *                       pais_id: 1
 *                       nombre: "Chile"
 * 
 *               - alumno_direccion_id: 702
 *                 alumno_id: 102
 *                 descripcion: "Calle Secundaria 567, Casa B"
 *                 es_principal: false
 *                 ubicaciones_mapa: "-33.45872, -70.65011"
 *                 comuna_id: 126
 *                 region_id: 13
 *                 pais_id: 1
 *                 alumno:
 *                   alumno_id: 102
 *                   nombre: "María González"
 *                 comuna:
 *                   comuna_id: 126
 *                   nombre: "Providencia"
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros inválidos"
 *               detalles: "El ID de alumno debe ser un número positivo"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso no autorizado"
 *               mensaje: "Token de autenticación requerido"
 *       404:
 *         description: No se encontraron direcciones
 *         content:
 *           application/json:
 *             example:
 *               error: "No encontrado"
 *               mensaje: "No existen direcciones para los criterios especificados"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error del servidor"
 *               mensaje: "No se pudieron recuperar las direcciones"
 *               detalles: "Error de conexión con el servicio de geolocalización"
 */
router.get(ruta_alumnos_direcciones, sessionAuth, AlumnoDireccionService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/direcciones:
 *   post:
 *     summary: Crear dirección de alumno
 *     description: Registra una nueva dirección para un alumno
 *     tags: [Direcciones]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoDireccion'
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoDireccion'
 *       400:
 *         description: Datos inválidos para crear la dirección
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_direcciones, sessionAuth, AlumnoDireccionService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/direcciones/{id}:
 *   put:
 *     summary: Actualizar dirección de alumno
 *     description: Actualiza una dirección existente de un alumno
 *     tags: [Direcciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoDireccion'
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoDireccion'
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_direcciones + '/:id', sessionAuth, AlumnoDireccionService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/direcciones/{id}:
 *   delete:
 *     summary: Eliminar dirección de alumno
 *     description: Elimina una dirección de alumno del sistema
 *     tags: [Direcciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a eliminar
 *     responses:
 *       204:
 *         description: Dirección eliminada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_direcciones + '/:id', sessionAuth, AlumnoDireccionService.eliminar);


// Rutas para Monitoreos
/**
 * @swagger
 * /api/v1/alumnos/monitoreos:
 *   get:
 *     summary: Obtener monitoreos de alumnos
 *     description: Retorna todos los monitoreos registrados para alumnos, incluyendo información del alumno y su colegio
 *     tags: [Monitoreos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de monitoreos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoMonitoreo'
 *             example:
 *               - monitoreo_id: 1
 *                 fecha: "2023-05-15T10:30:00Z"
 *                 observaciones: "El alumno mostró mejoría en su rendimiento"
 *                 alumno:
 *                   alumno_id: 101
 *                   nombre: "Juan Pérez"
 *                   url_foto_perfil: "https://ejemplo.com/fotos/101.jpg"
 *                   telefono_contacto1: "+56912345678"
 *                   email: "juan.perez@ejemplo.com"
 *                   colegio:
 *                     colegio_id: 201
 *                     nombre: "Colegio Ejemplo"
 *                     nombre_fantasia: "Colegio Ejemplo S.A."
 *                     direccion: "Calle Principal 123"
 *                     telefono_contacto: "+56223456789"
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al conectar con la base de datos"
 */
router.get(ruta_alumnos_monitoreos, sessionAuth, AlumnoMonitoreoService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/monitoreos:
 *   post:
 *     summary: Crear monitoreo de alumno
 *     description: Registra un nuevo monitoreo para un alumno
 *     tags: [Monitoreos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoMonitoreo'
 *     responses:
 *       201:
 *         description: Monitoreo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoMonitoreo'
 *       400:
 *         description: Datos inválidos para crear el monitoreo
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_monitoreos, sessionAuth, AlumnoMonitoreoService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/monitoreos/{id}:
 *   put:
 *     summary: Actualizar monitoreo de alumno
 *     description: Actualiza un monitoreo existente de un alumno
 *     tags: [Monitoreos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del monitoreo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoMonitoreo'
 *     responses:
 *       200:
 *         description: Monitoreo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoMonitoreo'
 *       404:
 *         description: Monitoreo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_monitoreos + '/:id', sessionAuth, AlumnoMonitoreoService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/monitoreos/{id}:
 *   delete:
 *     summary: Eliminar monitoreo de alumno
 *     description: Elimina un monitoreo de alumno del sistema
 *     tags: [Monitoreos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del monitoreo a eliminar
 *     responses:
 *       204:
 *         description: Monitoreo eliminado exitosamente
 *       404:
 *         description: Monitoreo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_monitoreos + '/:id', sessionAuth, AlumnoMonitoreoService.eliminar);

// Rutas para Notificaciones
/**
 * @swagger
 * /api/v1/alumnos/notificaciones:
 *   get:
 *     summary: Obtener notificaciones de alumnos
 *     description: Retorna todas las notificaciones registradas para alumnos, incluyendo detalles del alumno, tipo de notificación y estado
 *     tags: [Notificaciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - name: estado
 *         in: query
 *         description: Filtro por estado de notificación (leída/no leída)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [leida, no_leida]
 *           example: "no_leida"
 *       - name: limit
 *         in: query
 *         description: Límite de resultados a devolver (para paginación)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         description: Desplazamiento para paginación
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de notificaciones disponibles
 *                   example: 25
 *                 notificaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AlumnoNotificacion'
 *             example:
 *               total: 3
 *               notificaciones:
 *                 - notificacion_id: 1
 *                   alumno_id: 101
 *                   tipo: "academica"
 *                   titulo: "Nueva evaluación publicada"
 *                   mensaje: "Se ha publicado la evaluación de Matemáticas para el día 15/05"
 *                   fecha_envio: "2023-05-10T08:30:00Z"
 *                   estado: "no_leida"
 *                   alumno:
 *                     nombre: "Juan Pérez"
 *                     curso: "4° Básico A"
 *                 - notificacion_id: 2
 *                   alumno_id: 101
 *                   tipo: "conductual"
 *                   titulo: "Felicitaciones"
 *                   mensaje: "El alumno ha sido destacado por buen comportamiento"
 *                   fecha_envio: "2023-05-08T16:45:00Z"
 *                   estado: "leida"
 *                   alumno:
 *                     nombre: "Juan Pérez"
 *                     curso: "4° Básico A"
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *         content:
 *           application/json:
 *             example:
 *               error: "Token de autenticación no válido o expirado"
 *       403:
 *         description: Acceso prohibido - El usuario no tiene permisos para ver estas notificaciones
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al recuperar las notificaciones de la base de datos"
 */
router.get(ruta_alumnos_notificaciones, sessionAuth, AlumnoNotificacionService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/notificaciones:
 *   post:
 *     summary: Crear notificación de alumno
 *     description: Registra una nueva notificación para un alumno
 *     tags: [Notificaciones]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoNotificacion'
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoNotificacion'
 *       400:
 *         description: Datos inválidos para crear la notificación
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_notificaciones, sessionAuth, AlumnoNotificacionService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/notificaciones/{id}:
 *   put:
 *     summary: Actualizar notificación de alumno
 *     description: Actualiza una notificación existente de un alumno
 *     tags: [Notificaciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoNotificacion'
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoNotificacion'
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_notificaciones + '/:id', sessionAuth, AlumnoNotificacionService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar notificación de alumno
 *     description: Elimina una notificación de alumno del sistema
 *     tags: [Notificaciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación a eliminar
 *     responses:
 *       204:
 *         description: Notificación eliminada exitosamente
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_notificaciones + '/:id', sessionAuth, AlumnoNotificacionService.eliminar);

export default router;

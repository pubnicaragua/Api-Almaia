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
import { AlumnoInformeService } from '../infrestructure/server/alumno/AlumnoInformeService';
import { AlumnoNotificacionService } from '../infrestructure/server/alumno/AlumnoNotificacionService';

const router = express.Router();

const ruta_actividades = '/actividades';
const ruta_alumnos_alertas = '/alertas';
const ruta_alumnos_alertas_bitacoras = '/alertas_bitacoras';
const ruta_alumnos_antecedentes_clinicos = '/antecedentes_clinicos';
const ruta_alumnos_antecedentes_familiares = '/antecedentes_familiares';
const ruta_alumnos_cursos = '/cursos';
const ruta_alumnos_direcciones = '/direcciones';
const ruta_alumnos_informes = '/informes';
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
 *   - name: Informes
 *     description: Gestión de informes de alumnos
 *   - name: Monitoreos
 *     description: Gestión de monitoreos de alumnos
 *   - name: Notificaciones
 *     description: Gestión de notificaciones de alumnos
 */

// Rutas principales de Alumnos
/**
 * @swagger
 * /api/v1/alumnos:
 *   get:
 *     summary: Obtener lista de alumnos
 *     description: Retorna todos los alumnos registrados en el sistema
 *     tags: [Alumnos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de alumnos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', sessionAuth, AlumnosService.obtener);

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
router.put( '/:id', sessionAuth, AlumnosService.actualizar);

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
router.delete( '/:id', sessionAuth, AlumnosService.eliminar);

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
router.get( ruta_actividades, sessionAuth, ActividadsService.obtener);

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
router.post( ruta_actividades, sessionAuth, ActividadsService.guardar);

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
router.put( ruta_actividades + '/:id', sessionAuth, ActividadsService.actualizar);

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
router.delete( ruta_actividades + '/:id', sessionAuth, ActividadsService.eliminar);

// Rutas para Alertas
/**
 * @swagger
 * /api/v1/alumnos/alertas:
 *   get:
 *     summary: Obtener alertas de alumnos
 *     description: Retorna todas las alertas registradas
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de alertas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAlerta'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_alertas, sessionAuth, AlumnoAlertaService.obtener);

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
router.post( ruta_alumnos_alertas, sessionAuth, AlumnoAlertaService.guardar);

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
router.put( ruta_alumnos_alertas + '/:id', sessionAuth, AlumnoAlertaService.actualizar);

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
router.delete( ruta_alumnos_alertas + '/:id', sessionAuth, AlumnoAlertaService.eliminar);

// Rutas para Bitácoras de Alertas
/**
 * @swagger
 * /api/v1/alumnos/alertas_bitacoras:
 *   get:
 *     summary: Obtener bitácoras de alertas
 *     description: Retorna todas las bitácoras de alertas registradas
 *     tags: [Alertas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de bitácoras obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAlertaBitacora'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_alertas_bitacoras, sessionAuth, AlumnoAlertaBitacoraService.obtener);

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
router.post( ruta_alumnos_alertas_bitacoras, sessionAuth, AlumnoAlertaBitacoraService.guardar);

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
router.put( ruta_alumnos_alertas_bitacoras + '/:id', sessionAuth, AlumnoAlertaBitacoraService.actualizar);

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
router.delete( ruta_alumnos_alertas_bitacoras + '/:id', sessionAuth, AlumnoAlertaBitacoraService.eliminar);

// Rutas para Antecedentes Clínicos
/**
 * @swagger
 * /api/v1/alumnos/antecedentes_clinicos:
 *   get:
 *     summary: Obtener antecedentes clínicos
 *     description: Retorna todos los antecedentes clínicos registrados
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de antecedentes clínicos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAntecedenteClinico'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_antecedentes_clinicos, sessionAuth, AlumnoAntecedenteClinicosService.obtener);

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
router.post( ruta_alumnos_antecedentes_clinicos, sessionAuth, AlumnoAntecedenteClinicosService.guardar);

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
router.put( ruta_alumnos_antecedentes_clinicos + '/:id', sessionAuth, AlumnoAntecedenteClinicosService.actualizar);

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
router.delete( ruta_alumnos_antecedentes_clinicos + '/:id', sessionAuth, AlumnoAntecedenteClinicosService.eliminar);

// Rutas para Antecedentes Familiares
/**
 * @swagger
 * /api/v1/alumnos/antecedentes_familiares:
 *   get:
 *     summary: Obtener antecedentes familiares
 *     description: Retorna todos los antecedentes familiares registrados
 *     tags: [Antecedentes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de antecedentes familiares obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAntecedenteFamiliar'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_antecedentes_familiares, sessionAuth, AlumnoAntecedenteFamiliarsService.obtener);

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
router.post( ruta_alumnos_antecedentes_familiares, sessionAuth, AlumnoAntecedenteFamiliarsService.guardar);

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
router.put( ruta_alumnos_antecedentes_familiares + '/:id', sessionAuth, AlumnoAntecedenteFamiliarsService.actualizar);

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
router.delete( ruta_alumnos_antecedentes_familiares + '/:id', sessionAuth, AlumnoAntecedenteFamiliarsService.eliminar);

// Rutas para Cursos
/**
 * @swagger
 * /api/v1/alumnos/cursos:
 *   get:
 *     summary: Obtener cursos de alumnos
 *     description: Retorna todas las relaciones alumno-curso registradas
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de relaciones alumno-curso obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoCurso'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_cursos, sessionAuth, AlumnoCursoService.obtener);

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
router.post( ruta_alumnos_cursos, sessionAuth, AlumnoCursoService.guardar);

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
router.put( ruta_alumnos_cursos + '/:id', sessionAuth, AlumnoCursoService.actualizar);

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
router.delete( ruta_alumnos_cursos + '/:id', sessionAuth, AlumnoCursoService.eliminar);

// Rutas para Direcciones
/**
 * @swagger
 * /api/v1/alumnos/direcciones:
 *   get:
 *     summary: Obtener direcciones de alumnos
 *     description: Retorna todas las direcciones registradas para alumnos
 *     tags: [Direcciones]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoDireccion'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_direcciones, sessionAuth, AlumnoDireccionService.obtener);

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
router.post( ruta_alumnos_direcciones, sessionAuth, AlumnoDireccionService.guardar);

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
router.put( ruta_alumnos_direcciones + '/:id', sessionAuth, AlumnoDireccionService.actualizar);

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
router.delete( ruta_alumnos_direcciones + '/:id', sessionAuth, AlumnoDireccionService.eliminar);

// Rutas para Informes
/**
 * @swagger
 * /api/v1/alumnos/informes:
 *   get:
 *     summary: Obtener informes de alumnos
 *     description: Retorna todos los informes registrados para alumnos
 *     tags: [Informes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de informes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoInforme'
 *       500:
 *         description: Error interno del servidor
 */
router.get( ruta_alumnos_informes, sessionAuth, AlumnoInformeService.obtener);

/**
 * @swagger
 * /api/v1/alumnos/informes:
 *   post:
 *     summary: Crear informe de alumno
 *     description: Registra un nuevo informe para un alumno
 *     tags: [Informes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoInforme'
 *     responses:
 *       201:
 *         description: Informe creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoInforme'
 *       400:
 *         description: Datos inválidos para crear el informe
 *       500:
 *         description: Error interno del servidor
 */
router.post( ruta_alumnos_informes, sessionAuth, AlumnoInformeService.guardar);

/**
 * @swagger
 * /api/v1/alumnos/informes/{id}:
 *   put:
 *     summary: Actualizar informe de alumno
 *     description: Actualiza un informe existente de un alumno
 *     tags: [Informes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del informe a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoInforme'
 *     responses:
 *       200:
 *         description: Informe actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoInforme'
 *       404:
 *         description: Informe no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_informes + '/:id', sessionAuth, AlumnoInformeService.actualizar);

/**
 * @swagger
 * /api/v1/alumnos/informes/{id}:
 *   delete:
 *     summary: Eliminar informe de alumno
 *     description: Elimina un informe de alumno del sistema
 *     tags: [Informes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del informe a eliminar
 *     responses:
 *       204:
 *         description: Informe eliminado exitosamente
 *       404:
 *         description: Informe no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_alumnos_informes + '/:id', sessionAuth, AlumnoInformeService.eliminar);

// Rutas para Monitoreos
/**
 * @swagger
 * /api/v1/alumnos/monitoreos:
 *   get:
 *     summary: Obtener monitoreos de alumnos
 *     description: Retorna todos los monitoreos registrados para alumnos
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
 *                 $ref: '#/components/schemas/AlumnoInforme'
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_alumnos_monitoreos, sessionAuth, AlumnoInformeService.obtener);
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
 *             $ref: '#/components/schemas/AlumnoInforme'
 *     responses:
 *       201:
 *         description: Monitoreo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoInforme'
 *       400:
 *         description: Datos inválidos para crear el monitoreo
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_alumnos_monitoreos, sessionAuth, AlumnoInformeService.guardar);
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
 *             $ref: '#/components/schemas/AlumnoInforme'
 *     responses:
 *       200:
 *         description: Monitoreo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoInforme'
 *       404:
 *         description: Monitoreo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_alumnos_monitoreos + '/:id', sessionAuth, AlumnoInformeService.actualizar);

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
router.delete(ruta_alumnos_monitoreos + '/:id', sessionAuth, AlumnoInformeService.eliminar);

// Rutas para alumnos_notificaciones
/**
 * @swagger
 * /api/v1/alumnos/notificaciones:
 *   get:
 *     summary: Obtener notificaciones de alumnos
 *     description: Retorna todas las notificaciones registradas para alumnos
 *     tags: [Notificaciones]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoNotificacion'
 *       500:
 *         description: Error interno del servidor
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
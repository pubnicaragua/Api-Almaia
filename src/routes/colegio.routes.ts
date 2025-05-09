import express from "express";
import { sessionAuth } from "../middleware/supabaseMidleware";
import { ColegiosService } from "../infrestructure/server/colegio/ColegioService";
import { GradosService } from "../infrestructure/server/colegio/GradoService";
import { NivelEducativosService } from "../infrestructure/server/colegio/NivelEducativoService";
import { AlumnoAsistenciasService } from "../infrestructure/server/colegio/AlumnoAsistenciaService";
import { AlumnoTareasService } from "../infrestructure/server/colegio/AlumnoTareaService";

const router = express.Router();
const rutas_grados = "/grados";
const rutas_nivel_educativo = "/niveles_educativos";
const rutas_alumnos_asistencias = "/alumnos_asistencias";
const rutas_alumnos_tareas = "/alumnos_tareas";

/**
 * @swagger
 * tags:
 *   - name: Colegios
 *     description: Gestión de colegios
 *   - name: Grados
 *     description: Gestión de grados educativos
 *   - name: Niveles Educativos
 *     description: Gestión de niveles educativos
 *   - name: Asistencias
 *     description: Gestión de asistencias de alumnos
 *   - name: Tareas
 *     description: Gestión de tareas de alumnos
 */

/**
 * @swagger
 * /api/v1/colegios:
 *   get:
 *     summary: Obtener lista de colegios
 *     description: Retorna todos los colegios registrados en el sistema
 *     tags: [Colegios]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de colegios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Colegio'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", sessionAuth, ColegiosService.obtener);

/**
 * @swagger
 * /api/v1/colegios:
 *   post:
 *     summary: Crear un nuevo colegio
 *     description: Registra un nuevo colegio en el sistema
 *     tags: [Colegios]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *           example:
 *             nombre: "Colegio Ejemplo"
 *             nombre_fantasia: "Ejemplo"
 *             tipo_colegio: "Privado"
 *             direccion: "Calle Principal 123"
 *             telefono_contacto: "+56912345678"
 *             correo_electronico: "contacto@colegioejemplo.cl"
 *             comuna_id: 101
 *             region_id: 13
 *             pais_id: 1
 *     responses:
 *       201:
 *         description: Colegio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", sessionAuth, ColegiosService.guardar);

/**
 * @swagger
 * /api/v1/colegios/{id}:
 *   put:
 *     summary: Actualizar un colegio existente
 *     description: Modifica los datos de un colegio registrado
 *     tags: [Colegios]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del colegio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *           example:
 *             nombre: "Colegio Ejemplo Actualizado"
 *             telefono_contacto: "+56987654321"
 *     responses:
 *       200:
 *         description: Colegio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Colegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", sessionAuth, ColegiosService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/{id}:
 *   delete:
 *     summary: Eliminar un colegio
 *     description: Elimina un colegio del sistema (lógico o físico según configuración)
 *     tags: [Colegios]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del colegio a eliminar
 *     responses:
 *       204:
 *         description: Colegio eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Colegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", sessionAuth, ColegiosService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/grados:
 *   get:
 *     summary: Obtener lista de grados
 *     description: Retorna todos los grados educativos registrados
 *     tags: [Grados]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de grados obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grado'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_grados, sessionAuth, GradosService.obtener);

/**
 * @swagger
 * /api/v1/colegios/grados:
 *   post:
 *     summary: Crear un nuevo grado
 *     description: Registra un nuevo grado educativo en el sistema
 *     tags: [Grados]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grado'
 *           example:
 *             nombre: "Primero Básico"
 *     responses:
 *       201:
 *         description: Grado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grado'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_grados, sessionAuth, GradosService.guardar);

/**
 * @swagger
 * /api/v1/colegios/grados/{id}:
 *   put:
 *     summary: Actualizar un grado existente
 *     description: Modifica los datos de un grado educativo registrado
 *     tags: [Grados]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grado'
 *           example:
 *             nombre: "Primero Básico A"
 *     responses:
 *       200:
 *         description: Grado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grado'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Grado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_grados}/:id`, sessionAuth, GradosService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/grados/{id}:
 *   delete:
 *     summary: Eliminar un grado
 *     description: Elimina un grado educativo del sistema
 *     tags: [Grados]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grado a eliminar
 *     responses:
 *       204:
 *         description: Grado eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Grado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_grados}/:id`, sessionAuth, GradosService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/niveles_educativos:
 *   get:
 *     summary: Obtener lista de niveles educativos
 *     description: Retorna todos los niveles educativos registrados
 *     tags: [Niveles Educativos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de niveles educativos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NivelEducativo'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_nivel_educativo, sessionAuth, NivelEducativosService.obtener);

/**
 * @swagger
 * /api/v1/colegios/niveles_educativos:
 *   post:
 *     summary: Crear un nuevo nivel educativo
 *     description: Registra un nuevo nivel educativo en el sistema
 *     tags: [Niveles Educativos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NivelEducativo'
 *           example:
 *             nombre: "Educación Básica"
 *     responses:
 *       201:
 *         description: Nivel educativo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NivelEducativo'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_nivel_educativo, sessionAuth, NivelEducativosService.guardar);

/**
 * @swagger
 * /api/v1/colegios/niveles_educativos/{id}:
 *   put:
 *     summary: Actualizar un nivel educativo existente
 *     description: Modifica los datos de un nivel educativo registrado
 *     tags: [Niveles Educativos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel educativo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NivelEducativo'
 *           example:
 *             nombre: "Educación Básica Completa"
 *     responses:
 *       200:
 *         description: Nivel educativo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NivelEducativo'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Nivel educativo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  `${rutas_nivel_educativo}/:id`,
  sessionAuth,
  NivelEducativosService.actualizar
);

/**
 * @swagger
 * /api/v1/colegios/niveles_educativos/{id}:
 *   delete:
 *     summary: Eliminar un nivel educativo
 *     description: Elimina un nivel educativo del sistema
 *     tags: [Niveles Educativos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nivel educativo a eliminar
 *     responses:
 *       204:
 *         description: Nivel educativo eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Nivel educativo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  `${rutas_nivel_educativo}/:id`,
  sessionAuth,
  NivelEducativosService.eliminar
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_asistencias:
 *   get:
 *     summary: Obtener lista de asistencias de alumnos
 *     description: Retorna todos los registros de asistencia de alumnos
 *     tags: [Asistencias]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoAsistencia'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  rutas_alumnos_asistencias,
  sessionAuth,
  AlumnoAsistenciasService.obtener
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_asistencias:
 *   post:
 *     summary: Registrar asistencia de alumno
 *     description: Crea un nuevo registro de asistencia para un alumno
 *     tags: [Asistencias]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAsistencia'
 *           example:
 *             alumno_id: 1
 *             estado: "Presente"
 *             fecha_hora: "2023-10-15T08:00:00Z"
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAsistencia'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  rutas_alumnos_asistencias,
  sessionAuth,
  AlumnoAsistenciasService.guardar
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_asistencias/{id}:
 *   put:
 *     summary: Actualizar registro de asistencia
 *     description: Modifica un registro existente de asistencia de alumno
 *     tags: [Asistencias]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoAsistencia'
 *           example:
 *             estado: "Justificado"
 *             justificacion: "Enfermedad"
 *             usuario_justifica: 2
 *     responses:
 *       200:
 *         description: Asistencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoAsistencia'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Registro de asistencia no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  `${rutas_alumnos_asistencias}/:id`,
  sessionAuth,
  AlumnoAsistenciasService.actualizar
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_asistencias/{id}:
 *   delete:
 *     summary: Eliminar registro de asistencia
 *     description: Elimina un registro de asistencia de alumno
 *     tags: [Asistencias]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a eliminar
 *     responses:
 *       204:
 *         description: Asistencia eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Registro de asistencia no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  `${rutas_alumnos_asistencias}/:id`,
  sessionAuth,
  AlumnoAsistenciasService.eliminar
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_tareas:
 *   get:
 *     summary: Obtener lista de tareas de alumnos
 *     description: Retorna todos los registros de tareas asignadas a alumnos
 *     tags: [Tareas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlumnoTarea'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_alumnos_tareas, sessionAuth, AlumnoTareasService.obtener);

/**
 * @swagger
 * /api/v1/colegios/alumnos_tareas:
 *   post:
 *     summary: Asignar tarea a alumno
 *     description: Crea un nuevo registro de tarea asignada a un alumno
 *     tags: [Tareas]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoTarea'
 *           example:
 *             alumno_id: 1
 *             materia_id: 3
 *             fecha_programacion: "2023-10-20"
 *             tipo_tarea: "Proyecto"
 *             descripcion_tarea: "Investigación sobre ecosistemas"
 *             estado_tarea: "Pendiente"
 *             color: "#FF5733"
 *     responses:
 *       201:
 *         description: Tarea asignada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoTarea'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_alumnos_tareas, sessionAuth, AlumnoTareasService.guardar);

/**
 * @swagger
 * /api/v1/colegios/alumnos_tareas/{id}:
 *   put:
 *     summary: Actualizar tarea de alumno
 *     description: Modifica un registro existente de tarea asignada a alumno
 *     tags: [Tareas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlumnoTarea'
 *           example:
 *             estado_tarea: "Completada"
 *             descripcion_tarea: "Investigación sobre ecosistemas (entregada)"
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoTarea'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Registro de tarea no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  `${rutas_alumnos_tareas}/:id`,
  sessionAuth,
  AlumnoTareasService.actualizar
);

/**
 * @swagger
 * /api/v1/colegios/alumnos_tareas/{id}:
 *   delete:
 *     summary: Eliminar tarea de alumno
 *     description: Elimina un registro de tarea asignada a alumno
 *     tags: [Tareas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de tarea a eliminar
 *     responses:
 *       204:
 *         description: Tarea eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Registro de tarea no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  `${rutas_alumnos_tareas}/:id`,
  sessionAuth,
  AlumnoTareasService.eliminar
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Colegio:
 *       type: object
 *       properties:
 *         colegio_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Colegio Ejemplo"
 *         nombre_fantasia:
 *           type: string
 *           example: "Ejemplo"
 *         tipo_colegio:
 *           type: string
 *           example: "Privado"
 *         dependencia:
 *           type: string
 *           example: "Particular"
 *         sitio_web:
 *           type: string
 *           example: "www.colegioejemplo.cl"
 *         direccion:
 *           type: string
 *           example: "Calle Principal 123"
 *         telefono_contacto:
 *           type: string
 *           example: "+56912345678"
 *         correo_electronico:
 *           type: string
 *           example: "contacto@colegioejemplo.cl"
 *         comuna_id:
 *           type: integer
 *           example: 101
 *         region_id:
 *           type: integer
 *           example: 13
 *         pais_id:
 *           type: integer
 *           example: 1
 * 
 *     Grado:
 *       type: object
 *       properties:
 *         grado_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Primero Básico"
 * 
 *     NivelEducativo:
 *       type: object
 *       properties:
 *         nivel_educativo_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Educación Básica"
 * 
 *     AlumnoAsistencia:
 *       type: object
 *       properties:
 *         alumno_asistencia_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 1
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           example: "2023-10-15T08:00:00Z"
 *         estado:
 *           type: string
 *           example: "Presente"
 *         justificacion:
 *           type: string
 *           example: "Enfermedad"
 *         usuario_justifica:
 *           type: integer
 *           example: 2
 * 
 *     AlumnoTarea:
 *       type: object
 *       properties:
 *         alumno_tarea_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 1
 *         fecha_programacion:
 *           type: string
 *           format: date
 *           example: "2023-10-20"
 *         materia_id:
 *           type: integer
 *           example: 3
 *         color:
 *           type: string
 *           example: "#FF5733"
 *         tipo_tarea:
 *           type: string
 *           example: "Proyecto"
 *         descripcion_tarea:
 *           type: string
 *           example: "Investigación sobre ecosistemas"
 *         estado_tarea:
 *           type: string
 *           example: "Pendiente"
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Token de autenticación obtenido al iniciar sesión
 */

export default router;
import express from "express";
import { sessionAuth } from "../middleware/supabaseMidleware";
import { ColegiosService } from "../infrestructure/server/colegio/ColegioService";
import { GradosService } from "../infrestructure/server/colegio/GradoService";
import { NivelEducativosService } from "../infrestructure/server/colegio/NivelEducativoService";
import { AlumnoAsistenciasService } from "../infrestructure/server/colegio/AlumnoAsistenciaService";
import { AlumnoTareasService } from "../infrestructure/server/colegio/AlumnoTareaService";
import { AulasService } from "../infrestructure/server/colegio/AulaService";
import { CalendarioDiaFestivosService } from "../infrestructure/server/colegio/CalendarioDiaFestivoService";
import { CalendarioEscolarsService } from "../infrestructure/server/colegio/CalendarioEscolarService";
import { CalendarioFechaImportantesService } from "../infrestructure/server/colegio/FechaImportanteService";
import { CursosService } from "../infrestructure/server/colegio/CursoService";
import { HistorialComunicacionsService } from "../infrestructure/server/colegio/HistorialComunicacionService";

const router = express.Router();
const rutas_grados = "/grados";
const rutas_nivel_educativo = "/niveles_educativos";
const rutas_alumnos_asistencias = "/alumnos_asistencias";
const rutas_alumnos_tareas = "/alumnos_tareas";
const rutas_aulas = "/aulas";
const rutas_dias_festivos = "/dias_festivos";
const rutas_calendarios_escolares = "/calendarios_escolares";
const rutas_calendarios_fechas_importantes = "/calendarios_fechas_importantes";
const rutas_cursos = "/cursos";
const rutas_historiales_comunicaciones = "/historiales_comunicaciones";

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
 *   - name: Aulas
 *     description: Gestión de aulas
 *   - name: Días Festivos
 *     description: Gestión de días festivos
 *   - name: Calendarios Escolares
 *     description: Gestión de calendarios escolares
 *   - name: Fechas Importantes
 *     description: Gestión de fechas importantes
 *   - name: Cursos
 *     description: Gestión de cursos
 *   - name: Comunicaciones
 *     description: Gestión de historial de comunicaciones
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
 * /api/v1/colegios/aulas:
 *   get:
 *     summary: Obtener lista de aulas
 *     description: Retorna todas las aulas registradas
 *     tags: [Aulas]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de aulas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aula'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_aulas, sessionAuth, AulasService.obtener);

/**
 * @swagger
 * /api/v1/colegios/aulas:
 *   post:
 *     summary: Crear una nueva aula
 *     description: Registra una nueva aula en el sistema
 *     tags: [Aulas]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *           example:
 *             nombre: "Aula 101"
 *             capacidad: 30
 *             grado_id: 1
 *     responses:
 *       201:
 *         description: Aula creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_aulas, sessionAuth, AulasService.guardar);

/**
 * @swagger
 * /api/v1/colegios/aulas/{id}:
 *   put:
 *     summary: Actualizar una aula existente
 *     description: Modifica los datos de un aula registrada
 *     tags: [Aulas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aula a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *           example:
 *             nombre: "Aula 102"
 *             capacidad: 35
 *     responses:
 *       200:
 *         description: Aula actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Aula no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_aulas}/:id`, sessionAuth, AulasService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/aulas/{id}:
 *   delete:
 *     summary: Eliminar un aula
 *     description: Elimina un aula del sistema
 *     tags: [Aulas]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aula a eliminar
 *     responses:
 *       204:
 *         description: Aula eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Aula no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_aulas}/:id`, sessionAuth, AulasService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/dias_festivos:
 *   get:
 *     summary: Obtener lista de días festivos
 *     description: Retorna todos los días festivos registrados
 *     tags: [Días Festivos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de días festivos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiaFestivo'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_dias_festivos, sessionAuth, CalendarioDiaFestivosService.obtener);

/**
 * @swagger
 * /api/v1/colegios/dias_festivos:
 *   post:
 *     summary: Crear un nuevo día festivo
 *     description: Registra un nuevo día festivo en el sistema
 *     tags: [Días Festivos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiaFestivo'
 *           example:
 *             calendario_escolar_id: 1
 *             dia_festivo: "2023-12-25"
 *             descripcion: "Navidad"
 *     responses:
 *       201:
 *         description: Día festivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaFestivo'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_dias_festivos, sessionAuth, CalendarioDiaFestivosService.guardar);

/**
 * @swagger
 * /api/v1/colegios/dias_festivos/{id}:
 *   put:
 *     summary: Actualizar un día festivo existente
 *     description: Modifica los datos de un día festivo registrado
 *     tags: [Días Festivos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del día festivo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiaFestivo'
 *           example:
 *             descripcion: "Navidad (actualizado)"
 *     responses:
 *       200:
 *         description: Día festivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaFestivo'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Día festivo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_dias_festivos}/:id`, sessionAuth, CalendarioDiaFestivosService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/dias_festivos/{id}:
 *   delete:
 *     summary: Eliminar un día festivo
 *     description: Elimina un día festivo del sistema
 *     tags: [Días Festivos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del día festivo a eliminar
 *     responses:
 *       204:
 *         description: Día festivo eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Día festivo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_dias_festivos}/:id`, sessionAuth, CalendarioDiaFestivosService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_escolares:
 *   get:
 *     summary: Obtener lista de calendarios escolares
 *     description: Retorna todos los calendarios escolares registrados
 *     tags: [Calendarios Escolares]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de calendarios escolares obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioEscolar'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_calendarios_escolares, sessionAuth, CalendarioEscolarsService.obtener);

/**
 * @swagger
 * /api/v1/colegios/calendarios_escolares:
 *   post:
 *     summary: Crear un nuevo calendario escolar
 *     description: Registra un nuevo calendario escolar en el sistema
 *     tags: [Calendarios Escolares]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioEscolar'
 *           example:
 *             nombre: "Calendario 2023-2024"
 *             año: 2023
 *     responses:
 *       201:
 *         description: Calendario escolar creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioEscolar'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_calendarios_escolares, sessionAuth, CalendarioEscolarsService.guardar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_escolares/{id}:
 *   put:
 *     summary: Actualizar un calendario escolar existente
 *     description: Modifica los datos de un calendario escolar registrado
 *     tags: [Calendarios Escolares]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario escolar a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioEscolar'
 *           example:
 *             nombre: "Calendario Académico 2023-2024"
 *     responses:
 *       200:
 *         description: Calendario escolar actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioEscolar'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Calendario escolar no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_calendarios_escolares}/:id`, sessionAuth, CalendarioEscolarsService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_escolares/{id}:
 *   delete:
 *     summary: Eliminar un calendario escolar
 *     description: Elimina un calendario escolar del sistema
 *     tags: [Calendarios Escolares]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario escolar a eliminar
 *     responses:
 *       204:
 *         description: Calendario escolar eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Calendario escolar no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_calendarios_escolares}/:id`, sessionAuth, CalendarioEscolarsService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_fechas_importantes:
 *   get:
 *     summary: Obtener lista de fechas importantes
 *     description: Retorna todas las fechas importantes registradas
 *     tags: [Fechas Importantes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de fechas importantes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioFechaImportante'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_calendarios_fechas_importantes, sessionAuth, CalendarioFechaImportantesService.obtener);

/**
 * @swagger
 * /api/v1/colegios/calendarios_fechas_importantes:
 *   post:
 *     summary: Crear una nueva fecha importante
 *     description: Registra una nueva fecha importante en el sistema
 *     tags: [Fechas Importantes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioFechaImportante'
 *           example:
 *             calendario_escolar_id: 1
 *             fecha_importante: "2023-12-25"
 *             descripcion: "Navidad"
 *     responses:
 *       201:
 *         description: Fecha importante creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioFechaImportante'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_calendarios_fechas_importantes, sessionAuth, CalendarioFechaImportantesService.guardar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_fechas_importantes/{id}:
 *   put:
 *     summary: Actualizar una fecha importante existente
 *     description: Modifica los datos de una fecha importante registrada
 *     tags: [Fechas Importantes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fecha importante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioFechaImportante'
 *           example:
 *             descripcion: "Navidad (actualizado)"
 *     responses:
 *       200:
 *         description: Fecha importante actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioFechaImportante'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Fecha importante no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_calendarios_fechas_importantes}/:id`, sessionAuth, CalendarioFechaImportantesService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/calendarios_fechas_importantes/{id}:
 *   delete:
 *     summary: Eliminar una fecha importante
 *     description: Elimina una fecha importante del sistema
 *     tags: [Fechas Importantes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fecha importante a eliminar
 *     responses:
 *       204:
 *         description: Fecha importante eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Fecha importante no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_calendarios_fechas_importantes}/:id`, sessionAuth, CalendarioFechaImportantesService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/cursos:
 *   get:
 *     summary: Obtener lista de cursos
 *     description: Retorna todos los cursos registrados
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_cursos, sessionAuth, CursosService.obtener);

/**
 * @swagger
 * /api/v1/colegios/cursos:
 *   post:
 *     summary: Crear un nuevo curso
 *     description: Registra un nuevo curso en el sistema
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             nombre: "Matemáticas Avanzadas"
 *             descripcion: "Curso de matemáticas para nivel avanzado"
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_cursos, sessionAuth, CursosService.guardar);

/**
 * @swagger
 * /api/v1/colegios/cursos/{id}:
 *   put:
 *     summary: Actualizar un curso existente
 *     description: Modifica los datos de un curso registrado
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             descripcion: "Curso avanzado de matemáticas (actualizado)"
 *     responses:
 *       200:
 *         description: Curso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_cursos}/:id`, sessionAuth, CursosService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/cursos/{id}:
 *   delete:
 *     summary: Eliminar un curso
 *     description: Elimina un curso del sistema
 *     tags: [Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso a eliminar
 *     responses:
 *       204:
 *         description: Curso eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_cursos}/:id`, sessionAuth, CursosService.eliminar);

/**
 * @swagger
 * /api/v1/colegios/historiales_comunicaciones:
 *   get:
 *     summary: Obtener historial de comunicaciones
 *     description: Retorna el historial de comunicaciones registrado
 *     tags: [Comunicaciones]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Historial de comunicaciones obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistorialComunicacion'
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(rutas_historiales_comunicaciones, sessionAuth, HistorialComunicacionsService.obtener);

/**
 * @swagger
 * /api/v1/colegios/historiales_comunicaciones:
 *   post:
 *     summary: Registrar nueva comunicación
 *     description: Crea un nuevo registro en el historial de comunicaciones
 *     tags: [Comunicaciones]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistorialComunicacion'
 *           example:
 *             alumno_id: 1
 *             apoderado_id: 1
 *             usuario_id: 1
 *             asunto: "Informe de rendimiento"
 *             descripcion: "Reunión para discutir el rendimiento académico"
 *             acciones_acuerdos_tomados: "Programar tutorías semanales"
 *     responses:
 *       201:
 *         description: Comunicación registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialComunicacion'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(rutas_historiales_comunicaciones, sessionAuth, HistorialComunicacionsService.guardar);

/**
 * @swagger
 * /api/v1/colegios/historiales_comunicaciones/{id}:
 *   put:
 *     summary: Actualizar comunicación existente
 *     description: Modifica un registro existente en el historial de comunicaciones
 *     tags: [Comunicaciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la comunicación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistorialComunicacion'
 *           example:
 *             descripcion: "Reunión para discutir el rendimiento académico (actualizado)"
 *             acciones_acuerdos_tomados: "Programar tutorías semanales y seguimiento mensual"
 *     responses:
 *       200:
 *         description: Comunicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialComunicacion'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Comunicación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${rutas_historiales_comunicaciones}/:id`, sessionAuth, HistorialComunicacionsService.actualizar);

/**
 * @swagger
 * /api/v1/colegios/historiales_comunicaciones/{id}:
 *   delete:
 *     summary: Eliminar comunicación
 *     description: Elimina un registro del historial de comunicaciones
 *     tags: [Comunicaciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la comunicación a eliminar
 *     responses:
 *       204:
 *         description: Comunicación eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Comunicación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${rutas_historiales_comunicaciones}/:id`, sessionAuth, HistorialComunicacionsService.eliminar);

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
 *     Aula:
 *       type: object
 *       properties:
 *         aula_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Aula 101"
 *         capacidad:
 *           type: integer
 *           example: 30
 *         grado_id:
 *           type: integer
 *           example: 1
 * 
 *     DiaFestivo:
 *       type: object
 *       properties:
 *         dia_festivo_id:
 *           type: integer
 *           example: 1
 *         calendario_escolar_id:
 *           type: integer
 *           example: 1
 *         dia_festivo:
 *           type: string
 *           format: date
 *           example: "2023-12-25"
 *         descripcion:
 *           type: string
 *           example: "Navidad"
 * 
 *     CalendarioEscolar:
 *       type: object
 *       properties:
 *         calendario_escolar_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Calendario 2023"
 *         año:
 *           type: integer
 *           example: 2023
 * 
 *     CalendarioFechaImportante:
 *       type: object
 *       properties:
 *         fecha_importante_id:
 *           type: integer
 *           example: 1
 *         calendario_escolar_id:
 *           type: integer
 *           example: 1
 *         fecha_importante:
 *           type: string
 *           format: date
 *           example: "2023-12-25"
 *         descripcion:
 *           type: string
 *           example: "Navidad"
 * 
 *     Curso:
 *       type: object
 *       properties:
 *         curso_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Matemáticas Avanzadas"
 *         descripcion:
 *           type: string
 *           example: "Curso de matemáticas para nivel avanzado"
 * 
 *     HistorialComunicacion:
 *       type: object
 *       properties:
 *         historial_comunicacion_id:
 *           type: integer
 *           example: 1
 *         alumno_id:
 *           type: integer
 *           example: 1
 *         apoderado_id:
 *           type: integer
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           example: 1
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           example: "2023-10-15T14:30:00Z"
 *         asunto:
 *           type: string
 *           example: "Informe de rendimiento"
 *         descripcion:
 *           type: string
 *           example: "Reunión para discutir el rendimiento académico"
 *         acciones_acuerdos_tomados:
 *           type: string
 *           example: "Programar tutorías semanales"
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Token de autenticación obtenido al iniciar sesión
 */

export default router;
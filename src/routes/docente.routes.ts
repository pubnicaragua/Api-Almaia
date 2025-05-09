import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { DocentesService } from '../infrestructure/server/docente/DocenteService';
import { DocenteCursosService } from '../infrestructure/server/docente/DocenteCursoService';

const router = express.Router();
const ruta_docentes_cursos = '/docentes_cursos';

/**
 * @swagger
 * tags:
 *   - name: Docentes
 *     description: Gestión de docentes del sistema
 *   - name: Docentes_Cursos
 *     description: Asignación de cursos a docentes
 */

/**
 * @swagger
 * /api/v1/docentes:
 *   get:
 *     summary: Obtener lista de docentes
 *     description: Retorna todos los docentes registrados en el sistema con sus datos asociados
 *     tags: [Docentes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de docentes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Docente'
 *             example:
 *               - docente_id: 1
 *                 persona_id: 1
 *                 colegio_id: 1
 *                 especialidad: "Matemáticas"
 *                 estado: "Activo"
 *                 persona:
 *                   persona_id: 1
 *                   tipo_documento: "DNI"
 *                   numero_documento: "12345678"
 *                   nombres: "Juan"
 *                   apellidos: "Pérez"
 *                   genero_id: 1
 *                   estado_civil_id: 2
 *                 colegio:
 *                   colegio_id: 1
 *                   nombre: "Colegio San Juan"
 *                   nombre_fantasia: "San Juan"
 *                   tipo_colegio: "Privado"
 *                   direccion: "Calle Principal 123"
 *                   telefono_contacto: "+56912345678"
 *                   correo_electronico: "contacto@colegiosanjuan.cl"
 *                   comuna_id: 101
 *                   region_id: 13
 *                   pais_id: 1
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', sessionAuth, DocentesService.obtener);

/**
 * @swagger
 * /api/v1/docentes:
 *   post:
 *     summary: Crear un nuevo docente
 *     description: Registra un nuevo docente en el sistema
 *     tags: [Docentes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Docente'
 *           example:
 *             persona_id: 2
 *             colegio_id: 1
 *             especialidad: "Lenguaje"
 *             estado: "Activo"
 *     responses:
 *       201:
 *         description: Docente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Docente'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', sessionAuth, DocentesService.guardar);

/**
 * @swagger
 * /api/v1/docentes/{id}:
 *   put:
 *     summary: Actualizar un docente existente
 *     description: Modifica los datos de un docente registrado
 *     tags: [Docentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del docente a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Docente'
 *           example:
 *             especialidad: "Matemáticas Avanzadas"
 *             estado: "Activo"
 *     responses:
 *       200:
 *         description: Docente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Docente'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Docente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', sessionAuth, DocentesService.actualizar);

/**
 * @swagger
 * /api/v1/docentes/{id}:
 *   delete:
 *     summary: Eliminar un docente
 *     description: Elimina un docente del sistema (lógico o físico según configuración)
 *     tags: [Docentes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del docente a eliminar
 *         example: 1
 *     responses:
 *       204:
 *         description: Docente eliminado exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Docente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', sessionAuth, DocentesService.eliminar);

/**
 * @swagger
 * /api/v1/docentes/docentes_cursos:
 *   get:
 *     summary: Obtener asignaciones de cursos a docentes
 *     description: Retorna todas las asignaciones de cursos a docentes registradas
 *     tags: [Docentes_Cursos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocenteCurso'
 *             example:
 *               - id: 1
 *                 docente_id: 1
 *                 curso_id: 5
 *                 año: 2023
 *                 docente:
 *                   docente_id: 1
 *                   persona_id: 1
 *                   colegio_id: 1
 *                   especialidad: "Matemáticas"
 *                   estado: "Activo"
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_docentes_cursos, sessionAuth, DocenteCursosService.obtener);

/**
 * @swagger
 * /api/v1/docentes/docentes_cursos:
 *   post:
 *     summary: Asignar un curso a un docente
 *     description: Crea una nueva asignación de curso a docente
 *     tags: [Docentes_Cursos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docente_id:
 *                 type: integer
 *               curso_id:
 *                 type: integer
 *               año:
 *                 type: integer
 *           example:
 *             docente_id: 1
 *             curso_id: 5
 *             año: 2023
 *     responses:
 *       201:
 *         description: Asignación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteCurso'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_docentes_cursos, sessionAuth, DocenteCursosService.guardar);

/**
 * @swagger
 * /api/v1/docentes/docentes_cursos/{id}:
 *   put:
 *     summary: Actualizar asignación de curso a docente
 *     description: Modifica una asignación existente de curso a docente
 *     tags: [Docentes_Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curso_id:
 *                 type: integer
 *               año:
 *                 type: integer
 *           example:
 *             curso_id: 6
 *             año: 2024
 *     responses:
 *       200:
 *         description: Asignación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteCurso'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(`${ruta_docentes_cursos}/:id`, sessionAuth, DocenteCursosService.actualizar);

/**
 * @swagger
 * /api/v1/docentes/docentes_cursos/{id}:
 *   delete:
 *     summary: Eliminar asignación de curso a docente
 *     description: Elimina una asignación existente de curso a docente
 *     tags: [Docentes_Cursos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a eliminar
 *         example: 1
 *     responses:
 *       204:
 *         description: Asignación eliminada exitosamente
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(`${ruta_docentes_cursos}/:id`, sessionAuth, DocenteCursosService.eliminar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         persona_id:
 *           type: integer
 *           example: 1
 *         tipo_documento:
 *           type: string
 *           example: "DNI"
 *         numero_documento:
 *           type: string
 *           example: "12345678"
 *         nombres:
 *           type: string
 *           example: "Juan"
 *         apellidos:
 *           type: string
 *           example: "Pérez"
 *         genero_id:
 *           type: integer
 *           example: 1
 *         estado_civil_id:
 *           type: integer
 *           example: 2
 * 
 *     Colegio:
 *       type: object
 *       properties:
 *         colegio_id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Colegio San Juan"
 *         nombre_fantasia:
 *           type: string
 *           example: "San Juan"
 *         tipo_colegio:
 *           type: string
 *           example: "Privado"
 *         dependencia:
 *           type: string
 *           example: "Particular"
 *         sitio_web:
 *           type: string
 *           example: "www.colegiosanjuan.cl"
 *         direccion:
 *           type: string
 *           example: "Calle Principal 123"
 *         telefono_contacto:
 *           type: string
 *           example: "+56912345678"
 *         correo_electronico:
 *           type: string
 *           example: "contacto@colegiosanjuan.cl"
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
 *     Docente:
 *       type: object
 *       properties:
 *         docente_id:
 *           type: integer
 *           example: 1
 *         persona_id:
 *           type: integer
 *           example: 1
 *         colegio_id:
 *           type: integer
 *           example: 1
 *         especialidad:
 *           type: string
 *           example: "Matemáticas"
 *         estado:
 *           type: string
 *           example: "Activo"
 *         persona:
 *           $ref: '#/components/schemas/Persona'
 *         colegio:
 *           $ref: '#/components/schemas/Colegio'
 * 
 *     DocenteCurso:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         docente_id:
 *           type: integer
 *           example: 1
 *         curso_id:
 *           type: integer
 *           example: 5
 *         año:
 *           type: integer
 *           example: 2023
 *         docente:
 *           $ref: '#/components/schemas/Docente'
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Token de autenticación obtenido al iniciar sesión
 */

export default router;
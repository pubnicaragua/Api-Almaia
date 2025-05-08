import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
import { RolesService } from '../infrestructure/server/auth/RolesService';
import { FuncionalidadesService } from '../infrestructure/server/auth/Funcionalidades';
import { FuncionalidadRolService } from '../infrestructure/server/auth/FuncionalidadRolService';

const router = express.Router();
const ruta_roles = '/roles';
const ruta_funcionalidades = '/funcionalidades';
const ruta_funcionalidades_roles = '/funcionalidades_roles';

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicio de sesión de usuario
 *     description: Autentica al usuario y devuelve un token de sesión
 *     tags:
 *       - Autenticación
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: contraseñaSegura123
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', AuthService.login);

/**
 * @swagger
 * /api/v1/auth/registro:
 *   post:
 *     summary: Registro de nuevo usuario
 *     description: Crea una nueva cuenta de usuario
 *     tags:
 *       - Autenticación
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevo@usuario.com
 *               password:
 *                 type: string
 *                 example: contraseñaSegura123
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/registro', AuthService.register);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Cambio de contraseña
 *     description: Permite a un usuario cambiar su contraseña
 *     tags:
 *       - Autenticación
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: contraseñaActual123
 *               newPassword:
 *                 type: string
 *                 example: nuevaContraseña456
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       401:
 *         description: Contraseña actual incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/change-password', sessionAuth, AuthService.changePassword);

// Roles

/**
 * @swagger
 * /api/v1/auth/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     description: Retorna una lista de todos los roles disponibles
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error del servidor
 */
router.get(ruta_roles+'/', sessionAuth, RolesService.obtener);

/**
 * @swagger
 * /api/v1/auth/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     description: Crea un nuevo rol en el sistema
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(ruta_roles+'/', sessionAuth, RolesService.guardar);

/**
 * @swagger
 * /api/v1/auth/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     description: Actualiza la información de un rol existente
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(ruta_roles+'/:id', sessionAuth, RolesService.actualizar);

/**
 * @swagger
 * /api/v1/auth/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     description: Elimina un rol del sistema
 *     tags:
 *       - Roles
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       204:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(ruta_roles+'/:id', sessionAuth, RolesService.eliminar);

// Funcionalidades

/**
 * @swagger
 * /api/v1/auth/funcionalidades:
 *   get:
 *     summary: Obtener todas las funcionalidades
 *     description: Retorna una lista de todas las funcionalidades disponibles
 *     tags:
 *       - Funcionalidades
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionalidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionalidad'
 *       500:
 *         description: Error del servidor
 */
router.get(ruta_funcionalidades+'/', sessionAuth, FuncionalidadesService.obtener);

/**
 * @swagger
 * /api/v1/auth/funcionalidades:
 *   post:
 *     summary: Crear una nueva funcionalidad
 *     description: Crea una nueva funcionalidad en el sistema
 *     tags:
 *       - Funcionalidades
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionalidad'
 *     responses:
 *       201:
 *         description: Funcionalidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionalidad'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(ruta_funcionalidades+'/', sessionAuth, FuncionalidadesService.guardar);

/**
 * @swagger
 * /api/v1/auth/funcionalidades/{id}:
 *   put:
 *     summary: Actualizar una funcionalidad
 *     description: Actualiza la información de una funcionalidad existente
 *     tags:
 *       - Funcionalidades
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la funcionalidad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Funcionalidad'
 *     responses:
 *       200:
 *         description: Funcionalidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionalidad'
 *       404:
 *         description: Funcionalidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(ruta_funcionalidades+'/:id', sessionAuth, FuncionalidadesService.actualizar);

/**
 * @swagger
 * /api/v1/auth/funcionalidades/{id}:
 *   delete:
 *     summary: Eliminar una funcionalidad
 *     description: Elimina una funcionalidad del sistema
 *     tags:
 *       - Funcionalidades
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la funcionalidad a eliminar
 *     responses:
 *       204:
 *         description: Funcionalidad eliminada exitosamente
 *       404:
 *         description: Funcionalidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(ruta_funcionalidades+'/:id', sessionAuth, FuncionalidadesService.eliminar);

// Funcionalidades-Roles

/**
 * @swagger
 * /api/v1/auth/funcionalidades_roles:
 *   get:
 *     summary: Obtener todas las asociaciones funcionalidad-rol
 *     description: Retorna una lista de todas las asociaciones entre funcionalidades y roles
 *     tags:
 *       - Funcionalidades-Roles
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de asociaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuncionalidadRol'
 *       500:
 *         description: Error del servidor
 */
router.get(ruta_funcionalidades_roles+'/', sessionAuth, FuncionalidadRolService.obtener);

/**
 * @swagger
 * /funcionalidades_roles:
 *   post:
 *     summary: Crear una nueva asociación funcionalidad-rol
 *     description: Crea una nueva asociación entre una funcionalidad y un rol
 *     tags:
 *       - Funcionalidades-Roles
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionalidadRol'
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuncionalidadRol'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(ruta_funcionalidades_roles+'/', sessionAuth, FuncionalidadRolService.guardar);

/**
 * @swagger
 * /api/v1/auth/funcionalidades_roles/{id}:
 *   put:
 *     summary: Actualizar una asociación funcionalidad-rol
 *     description: Actualiza una asociación existente entre una funcionalidad y un rol
 *     tags:
 *       - Funcionalidades-Roles
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asociación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionalidadRol'
 *     responses:
 *       200:
 *         description: Asociación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuncionalidadRol'
 *       404:
 *         description: Asociación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(ruta_funcionalidades_roles+'/:id', sessionAuth, FuncionalidadRolService.actualizar);

/**
 * @swagger
 * /api/v1/auth/funcionalidades_roles/{id}:
 *   delete:
 *     summary: Eliminar una asociación funcionalidad-rol
 *     description: Elimina una asociación entre una funcionalidad y un rol
 *     tags:
 *       - Funcionalidades-Roles
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asociación a eliminar
 *     responses:
 *       204:
 *         description: Asociación eliminada exitosamente
 *       404:
 *         description: Asociación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(ruta_funcionalidades_roles+'/:id', sessionAuth, FuncionalidadRolService.eliminar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         rol_id:
 *           type: integer
 *           description: ID único del rol
 *         nombre:
 *           type: string
 *           description: Nombre del rol
 *           example: "Administrador"
 *         descripcion:
 *           type: string
 *           description: Descripción del rol
 *           example: "Rol con todos los permisos del sistema"
 *       required:
 *         - nombre
 * 
 *     Funcionalidad:
 *       type: object
 *       properties:
 *         funcionalidad_id:
 *           type: integer
 *           description: ID único de la funcionalidad
 *         nombre:
 *           type: string
 *           description: Nombre de la funcionalidad
 *           example: "Gestionar usuarios"
 *         descripcion:
 *           type: string
 *           description: Descripción de la funcionalidad
 *           example: "Permite crear, editar y eliminar usuarios"
 *       required:
 *         - nombre
 * 
 *     FuncionalidadRol:
 *       type: object
 *       properties:
 *         funcionalidad_rol:
 *           type: integer
 *           description: ID único de la asociación
 *         funcionalidad_id:
 *           type: integer
 *           description: ID de la funcionalidad asociada
 *           example: 1
 *         rol_id:
 *           type: integer
 *           description: ID del rol asociado
 *           example: 2
 *       required:
 *         - funcionalidad_id
 *         - rol_id
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Token de autenticación obtenido al iniciar sesión
 */

export default router;
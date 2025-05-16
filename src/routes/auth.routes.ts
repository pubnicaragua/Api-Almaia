import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
import { RolesService } from '../infrestructure/server/auth/RolesService';
import { FuncionalidadesService } from '../infrestructure/server/auth/Funcionalidades';
import { FuncionalidadRolService } from '../infrestructure/server/auth/FuncionalidadRolService';
import { UsuariosService } from '../infrestructure/server/auth/UsuarioService';
import { AuditoriaesService } from '../infrestructure/server/auth/AuditoriaService';
import { AuditoriaPermisoesService } from '../infrestructure/server/auth/AuditoriaPermisoService';
import { RegistroInteraccionesService } from '../infrestructure/server/auth/RegistroInteracccionService';

const router = express.Router();
const ruta_roles = '/roles';
const ruta_usuarios = '/usuarios';
const ruta_funcionalidades = '/funcionalidades';
const ruta_funcionalidades_roles = '/funcionalidades_roles';
const ruta_auditorias = '/auditorias';
const ruta_auditorias_permisos = '/auditorias_permisos';
const ruta_registros_interacciones = '/registros_interacciones';

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
/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/v1/usuarios/:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en el sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         description: No autorizado, token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_usuarios+'/', sessionAuth, UsuariosService.obtener);

/**
 * @swagger
 * /api/v1/usuarios/:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *       401:
 *         description: No autorizado, token inválido o faltante
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_usuarios+'/', sessionAuth, UsuariosService.guardar);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario existente
 *     description: Actualiza la información de un usuario por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado, token inválido o faltante
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(ruta_usuarios+'/:id', sessionAuth, UsuariosService.actualizar);

/**
 * @swagger
 * /api/v1/auth/auditorias/:
 *   get:
 *     summary: Obtiene todos los registros de auditoría
 *     description: Retorna una lista de todos los registros de auditoría del sistema
 *     tags: [Auditoría]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditoria'
 *       401:
 *         description: No autorizado, sesión inválida
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_auditorias+'/', sessionAuth, AuditoriaesService.obtener);

/**
 * @swagger
 * /api/v1/auth/auditorias/{id}:
 *   post:
 *     summary: Crea o actualiza un registro de auditoría
 *     description: Guarda un nuevo registro de auditoría o actualiza uno existente si se proporciona un ID
 *     tags: [Auditoría]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del registro de auditoría (opcional para actualización)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auditoria'
 *     responses:
 *       201:
 *         description: Registro de auditoría creado/actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado, sesión inválida
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_auditorias+'/', sessionAuth, AuditoriaesService.guardar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Auditoria:
 *       type: object
 *       properties:
 *         auditoria_id:
 *           type: integer
 *           description: ID único del registro de auditoría
 *           example: 1
 *         tipo_auditoria_id:
 *           type: integer
 *           description: ID del tipo de auditoría
 *           example: 2
 *         colegio_id:
 *           type: integer
 *           description: ID del colegio relacionado
 *           example: 5
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la auditoría
 *           example: "2023-05-16T14:30:00Z"
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realizó la acción
 *           example: 10
 *         descripcion:
 *           type: string
 *           description: Descripción detallada de la auditoría
 *           example: "Usuario modificó datos de estudiante"
 *         modulo_afectado:
 *           type: string
 *           description: Módulo del sistema afectado
 *           example: "Estudiantes"
 *         accion_realizada:
 *           type: string
 *           description: Acción específica realizada
 *           example: "Actualización"
 *         ip_origen:
 *           type: string
 *           description: Dirección IP desde donde se realizó la acción
 *           example: "192.168.1.100"
 *         referencia_id:
 *           type: integer
 *           description: ID del registro afectado en el módulo
 *           example: 15
 *         model:
 *           type: string
 *           description: Modelo de datos afectado
 *           example: "Student"
 *       required:
 *         - tipo_auditoria_id
 *         - colegio_id
 *         - fecha
 *         - usuario_id
 *         - descripcion
 *         - modulo_afectado
 *         - accion_realizada
 *         - ip_origen
 *         - referencia_id
 *         - model
 */

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID (eliminación lógica)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado, token inválido o faltante
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(ruta_usuarios+'/:id', sessionAuth, UsuariosService.eliminar);

/**
 * @swagger
 * /api/v1/auth/auditorias-permisos/:
 *   get:
 *     summary: Obtiene todos los registros de auditoría de permisos
 *     description: Retorna una lista de todos los registros de auditoría de permisos del sistema
 *     tags: [Auditoría de Permisos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de auditorías de permisos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditoriaPermiso'
 *       401:
 *         description: No autorizado, sesión inválida o sin permisos
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_auditorias_permisos+'/', sessionAuth, AuditoriaPermisoesService.obtener);

/**
 * @swagger
 * /api/v1/auth/auditorias-permisos/:
 *   post:
 *     summary: Crea un nuevo registro de auditoría de permisos
 *     description: Registra un nuevo permiso auditado en el sistema
 *     tags: [Auditoría de Permisos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditoriaPermiso'
 *     responses:
 *       201:
 *         description: Registro de auditoría de permisos creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditoriaPermiso'
 *       400:
 *         description: Datos de entrada inválidos o incompletos
 *       401:
 *         description: No autorizado, sesión inválida o sin permisos
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_auditorias_permisos+'/', sessionAuth, RegistroInteraccionesService.guardar);

/**
 * @swagger
 * /api/v1/auth/registros_interacciones/:
 *   get:
 *     summary: Obtiene todos los registros de interacción
 *     description: Retorna una lista completa de todos los registros de interacciones del sistema
 *     tags: [Registros de Interacción]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de interacción obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroInteraccion'
 *       401:
 *         description: No autorizado, sesión inválida o sin permisos
 *       500:
 *         description: Error interno del servidor
 */
router.get(ruta_registros_interacciones+'/', sessionAuth, RegistroInteraccionesService.obtener);

/**
 * @swagger
 * /api/v1/auth/registros_interacciones/:
 *   post:
 *     summary: Crea un nuevo registro de interacción
 *     description: Registra una nueva interacción en el sistema
 *     tags: [Registros de Interacción]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInteraccion'
 *     responses:
 *       201:
 *         description: Registro de interacción creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroInteraccion'
 *       400:
 *         description: Datos de entrada inválidos o incompletos
 *       401:
 *         description: No autorizado, sesión inválida o sin permisos
 *       500:
 *         description: Error interno del servidor
 */
router.post(ruta_registros_interacciones+'/', sessionAuth, RegistroInteraccionesService.guardar);

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroInteraccion:
 *       type: object
 *       properties:
 *         registro_interaccion_id:
 *           type: integer
 *           description: ID único del registro de interacción
 *           example: 1
 *           readOnly: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora exacta de la interacción (ISO 8601)
 *           example: "2023-05-16T14:30:45.000Z"
 *         tipo_evento:
 *           type: string
 *           description: Tipo de evento/interacción registrada
 *           example: "LOGIN"
 *           enum: ["LOGIN", "LOGOUT", "ACCESO_DENEGADO", "CONSULTA", "MODIFICACION"]
 *         datos_evento:
 *           type: string
 *           description: Datos adicionales en formato JSON sobre la interacción
 *           example: "{\"ip\":\"192.168.1.100\",\"navegador\":\"Chrome 112\"}"
 *         sesion_id:
 *           type: integer
 *           description: ID de la sesión asociada a la interacción
 *           example: 789
 *       required:
 *         - timestamp
 *         - tipo_evento
 *         - datos_evento
 *         - creado_por
 *         - sesion_id
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AuditoriaPermiso:
 *       type: object
 *       properties:
 *         auditoria_permiso_id:
 *           type: integer
 *           description: ID único del registro de auditoría de permiso
 *           example: 1
 *           readOnly: true
 *         auditoria_id:
 *           type: integer
 *           description: ID de la auditoría principal relacionada
 *           example: 15
 *           required: true
 *         nombre_permiso:
 *           type: string
 *           description: Nombre del permiso que fue auditado
 *           example: "documents.edit"
 *           required: true
 *       required:
 *         - auditoria_id
 *         - nombre_permiso
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioInput:
 *       type: object
 *       properties:
 *         nombre_social:
 *           type: string
 *           example: "Alex"
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           example: "alex@example.com"
 *         encripted_password:
 *           type: string
 *           example: "hashedPassword123"
 *           description: Contraseña encriptada (hash)
 *         rol_id:
 *           type: integer
 *           example: 2
 *           description: ID del rol del usuario
 *         telefono_contacto:
 *           type: string
 *           example: "+51987654321"
 *           maxLength: 20
 *         estado_usuario:
 *           type: string
 *           example: "ACTIVO"
 *           enum: [ACTIVO, INACTIVO, SUSPENDIDO, PENDIENTE]
 *         url_foto_perfil:
 *           type: string
 *           example: "https://example.com/profile.jpg"
 *           nullable: true
 *         persona_id:
 *           type: integer
 *           example: 1
 *           description: ID de la persona asociada
 *         idioma_id:
 *           type: integer
 *           example: 1
 *           description: ID del idioma preferido
 *       required:
 *         - nombre_social
 *         - email
 *         - encripted_password
 *         - rol_id
 *         - estado_usuario
 *         - persona_id
 *         - idioma_id
 * 
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           example: 1
 *           readOnly: true
 *         nombre_social:
 *           type: string
 *           example: "Alex"
 *         email:
 *           type: string
 *           example: "alex@example.com"
 *         rol_id:
 *           type: integer
 *           example: 2
 *         telefono_contacto:
 *           type: string
 *           example: "+51987654321"
 *         ultimo_inicio_sesion:
 *           type: string
 *           format: date-time
 *           example: "2023-05-15T10:00:00Z"
 *         estado_usuario:
 *           type: string
 *           example: "ACTIVO"
 *         intentos_inicio_sesion:
 *           type: integer
 *           example: 0
 *         url_foto_perfil:
 *           type: string
 *           example: "https://example.com/profile.jpg"
 *           nullable: true
 *         persona_id:
 *           type: integer
 *           example: 1
 *         idioma_id:
 *           type: integer
 *           example: 1
 *         auth_id:
 *           type: string
 *           example: "auth0|123456789"
 *           nullable: true
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           example: "2023-01-10T08:30:00Z"
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 *           example: "2023-05-12T15:45:00Z"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
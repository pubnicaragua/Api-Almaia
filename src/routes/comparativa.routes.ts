import express from "express";
import { sessionAuth } from "../middleware/supabaseMidleware";
import { DashboardComparativaService } from "../infrestructure/server/dashboard/DashboardComparativaService";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comparativo
 *     description: Endpoints para datos del panel de control
 */
/**
 * @swagger
 * /api/v1/comparativa/emotions/course:
 *   get:
 *     summary: Obtener datos comparativos de emociones por curso
 *     description: Retorna datos estadísticos de emociones filtrados por nivel, curso, año y mes
 *     tags: [Comparativo]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: nivel_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del nivel educativo a filtrar
 *         example: 1
 *       - in: query
 *         name: curso_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso específico a filtrar
 *         example: 5
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 2020
 *           maximum: 2030
 *         required: false
 *         description: Año de los datos a consultar (formato YYYY)
 *         example: 2023
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           maximum: 12
 *         required: false
 *         description: Mes de los datos a consultar (1-12)
 *         example: 10
 *     responses:
 *       200:
 *         description: Datos comparativos de emociones obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 curso:
 *                   type: string
 *                   example: "4° Básico A"
 *                 nivel:
 *                   type: string
 *                   example: "Básica"
 *                 periodo:
 *                   type: string
 *                   example: "Octubre 2023"
 *                 emociones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Tristeza"
 *                       value:
 *                         type: integer
 *                         example: 150
 *                       color:
 *                         type: string
 *                         example: "#29B6F6"
 *                       porcentaje:
 *                         type: number
 *                         format: float
 *                         example: 25.5
 *                   example:
 *                     - name: "Tristeza"
 *                       value: 150
 *                       color: "#29B6F6"
 *                       porcentaje: 25.5
 *                     - name: "Felicidad"
 *                       value: 200
 *                       color: "#FFCA28"
 *                       porcentaje: 34.0
 *                     - name: "Estrés"
 *                       value: 80
 *                       color: "#757575"
 *                       porcentaje: 13.6
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             example:
 *               error: "Faltan parámetros requeridos (nivel_id, curso_id, año, mes)"
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       404:
 *         description: No se encontraron datos para los parámetros proporcionados
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al procesar la solicitud"
 */
router.get('/emotions/course', sessionAuth, DashboardComparativaService.getEmotionsDataCourse);

/**
 * @swagger
 * /api/v1/comparativa/alerts/totales:
 *   get:
 *     summary: Obtener datos comparativos de alertas para gráfico de líneas
 *     description: Retorna datos estadísticos de alertas comparando diferentes cursos por mes
 *     tags: [Comparativo]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos comparativos de alertas obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlertData'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/alerts/totales', sessionAuth, DashboardComparativaService.obtenerGestorAlertasHoy);
/**
 * @swagger
 * /api/v1/comparativa/alerts/historial:
 *   get:
 *     tags:
 *       - Dashboard Comparativa
 *     summary: Obtiene el historial de alertas para un colegio específico
 *     description: Retorna el historial de alertas filtrado por el ID del colegio
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: colegio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del colegio para filtrar el historial de alertas
 *     responses:
 *       200:
 *         description: Historial de alertas obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       alerta_id:
 *                         type: integer
 *                         example: 5
 *                       colegio_id:
 *                         type: integer
 *                         example: 10
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-15T14:30:00Z"
 *                       estado:
 *                         type: string
 *                         example: "resuelta"
 *                       detalles:
 *                         type: string
 *                         example: "Se detectó un problema en el área de matemáticas"
 *       400:
 *         description: Parámetro colegio_id faltante o inválido
 *       401:
 *         description: No autorizado (sesión no válida)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/alerts/historial', sessionAuth, DashboardComparativaService.obtenerGestorHistorial);

/**
 * @swagger
 * components:
 *   schemas:
 *     Emotion:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la emoción
 *           example: "Tristeza"
 *         value:
 *           type: integer
 *           description: Cantidad de registros de esta emoción
 *           example: 1500
 *         color:
 *           type: string
 *           description: Código hexadecimal del color asociado
 *           example: "#3b82f6"
 *
 *     DonutData:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           description: Etiqueta descriptiva del segmento
 *           example: "10 Pendientes"
 *         value:
 *           type: integer
 *           description: Valor numérico del segmento
 *           example: 10
 *         percentage:
 *           type: string
 *           description: Porcentaje representado como cadena
 *           example: "22.8%"
 *         color:
 *           type: string
 *           description: Código hexadecimal del color del segmento
 *           example: "#facc15"
 *
 *     ImportantDate:
 *       type: object
 *       properties:
 *         event:
 *           type: string
 *           description: Nombre del evento importante
 *           example: "Pruebas Parciales"
 *         dateRange:
 *           type: string
 *           description: Rango de fechas del evento
 *           example: "Abr 02 - Abr 07"
 *
 *     RecentAlert:
 *       type: object
 *       properties:
 *         student:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre del estudiante
 *               example: "Carolina Espina"
 *             image:
 *               type: string
 *               description: Ruta de la imagen del estudiante
 *               example: "/smiling-woman-garden.png"
 *         alertType:
 *           type: string
 *           description: Tipo de alerta
 *           example: "SOS Alma"
 *         date:
 *           type: string
 *           description: Fecha de la alerta
 *           example: "Abr 02 - 2024"
 *
 *     AlertData:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           description: Nombre del mes (abreviado)
 *           example: "Ene"
 *         courseA:
 *           type: integer
 *           description: Cantidad de alertas para el curso A
 *           example: 1200
 *         courseB:
 *           type: integer
 *           description: Cantidad de alertas para el curso B
 *           example: 1500
 *
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Token de autenticación obtenido al iniciar sesión
 */
export default router;
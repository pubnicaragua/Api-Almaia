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
 *     description: Retorna datos estadísticos de emociones comparando diferentes cursos
 *     tags: [Comparativo]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos comparativos de emociones obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emotion'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/emotions/course', sessionAuth, DashboardComparativaService.getEmotionsDataCourse);

/**
 * @swagger
 * /api/v1/home/comparativa/alerts/totales:
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
router.get('/alerts/totales', sessionAuth, DashboardComparativaService.getAlertsLineChartData);

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
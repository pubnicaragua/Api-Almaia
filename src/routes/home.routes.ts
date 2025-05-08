import express from "express";
import { sessionAuth } from "../middleware/supabaseMidleware";
import { DashboardHomeService } from "../infrestructure/server/dashboard/DashboardHomeService";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Home
 *     description: Endpoints para datos del panel de control
 */
/**
 * @swagger
 * /api/v1/home/cards/emociones:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     description: Retorna datos estadísticos sobre alumnos, alertas SOS, denuncias y alertas Alma
 *     tags: [Home]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alumnos:
 *                   type: object
 *                   properties:
 *                     activos:
 *                       type: integer
 *                       example: 637
 *                     inactivos:
 *                       type: integer
 *                       example: 10
 *                     frecuentes:
 *                       type: integer
 *                       example: 510
 *                     totales:
 *                       type: integer
 *                       example: 733
 *                 sos_alma:
 *                   type: object
 *                   properties:
 *                     activos:
 *                       type: integer
 *                       example: 5
 *                     vencidos:
 *                       type: integer
 *                       example: 0
 *                     por_vencer:
 *                       type: integer
 *                       example: 2
 *                     totales:
 *                       type: integer
 *                       example: 13
 *                 denuncias:
 *                   type: object
 *                   properties:
 *                     activos:
 *                       type: integer
 *                       example: 19
 *                     vencidos:
 *                       type: integer
 *                       example: 0
 *                     por_vencer:
 *                       type: integer
 *                       example: 3
 *                     totales:
 *                       type: integer
 *                       example: 24
 *                 alertas_alma:
 *                   type: object
 *                   properties:
 *                     activos:
 *                       type: integer
 *                       example: 57
 *                     vencidos:
 *                       type: integer
 *                       example: 0
 *                     por_vencer:
 *                       type: integer
 *                       example: 6
 *                     totales:
 *                       type: integer
 *                       example: 82
 *             example:
 *               alumnos:
 *                 activos: 637
 *                 inactivos: 10
 *                 frecuentes: 510
 *                 totales: 733
 *               sos_alma:
 *                 activos: 5
 *                 vencidos: 0
 *                 por_vencer: 2
 *                 totales: 13
 *               denuncias:
 *                 activos: 19
 *                 vencidos: 0
 *                 por_vencer: 3
 *                 totales: 24
 *               alertas_alma:
 *                 activos: 57
 *                 vencidos: 0
 *                 por_vencer: 6
 *                 totales: 82
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al recuperar estadísticas del home"
 */
router.get("cards/emociones", sessionAuth, DashboardHomeService.getEmotionData);
/**
 * @swagger
 * /barra/emociones:
 *   get:
 *     summary: Obtener datos estadísticos de emociones
 *     description: Retorna un listado de emociones registradas con sus valores cuantitativos y colores asociados
 *     tags: [Home]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos de emociones obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nombre de la emoción
 *                     example: "Tristeza"
 *                   value:
 *                     type: integer
 *                     description: Cantidad de registros para esta emoción
 *                     example: 1500
 *                   color:
 *                     type: string
 *                     description: Código hexadecimal del color asociado a la emoción
 *                     example: "#29B6F6"
 *             example:
 *               - name: "Tristeza"
 *                 value: 1500
 *                 color: "#29B6F6"
 *               - name: "Felicidad"
 *                 value: 3100
 *                 color: "#FFCA28"
 *               - name: "Estrés"
 *                 value: 950
 *                 color: "#757575"
 *               - name: "Ansiedad"
 *                 value: 2600
 *                 color: "#FFA726"
 *               - name: "Enojo"
 *                 value: 750
 *                 color: "#F44336"
 *               - name: "Otros"
 *                 value: 1900
 *                 color: "#BA68C8"
 *       401:
 *         description: No autorizado - Sesión no válida o no proporcionada
 *         content:
 *           application/json:
 *             example:
 *               error: "Token de autenticación inválido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al recuperar los datos de emociones"
 */
router.get("barra/emociones", sessionAuth, DashboardHomeService.getEmotionsData);
/**
 * @swagger
 * /api/v1/home/emotions/general:
 *   get:
 *     summary: Obtener datos generales de emociones
 *     description: Retorna datos estadísticos generales sobre las emociones registradas
 *     tags: [Home]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos generales de emociones obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emotion'
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/emotions/general",
  sessionAuth,
  DashboardHomeService.getEmotionDataGeneral
);
/**
 * @swagger
 * /api/v1/home/alertas/totales:
 *   get:
 *     summary: Obtener datos para gráfico de donut
 *     description: Retorna datos para visualización en gráfico circular (donut chart)
 *     tags: [Home]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos para gráfico donut obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DonutData'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/alertas/totales", sessionAuth, DashboardHomeService.getDonutData);
/**
 * @swagger
 * /api/v1/home/fechas/importantes:
 *   get:
 *     summary: Obtener fechas importantes
 *     description: Retorna un listado de fechas relevantes para el home
 *     tags: [Home]
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
 *                 $ref: '#/components/schemas/ImportantDate'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/fechas/importantes", sessionAuth, DashboardHomeService.getImportantDates);
/**
 * @swagger
 * /api/v1/home/alertas/recientes:
 *   get:
 *     summary: Obtener alertas recientes
 *     description: Retorna las alertas más recientes registradas en el sistema
 *     tags: [Home]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de alertas recientes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecentAlert'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/alertas/recientes", sessionAuth, DashboardHomeService.getRecentAlerts);
export default router;
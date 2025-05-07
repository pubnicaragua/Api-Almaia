import cron from "node-cron";
import { PreguntaService } from "../server/preguntas/PreguntaService";

// Ejecutar todos los días a las 00:00
cron.schedule("0 0 * * *", () => {
  PreguntaService.motor_pregunta(); // Tu lógica aquí (ej: limpieza, backups, etc.)
});

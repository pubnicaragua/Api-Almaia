import cron from "node-cron";
import { PreguntaService } from "../server/PreguntaService";

// Ejecutar todos los días a las 00:00
cron.schedule("* * * * *", () => {
  PreguntaService.motor_pregunta(); // Tu lógica aquí (ej: limpieza, backups, etc.)
});

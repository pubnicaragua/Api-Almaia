import cron from "node-cron";
import { PreguntaService } from "../server/preguntas/PreguntaService";
import { MotorAlertasService } from "../server/alertas/MotorAlertaService";
import { DateTime } from "luxon";
// import { MotorPreguntasService } from "../server/alertas/MotorPreguntaService";

// Ejecutar todos los días a las 00:00
cron.schedule("0 0 * * *", () => {
  // PreguntaService.motor_pregunta(); // Tu lógica aquí (ej: limpieza, backups, etc.)
});
cron.schedule("* * * * *", () => {
  const now = DateTime.now().setZone("America/Guayaquil");
  if (now.hour === 22 && now.minute === 0) {
    MotorAlertasService.ejecutar_motor();
  }
});
cron.schedule("*/15 0-5 * * *", () => {
  // const now = DateTime.now().setZone("America/Guayaquil");

  PreguntaService.motor_pregunta();
  // MotorPreguntasService.ejecutar_motor(1);
  // MotorPreguntasService.ejecutar_motor(2);

  // Opcional: imprime la hora para depurar
  // console.log("Ejecutado a:", now.toISO());
});

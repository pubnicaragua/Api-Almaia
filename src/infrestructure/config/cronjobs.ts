import cron from "node-cron";
import { PreguntaService } from "../server/preguntas/PreguntaService";
import { MotorAlertasService } from "../server/alertas/MotorAlertaService";
// import { DateTime } from "luxon";
import { MotorInformeService } from "../server/informes/MotorInformeService";
// import { MotorPreguntasService } from "../server/alertas/MotorPreguntaService";

// Ejecutar todos los días a las 00:00
cron.schedule("0 0 * * *", () => {
  // PreguntaService.motor_pregunta(); // Tu lógica aquí (ej: limpieza, backups, etc.)
});
cron.schedule("0 2 * * 1-6", () => {
  // const now = DateTime.now().setZone("America/Guayaquil");
  // if (now.hour === 22 && now.minute === 0) {
  // }
  console.log('Ejecutando tarea programada a las 2 AM...');
  MotorAlertasService.ejecutar_motor();
});

cron.schedule("0 4 * * 1-6", () => {
  console.log('Ejecutando tarea programada de las 4:00 AM...');
  PreguntaService.motor_pregunta();
});

cron.schedule("30 12 * * 1-6", () => {
  console.log('Ejecutando tarea programada de las 12:30 PM...');
  PreguntaService.motor_pregunta();
});

// Programar la tarea
// El string '0 0 5 * *' significa:
// * En el minuto 0 (primer 0)
// * En la hora 0 (segundo 0)
// * En el día 5 del mes (tercer 5)
// * En cualquier mes del año (*)
// * En cualquier día de la semana (*)
cron.schedule('0 0 5 * *', async () => {
    console.log('--- Iniciando la ejecución programada generacion de informes---');
    console.log(`Fecha de ejecución: ${new Date().toLocaleString()}`);

    // Llama a la función para ejecutar el motor de informes
    await MotorInformeService.ejecutarMotor();
    
    // Llama a la función principal para procesar y guardar la plantilla
    await MotorInformeService.generarInformeAlumnos();
    // LLama a la función principal para procesar y guardar la plantilla
    await MotorInformeService.generarInformeGenerales();
    await MotorInformeService.generarInformeGenerales(3);
    await MotorInformeService.generarInformeGenerales(4);
    
    console.log('--- Ejecución programada finalizada ---');
});
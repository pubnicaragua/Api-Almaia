import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './infrestructure/config/cronjobs';

dotenv.config();
//import PreguntasRoutes from './routes/preguntas.routes';
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(helmet());

// Configuración de CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir solicitudes sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);
    
    // Lista de dominios permitidos (ajusta según tus necesidades)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // añade otros dominios permitidos aquí
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  optionsSuccessStatus: 200 // Para navegadores legacy
};

// Aplicar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware adicional para verificación de IP/headers
app.use((req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.connection.remoteAddress || '';
  const customHeader = req.headers['x-almaia-access'];
  
  // Lista blanca de IPs permitidas
  const allowedIps = ['::1', '127.0.0.1'];
  
  // Si es una IP permitida o tiene el header correcto, continuar
  if (allowedIps.includes(clientIp) || customHeader === 'mi-token-secreto') {
    return next();
  }
  
  // Si no cumple los requisitos, denegar acceso
  res.status(403).json({ message: 'Acceso denegado' });
});

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola mundo con CORS y seguridad mejorada!');
});
//app.use('api/v1/preguntas', PreguntasRoutes);
// Manejador de errores
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
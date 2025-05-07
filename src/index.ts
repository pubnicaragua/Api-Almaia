import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './infrestructure/config/cronjobs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();
import AuthRoutes from './routes/auth.routes';
import AvisosRoutes from './routes/aviso.routes';
import LocalidadesRoutes from './routes/localidades.routes';
import DashboardRoutes from './routes/dashboard.routes';
import PatologiaRoutes from './routes/patologia.routes';
import AlumnosRouters from './routes/alumno.routes';
import AlertaRouters from './routes/alerta.routes';
const app: Application = express();
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Alma IA API",
      version: "1.0",
      description:
        "Esta es una APIpara gestionar la información de Alma IA.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Soporte AlmaIA",
        url: "https://almaia.cl",
        email: "soporte@almaia.cl",
      },
    },
    servers: [
      {
        url: "https://api-almaia.onrender.com/",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

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
const specs = swaggerJsdoc(options);
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(specs));
app.use('api/v1/auth', AuthRoutes);
app.use('api/v1/avisos', AvisosRoutes);
app.use('api/v1/localidades', LocalidadesRoutes);
app.use('api/v1/dashboard', DashboardRoutes);
app.use('api/v1/patologias', PatologiaRoutes);
app.use('api/v1/alumnos', AlumnosRouters);
app.use('api/v1/alumnos', AlertaRouters);
// Manejador de errores
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
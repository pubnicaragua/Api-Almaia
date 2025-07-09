import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './infrestructure/config/cronjobs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();
import AuthRoutes from './routes/auth.routes';
import AvisosRoutes from './routes/aviso.routes';
import LocalidadesRoutes from './routes/localidades.routes';
import ComparativaRoutes from './routes/comparativa.routes';
import PatologiaRoutes from './routes/patologia.routes';
import AlumnosRouters from './routes/alumno.routes';
import AlertaRouters from './routes/alerta.routes';
import ApoderadosRouters from './routes/apoderado.routes';
import HomeRouters from './routes/home.routes';
import PerfilRouters from './routes/perfil.routes';
import InformesRouters from './routes/informes.routes';
import PreguntasRouters from './routes/preguntas.routes';
import DocentesRouters from './routes/docente.routes';
import ColegioRouters from './routes/colegio.routes';
import PersonaRouters from './routes/persona.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Alma IA API",
      version: "1.0",
      description:
        "Esta es una APIpara gestionar la información de Alma IA. Cada get del CRUD posee parametros es decir api/v1/ruta?campo={valor}",
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
function cleanIp(ip: string): string {
  // Si es del tipo ::ffff:127.0.0.1, extrae la parte IPv4
  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }
  return ip;
}

// Habilitar la confianza en los proxies
app.set('trust proxy', true);
// Middleware básico
app.use(express.json({ limit: '30mb' }));
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
// Configuración de CORS
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  console.log(`Origen: ${origin}`);
   
    // Permitir solicitudes sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);
    
    // Lista de dominios permitidos (ajusta según tus necesidades)
    const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];
   
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  optionsSuccessStatus: 200, // Para navegadores legacy
  allowedHeaders: ['*']
};

// Aplicar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware adicional para verificación de IP/headers
app.use((req: Request, res: Response, next: NextFunction) => {
  const rawIp = req.ip || req.connection.remoteAddress || '';
  const clientIp = cleanIp(rawIp);
  const customHeader = req.headers['x-almaia-access'];
  
  // Lista blanca de IPs permitidas
  const allowedIps = ['::1', '127.0.0.1'];
 const allowAllIpDesarrollo = true;
  console.log(`IP: ${clientIp}`);

  // Si es una IP permitida o tiene el header correcto, continuar
  if (allowAllIpDesarrollo|| allowedIps.includes(clientIp) || customHeader === 'x-almaia-access') {
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
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/avisos', AvisosRoutes);
app.use('/api/v1/localidades', LocalidadesRoutes);
app.use('/api/v1/comparativa', ComparativaRoutes);
app.use('/api/v1/home', HomeRouters);
app.use('/api/v1/patologias', PatologiaRoutes);
app.use('/api/v1/alumnos', AlumnosRouters);
app.use('/api/v1/alertas', AlertaRouters);
app.use('/api/v1/apoderados', ApoderadosRouters);
app.use('/api/v1/perfil', PerfilRouters);
app.use('/api/v1/informes', InformesRouters);
app.use('/api/v1/preguntas', PreguntasRouters);
app.use('/api/v1/docentes', DocentesRouters);
app.use('/api/v1/colegios', ColegioRouters);
app.use('/api/v1/personas', PersonaRouters);
// Manejador de errores
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
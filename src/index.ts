import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; // ✅ Rate limiting
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
import ContactoRouter from './routes/contacto.route';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Alma IA API",
      version: "1.0",
      description:
        "Esta es una API para gestionar la información de Alma IA. Cada get del CRUD posee parametros es decir api/v1/ruta?campo={valor}",
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

// function cleanIp(ip: string): string {
//   if (ip.startsWith('::ffff:')) {
//     return ip.replace('::ffff:', '');
//   }
//   return ip;
// }

// ✅ 1.3 Implementar Rate Limiting
// Límite general para toda la API
const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutos
  max: 100, // máximo 100 solicitudes por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes, inténtelo más tarde.' }
});
app.use(apiLimiter);

// Límite más estricto para login y registro
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de autenticación, inténtelo más tarde.' }
});

// Rate limiting granular para endpoints críticos
const alertCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 alertas por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas alertas creadas, inténtelo más tarde.' }
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 intentos por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de cambio de contraseña, inténtelo más tarde.' }
});

const bulkUserCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 cargas masivas por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas cargas masivas de usuarios, inténtelo más tarde.' }
});

const colegioModificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // máximo 20 modificaciones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas modificaciones de colegios, inténtelo más tarde.' }
});

// Habilitar la confianza en los proxies
app.set('trust proxy', 1);
app.use(express.json({ limit: '30mb' }));
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// ✅ 1.4 Configuración CORS segura
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : []; // Sin wildcard "*"

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin) return callback(null, true); // Permitir sin origen (ej. Postman, móvil)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  optionsSuccessStatus: 200,
  allowedHeaders: ['date-zone', 'Date-Zone', 'Content-Type', 'Authorization', 'x-almaia-access'],
};
app.use(cors(corsOptions));

// ✅ 1.5 Eliminar bypass de IP;

// app.use((req: Request, res: Response, next: NextFunction) => {
//   const rawIp = req.ip || req.connection.remoteAddress || '';
//   const clientIp = cleanIp(rawIp);
//   console.log(`Solicitud desde IP: ${clientIp}`); // Log de IP para depuración
//   const customHeader = req.headers['x-almaia-access'];

//   // Lista blanca de IPs
//   const allowedIps = ['::1', '127.0.0.1'];

//   if (allowedIps.includes(clientIp) || customHeader === 'x-almaia-access') {
//     return next();
//   }
//   res.status(403).json({ message: 'Acceso denegado' });
// });

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola mundo con CORS, seguridad y rate limiting!');
});

const specs = swaggerJsdoc(options);
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1/auth', AuthRoutes); // 🔒 Rate limit especial en Auth
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
app.use('/api/v1/contacto', ContactoRouter);

// Manejador de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

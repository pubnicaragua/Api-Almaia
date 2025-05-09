import 'express';

// types/express.d.ts
declare module 'express-serve-static-core' {
  interface Request {
    creado_por: number; // o number, según tu caso
    actualizado_por:number
    fecha_creacion:string
  }
}
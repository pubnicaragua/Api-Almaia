/* eslint-disable @typescript-eslint/no-explicit-any */
export type SelectFields = string | string[];

export interface GenericFilterOptions {
  tableFilter: string;       // Tabla para filtrar (ej: "apoderados")
  filterField: string;       // Campo para filtrar con `.eq` (ej: "colegio_id")
  filterValue: any;          // Valor para filtrar (ej: colegio_id)
  idField: string;           // Campo para extraer los IDs (ej: "apoderado_id")
  tableIn: string;           // Tabla para filtrar con `.in` (ej: "alumnos_apoderados")
  inField: string;           // Campo para filtrar con `.in` (ej: "apoderado_id")
  selectFields: SelectFields; // Campos para `.select()` en la consulta `.in`
}
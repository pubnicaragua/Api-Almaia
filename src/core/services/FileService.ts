/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "./supabaseClient";
import { ColegioExcel } from "../modelo/import/ColegioExcel";
import { Colegio } from "../modelo/colegio/Colegio";
import { CalendarioEscolarExcel } from "../modelo/import/CalendarioEscolarExcel";
import { CalendarioEscolar } from "../modelo/colegio/CalendarioEscolar";
import { DiaFestivoExcel } from "../modelo/import/DiaFestivoExcel";
import { CalendarioDiaFestivo } from "../modelo/colegio/CalendarioDiaFestivo";
import { FechaImportanteExcel } from "../modelo/import/FechaImportanteExcel";
import { CalendarioFechaImportante } from "../modelo/colegio/CalendarioFechaImportante";
import { NivelEducativoExcel } from "../modelo/import/NivelEducativoExcel";
import { NivelEducativo } from "../modelo/colegio/NivelEducativo";
import { GradoExcel } from "../modelo/import/GradoExcel";
import { Grado } from "../modelo/colegio/Grado";
import { MateriaExcel } from "../modelo/import/MateriaExcel";
import { Materia } from "../modelo/colegio/Materia";
import { CursoExcel } from "../modelo/import/CursoExcel";
import { Curso } from "../modelo/colegio/Curso";

export class Fileservice {
  private client: SupabaseClient;
  private comunasCache: any[] | null = null;
  private regionesCache: any[] | null = null;
  private paisesCache: any[] | null = null;
  private cursosCache: any[] | null = null;
  private gradosCache: any[] | null = null;
  private nivelesCache: any[] | null = null;
  private colegio_id: number = 0;
  private calendario_escolar_id: number = 0;

  constructor() {
    const supabaseService = new SupabaseClientService();
    this.client = supabaseService.getClient();
    this.initializeComunasCache();
    this.initializeRegionCache();
    this.initializePaisCache();
    this.initializeCursoCache();
    this.initializeGradoCache();
    this.initializeNivelCache();
  }

  private async initializeComunasCache() {
    if (!this.comunasCache) {
      const { data: comunas, error } = await this.client
        .from("comunas")
        .select("*");
      if (error) throw new Error(`Error obteniendo comunas: ${error.message}`);
      this.comunasCache = comunas;
    }
  }
  private async initializeRegionCache() {
    if (!this.regionesCache) {
      const { data: regiones, error } = await this.client
        .from("regiones")
        .select("*");
      if (error) throw new Error(`Error obteniendo regiones: ${error.message}`);
      this.regionesCache = regiones;
    }
  }
  private async initializePaisCache() {
    if (!this.paisesCache) {
      const { data: paises, error } = await this.client
        .from("paises")
        .select("*");
      if (error) throw new Error(`Error obteniendo paises: ${error.message}`);
      this.paisesCache = paises;
    }
  }
  private async initializeCursoCache() {
    if (!this.cursosCache) {
      const { data: cursos, error } = await this.client
        .from("cursos")
        .select("*");
      if (error) throw new Error(`Error obteniendo cursos: ${error.message}`);
      this.cursosCache = cursos;
    }
  }
  private async initializeGradoCache() {
    if (!this.gradosCache) {
      const { data: grados, error } = await this.client
        .from("grados")
        .select("*");
      if (error) throw new Error(`Error obteniendo grados: ${error.message}`);
      this.gradosCache = grados;
    }
  }
  private async initializeNivelCache() {
    if (!this.gradosCache) {
      const { data: niveles, error } = await this.client
        .from("niveles")
        .select("*");
      if (error) throw new Error(`Error obteniendo niveles: ${error.message}`);
      this.nivelesCache = niveles;
    }
  }
  public async obtenerIdRegionPorNombre(
    nombreRegion: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.regionesCache) {
        const regionEncontrada = this.regionesCache.find((region) =>
          region.nombre.toLowerCase().includes(nombreRegion.toLowerCase())
        );
        if (regionEncontrada) return regionEncontrada.comuna_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("regiones")
        .select("region_id")
        .ilike("nombre", `%${nombreRegion}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].region_id;
    } catch (error) {
      console.error("Error al buscar region por nombre:", error);
      return null;
    }
  }
  public async obtenerIdComunaPorNombre(
    nombreComuna: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.comunasCache) {
        const comunaEncontrada = this.comunasCache.find((comuna) =>
          comuna.nombre.toLowerCase().includes(nombreComuna.toLowerCase())
        );
        if (comunaEncontrada) return comunaEncontrada.comuna_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("comunas")
        .select("comuna_id")
        .ilike("nombre", `%${nombreComuna}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].comuna_id;
    } catch (error) {
      console.error("Error al buscar comuna por nombre:", error);
      return null;
    }
  }
  public async obtenerIdPaisPorNombre(
    nombrepais: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.paisesCache) {
        const paisEncontrada = this.paisesCache.find((pais) =>
          pais.nombre.toLowerCase().includes(nombrepais.toLowerCase())
        );
        if (paisEncontrada) return paisEncontrada.pais_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("paises")
        .select("pais_id")
        .ilike("nombre", `%${nombrepais}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].pais_id;
    } catch (error) {
      console.error("Error al buscar pais por nombre:", error);
      return 0;
    }
  }
  public async obtenerIdCursoPorNombre(
    nombrecurso: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.cursosCache) {
        const cursoEncontrada = this.cursosCache.find((curso) =>
          curso.nombre.toLowerCase().includes(nombrecurso.toLowerCase())
        );
        if (cursoEncontrada) return cursoEncontrada.curso_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("cursos")
        .select("curso_id")
        .ilike("nombre", `%${nombrecurso}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].curso_id;
    } catch (error) {
      console.error("Error al buscar curso por nombre:", error);
      return 0;
    }
  }
  public async obtenerIdNivelEducativoPorNombre(
    nombrenivel_educativo: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.nivelesCache) {
        const nivel_educativoEncontrada = this.nivelesCache.find(
          (nivel_educativo) =>
            nivel_educativo.nombre
              .toLowerCase()
              .includes(nombrenivel_educativo.toLowerCase())
        );
        if (nivel_educativoEncontrada)
          return nivel_educativoEncontrada.nivel_educativo_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("niveles_educativos")
        .select("nivel_educativo_id")
        .ilike("nombre", `%${nombrenivel_educativo}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].nivel_educativo_id;
    } catch (error) {
      console.error("Error al buscar nivel_educativo por nombre:", error);
      return 0;
    }
  }
  public async obtenerIdGradoPorNombre(
    nombregrado: string
  ): Promise<number | null> {
    try {
      // Primero intenta buscar en la caché
      if (this.gradosCache) {
        const gradoEncontrada = this.gradosCache.find((grado) =>
          grado.nombre.toLowerCase().includes(nombregrado.toLowerCase())
        );
        if (gradoEncontrada) return gradoEncontrada.grado_id;
      }

      // Si no está en caché, busca directamente en Supabase
      const { data, error } = await this.client
        .from("grados")
        .select("grado_id")
        .ilike("nombre", `%${nombregrado}%`) // Búsqueda insensible a mayúsculas
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0].grado_id;
    } catch (error) {
      console.error("Error al buscar grado por nombre:", error);
      return 0;
    }
  }

  async procesarColegio({ data }: { data: ColegioExcel[] }) {
    try {
      // Mapeamos async para obtener los IDs necesarios
      const datosMapeadosPromises = data.map(async (item) => {
        // Resolvemos todas las promesas en paralelo
        const [comuna_id, region_id, pais_id] = await Promise.all([
          this.obtenerIdComunaPorNombre(item.COMUNA_ID),
          this.obtenerIdRegionPorNombre(item.COMUNA_ID),
          this.obtenerIdPaisPorNombre(item.PAIS_ID),
        ]);

        return {
          nombre: item.NOMBRE?.trim() || "",
          nombre_fantasia: item.NOMBRE_FANTASIA?.trim() || "",
          tipo_colegio: item.TIPO_COLEGIO?.trim() || "",
          dependencia: item.DEPENDENCIA?.trim() || "",
          sitio_web: item.SITIO_WEB?.trim() || " ",
          direccion: item.DIRECCION?.trim() || "",
          telefono_contacto: item.TELEFONO_CONTACTO?.trim() || " ",
          correo_electronico: item.CORREO_ELECTRONICO?.trim() || " ",
          comuna_id: comuna_id || 0, // Valor por defecto si no se encuentra
          region_id: region_id || 0,
          pais_id: pais_id || 0,
          creado_por: 0,
          actualizado_por: 0,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
        } as Colegio;
      });

      // Esperamos a que todas las promesas se resuelvan
      const datosMapeados = await Promise.all(datosMapeadosPromises);

      // Validamos que al menos algunos IDs sean válidos
      const datosValidos = datosMapeados.filter(
        (item) => item.comuna_id > 0 && item.region_id > 0 && item.pais_id > 0
      );

      if (datosValidos.length === 0) {
        throw new Error(
          "No se encontraron IDs válidos para comuna, región o país"
        );
      }

      const { data: inserted, error } = await this.client
        .from("colegios")
        .insert(datosValidos)
        .select("colegio_id")
        .single(); // Retornamos todos los campos insertados
      this.colegio_id = inserted?.colegio_id;
      if (error) throw error;
    } catch (error) {
      console.error("Error en procesarColegio:", error);
      return null;
    }
  }

  async procesarAnioAcademico({
    data,
  }: {
    data: CalendarioEscolarExcel[];
  }): Promise<CalendarioEscolar | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de años académicos");
      }
      if (!this.colegio_id || this.colegio_id <= 0) {
        throw new Error("ID de colegio inválido");
      }

      // Mapeamos los datos
      const datosMapeados = data.map((item) => {
        // Convertimos fechas numéricas de Excel a fechas JavaScript
        const fechaInicio = this.excelDateToJSDate(item.FECHA_INGRESO);
        const fechaFin = this.excelDateToJSDate(item.FECHA_EGRESO);

        // Validamos fechas
        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
          throw new Error(
            `Fechas inválidas para año escolar ${item.ANO_ESCOLAR}`
          );
        }

        // Validamos que la fecha de fin sea posterior a la de inicio
        if (fechaFin <= fechaInicio) {
          throw new Error(
            `La fecha de egreso debe ser posterior a la de ingreso para el año ${item.ANO_ESCOLAR}`
          );
        }

        // Calculamos días hábiles (opcional)
        const diasHabiles = this.calcularDiasHabiles(fechaInicio, fechaFin);

        return {
          colegio_id: this.colegio_id,
          ano_escolar: Number(item.ANO_ESCOLAR) || new Date().getFullYear(),
          fecha_inicio: fechaInicio.toISOString(),
          fecha_fin: fechaFin.toISOString(),
          dias_habiles: diasHabiles,
          creado_por: 0,
          actualizado_por: 0,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
        } as CalendarioEscolar;
      });

      // Insertamos en la base de datos
      const { data: inserted, error } = await this.client
        .from("calendario_escolar")
        .insert(datosMapeados)
        .select("*,calendario_escolar_id")
        .single();

      if (error) throw error;
      this.calendario_escolar_id = inserted?.inserted;
      return inserted;
    } catch (error) {
      console.error(
        "Error en procesarAnioAcademico:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  async procesarDiasFestivos({
    data,
  }: {
    data: DiaFestivoExcel[];
  }): Promise<CalendarioDiaFestivo[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de días festivos");
      }

      // Mapeamos los datos
      const datosMapeados = data.map((item) => {
        // Convertimos fecha numérica de Excel a Date
        const fechaFestivo = this.excelDateToJSDate(item.FECHA);

        // Validamos fecha
        if (isNaN(fechaFestivo.getTime())) {
          throw new Error(`Fecha inválida para día festivo: ${item.FECHA}`);
        }

        return {
          dia_festivo: fechaFestivo.toISOString(),
          descripcion: item.DESCRIPCION?.trim() || "Día festivo",
          creado_por: 0,
          actualizado_por: 0,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
          calendario_escolar_id: this.calendario_escolar_id,
        } as CalendarioDiaFestivo;
      });

      // Insertamos en la base de datos (todos los días festivos en una sola operación)
      const { data: inserted, error } = await this.client
        .from("calendario_dia_festivo")
        .insert(datosMapeados)
        .select("*");

      if (error) throw error;
      return inserted;
    } catch (error) {
      console.error(
        "Error en procesarDiasFestivos:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  async procesarFechasImportantes({
    data,
  }: {
    data: FechaImportanteExcel[];
  }): Promise<CalendarioFechaImportante[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de fechas importantes");
      }
      if (!this.colegio_id || this.colegio_id <= 0) {
        throw new Error("ID de colegio inválido");
      }
      if (!this.calendario_escolar_id || this.calendario_escolar_id <= 0) {
        throw new Error("ID de calendario escolar inválido");
      }

      // Mapeamos los datos
      const datosMapeados = data.map(async (item) => {
        // Convertimos fecha numérica de Excel a Date
        const fechaImportante = this.excelDateToJSDate(item.FECHA);

        // Validamos fecha
        if (isNaN(fechaImportante.getTime())) {
          throw new Error(`Fecha inválida para evento: ${item.FECHA}`);
        }
        const [curso_id] = await Promise.all([
          this.obtenerIdCursoPorNombre(item.CURSO_ID),
        ]);
        return {
          colegio_id: this.colegio_id,
          curso_id: curso_id,
          calendario_escolar_id: this.calendario_escolar_id,
          titulo: item.TITULO?.trim() || "Evento importante",
          descripcion: item.DESCRIPCION?.trim() || "",
          fecha: fechaImportante.toISOString(),
          tipo: item.TIPO,
          creado_por: 0,
          actualizado_por: 0,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
        } as CalendarioFechaImportante;
      });

      // Insertamos en la base de datos (todas las fechas en una sola operación)
      const { data: inserted, error } = await this.client
        .from("calendario_fecha_importante")
        .insert(datosMapeados)
        .select("*");

      if (error) throw error;
      return inserted;
    } catch (error) {
      console.error(
        "Error en procesarFechasImportantes:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  async procesarNivelesEducativos({
    data,
  }: {
    data: NivelEducativoExcel[];
  }): Promise<NivelEducativo[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de niveles educativos");
      }

      // Mapeamos los datos
      const datosMapeados = data.map((item) => ({
        nivel_educativo_id: item.NIVEL_EDUCATIVO_ID || undefined, // Si es 0, Supabase generará automáticamente el ID
        nombre: item.NOMBRE?.trim() || "Nivel sin nombre",
        creado_por: 0,
        actualizado_por: 0,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        activo: true,
      }));

      // Upsert (insertar o actualizar si ya existe)
      const { data: niveles, error } = await this.client
        .from("niveles_educativos")
        .upsert(datosMapeados, {
          onConflict: "nivel_educativo_id", // Actualiza si el ID ya existe
          ignoreDuplicates: false,
        })
        .select("*");

      if (error) throw error;
      return niveles;
    } catch (error) {
      console.error(
        "Error en procesarNivelesEducativos:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
  async procesarGrados({
    data,
  }: {
    data: GradoExcel[];
  }): Promise<Grado[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de grados");
      }

      // Mapeamos los datos
      const datosMapeados = data.map((item) => ({
        nombre: item.NOMBRE?.trim() || "Grado sin nombre",
        creado_por: 0,
        actualizado_por: 0,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        activo: true,
      }));

      // Upsert (insertar o actualizar si ya existe)
      const { data: grados, error } = await this.client
        .from("grados")
        .upsert(datosMapeados, {
          onConflict: "grado_id", // Actualiza si el ID ya existe
          ignoreDuplicates: false,
        })
        .select("*");

      if (error) throw error;
      return grados;
    } catch (error) {
      console.error(
        "Error en procesarGrados:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
  async procesarMaterias({
    data,
  }: {
    data: MateriaExcel[];
  }): Promise<Materia[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de materias");
      }
      if (!this.colegio_id || this.colegio_id <= 0) {
        throw new Error("ID de colegio inválido");
      }

      // Mapeamos los datos
      const datosMapeados = data.map((item) => ({
        materia_id: item.MATERIA_ID || undefined, // Si es 0, Supabase generará automáticamente el ID
        colegio_id: this.colegio_id,
        nombre: item.NOMBRE?.trim() || "Materia sin nombre",
        codigo: item.CODIGO?.trim() || "",
        creado_por: 0,
        actualizado_por: 0,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        activo: true,
      }));

      // Upsert (insertar o actualizar si ya existe)
      const { data: materias, error } = await this.client
        .from("materias")
        .upsert(datosMapeados, {
          onConflict: "materia_id", // Actualiza si el ID ya existe
          ignoreDuplicates: false,
        })
        .select("*");

      if (error) throw error;
      return materias;
    } catch (error) {
      console.error(
        "Error en procesarMaterias:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
  async procesarCursos({
    data,
  }: {
    data: CursoExcel[];
  }): Promise<Curso[] | null> {
    try {
      // Validación básica
      if (!data || data.length === 0) {
        throw new Error("No se proporcionaron datos de cursos");
      }
      if (!this.colegio_id || this.colegio_id <= 0) {
        throw new Error("ID de colegio inválido");
      }

      // Mapeamos los datos
      const datosMapeados = data.map(async (item) => {
        // Convertimos IDs de string a number
        const [grado_id, nivel_educativo_id] = await Promise.all([
          this.obtenerIdGradoPorNombre(item.GRADO_ID),
          this.obtenerIdNivelEducativoPorNombre(item.NIVEL_EDUCATIVO_ID),
        ]);

        return {
          curso_id: item.CURSO_ID || undefined, // Si es 0, Supabase generará el ID
          nombre_curso: item.NOMBRE_CURSO?.trim() || "Curso sin nombre",
          colegio_id: this.colegio_id,
          grado_id: grado_id,
          nivel_educativo_id: nivel_educativo_id,
          creado_por: 0,
          actualizado_por: 0,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
        } as Curso;
      });
      // Upsert (insertar o actualizar si ya existe)
      const { data: cursos, error } = await this.client
        .from("cursos")
        .upsert(datosMapeados, {
          onConflict: "curso_id", // Actualiza si el ID ya existe
          ignoreDuplicates: false,
        })
        .select("*");

      if (error) throw error;
      return cursos;
    } catch (error) {
      console.error(
        "Error en procesarCursos:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  // Método reutilizable para conversión de fechas Excel (debe estar en la misma clase)
  private excelDateToJSDate(excelDate: number): Date {
    // Excel cuenta desde 01/01/1900 (con el error de 1900 como bisiesto)
    const jsDate = new Date(1900, 0, excelDate - 1);

    // Ajuste para el error de Excel (1900 no fue bisiesto)
    if (excelDate > 60) {
      jsDate.setDate(jsDate.getDate() - 1);
    }

    return jsDate;
  }

  // Método auxiliar para calcular días hábiles (opcional)
  private calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
    // Implementación básica - puedes mejorarla
    const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  procesarCargosDirectivos({ data }: { data: any }) {
    console.log(data);
  }
  procesarDirectivos({ data }: { data: any }) {
    console.log(data);
  }

  procesarDocentes({ data }: { data: any }) {
    console.log(data);
  }
  procesarAlumnos({ data }: { data: any }) {
    console.log(data);
  }
  procesarAulas({ data }: { data: any }) {
    console.log(data);
  }
}

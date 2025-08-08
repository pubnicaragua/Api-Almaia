/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Colegio } from "../../../core/modelo/colegio/Colegio";
import XLSX from "exceljs";
import { ColegioExcel } from "../../../core/modelo/import/ColegioExcel";
import { Fileservice } from "../../../core/services/FileService";
import { CalendarioEscolarExcel } from "../../../core/modelo/import/CalendarioEscolarExcel";
import { DiaFestivoExcel } from "../../../core/modelo/import/DiaFestivoExcel";
import { FechaImportanteExcel } from "../../../core/modelo/import/FechaImportanteExcel";
import { NivelEducativoExcel } from "../../../core/modelo/import/NivelEducativoExcel";
import { GradoExcel } from "../../../core/modelo/import/GradoExcel";
import { MateriaExcel } from "../../../core/modelo/import/MateriaExcel";
import { CursoExcel } from "../../../core/modelo/import/CursoExcel";
import { DirectivoExcel } from "../../../core/modelo/import/DirectivoExcel";
import { DocenteExcel } from "../../../core/modelo/import/DocenteExcel";
import { AlumnoExcel } from "../../../core/modelo/import/AlumnoExcel";
import { AulaExcel } from "../../../core/modelo/import/AulaExcel";

const dataService: DataService<Colegio> = new DataService("colegios", "colegio_id");
export const ColegiosService = {
  async importarExcelColegio(req: Request, res: Response) {
    try {
      const fileService = new Fileservice();
      const { colegio_id } = req.query;
      if (!req.file) throw new Error("Archivo no encontrado");
      const workbook = new XLSX.Workbook();
      await workbook.xlsx.load(req.file.buffer); // Cargar el archivo Excel desde el buffer
      // const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

      const ordenLectura = [
        "Colegio",
        "Año_Academico",
        "Dias Festivos",
        "Fechas Importantes",
        "Cargos_Directivos",
        "Directivos",
        "Niveles_Educativos",
        "Grados",
        "Materias",
        "Cursos",
        "Docentes",
        "Alumnos",
        "Aulas",
      ];
      fileService.setColegio(colegio_id);
      for (const hoja of ordenLectura) {
        const worksheet = workbook.getWorksheet(hoja);
        if (!worksheet) continue;
        // const datos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja]);

        // Obtiene los encabezados
        const headers: string[] = [];
        worksheet.getRow(1).eachCell((cell) => {
          headers.push(cell.value?.toString() ?? "");
        });

        // Convierte las filas a objetos usando los encabezados
        const datos: any[] = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // omitir encabezado
          const obj: any = {};
          row.eachCell((cell, colNumber) => {
            obj[headers[colNumber - 1]] = cell.value;
          });
          datos.push(obj);
        });

        switch (hoja) {
          case "Año_Academico":
            if (colegio_id === undefined) {
              await fileService.procesarAnioAcademico({
                data: datos as CalendarioEscolarExcel[],
              });
            }
            break;

          case "Dias Festivos":
            if (colegio_id === undefined) {
              await fileService.procesarDiasFestivos({
                data: datos as DiaFestivoExcel[],
              });
            }
            break;

          case "Fechas Importantes":
            if (colegio_id === undefined) {
              await fileService.procesarFechasImportantes({
                data: datos as FechaImportanteExcel[],
              });
            }
            break;

          case "Colegio":
            if (colegio_id === undefined) {
              await fileService.procesarColegio({
                data: datos as ColegioExcel[],
              });
            }
            break;

          case "Cargos_Directivos":
            await fileService.procesarCargosDirectivos({ data: datos });
            break;

          case "Directivos":
            if (colegio_id === undefined) {
              await fileService.procesarDirectivos({
                data: datos as DirectivoExcel[],
              });
            }
            break;

          case "Niveles_Educativos":
            if (colegio_id === undefined) {
              await fileService.procesarNivelesEducativos({
                data: datos as NivelEducativoExcel[],
              });
            }
            break;

          case "Grados":
            await fileService.procesarGrados({ data: datos as GradoExcel[] });
            break;

          case "Materias":
            await fileService.procesarMaterias({
              data: datos as MateriaExcel[],
            });
            break;

          case "Cursos":
            if (colegio_id === undefined) {
              await fileService.procesarCursos({ data: datos as CursoExcel[] });
            }
            break;

          case "Docentes":
            if (colegio_id === undefined) {
              await fileService.procesarDocentes({
                data: datos as DocenteExcel[],
              });
            }
            break;

          case "Alumnos":
            await fileService.procesarAlumnos({ data: datos as AlumnoExcel[] });
            break;

          case "Aulas":
            if (colegio_id === undefined) {
              await fileService.procesarAulas({ data: datos as AulaExcel[] });
            }
            break;

          default:
            console.warn(`Hoja desconocida: ${hoja}`);
        }
      }

      res.status(200).json({ message: "Excel procesado correctamente." });
    } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async obtener(req: Request, res: Response) {
    try {
      console.log(req.user)
      // dataService.setClient(req.user)
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const colegios = await dataService.getAll(["*"], where);
      console.log(colegios)
      res.status(200).json(colegios);
    } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(400).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const colegio: Colegio = req.body;
      const savedcolegio = await dataService.processData(colegio);
      res.status(201).json(savedcolegio);
    } catch (error) {
      console.error("Error al guardar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      const colegio: Colegio = req.body;
      const updatedcolegio = await dataService.updateById(colegioId, colegio);
      res.status(200).json(updatedcolegio);
    } catch (error) {
      console.error("Error al actualizar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  eliminar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      await dataService.deleteById(colegioId);
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

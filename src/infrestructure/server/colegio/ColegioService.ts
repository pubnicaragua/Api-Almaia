import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Colegio } from "../../../core/modelo/colegio/Colegio";
import * as XLSX from 'xlsx';
import { procesarAlumnos, procesarAnioAcademico, procesarAulas, procesarCargosDirectivos, procesarColegio, procesarCursos, procesarDiasFestivos, procesarDirectivos, procesarDocentes, procesarFechasImportantes, procesarGrados, procesarMaterias, procesarNivelesEducativos } from "../../../core/services/FileService";


const dataService: DataService<Colegio> = new DataService("colegios");
export const ColegiosService = {
  async importarExcelColegio(req: Request, res: Response) {
  try {
    const {colegio_id} = req.query
    if (!req.file) throw new Error('Archivo no encontrado');

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    const hojas = workbook.SheetNames;

    for (const hoja of hojas) {
      const datos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja]);

      switch (hoja) {
        case 'Año_Academico':
          await procesarAnioAcademico({colegio_id,data:datos});
          break;

        case 'Dias Festivos':
          await procesarDiasFestivos({colegio_id,data:datos});
          break;

        case 'Fechas Importantes':
          await procesarFechasImportantes({colegio_id,data:datos});
          break;

        case 'Colegio':
          await procesarColegio({colegio_id,data:datos});
          break;

        case 'Cargos_Directivos':
          await procesarCargosDirectivos({colegio_id,data:datos});
          break;

        case 'Directivos':
          await procesarDirectivos({colegio_id,data:datos});
          break;

        case 'Niveles_Educativos':
          await procesarNivelesEducativos({colegio_id,data:datos});
          break;

        case 'Grados':
          await procesarGrados({colegio_id,data:datos});
          break;

        case 'Materias':
          await procesarMaterias({colegio_id,data:datos});
          break;

        case 'Cursos':
          await procesarCursos({colegio_id,data:datos});
          break;

        case 'Docentes':
          await procesarDocentes({colegio_id,data:datos});
          break;

        case 'Alumnos':
          await procesarAlumnos({colegio_id,data:datos});
          break;

        case 'Aulas':
          await procesarAulas({colegio_id,data:datos});
          break;

        default:
          console.warn(`Hoja desconocida: ${hoja}`);
      }
    }

    res.status(200).json({ message: 'Excel procesado correctamente.' });

  } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
},

  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const colegios = await dataService.getAll(["*"], where);
      res.json(colegios);
    } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
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

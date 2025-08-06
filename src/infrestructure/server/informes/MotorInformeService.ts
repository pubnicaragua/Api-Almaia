/* eslint-disable @typescript-eslint/no-explicit-any */
import SupabaseStorageAdapter from "../../../core/services/SupabaseStorageAdapter";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import moment from "moment";
// import { randomUUID } from "crypto";
// import Joi from "joi";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

export const MotorInformeService = {
  async ejecutarMotor() {
    // Implementación de la lógica para ejecutar el motor de informes
    // Aquí se puede utilizar el cliente Supabase para interactuar con la base de datos
    // y generar los informes necesarios.
    console.log('--- Iniciando la ejecución del motor de informes ---');
    try {
      const { error } = await client
      .rpc('ejecutar_generacion_informes_por_colegios');
      if (error) {
        console.error("Error al ejecutar el motor de informes:", error);
        throw new Error("Error al ejecutar el motor de informes");
      }
      console.log('--- Motor de informes ejecutado correctamente ---');
    } catch (error) {
      console.error('Error al ejecutar el motor de informes:', error);
    }
  },
  async generarInformeAlumnos() {
    // Implementación de la lógica para generar el informe del motor
    // Aquí se puede utilizar el cliente Supabase para interactuar con la base de datos
    // y generar el informe necesario.

    // consumir una funcion de postgres por medio de supabase para obtener el listado de informes, donde paso un parametro de filtro, en donde lo que retorna es un valor tipo json
    // Donde los informes pendientes de generacion son aquellos que tienen el campo generado en false
    // Los tipos de informes son:
    // 1: Informe de alumnos
    // 2: Informe de colegios
    // 3: Informe de cursos
    // 4: Informe de niveles
    // Considerando que el informe tipo 1 tiene un formato diferente al resto, ya que es un informe de alumnos, y los otros son informes de colegios, cursos y niveles.
    const { data, error } = await client
      .rpc('consultar_informes_pendientes_generacion', { p_tipo_informes: 1 });

    if (error) {
      console.error("Error al consultar informes pendientes de generación:", error);
      throw new Error("Error al consultar informes pendientes de generación");
    }
    if (!data || data.length === 0) {
      console.log("No hay informes pendientes de generación");
      return;
    }
    // Necesito recorrer el array de informes de alumnos y generar cada uno de ellos
    for (const informe of data) {
      try {

        if (informe.template_informe === 'NO_DEFINIDO_MATRIZ' || !informe.template_informe) {
          console.error(`El informe de alumnos con ID ${informe.alumno_informe_id} no tiene un template definido.`);
          continue; // Saltar al siguiente informe si no hay template definido
        }

        const storageAdapter = new SupabaseStorageAdapter({
          bucketName: 'informes',
        });
        // Obtenemos el template del informe segun el tipo y codigo del informe de la consulta realizada, y utilizamos el adaptador de almacenamiento para obtener el template del informe.
        const templatePath = `templates/alumnos/${'TEMPLATE_ALUMNOS.docx'}`;
        const templateBlob = await storageAdapter.getFile(templatePath);

        if (!templateBlob) {
          console.error(`No se encontró el template para el informe de alumnos, codigo de registo ${informe.alumno_informe_id}`);
          continue;
        }
        console.log(`Generando informe para: ${informe.alumno_id}`);

        // Convertir el Blob a un ArrayBuffer, necesario para PizZip
        const templateArrayBuffer = await templateBlob.arrayBuffer();
        
        const zip = new PizZip(templateArrayBuffer);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Acondicionar el nombre completo del alumno, sin tildes o caracteres especiales y los espacios reemplazados por guiones bajos
        // Normalizar el nombre completo del alumno para evitar problemas con caracteres especiales
        // y espacios en blanco, reemplazando los espacios por guiones bajos.
        // Utilizamos el método normalize para eliminar tildes y caracteres especiales
        // y luego reemplazamos los espacios por guiones bajos.
        // Esto es importante para evitar problemas al guardar el archivo en el almacenamiento en la nube.
        const nombreCompleto = `${informe.nombres} ${informe.apellidos}`;

        const sinEspeciales = nombreCompleto
          .replace(/ñ/g, 'n')
          .replace(/Ñ/g, 'N')
          .replace(/ü/g, 'u')
          .replace(/Ü/g, 'U');

        // Eliminar tildes y acentos
        const sinAcentos = sinEspeciales
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        // Reemplazar espacios por guiones bajos
        // Ahora resultado contiene el nombre completo del alumno sin tildes ni espacios
        const resultado = sinAcentos.replace(/\s+/g, '_');

        const diagnostico = informe.template_informe === 'NO_DEFINIDO.docx'
          ? 'No existe suficiente información del periodo para generar el informe.'
          : informe.descripcion_informe || 'No disponible';

        const recomendaciones = informe.template_informe === 'NO_DEFINIDO.docx'
          ? 'No existe suficiente información del periodo para generar el informe.'
          : informe.recomendacion_almaia || 'No disponible';

        // 1. Validar los datos del informe
        const periodoEvaluacion = moment(informe.fecha_creacion).subtract(1,'month').format('MMMM YYYY');
        const data_informe = {
          alumno: nombreCompleto,
          curso: informe.nombre_curso || 'No disponible',
          periodo: periodoEvaluacion,
          analisis_diagnostico: diagnostico,
          analisis_recomendaciones: recomendaciones,
          patologia: informe.alerta_neurodivergencia ? 'Se observan señales que pueden orientar a una Neurodivergencia' : '',
        } as Record<string, any>;

        // 2. Reemplazar los tags con los datos
        doc.render(data_informe);

        // 3. Generar el nuevo archivo
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            // mimeType: 'application/pdf'
        });

        const fileName = `informe_${informe.alumno_id}_${resultado}_${periodoEvaluacion.replace(/\s+/g, '_')}.docx`;

        const colegios = informe.colegio
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_') || 'No_Definido';
        
        // 4. Guardar el archivo modificado de vuelta en el almacenamiento en la nube
        const outputPath = `alumnos/${colegios}/${fileName}`;
        // Utilizamos el adaptador de almacenamiento para guardar el archivo generado
        const { id } = await storageAdapter.saveFile(outputPath, buf, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        if (!id) {
          console.error(`Error al guardar el informe generado para el alumno ${informe.alumno_id}`);
          continue; // Saltar al siguiente informe si hay un error al guardar
        }
        console.log(`Informe generado y guardado en: ${outputPath}`);
        
        // 5. Obtener la URL del archivo generado
        const fileUrl = await storageAdapter.getFileUrl(outputPath);
        
        // Una vez generados el informe, se actualiza el campo generado a true y la url del informe en la tabla alumnos_informes
        const { error: updateError } = await client
          .from('alumnos_informes')
          .update({ generado: true, url_reporte: fileUrl, fecha_actualizacion: new Date().toUTCString() })
          .eq('alumno_informe_id', informe.alumno_informe_id);

        if (updateError) {
          console.error(`Error al actualizar el informe generado para el alumno ${informe.alumno_id}:`, updateError);
          continue; // Saltar al siguiente informe si hay un error al actualizar
        }

      } catch (error) {
        console.error(`Error al generar el informe para el alumno ${informe.alumno_id}:`, error);
      }
    }
    console.log("Generación de informes completada");
  },
    async generarInformeGenerales(tipoInforme: 2 | 3 | 4 = 2) {
    // Implementación de la lógica para generar el informe del motor
    // Aquí se puede utilizar el cliente Supabase para interactuar con la base de datos
    // y generar el informe necesario.

    // consumir una funcion de postgres por medio de supabase para obtener el listado de informes, donde paso un parametro de filtro, en donde lo que retorna es un valor tipo json
    // Donde los informes pendientes de generacion son aquellos que tienen el campo generado en false
    // Los tipos de informes son:
    // 1: Informe de alumnos
    // 2: Informe de colegios
    // 3: Informe de cursos
    // 4: Informe de niveles
    // Considerando que el informe tipo 1 tiene un formato diferente al resto, ya que es un informe de alumnos, y los otros son informes de colegios, cursos y niveles.
    const { data, error } = await client
      .rpc('consultar_informes_pendientes_generacion', { p_tipo_informes: tipoInforme });

    if (error) {
      console.error("Error al consultar informes pendientes de generación:", error);
      throw new Error("Error al consultar informes pendientes de generación");
    }
    if (!data || data.length === 0) {
      console.log("No hay informes pendientes de generación");
      return;
    }

    const tipoInformeNombre = tipoInforme === 2 ? 'colegios' :
      tipoInforme === 3 ? 'cursos' :
      tipoInforme === 4 ? 'niveles' : 'generales';

    // Necesito recorrer el array de informes de alumnos y generar cada uno de ellos
    for (const informe of data) {
      try {

        if (informe.template_informe.includes('NO_DEFINIDO_MATRIZ') || !informe.template_informe) {
          console.error(`El informe general con ID ${informe.informe_id} no tiene un template definido.`);
          continue; // Saltar al siguiente informe si no hay template definido
        }

        const storageAdapter = new SupabaseStorageAdapter({
          bucketName: 'informes',
        });
        // Obtenemos el template del informe segun el tipo y codigo del informe de la consulta realizada, y utilizamos el adaptador de almacenamiento para obtener el template del informe.
        const templatePath = `templates/${tipoInformeNombre}/TEMPLATE_${tipoInformeNombre.toUpperCase()}.docx`;
        const templateBlob = await storageAdapter.getFile(templatePath);

        if (!templateBlob) {
          console.error(`No se encontró el template para el informe general, codigo de registo ${informe.informe_id}`);
          continue;
        }
        console.log(`Generando informe para: ${tipoInformeNombre}`);

        // Convertir el Blob a un ArrayBuffer, necesario para PizZip
        const templateArrayBuffer = await templateBlob.arrayBuffer();
        
        const zip = new PizZip(templateArrayBuffer);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Acondicionar el nombre completo del alumno, sin tildes o caracteres especiales y los espacios reemplazados por guiones bajos
        // Normalizar el nombre completo del alumno para evitar problemas con caracteres especiales
        // y espacios en blanco, reemplazando los espacios por guiones bajos.
        // Utilizamos el método normalize para eliminar tildes y caracteres especiales
        // y luego reemplazamos los espacios por guiones bajos.
        // Esto es importante para evitar problemas al guardar el archivo en el almacenamiento en la nube.
        const nombreCompleto = `${informe.nivel}`;

        const sinEspeciales = nombreCompleto
          .replace(/ñ/g, 'n')
          .replace(/Ñ/g, 'N')
          .replace(/ü/g, 'u')
          .replace(/Ü/g, 'U')
          .replace(/°/g, '');

        // Eliminar tildes y acentos
        const sinAcentos = sinEspeciales
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        // Reemplazar espacios por guiones bajos
        // Ahora resultado contiene el nombre completo del informe sin tildes ni espacios
        const resultado = sinAcentos.replace(/\s+/g, '_').replace(/-/g, '_');

        const diagnostico = informe.template_informe === 'NO_DEFINIDO.docx'
          ? 'No existe suficiente información del periodo para generar el informe.'
          : informe.descripcion_informe || 'No disponible';

        const recomendaciones = informe.template_informe === 'NO_DEFINIDO.docx'
          ? 'No existe suficiente información del periodo para generar el informe.'
          : informe.recomendacion_almaia || 'No disponible';

        const alertaNeurodivergencia = [
          {
            tag: 'alerta_colegios',
            value: 'En algunos estudiantes del colegio se han identificado indicios que podrían estar asociados a un perfil neurodivergente.'
          },
          {
            tag: 'alerta_cursos',
            value: 'En algunos estudiantes del Curso se han identificado indicios que podrían estar asociados a un perfil neurodivergente.'
          },
          {
            tag: 'alerta_niveles',
            value: 'En algunos estudiantes del Nivel se han identificado indicios que podrían estar asociados a un perfil neurodivergente'
          },
        ]

        // 1. Validar los datos del informe
        const periodoEvaluacion = moment(informe.fecha_creacion).subtract(1,'month').format('MMMM YYYY');
        const data_informe = {
          // informe: nombreCompleto,
          nivel: informe.nivel || 'No disponible',
          periodo: periodoEvaluacion,
          analisis_diagnostico: diagnostico,
          analisis_recomendaciones: recomendaciones,
          neurodivergencia: informe.alerta_neurodivergencia ? alertaNeurodivergencia[tipoInforme - 2].value : '',
          docente: informe.docente || 'No disponible',
        } as Record<string, any>;

        // 2. Reemplazar los tags con los datos
        doc.render(data_informe);

        // 3. Generar el nuevo archivo
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            // mimeType: 'application/pdf'
        });
        
        const colegios = informe.colegio
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_') || 'No_Definido';
        
        const fileName = `informe_${resultado}_${periodoEvaluacion.replace(/\s+/g, '_')}_${informe.colegio_id}_${colegios}.docx`;
        
        // 4. Guardar el archivo modificado de vuelta en el almacenamiento en la nube
        const outputPath = `${tipoInformeNombre}/${fileName}`;
        // Utilizamos el adaptador de almacenamiento para guardar el archivo generado
        const { id } = await storageAdapter.saveFile(outputPath, buf, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        if (!id) {
          console.error(`Error al guardar el informe general generado ${informe.informe_id}`);
          continue; // Saltar al siguiente informe si hay un error al guardar
        }
        console.log(`Informe generado y guardado en: ${outputPath}`);
        
        // 5. Obtener la URL del archivo generado
        const fileUrl = await storageAdapter.getFileUrl(outputPath);
        
        // Una vez generados el informe, se actualiza el campo generado a true y la url del informe en la tabla informes_generales
        const { error: updateError } = await client
          .from('informes_generales')
          .update({ generado: true, url_reporte: fileUrl, fecha_actualizacion: new Date().toUTCString() })
          .eq('informe_id', informe.informe_id);

        if (updateError) {
          console.error(`Error al actualizar el informe general generado ${informe.informe_id}:`, updateError);
          continue; // Saltar al siguiente informe si hay un error al actualizar
        }

      } catch (error) {
        console.error(`Error al generar el informe general ${informe.informe_id}:`, error);
      }
    }
    console.log("Generación de informes completada");
  }
};
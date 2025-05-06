import { SupabaseClient } from "@supabase/supabase-js";
import { ISupabaseRepository } from "../../core/interface/ISupabaseRepository";
import { SupabaseClientService } from "../../core/services/supabaseClient";
import { getSecret, loginToVault } from "../../core/services/valutClient";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ClientSupabase {
  host: string;
  password: string;
}

export class SupabaseRepository<T> implements ISupabaseRepository<T> {
  private client!: SupabaseClient;
  private table: string= "";
  constructor(tableName:string) {
    this.table= tableName
    this.init().catch((err) => {
      throw new Error(`Error al inicializar SupabaseClient: ${err.message}`);
    });
  }

  private async init() {
    const token = await loginToVault();
   
    if (!token) {
      console.error('❌ No se pudo autenticar con Vault.');
      return;
    }
    const secret = await getSecret(token, 'secret/data/database');

    if (!secret) {
      console.error('❌ No se pudo obtener el secreto.');
      return;
    }
   
    const client_credential: ClientSupabase = {
      host: secret.SUPABASE_HOST!,
      password: secret.SUPABASE_PASSWORD!,
    };
    const supabaseService = new SupabaseClientService(
      client_credential.host,
      client_credential.password
    );
    this.client = supabaseService.getClient();
  }

  private async ensureClientInitialized() {
    if (!this.client) {
      await this.init();
    }
  }

  async saveData( entity: T): Promise<void> {
    await this.ensureClientInitialized();
    const { data, error } = await this.client
      .from(this.table)
      .insert([entity])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  }
  async getAll<T>(
    columns: string[],
    where: Record<string, any> = {} // Filtro opcional
  ): Promise<T[]> {
    await this.ensureClientInitialized();
    if (!columns.length) {
      throw new Error(
        "Debes especificar al menos una columna para generar el reporte."
      );
    }

    // Formatear columnas para la consulta
    const columnQuery = columns.join(",");

    // Crear la consulta base
    let query = this.client.from(this.table).select(columnQuery);

    // Aplicar filtros WHERE si se pasan
    Object.keys(where).forEach((key) => {
      query = query.eq(key, where[key]);
    });

    // Consultar datos desde Supabase con el filtro aplicado
    const { data, error } = await query
      .order(columns[0], { ascending: true })
      .returns<T[]>(); // Ordenar por la primera columna

    if (error) {
      throw new Error(
        `Error al consultar la tabla '${this.table}': ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return []; // Si no hay datos, devolvemos una cadena vacía.
    }
    return data;
  }
  async getData(id: number): Promise<any> {
    await this.ensureClientInitialized();
    const { data, error } = await this.client.from(this.table).select('*').eq('id', id);
    if (error) throw new Error(error.message);
    return data[0];
  }

  async deleteData(id: number): Promise<any> {
    await this.ensureClientInitialized();
    const { error } = await this.client.from(this.table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async updateData(id: number, data: T): Promise<any> {
    await this.ensureClientInitialized();
    const { error } = await this.client.from(this.table).update(data).eq("id", id);
    if (error) throw new Error(error.message);
  }
}

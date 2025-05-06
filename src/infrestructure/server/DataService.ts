import { SupabaseRepository } from "../adapter/SupabaseRepository";

export class DataService<T> {
    protected repository: SupabaseRepository<T>;
  
    constructor(tableName: string) {
      this.repository = new SupabaseRepository<T>(tableName);
    }
  
    async processData(entity: T): Promise<T> {
      const processedEntity = this.transformData(entity);
      await this.repository.saveData(processedEntity);
      return processedEntity;
    }
  
    protected transformData(entity: T): T {
      return entity; // Puede ser sobrescrito en servicios específicos
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAll(columns: string[], where: Record<string, any> = {}): Promise<T[]> {
      return await this.repository.getAll(columns, where);
    }
  
    async getById(id: number): Promise<T> {
      return await this.repository.getData(id);
    }
  
    async deleteById(id: number): Promise<void> {
      await this.repository.deleteData(id);
    }
  
    async updateById(id: number, entity: T): Promise<void> {
      await this.repository.updateData(id, entity);
    }
  }
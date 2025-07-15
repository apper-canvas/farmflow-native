import farmsData from "@/services/mockData/farms.json";

class FarmService {
  constructor() {
    this.farms = [...farmsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.farms];
  }

  async getById(id) {
    await this.delay();
    const farm = this.farms.find(f => f.Id === parseInt(id));
    if (!farm) {
      throw new Error(`Farm with ID ${id} not found`);
    }
    return { ...farm };
  }

  async create(farmData) {
    await this.delay();
    const maxId = Math.max(...this.farms.map(f => f.Id), 0);
    const newFarm = {
      ...farmData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await this.delay();
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Farm with ID ${id} not found`);
    }
    this.farms[index] = { ...farmData, Id: parseInt(id) };
    return { ...this.farms[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Farm with ID ${id} not found`);
    }
    this.farms.splice(index, 1);
    return true;
  }
}

export const farmService = new FarmService();
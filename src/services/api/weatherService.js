import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = [...weatherData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.weather];
  }

  async getById(id) {
    await this.delay();
    const weather = this.weather.find(w => w.Id === parseInt(id));
    if (!weather) {
      throw new Error(`Weather with ID ${id} not found`);
    }
    return { ...weather };
  }

  async create(weatherData) {
    await this.delay();
    const maxId = Math.max(...this.weather.map(w => w.Id), 0);
    const newWeather = {
      ...weatherData,
      Id: maxId + 1,
    };
    this.weather.push(newWeather);
    return { ...newWeather };
  }

  async update(id, weatherData) {
    await this.delay();
    const index = this.weather.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Weather with ID ${id} not found`);
    }
    this.weather[index] = { ...weatherData, Id: parseInt(id) };
    return { ...this.weather[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.weather.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Weather with ID ${id} not found`);
    }
    this.weather.splice(index, 1);
    return true;
  }
}

export const weatherService = new WeatherService();
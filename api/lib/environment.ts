//import { environment } from './../../backend/src/environments/environment.prod';

enum EnviromentType {
  Local = "local",
  Dev = "dev",
  Prod = "prod",
  Test = "test",
  QA = "qa",
}

export default class Environment {
  public environment: string;

  constructor(environment: string) {
    this.environment = environment;
  }

  getEnv(): string {
    return this.environment;
  }

  getPort(): number {
    if (this.environment === EnviromentType.Prod) {
      return 4081;
    }
    if (this.environment === EnviromentType.Dev) {
      return 4082;
    }
    if (this.environment === EnviromentType.QA) {
      return 4083;
    }
    if (this.environment === EnviromentType.Test) {
      return 4084;
    }
    return 4000;
  }

  getDBName(): string {
    if (this.environment === EnviromentType.Prod) {
      return "restaurant_prod";
    }
    if (this.environment === EnviromentType.Dev) {
      return "restaurant_dev";
    }
    if (this.environment === EnviromentType.QA) {
      return "restaurant_qa";
    }
    if (this.environment === EnviromentType.Test) {
      return "restaurant_test";
    }
    return "restaurant_remote";
  }
}

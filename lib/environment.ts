enum Environments {
  local_environment = 'local',
  dev_environment = 'dev',
  prod_environment = 'prod',
  qa_environment = 'qa'
}

class Environment {
  private environment: String;

  constructor(environment: String) {
    this.environment = environment;
  }

  getPort(): Number {
    if (this.environment === Environments.prod_environment) {
      return 8081;
    } else if (this.environment === Environments.dev_environment) {
      return 8082;
    } else if (this.environment === Environments.qa_environment) {
      return 8083;
    }

     return 3000;
  }

  getDataBasePath(): string {
    if (this.environment === Environments.prod_environment) {
      return 'mongodb://localhost/';
    } else if (this.environment === Environments.dev_environment) {
      return 'mongodb://localhost/';
    } else if (this.environment === Environments.qa_environment) {
      return 'mongodb://localhost/';
    }

    return 'mongodb://localhost/data';
  }

  getPrivateKey(): string {
    if (this.environment === Environments.prod_environment) {
      return 'cHJvZHVjdGlvbg';
    } else if (this.environment === Environments.dev_environment) {
      return 'ZGV2ZWxvcA';
    } else if (this.environment === Environments.qa_environment) {
      return 'cXVhbGl0eWE';
    }

    return 'bG9jYWxob3N0';
  }
}

export default new Environment(
  process.env.ENV || Environments.local_environment);

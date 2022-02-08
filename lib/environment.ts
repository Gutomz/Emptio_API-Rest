class Environment {
  public endpoint: string = '/api';
  public static: string = '/static';

  getPort(): Number {
    try {
      return parseInt(process.env.SERVER_PORT);
    } catch (_) {
      return 3000;
    }
  }

  getDataBasePath(): string {
    const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

    return `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
  }

  getPrivateKey(): string {
    return process.env.PRIVATE_KEY;
  }

  getApiURL(): string {
    return `http://localhost:${this.getPort()}${this.endpoint}`;
  }

  getStaticURL(): string {
    return this.getApiURL() + this.static;
  }

  getProductRecognizerURL(): string {
    return `http://${process.env.PR_HOST}:${process.env.PR_PORT}`;
  }
 
  getGoogleApiKey(): string {
    return process.env.GOOGLE_PLACES_KEY;
  }
}

export default new Environment();

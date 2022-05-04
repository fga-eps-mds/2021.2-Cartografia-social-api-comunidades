export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.microsservice = {
      queueName: process.env.RABBIT_QUEUE_NAME,
      host: process.env.RABBIT_HOST,
    };
    this.envConfig.mongo = {
      url: process.env.MONGO_URL,
    };
    this.envConfig.mail = {
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      staffEmail: process.env.STAFF_EMAIL,
    };
    this.envConfig.communityCreation = {
      formURL: process.env.FORM_URL,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

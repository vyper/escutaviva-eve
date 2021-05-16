import * as fs from 'fs';
import * as path from 'path';
import * as WAWebJS from 'whatsapp-web.js';

export class Session {
  readonly sessionFilePath = path.resolve(__dirname, 'session.json');
  private static instance: Session;

  private constructor() {}

  public static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }

    return Session.instance;
  }

  public getConfiguration() {
    let sessionCfg;

    if (fs.existsSync(this.sessionFilePath)) {
      sessionCfg = require(this.sessionFilePath);
    }

    return sessionCfg;
  }

  public persist(session: WAWebJS.ClientSession) {
    fs.writeFile(this.sessionFilePath, JSON.stringify(session), err => {
      if (err) {
        console.error(err);
      }
    });
  }
}

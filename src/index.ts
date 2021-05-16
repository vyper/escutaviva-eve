import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

// eslint-disable-next-line node/no-extraneous-import
import {Client} from 'whatsapp-web.js';
import * as QRCode from 'qrcode';

const SESSION_FILE_PATH = path.resolve(__dirname, 'session.json');
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
const client = new Client({
  session: sessionCfg,
});

client.on('qr', qr => {
  console.log('QR RECEIVED', qr);
  QRCode.toString(qr, {type: 'terminal'}, (_: Error, url: string) => {
    console.log(url);
  });
});

client.on('authenticated', session => {
  console.log('AUTHENTICATED', session);

  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
    if (err) {
      console.error(err);
    }
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', msg => {
  if (msg.body === '!ping') {
    msg.reply('pong');
  }
});

client.initialize();

console.log('defining listener...');
const requestListener = (_: http.IncomingMessage, res: http.ServerResponse) => {
  client.getState().then(state => {
    res.writeHead(200);
    res.end(state);
  });
};

console.log('createServer...');
const server = http.createServer(requestListener);
console.log('running listener...');
server.listen(3000);

// eslint-disable-next-line node/no-extraneous-import
import {Client} from 'whatsapp-web.js';
import * as QRCode from 'qrcode';

const client = new Client({});

client.on('qr', qr => {
  console.log('QR RECEIVED', qr);
  QRCode.toString(qr, {type: 'terminal'}, (_: Error, url: string) => {
    console.log(url);
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

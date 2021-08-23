import { HttpServer } from '../src/index';
import supertest from 'supertest';

const httpServer = new HttpServer();
const app = httpServer.app;

describe('POST /segWitAddress', () => {
  test('succeed generate an address', async () => {
    await supertest(app)
      .post('/api/v1/wallet/segWitAddress')
      .send({
        seed: 'b03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0c',
        path: 'm/0/0/1'
      })
      .expect(200)
      .then(response => {
        expect(response.body.result).toBe('bc1q3ge2uvhff53t7qfzvpss8hxyh6uk8pjmjw538z');
      });
  });

  test('seed cannot be too short, less than 32 hex string', async () => {
    await supertest(app)
      .post('/api/v1/wallet/segWitAddress')
      .send({
        seed: 'b03daae795a1976f3a',
        path: 'm/0/0/1'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('seed should be a hex string length varies from 32 to 128');
      });
  });

  test('seed cannot be too long, more than 128 hex string', async () => {
    await supertest(app)
      .post('/api/v1/wallet/segWitAddress')
      .send({
        seed: 'b03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0cb03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0cb03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0c',
        path: 'm/0/0/1'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('seed should be a hex string length varies from 32 to 128');
      });
  });

  test('seed must be a hex string', async () => {
    await supertest(app)
      .post('/api/v1/wallet/segWitAddress')
      .send({
        seed: 'b03daae795a1976f3ad3de782xb7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0c',
        path: 'm/0/0/1'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('seed should be a hex string length varies from 32 to 128');
      });
  });

  test(`path must follow regular express ^m\/(\d+'?\/)*(\d+'?)$`, async () => {
    await supertest(app)
      .post('/api/v1/wallet/segWitAddress')
      .send({
        seed: 'b03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0c',
        path: 'm/0/0/1/'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe(`path should be a bip 32 derive path follow regexp ^m\/(\d+'?\/)*(\d+'?)$`);
      });
  });
});

describe('POST /multiSigAddress', () => {
  test('succeed generate an address', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 2,
        n: 3,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
        ]
      })
      .expect(200)
      .then(response => {
        expect(response.body.result).toBe('36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7');
      });
  });

  test('m cannot bigger than n', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 4,
        n: 3,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
        ]
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('m and n should both be a positive number and m should less or equal to n');
      });
  });

  test('m cannot bigger than pubKyes length', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 4,
        n: 6,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
        ]
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('m should be less or equal to the pubKeys count');
      });
  });

  test('pubKeys should be a compressed pubkey hex (66 length long) array', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 2,
        n: 6,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebfd12'
        ]
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('pubKeys should be a compressed pubkey hex (66 length long) array');
      });
  });

  test('each of pubkey should start with 0x02 or 0x03.', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 2,
        n: 3,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '08c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
        ]
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('pubKeys should be a compressed pubkey hex (66 length long) array');
      });
  });

  test('each of pubkey should be EC point', async () => {
    await supertest(app)
      .post('/api/v1/wallet/multiSigAddress')
      .send({
        m: 2,
        n: 3,
        pubKeys: [
          '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '03c6103b3b83e4a24a0e33a4df246ef11772f1122663db0c35759a5e2ebf68d8e9'
        ]
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('pubKeys should be a compressed pubkey hex (66 length long) array');
      });
  });
});

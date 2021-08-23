# BitcoinWallet

A typescript written API server for bitcoin wallet

# End Points

## HD SegWit address 

Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path

**URL** : `/api/v1/wallet/segWitAddress`

**Method** : `POST`

**Data format** : `application/json`

**Data constraints**

seed should be a hex string length varies from 32 to 128

```json
{
    "seed": "b03daae795a1976f3ad3de7827b7b5af82802109040092056f67fb146d4961ad5f24e787bf24e4e0b3e2f1360fec05b0de01905613ba995f3b06e0b3dbdb6e0c"
}
```

path should be a bip 32 derive path follow regexp ^m\/(\d+'?\/)*(\d+'?)$

```json
{
    "path": "m/0/0/1"
}
```
### Success Response

**Code** : `200`

**Content example**

```json
{
    "status": 200,
    "timestamp": "1629662957342",
    "result": "bc1q3ge2uvhff53t7qfzvpss8hxyh6uk8pjmjw538z"
}
```

### Error Responses

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": 400,
    "timestamp": "1629662957342",
    "message": "seed should be a hex string length varies from 32 to 128"
}
```

## multi-sig address 

 Generate an m-out-of-n Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address, where m, n and pubKeys can be specified

**URL** : `/api/v1/wallet/multiSigAddress`

**Method** : `POST`

**Data format** : `application/json`

**Data constraints**

m and n should both be a positive number and m should less or equal to n

```json
{
    "m": 2,
    "n": 3
}
```

pubKeys should be a compressed pubkey hex (66 length long) array and m should be less or equal to the pubKeys count. Each of pubkey should follow EC point rules.

```json
{
    "pubKeys": [
      "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
      "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
      "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
    ]
}
```
### Success Response

**Code** : `200`

**Content example**

```json
{
    "status": 200,
    "timestamp": "1629662957342",
    "result": "36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7"
}
```

### Error Responses

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": 400,
    "timestamp": "1629662957342",
    "message": "m should be less or equal to the pubKeys count"
}
```

# Test

install dependencies
```
npm install
```

run test

```
npm test
```

# Develop or serve the server

development mode

``` 
npm run start
```

or production mode

``` 
npm run serve
```
# bitcoinWallet

A typescript written API server for bitcoin wallet

## End Points

### HD SegWit address 

Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path

**URL** : `/api/v1/wallet/segWitAddress`

**Method** : `POST`

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
#### Success Response

**Code** : `200`

**Content example**

```json
{
    "status": 200,
    "timestamp": "1629662957342",
    "result": "bc1q3ge2uvhff53t7qfzvpss8hxyh6uk8pjmjw538z"
}
```

#### Error Responses

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": 400,
    "timestamp": "1629662957342",
    "message": "seed should be a hex string length varies from 32 to 128"
}
```
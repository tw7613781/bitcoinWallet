import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';

export type Address = string;

export class Wallet {
  public static generateSegWitAddress(seed: string, path: string): string {
    const node: BIP32Interface = bip32.fromSeed(Buffer.from(seed, 'hex'));
    const child: BIP32Interface = node.derivePath(path);
    return bitcoin.payments.p2wpkh({ pubkey: child.publicKey }).address!;
  }

  public static generateMultiSigP2SHAddress(m: number, n: number, pubKeys: string[]): string {
    const pubkeys = pubKeys.map(hex => Buffer.from(hex, 'hex'));
    return bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2ms({ m, pubkeys })
    }).address!;
  }
}

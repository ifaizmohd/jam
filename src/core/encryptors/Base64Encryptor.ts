import { Encryptor } from "../../types/urlParser/urlParser.types";

export class Base64Encrypto implements Encryptor {
  encrypt(data: string): string {
    return Buffer.from(data).toString("base64");
  }
}

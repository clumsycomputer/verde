export interface GetEncodedBooleanApi {
  someBoolean: boolean;
}

export function getEncodedBoolean(api: GetEncodedBooleanApi) {
  const { someBoolean } = api;
  const encodedBooleanResult = new Uint8Array(1);
  encodedBooleanResult[0] = someBoolean === true ? 0x01 : 0x00;
  return encodedBooleanResult;
}

export interface GetEncodedNumberApi {
  someNumber: number;
}

export function getEncodedNumber(api: GetEncodedNumberApi) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(8);
  new DataView(encodedNumberResult.buffer).setFloat64(0, someNumber);
  return encodedNumberResult;
}

export interface GetEncodedUint32Api {
  someNumber: number;
}

export function getEncodedUint32(api: GetEncodedUint32Api) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(4);
  new DataView(encodedNumberResult.buffer).setUint32(0, someNumber);
  return encodedNumberResult;
}

export interface GetEncodedStringApi {
  someString: string;
}

export function getEncodedString(api: GetEncodedStringApi) {
  const { someString } = api;
  return new TextEncoder().encode(someString);
}

import { throwInvalidPathError } from '../../helpers/throwError.ts';
import { RecordUuid } from '../schema/types/DataSchema.ts';

export function createRecordUuid(): RecordUuid {
  const newUuidString = crypto.randomUUID();
  const hyphenlessUuidString = newUuidString.replaceAll('-', '');
  const uuidBytes = new Uint8Array(16);
  for (let byteIndex = 0; byteIndex < uuidBytes.byteLength; byteIndex++) {
    const hexIndex = byteIndex * 2;
    uuidBytes[byteIndex] = parseInt(
      hyphenlessUuidString.substring(hexIndex, hexIndex + 2),
      16,
    );
  }
  const uuidBytesView = new DataView(uuidBytes.buffer);
  const recordUuidResult = new Float64Array(2);
  recordUuidResult[0] = uuidBytesView.getFloat64(0);
  recordUuidResult[1] = uuidBytesView.getFloat64(8);
  return [recordUuidResult[0], recordUuidResult[1]];
}

export interface GetUuidStringApi {
  someRecordUuid: Float64Array;
}

export function getUuidString(api: GetUuidStringApi) {
  const { someRecordUuid } = api;
  const uuidBytes = new Uint8Array(16);
  const uuidBytesView = new DataView(uuidBytes.buffer);
  uuidBytesView.setFloat64(
    0,
    someRecordUuid[0] ?? throwInvalidPathError('someRecordUuid[0]'),
  );
  uuidBytesView.setFloat64(
    8,
    someRecordUuid[1] ?? throwInvalidPathError('someRecordUuid[1]'),
  );
  const hyphenlessUuidString = Array.from(uuidBytes).map((someUuidByte) =>
    someUuidByte.toString(16).padStart(2, '0')
  ).join('');
  return `${hyphenlessUuidString.substring(0, 8)}-${
    hyphenlessUuidString.substring(8, 12)
  }-${hyphenlessUuidString.substring(12, 16)}-${
    hyphenlessUuidString.substring(16, 20)
  }-${hyphenlessUuidString.substring(20, 32)}`;
}

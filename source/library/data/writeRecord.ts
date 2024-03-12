import { throwInvalidPathError } from '../../helpers/throwError.ts';
import { Path } from '../../imports/Path.ts';
import { getStoreEffects } from '../../imports/ReduxSaga.ts';
import { RecordSchema } from '../schema/types/RecordSchema.ts';
import { getRecordRowEntries, RecordRowEntry } from './getRecordRowEntries.ts';

const { storeEffects } = getStoreEffects();
const call = storeEffects.call;

export interface WriteRecordApi {
  databaseDirectoryPath: string;
  recordSchema: RecordSchema;
  recordData: Record<string, unknown>;
}

export function* writeRecord(api: WriteRecordApi) {
  const { recordSchema, recordData, databaseDirectoryPath } = api;
  const recordRowEntries = getRecordRowEntries({
    recordSchema,
    recordData,
  });
  for (const someRowEntry of recordRowEntries) {
    if (someRowEntry.entryPageIndex === null) {
      yield* call(writeNewRowEntry, {
        recordSchema,
        databaseDirectoryPath,
        someRowEntry,
      });
    } else {
      // yield* call(writeUpdatedRowEntry, {
      //   databaseDirectoryPath,
      //   someRowEntry
      // })
    }
  }
}

interface WriteNewRowEntryApi
  extends Pick<WriteRecordApi, 'recordSchema' | 'databaseDirectoryPath'> {
  someRowEntry: RecordRowEntry;
}

function* writeNewRowEntry(api: WriteNewRowEntryApi) {
  const { databaseDirectoryPath, someRowEntry, recordSchema } = api;
  const appendWriteHeadPageFile = yield* call(openAppendWriteHeadPageFile, {
    databaseDirectoryPath,
    someRowEntry,
  });
  const rowEntryBytes = getRowEntryBytes({
    someRowEntry,
    recordSchema,
  });
  yield* call(() => appendWriteHeadPageFile.write(rowEntryBytes));
  appendWriteHeadPageFile.close();
}

interface GrabHeadPageAppendWriteFileApi
  extends Pick<WriteNewRowEntryApi, 'databaseDirectoryPath' | 'someRowEntry'> {}

async function openAppendWriteHeadPageFile(
  api: GrabHeadPageAppendWriteFileApi,
): Promise<Deno.FsFile> {
  const { databaseDirectoryPath, someRowEntry } = api;
  const modelDataDirectoryPath = Path.join(
    databaseDirectoryPath,
    `./${someRowEntry.entryModelSymbol}`,
  );
  const modelDataPageEntries = Array.from(
    Deno.readDirSync(modelDataDirectoryPath),
  );
  if (modelDataPageEntries.length === 0) {
    return createNextHeadPageAppendWriteFile({
      modelDataDirectoryPath,
      nextHeadPageIndex: 0,
    });
  }
  const lastHeadModelPageEntry =
    modelDataPageEntries.sort()[modelDataPageEntries.length - 1] ??
      throwInvalidPathError('headModelPageEntry');
  const lastHeadModelPagePath = Path.join(
    modelDataDirectoryPath,
    lastHeadModelPageEntry.name,
  );
  const lastHeadModelPageFile = await Deno.open(lastHeadModelPagePath, {
    read: true,
    write: true,
    append: true,
  });
  const lastHeadModelPageStats = await lastHeadModelPageFile.stat();
  const MODEL_PAGE_FINISHLINE_BYTE_SIZE = 8000;
  if (lastHeadModelPageStats.size < MODEL_PAGE_FINISHLINE_BYTE_SIZE) {
    return lastHeadModelPageFile;
  } else {
    lastHeadModelPageFile.close();
    return createNextHeadPageAppendWriteFile({
      modelDataDirectoryPath,
      nextHeadPageIndex: modelDataPageEntries.length,
    });
  }
}

interface CreateNextHeadPageAppendWriteFileApi {
  modelDataDirectoryPath: string;
  nextHeadPageIndex: number;
}

function createNextHeadPageAppendWriteFile(
  api: CreateNextHeadPageAppendWriteFileApi,
) {
  const { modelDataDirectoryPath, nextHeadPageIndex } = api;
  const nextHeadPageFilePath = Path.join(
    modelDataDirectoryPath,
    `${nextHeadPageIndex}.data`,
  );
  return Deno.open(nextHeadPageFilePath, {
    read: true,
    write: true,
    createNew: true,
    append: true,
  });
}

interface GetRowEntryBytesApi
  extends Pick<WriteNewRowEntryApi, 'recordSchema' | 'someRowEntry'> {}

function getRowEntryBytes(api: GetRowEntryBytesApi) {
  const { someRowEntry, recordSchema } = api;
  const [identifierEncoding, ...propertiesEncoding] =
    recordSchema.schemaMap[someRowEntry.entryModelSymbol]?.modelEncoding ??
      throwInvalidPathError('rowEntryModel');
  const rowEntryByteSize = Object.values(someRowEntry.entryEncodedProperties)
    .reduce(
      (byteSizeResult, someEncodedProperty) =>
        byteSizeResult + someEncodedProperty.length,
      4 + 1,
    );
  const encodedRowEntryByteSizeResult = new Uint8Array(4);
  new DataView(encodedRowEntryByteSizeResult.buffer).setUint32(
    0,
    rowEntryByteSize
  );
  console.log(rowEntryByteSize)
  const rowEntryBytesResult = new Uint8Array(rowEntryByteSize);
  let rowEntryByteOffsetIndex = 0;
  rowEntryBytesResult.set(
    encodedRowEntryByteSizeResult,
    rowEntryByteOffsetIndex,
  );
  rowEntryByteOffsetIndex += encodedRowEntryByteSizeResult.length;
  rowEntryBytesResult.set(
    someRowEntry.entryEncodedProperties.__uuid,
    rowEntryByteOffsetIndex,
  );
  rowEntryByteOffsetIndex += someRowEntry.entryEncodedProperties.__uuid.length;
  propertiesEncoding.forEach((somePropertyEncoding) => {
    const encodedProperty = someRowEntry
      .entryEncodedProperties[somePropertyEncoding.encodingPropertyKey] ??
      throwInvalidPathError('encodedProperty');
    rowEntryBytesResult.set(
      encodedProperty,
      rowEntryByteOffsetIndex,
    );
    rowEntryByteOffsetIndex += encodedProperty.length;
  });
  rowEntryBytesResult.set(
    new TextEncoder().encode('\n'),
    rowEntryByteOffsetIndex,
  );
  return rowEntryBytesResult;
}

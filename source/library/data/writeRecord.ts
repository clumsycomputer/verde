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
    const modelDataDirectoryPath = Path.join(
      databaseDirectoryPath,
      `./${someRowEntry.entryModelSymbol}`,
    );
    const rowEntryBytes = getRowEntryBytes({
      someRowEntry,
      recordSchema,
    });
    someRowEntry.entryPageIndex === null
      ? yield* call(writeNewRowEntry, {
        modelDataDirectoryPath,
        rowEntryBytes,
      })
      : yield* call(writeUpdatedRowEntry, {
        someRowEntry,
        modelDataDirectoryPath,
        rowEntryBytes,
      });
  }
}

interface GetRowEntryBytesApi extends Pick<WriteRecordApi, 'recordSchema'> {
  someRowEntry: RecordRowEntry;
}

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
    rowEntryByteSize,
  );
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

interface WriteNewRowEntryApi {
  modelDataDirectoryPath: string;
  rowEntryBytes: Uint8Array;
}

function* writeNewRowEntry(api: WriteNewRowEntryApi) {
  const { modelDataDirectoryPath, rowEntryBytes } = api;
  const appendWriteHeadPageFile = yield* call(openAppendWriteHeadPageFile, {
    modelDataDirectoryPath,
  });
  yield* call(() => appendWriteHeadPageFile.write(rowEntryBytes));
  appendWriteHeadPageFile.close();
}

interface OpenAppendWriteHeadPageFileApi
  extends Pick<WriteNewRowEntryApi, 'modelDataDirectoryPath'> {}

async function openAppendWriteHeadPageFile(
  api: OpenAppendWriteHeadPageFileApi,
): Promise<Deno.FsFile> {
  const { modelDataDirectoryPath } = api;
  const modelDataPageEntries = Array.from(
    Deno.readDirSync(modelDataDirectoryPath),
  );
  if (modelDataPageEntries.length === 0) {
    return openAppendWriteNextHeadPageFile({
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
    return openAppendWriteNextHeadPageFile({
      modelDataDirectoryPath,
      nextHeadPageIndex: modelDataPageEntries.length,
    });
  }
}

interface OpenAppendWriteNextHeadPageFileApi {
  modelDataDirectoryPath: string;
  nextHeadPageIndex: number;
}

function openAppendWriteNextHeadPageFile(
  api: OpenAppendWriteNextHeadPageFileApi,
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

interface WriteUpdatedRowEntryApi {
  modelDataDirectoryPath: string;
  someRowEntry: RecordRowEntry;
  rowEntryBytes: Uint8Array;
}

function* writeUpdatedRowEntry(api: WriteUpdatedRowEntryApi) {
  const {
    modelDataDirectoryPath,
    someRowEntry,
    rowEntryBytes,
  } = api;  
  const {
    staleTargetPageFile,
    nextTargetPageFile,
    nextTargetPagePath,
    targetPagePath,
  } = yield* call(openTargetPageFile, {
    modelDataDirectoryPath,
    someRowEntry,
  });
  yield* call(async () => {
    let targetPageHasBytesRemaining = true;
    const currentRowByteSizeBytes = new Uint8Array(4);
    const currentRowByteSizeView = new DataView(
      currentRowByteSizeBytes.buffer,
    );
    while (targetPageHasBytesRemaining) {
      const countBytesReadCount = await staleTargetPageFile.read(
        currentRowByteSizeBytes,
      );
      if (countBytesReadCount === null) {
        targetPageHasBytesRemaining = false;
        continue;
      } else if (countBytesReadCount !== 4) {
        // documentation says possible, probably won't handle in the future
        throwInvalidPathError('rowBytesCountRead');
      }
      const currentRowByteCount = currentRowByteSizeView.getUint32(0);
      const currentRowBytes = new Uint8Array(currentRowByteCount - 4);
      const currentRowView = new DataView(currentRowBytes.buffer);
      const rowBytesReadCount = await staleTargetPageFile.read(currentRowBytes);
      if (rowBytesReadCount !== currentRowBytes.length) {
        // documentation says possible, and should handle in the future
        throwInvalidPathError('rowBytesReadCount');
      }
      const currentRowUuidFirst = currentRowView.getFloat64(0);
      const currentRowUuidSecond = currentRowView.getFloat64(8);
      currentRowUuidFirst === someRowEntry.entryRecordUuid[0] &&
        currentRowUuidSecond === someRowEntry.entryRecordUuid[1]
        ? await nextTargetPageFile.write(rowEntryBytes)
        : await nextTargetPageFile.write(
          new Uint8Array([
            ...currentRowByteSizeBytes,
            ...currentRowBytes,
          ]),
        );
    }
    staleTargetPageFile.close();
    nextTargetPageFile.close();
    await Deno.rename(nextTargetPagePath, targetPagePath);
  });
}

interface OpenTargetPageFileApi
  extends
    Pick<WriteUpdatedRowEntryApi, 'modelDataDirectoryPath' | 'someRowEntry'> {}

async function openTargetPageFile(api: OpenTargetPageFileApi) {
  const {
    modelDataDirectoryPath,
    someRowEntry,
  } = api;
  const targetPagePath = Path.join(
    modelDataDirectoryPath,
    `${someRowEntry.entryPageIndex}.data`,
  );
  const staleTargetPageFilePromise = Deno.open(
    targetPagePath,
    {
      read: true,
    },
  );
  const nextTargetPagePath = Path.join(
    modelDataDirectoryPath,
    `${someRowEntry.entryPageIndex}.data__NEXT`,
  );
  const nextTargetPageFilePromise = Deno.open(
    nextTargetPagePath,
    {
      createNew: true,
      write: true,
      append: true,
    },
  );
  return {
    targetPagePath,
    staleTargetPageFile: await staleTargetPageFilePromise,
    nextTargetPagePath,
    nextTargetPageFile: await nextTargetPageFilePromise,
  };
}

import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { Path } from '../../../imports/Path.ts';
import { getStoreEffects } from '../../../imports/ReduxSaga.ts';
import { DataSchema } from '../../schema/types/DataSchema.ts';
import {
  CreateDataRowOperation,
  UpdateDataRowOperation,
  WriteDataRowOperation,
  getDataRowOperations,
} from './getDataRowOperations.ts';

const { storeEffects } = getStoreEffects();
const call = storeEffects.call;

export interface WriteRecordApi {
  dataDirectoryPath: string;
  dataSchema: DataSchema;
  dataRecord: Record<string, unknown>;
}

export function* writeRecord(api: WriteRecordApi) {
  const { dataSchema, dataRecord, dataDirectoryPath } = api;
  const { dataRowOperations } = getDataRowOperations({
    dataSchema,
    dataRecord,
  });
  for (const someDataRowOperation of dataRowOperations) {
    yield* call(writeDataRow, {
      dataDirectoryPath,
      dataRowOperation: someDataRowOperation,
    });
  }
}


interface WriteDataRowApi
  extends Pick<WriteRecordApi, 'dataDirectoryPath'> {
  dataRowOperation: WriteDataRowOperation;
}

function* writeDataRow(api: WriteDataRowApi) {
  const { dataDirectoryPath, dataRowOperation } = api;
  const modelDataDirectoryPath = Path.join(
    dataDirectoryPath,
    `./${dataRowOperation.operationModelSymbol}`,
  );
  dataRowOperation.operationKind === 'create'
    ? yield* call(createDataRow, {
      dataRowOperation,
      modelDataDirectoryPath,
    })
    : yield* call(updateDataRow, {
      dataRowOperation,
      modelDataDirectoryPath,
    });
}

interface CreateDataRowApi {
  modelDataDirectoryPath: string;
  dataRowOperation: CreateDataRowOperation;
}

function* createDataRow(api: CreateDataRowApi) {
  const { modelDataDirectoryPath, dataRowOperation } = api;
  const { modelHeadPageFile } = yield* call(openModelHeadPageFile, {
    modelDataDirectoryPath,
  });
  yield* call(appendDataRowToHeadPage, {
    modelHeadPageFile,
    dataRowOperation,
  });
  modelHeadPageFile.close();
}

interface OpenModelHeadPageFileApi
  extends Pick<CreateDataRowApi, 'modelDataDirectoryPath'> {}

interface OpenModelHeadPageFileResult {
  modelHeadPageFile: Deno.FsFile;
}

async function openModelHeadPageFile(
  api: OpenModelHeadPageFileApi,
): Promise<OpenModelHeadPageFileResult> {
  const { modelDataDirectoryPath } = api;
  const modelDataPageEntries = Array.from(
    Deno.readDirSync(modelDataDirectoryPath),
  );
  if (modelDataPageEntries.length === 0) {
    return {
      modelHeadPageFile: await openNewHeadPageFile({
        modelDataDirectoryPath,
        nextHeadPageIndex: 0,
      }),
    };
  }
  const lastHeadModelPageEntry =
    modelDataPageEntries.sort()[modelDataPageEntries.length - 1] ??
      throwInvalidPathError('lastHeadModelPageEntry');
  const lastHeadModelPagePath = Path.join(
    modelDataDirectoryPath,
    lastHeadModelPageEntry.name,
  );
  const lastHeadModelPageFile = await Deno.open(lastHeadModelPagePath, {
    write: true,
    append: true,
  });
  const lastHeadModelPageStats = await lastHeadModelPageFile.stat();
  const MODEL_PAGE_BYTE_FINISHLINE_SIZE = 8192;
  if (lastHeadModelPageStats.size < MODEL_PAGE_BYTE_FINISHLINE_SIZE) {
    return {
      modelHeadPageFile: lastHeadModelPageFile,
    };
  } else {
    lastHeadModelPageFile.close();
    return {
      modelHeadPageFile: await openNewHeadPageFile({
        modelDataDirectoryPath,
        nextHeadPageIndex: modelDataPageEntries.length,
      }),
    };
  }
}

interface OpenNewHeadPageFileApi {
  modelDataDirectoryPath: string;
  nextHeadPageIndex: number;
}

function openNewHeadPageFile(
  api: OpenNewHeadPageFileApi,
) {
  const { modelDataDirectoryPath, nextHeadPageIndex } = api;
  const nextHeadPageFilePath = Path.join(
    modelDataDirectoryPath,
    `${nextHeadPageIndex}.data`,
  );
  return Deno.open(nextHeadPageFilePath, {
    createNew: true,
    write: true,
    append: true,
  });
}

interface AppendDataRowToHeadPageApi
  extends
    Pick<CreateDataRowApi, 'dataRowOperation'>,
    Pick<OpenModelHeadPageFileResult, 'modelHeadPageFile'> {
}

function appendDataRowToHeadPage(
  api: AppendDataRowToHeadPageApi,
) {
  const { modelHeadPageFile, dataRowOperation } = api;
  return modelHeadPageFile.write(dataRowOperation.operationRowBytes);
}

interface UpdateDataRowApi {
  modelDataDirectoryPath: string;
  dataRowOperation: UpdateDataRowOperation;
}

function* updateDataRow(api: UpdateDataRowApi) {
  const {
    modelDataDirectoryPath,
    dataRowOperation,
  } = api;
  const {
    staleTargetPageFile,
    nextTargetPageFile,
    temporaryTargetPagePath,
    targetPagePath,
  } = yield* call(openTargetPageFile, {
    modelDataDirectoryPath,
    dataRowOperation,
  });
  yield* call(writeNextTargetPage, {
    dataRowOperation,
    staleTargetPageFile,
    nextTargetPageFile,
  });
  staleTargetPageFile.close();
  nextTargetPageFile.close();
  yield* call(replaceTargetPageWithNextVersion, {
    temporaryTargetPagePath,
    targetPagePath,
  });
}

interface OpenTargetPageFileApi
  extends
    Pick<UpdateDataRowApi, 'modelDataDirectoryPath' | 'dataRowOperation'> {
}

interface OpenTargetPageFileResult {
  targetPagePath: string;
  temporaryTargetPagePath: string;
  staleTargetPageFile: Deno.FsFile;
  nextTargetPageFile: Deno.FsFile;
}

async function openTargetPageFile(
  api: OpenTargetPageFileApi,
): Promise<OpenTargetPageFileResult> {
  const {
    modelDataDirectoryPath,
    dataRowOperation,
  } = api;
  const targetPagePath = Path.join(
    modelDataDirectoryPath,
    `${dataRowOperation.operationPageIndex}.data`,
  );
  const staleTargetPageFilePromise = Deno.open(
    targetPagePath,
    {
      read: true,
    },
  );
  const temporaryTargetPagePath = Path.join(
    modelDataDirectoryPath,
    `${dataRowOperation.operationPageIndex}.data__NEXT`,
  );
  const nextTargetPageFilePromise = Deno.open(
    temporaryTargetPagePath,
    {
      createNew: true,
      write: true,
      append: true,
    },
  );
  return {
    targetPagePath,
    temporaryTargetPagePath,
    staleTargetPageFile: await staleTargetPageFilePromise,
    nextTargetPageFile: await nextTargetPageFilePromise,
  };
}

interface WriteNextTargetPageApi
  extends
    Pick<UpdateDataRowApi, 'dataRowOperation'>,
    Pick<
      OpenTargetPageFileResult,
      'staleTargetPageFile' | 'nextTargetPageFile'
    > {}

async function writeNextTargetPage(api: WriteNextTargetPageApi) {
  const {
    staleTargetPageFile,
    nextTargetPageFile,
    dataRowOperation,
  } = api;
  let targetPageHasBytesRemaining = true;
  const currentRowByteSizeBytes = new Uint8Array(4);
  const currentRowByteSizeView = new DataView(
    currentRowByteSizeBytes.buffer,
  );
  while (targetPageHasBytesRemaining) {
    const currentRowByteSizeBytesReadCount = await staleTargetPageFile.read(
      currentRowByteSizeBytes,
    );
    if (currentRowByteSizeBytesReadCount === null) {
      targetPageHasBytesRemaining = false;
      continue;
    } else if (4 !== currentRowByteSizeBytesReadCount) {
      // documentation says possible, probably won't handle
      throwInvalidPathError('rowBytesCountRead');
    }
    const currentRowByteSize = currentRowByteSizeView.getUint32(0);
    const currentRowBytes = new Uint8Array(currentRowByteSize);
    const currentRowView = new DataView(currentRowBytes.buffer);
    const rowBytesReadCount = await staleTargetPageFile.read(currentRowBytes);
    if (currentRowBytes.length !== rowBytesReadCount) {
      // documentation says possible, and should handle
      throwInvalidPathError('rowBytesReadCount');
    }
    const currentRowUuidFirst = currentRowView.getFloat64(0);
    const currentRowUuidSecond = currentRowView.getFloat64(8);
    currentRowUuidFirst === dataRowOperation.operationRecordUuid[0] &&
      currentRowUuidSecond === dataRowOperation.operationRecordUuid[1]
      ? await nextTargetPageFile.write(dataRowOperation.operationRowBytes)
      : await nextTargetPageFile.write(
        new Uint8Array([
          ...currentRowByteSizeBytes,
          ...currentRowBytes,
        ]),
      );
  }
}

interface ReplaceTargetPageWithNextVersionApi extends
  Pick<
    OpenTargetPageFileResult,
    'temporaryTargetPagePath' | 'targetPagePath'
  > {
}

function replaceTargetPageWithNextVersion(
  api: ReplaceTargetPageWithNextVersionApi,
) {
  const { temporaryTargetPagePath, targetPagePath } = api;
  return Deno.rename(temporaryTargetPagePath, targetPagePath);
}

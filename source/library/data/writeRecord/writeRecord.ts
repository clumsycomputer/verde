import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { Path } from '../../../imports/Path.ts';
import { getStoreEffects } from '../../../imports/ReduxSaga.ts';
import { DataSchema, RecordUuid } from '../../schema/types/DataSchema.ts';
import {
  CreateDataRowOperation,
  getDataRowOperations,
  UpdateDataRowOperation,
  WriteDataRowOperation,
} from './getDataRowOperations.ts';
import {
  isShallowWellFormedRecord,
  PagedShallowWellFormedRecord,
} from './isShallowWellFormedRecord.ts';

const { storeEffects } = getStoreEffects();
const call = storeEffects.call;

export interface WriteRecordApi {
  dataPageFinishlineSize: number;
  dataDirectoryPath: string;
  dataSchema: DataSchema;
  dataRecord: Record<string, unknown>;
}

export function* writeRecord(api: WriteRecordApi) {
  const { dataSchema, dataRecord, dataDirectoryPath, dataPageFinishlineSize } =
    api;
  const { dataRowOperations } = getDataRowOperations({
    dataSchema,
    dataRecord,
  });
  const recordPageIndexMapResult: Record<number, Record<number, number>> = {};
  for (const someDataRowOperation of dataRowOperations) {
    const operationPageIndex = yield* call(writeDataRow, {
      dataDirectoryPath,
      dataPageFinishlineSize,
      dataRowOperation: someDataRowOperation,
    });
    const subRecordPageIndexMap =
      recordPageIndexMapResult[someDataRowOperation.operationRecordUuid[0]] ?? {};
    subRecordPageIndexMap[someDataRowOperation.operationRecordUuid[1]] =
      operationPageIndex;
    recordPageIndexMapResult[someDataRowOperation.operationRecordUuid[0]] = 
      subRecordPageIndexMap;
  }
  return getUpdatedPagedRecord({
    dataSchema,
    dataRecord,
    recordPageIndexMap: recordPageIndexMapResult,
  });
}

interface WriteDataRowApi
  extends Pick<WriteRecordApi, 'dataDirectoryPath' | 'dataPageFinishlineSize'> {
  dataRowOperation: WriteDataRowOperation;
}

function* writeDataRow(api: WriteDataRowApi) {
  const { dataPageFinishlineSize, dataDirectoryPath, dataRowOperation } = api;
  const modelDataDirectoryPath = Path.join(
    dataDirectoryPath,
    `./${dataRowOperation.operationModelSymbol}`,
  );
  return dataRowOperation.operationKind === 'create'
    ? yield* call(createDataRow, {
      dataPageFinishlineSize,
      dataRowOperation,
      modelDataDirectoryPath,
    })
    : yield* call(updateDataRow, {
      dataRowOperation,
      modelDataDirectoryPath,
    });
}

interface CreateDataRowApi
  extends Pick<WriteRecordApi, 'dataPageFinishlineSize'> {
  modelDataDirectoryPath: string;
  dataRowOperation: CreateDataRowOperation;
}

function* createDataRow(api: CreateDataRowApi) {
  const { dataPageFinishlineSize, modelDataDirectoryPath, dataRowOperation } =
    api;
  const { modelHeadPageFile, modelHeadPageIndex } = yield* call(
    openModelHeadPageFile,
    {
      dataPageFinishlineSize,
      modelDataDirectoryPath,
    },
  );
  yield* call(appendDataRowToHeadPage, {
    modelHeadPageFile,
    dataRowOperation,
  });
  modelHeadPageFile.close();
  return modelHeadPageIndex;
}

interface OpenModelHeadPageFileApi extends
  Pick<
    CreateDataRowApi,
    'dataPageFinishlineSize' | 'modelDataDirectoryPath'
  > {}

interface OpenModelHeadPageFileResult {
  modelHeadPageIndex: number;
  modelHeadPageFile: Deno.FsFile;
}

async function openModelHeadPageFile(
  api: OpenModelHeadPageFileApi,
): Promise<OpenModelHeadPageFileResult> {
  const { modelDataDirectoryPath, dataPageFinishlineSize } = api;
  const modelDataPageEntries = Array.from(
    Deno.readDirSync(modelDataDirectoryPath),
  );
  const mostRecentHeadModelPageEntry =
    modelDataPageEntries.sort()[modelDataPageEntries.length - 1] ??
      throwInvalidPathError('lastHeadModelPageEntry');
  const mostRecentHeadModelPagePath = Path.join(
    modelDataDirectoryPath,
    mostRecentHeadModelPageEntry.name,
  );
  const lastHeadModelPageStats = await Deno.stat(mostRecentHeadModelPagePath);
  return lastHeadModelPageStats.size < dataPageFinishlineSize
    ? {
      modelHeadPageIndex: modelDataPageEntries.length - 1,
      modelHeadPageFile: await Deno.open(mostRecentHeadModelPagePath, {
        write: true,
        append: true,
      }),
    }
    : {
      modelHeadPageIndex: modelDataPageEntries.length,
      modelHeadPageFile: await openNewHeadPageFile({
        modelDataDirectoryPath,
        nextHeadPageIndex: modelDataPageEntries.length,
      }),
    };
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
  return dataRowOperation.operationPageIndex;
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

interface GetUpdatedPagedRecordApi
  extends Pick<WriteRecordApi, 'dataSchema' | 'dataRecord'> {
  recordPageIndexMap: Record<
    RecordUuid[0],
    Record<RecordUuid[1], PagedShallowWellFormedRecord['__pageIndex']>
  >;
}

function getUpdatedPagedRecord(api: GetUpdatedPagedRecordApi) {
  const { dataSchema, dataRecord, recordPageIndexMap } = api;
  if (false === isShallowWellFormedRecord(dataRecord)) {
    throwUserError('__getDataRowOperations["dataRecord"]');
  }
  const recordModel = dataSchema.schemaMap[dataRecord.__modelSymbol] ??
    throwInvalidPathError('recordModel');
  return Object.values(recordModel.modelProperties).reduce<
    PagedShallowWellFormedRecord
  >(
    (recordResult, someModelProperty) => {
      const recordProperty = dataRecord[someModelProperty.propertyKey];
      recordResult[someModelProperty.propertyKey] =
        someModelProperty.propertyElement.elementKind === 'dataModel'
          ? getUpdatedPagedRecord({
            dataSchema,
            recordPageIndexMap,
            dataRecord: recordProperty as any as Record<string, unknown>,
          })
          : recordProperty;
      return recordResult;
    },
    {
      __status: 'paged',
      __uuid: dataRecord.__uuid,
      __modelSymbol: dataRecord.__modelSymbol,
      __pageIndex:
        recordPageIndexMap[dataRecord.__uuid[0]]![dataRecord.__uuid[1]] ??
          throwInvalidPathError('__pageIndex'),
    } satisfies PagedShallowWellFormedRecord,
  );
}

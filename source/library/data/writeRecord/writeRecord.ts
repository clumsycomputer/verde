import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { FileSystem } from '../../../imports/FileSystem.ts';
import { Path } from '../../../imports/Path.ts';
import { DataSchema } from '../../schema/types/DataSchema.ts';
import {
  isShallowWellFormedRecord,
  ShallowWellFormedRecord,
} from '../helpers/isShallowWellFormedRecord.ts';

export interface WriteRecordApi {
  tableFileResultBufferSize: number;
  dataDirectoryPath: string;
  dataSchema: DataSchema;
  dataRecord: Record<string, unknown>;
}

export async function writeRecord(api: WriteRecordApi) {
  const {
    dataRecord,
    dataDirectoryPath,
    dataSchema,
    tableFileResultBufferSize,
  } = api;
  if (false === isShallowWellFormedRecord(dataRecord)) {
    throwUserError('writeRecord.dataRecord');
  }
  const transactionDirectoryPath = Path.join(
    dataDirectoryPath,
    './__transaction',
  );
  await FileSystem.emptyDir(transactionDirectoryPath);
  const filedRecordResult: Record<string, unknown> = {};
  const rowOperationsQueue: Array<TableRowOperation> = [{
    operationSourceRecord: dataRecord,
    operationFiledRecordResult: filedRecordResult,
  }];
  for (const someTableRowOperation of rowOperationsQueue) {
    await writeTableRow({
      ...someTableRowOperation,
      dataSchema,
      tableFileResultBufferSize,
      transactionDirectoryPath,
      transactionState: {
        rowOperationsQueue,
      },
    });
  }
  await commitRecordTransaction({});
  return filedRecordResult;
}

interface TableRowOperation {
  operationSourceRecord: ShallowWellFormedRecord;
  operationFiledRecordResult: Record<string, unknown>;
}

interface WriteTableRowApi extends
  Pick<
    WriteRecordApi,
    'tableFileResultBufferSize' | 'dataSchema'
  >,
  Pick<
    TableRowOperation,
    'operationSourceRecord' | 'operationFiledRecordResult'
  > {
  transactionDirectoryPath: string;
  transactionState: TransactionState;
}

interface TransactionState {
  rowOperationsQueue: Array<TableRowOperation>;
}

async function writeTableRow(api: WriteTableRowApi) {
  const {
    operationSourceRecord,
    dataSchema,
    tableFileResultBufferSize,
    transactionDirectoryPath,
    operationFiledRecordResult,
  } = api;
  const recordModel =
    dataSchema.schemaMap[operationSourceRecord.__modelSymbol] ??
      throwUserError('recordModel');
  const tableFileBytesResult = new Uint8Array(tableFileResultBufferSize);
  let currentTableFileByteOffset = { value: 0 };
  const { tableFileIndex } = operationSourceRecord.__status === 'new'
    ? await createTableRow()
    : await updateTableRow();
  const transactionTableFilePath = Path.join(
    transactionDirectoryPath,
    `./${recordModel.modelSymbol}__${tableFileIndex}.data`,
  );
  await Deno.writeFile(
    transactionTableFilePath,
    tableFileBytesResult.subarray(currentTableFileByteOffset.value),
    { create: true },
  );
  Object.assign(operationFiledRecordResult, {
    __status: 'filed',
    __fileIndex: tableFileIndex,
  });
}

interface CreateTableRowApi {}

async function createTableRow(api: CreateTableRowApi) {
  const {} = api;
  const { tableHeadIndex } = await retrieveTableHeadIndex({});
  await backfillUnresolvedNewRecordFileIndexByteWindows({});
  await retrieveSourceTableHeadBytes({});
  getNextTableHeadBytes({});
  return {
    tableFileIndex: tableHeadIndex,
  };
}

interface RetrieveTableHeadIndexApi {}

async function retrieveTableHeadIndex(api: RetrieveTableHeadIndexApi) {
  const {} = api;
}

interface BackfillUnresolvedNewRecordFileIndexByteWindowsApi {}

async function backfillUnresolvedNewRecordFileIndexByteWindows(
  api: BackfillUnresolvedNewRecordFileIndexByteWindowsApi,
) {}

interface RetrieveSourceTableHeadBytesApi {}

async function retrieveSourceTableHeadBytes(
  api: RetrieveSourceTableHeadBytesApi,
) {}

interface GetNextTableHeadBytesApi {}

function getNextTableHeadBytes(api: GetNextTableHeadBytesApi) {}

interface StageNextTableHeadApi {}

async function stageNextTableHead(api: StageNextTableHeadApi) {}

async function updateTableRow() {
  await loadSourceTableFileBytes({});
  getNextTableFileBytes({});
  return {
    tableFileIndex: operationSourceRecord.__fileIndex,
  };
}

interface LoadSourceTableFileBytesApi {}

async function loadSourceTableFileBytes(api: LoadSourceTableFileBytesApi) {}

interface GetNextTableFileBytesApi {}

function getNextTableFileBytes(api: GetNextTableFileBytesApi) {}

interface CommitRecordTransactionApi {}

async function commitRecordTransaction(api: CommitRecordTransactionApi) {
  const {} = api;
}

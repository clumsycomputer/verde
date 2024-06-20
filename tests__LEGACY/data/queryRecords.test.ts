import { queryRecords } from '../../source/library/data__LEGACY/queryRecords/queryRecords.ts';
import { Path } from '../imports/Path.ts';
import { dataSchema__EXAMPLE } from './helpers/dataSchema__EXAMPLE.ts';
import { setupTestDatabase } from './helpers/setupTestDatabase.ts';

Deno.test('queryRecords', async (queryRecordsContext) => {
  const queryRecordsTableFileFinishlineSize = 4096;
  const queryRecordsTableFileResultBufferSize = 2 *
    queryRecordsTableFileFinishlineSize;
  const queryRecordsDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__data__queryRecords',
  );
  await setupTestDatabase({
    dataDirectoryPath: queryRecordsDataDirectoryPath,
    dataSchema: dataSchema__EXAMPLE,
  });
  await queryRecords({
    dataQuery: {
      queryFilter: {
        filterKind: 'model',
        filterModelSymbol: 'TODO',
        filterCondition: {
          todo
        }
      },
      querySort: {
        sortKind: 'basicProperty',
        sortOrder: 'ascending',
        sortPropertyKey: 'todo'
      }
    },
  });
  await queryRecordsContext.step('filtering', () => {});
  await queryRecordsContext.step('sorting', async (sortingContext) => {
    await sortingContext.step('primitive / literal property', () => {});
    await sortingContext.step('data model property', () => {});
    await sortingContext.step('multiple properties', () => {});
    await sortingContext.step('arbitrary grouping', () => {});
    // await sortingContext.step('nested sorting', () => {})
    await sortingContext.step('existence in set / array', () => {});
  });
});

import {
  getEncodedString,
} from '../../source/library/data/helpers/getEncodedData.ts';
import { FiledShallowWellFormedRecord } from '../../source/library/data/helpers/isShallowWellFormedRecord.ts';
import { writeRecord } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { setupTestDatabase } from './helpers/setupTestDatabase.ts';
import {
  createDataModelPropertyRecord,
  createTopLevelRecord,
} from './helpers/testSchema.ts';
import { testSchema } from './helpers/testSchema.ts';

Deno.test('writeRecord', async (aaa) => {
  const testDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__writeRecord',
  );
  await setupTestDatabase({
    testDataDirectoryPath,
    dataSchema: testSchema,
  });
  const inputRecordAaa = createTopLevelRecord({
    dataModelProperty__EXAMPLE: createDataModelPropertyRecord({}),
  });
  const resultRecordAaa = await writeRecord({
    dataSchema: testSchema,
    dataDirectoryPath: testDataDirectoryPath,
    tableFileResultBufferSize: 2 * 4096,
    tableFileFinishlineSize: 4096,
    dataRecord: inputRecordAaa,
  });
  const topLevelFileBytesAaa = await Deno.readFile(
    Path.join(
      testDataDirectoryPath,
      `./${resultRecordAaa.__modelSymbol}/${resultRecordAaa.__fileIndex}.data`,
    ),
  );
  const topLevelFileViewAaa = new DataView(topLevelFileBytesAaa.buffer);
  const dataModelPropertyFileBytesAaa = await Deno.readFile(
    Path.join(
      testDataDirectoryPath,
      `./${
        (resultRecordAaa[
          'dataModelProperty__EXAMPLE'
        ] as FiledShallowWellFormedRecord).__modelSymbol
      }/${resultRecordAaa.__fileIndex}.data`,
    ),
  );
  const dataModelPropertyFileViewAaa = new DataView(
    dataModelPropertyFileBytesAaa.buffer,
  );
  await aaa.step('result record', () => {
    const {
      __status: __inputStatus,
      dataModelProperty__EXAMPLE: inputDataModelProperty__EXAMPLE,
      ...inputCopiedTopLevelProperties
    } = inputRecordAaa;
    const {
      __status: __inputDataModelPropertyStatus,
      ...inputCopiedDataModelPropertyProperties
    } = inputDataModelProperty__EXAMPLE;
    const {
      __status: __resultStatus,
      __fileIndex: __resultFileIndex,
      dataModelProperty__EXAMPLE: resultDataModelProperty__EXAMPLE,
      ...resultCopiedTopLevelProperties
    } = resultRecordAaa;
    const {
      __status: __resultDataModelPropertyStatus,
      __fileIndex: __resultDataModelPropertyFileIndex,
      ...resultCopiedDataModelPropertyProperties
    } = resultDataModelProperty__EXAMPLE as FiledShallowWellFormedRecord;
    Assert.assertEquals(__resultStatus, 'filed');
    Assert.assertEquals(__resultDataModelPropertyStatus, 'filed');
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(4),
      resultRecordAaa.__uuid[0],
    );
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(12),
      resultRecordAaa.__uuid[1],
    );
    Assert.assertEquals(
      dataModelPropertyFileViewAaa.getFloat64(4),
      (resultRecordAaa[
        'dataModelProperty__EXAMPLE'
      ] as FiledShallowWellFormedRecord).__uuid[0],
    );
    Assert.assertEquals(
      dataModelPropertyFileViewAaa.getFloat64(12),
      (resultRecordAaa[
        'dataModelProperty__EXAMPLE'
      ] as FiledShallowWellFormedRecord).__uuid[1],
    );
    Assert.assertEquals(
      inputCopiedTopLevelProperties,
      resultCopiedTopLevelProperties,
    );
    Assert.assertEquals(
      inputCopiedDataModelPropertyProperties,
      resultCopiedDataModelPropertyProperties,
    );
  });
  await aaa.step('record row encoding', () => {
    const recordModel = testSchema.schemaMap[resultRecordAaa.__modelSymbol]!;
    let resultRecordByteOffset = 0;
    const resultRecordByteSize = topLevelFileViewAaa.getInt32(
      resultRecordByteOffset,
    );
    resultRecordByteOffset += 4;
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(resultRecordByteOffset),
      resultRecordAaa.__uuid[0],
    );
    resultRecordByteOffset += 8;
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(resultRecordByteOffset),
      resultRecordAaa.__uuid[1],
    );
    resultRecordByteOffset += 8;
    Assert.assertEquals(
      Boolean(topLevelFileViewAaa.getUint8(resultRecordByteOffset)),
      resultRecordAaa['booleanProperty__EXAMPLE'],
    );
    resultRecordByteOffset += 1;
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(resultRecordByteOffset),
      resultRecordAaa['numberProperty__EXAMPLE'],
    );
    resultRecordByteOffset += 8;
    const encodedStringProperty__EXAMPLE = getEncodedString({
      someString: resultRecordAaa['stringProperty__EXAMPLE'] as string,
    });
    Assert.assertEquals(
      topLevelFileViewAaa.getUint32(resultRecordByteOffset),
      encodedStringProperty__EXAMPLE.length,
    );
    resultRecordByteOffset += 4;
    Assert.assertEquals(
      topLevelFileBytesAaa.subarray(
        resultRecordByteOffset,
        resultRecordByteOffset + encodedStringProperty__EXAMPLE.length,
      ),
      encodedStringProperty__EXAMPLE,
    );
    resultRecordByteOffset += encodedStringProperty__EXAMPLE.length;
    Assert.assertEquals(
      topLevelFileViewAaa.getUint32(resultRecordByteOffset),
      (resultRecordAaa[
        'dataModelProperty__EXAMPLE'
      ] as FiledShallowWellFormedRecord).__fileIndex,
    );
    resultRecordByteOffset += 4;
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(resultRecordByteOffset),
      (resultRecordAaa[
        'dataModelProperty__EXAMPLE'
      ] as FiledShallowWellFormedRecord).__uuid[0],
    );
    resultRecordByteOffset += 8;
    Assert.assertEquals(
      topLevelFileViewAaa.getFloat64(resultRecordByteOffset),
      (resultRecordAaa[
        'dataModelProperty__EXAMPLE'
      ] as FiledShallowWellFormedRecord).__uuid[1],
    );
    resultRecordByteOffset += 8;
    Assert.assertEquals(
      topLevelFileViewAaa.getUint8(resultRecordByteOffset),
      10,
    );
    resultRecordByteOffset += 1;
    Assert.assertEquals(resultRecordByteSize, resultRecordByteOffset - 4);
  });
  // await aaa.step('general', () => {})
  // await aaa.step('input', async (bbb) => {
  //   await bbb.step('basic new record', () => {})
  //   await bbb.step('basic filed record', () => {})
  //   await bbb.step('filed record', () => {})
  // })

  // await aaa.step('output', async (bbb) => {
  //   await bbb.step('data directory', async (ccc) => {
  //     await ccc.step('model / table directory', async (ddd) => {
  //       await ddd.step('table file', async (eee) => {
  //         await eee.step('file encoding', async (fff) => {
  //           await fff.step('table row', async (ggg) => {
  //             await ggg.step('row byte size', () => {});
  //             await ggg.step('record identifier', () => {});
  //             await ggg.step('record properties', async (hhh) => {
  //               await hhh.step('boolean primitive', () => {});
  //               await hhh.step('number primitive', () => {});
  //               await hhh.step('string primitive', async (iii) => {
  //                 await iii.step('string byte size', () => {});
  //                 await iii.step('string characters', () => {});
  //               });
  //               await hhh.step('data model', async (iii) => {
  //                 await iii.step('page index', () => {});
  //                 await iii.step('record identifier', () => {});
  //               });
  //             });
  //             await ggg.step('end of row', () => {});
  //           });
  //         });
  //       });
  //     });
  //   });
  // });

  // await aaa.step('writeRecord', async (bbb) => {
  //   // await bbb.step('assert shallowWellFormedRecord', () => {})
  //   // await bbb.step('setup transaction cache directory', () => {})
  //   // await bbb.step('initialize pending transaction records', () => {})
  //   // await bbb.step('iterate over data row operation', () => {})
  //   // await bbb.step('rename files in transaction cache to corresponding source files', () => {})
  //   // await bbb.step('return updated data record', () => {})
  // })
  // await aaa.step('writeTableRow', async (bbb) => {
  //   await bbb.step('calculate table / model directory path', () => {})
  //   await bbb.step('if new record then create table row', () => {})
  //   await bbb.step('else if filed record then update table row', () => {})
  // })
  // await aaa.step('createTableRow', async (bbb) => {
  //   await bbb.step('retrieve table head page index for row', async (ccc) => {
  //     await ccc.step('retrieve current table head page index', async (ddd) => {
  //       await ddd.step('check table head page index cache', () => {});
  //       await ddd.step(
  //         'if not cached then calculate from model / table directory',
  //         () => {},
  //       );
  //     });
  //     await ccc.step('calculate table head page index for current new table row', async (ddd) => {
  //       await ddd.step('return current page index if space available', () => {});
  //       await ddd.step('if current page full then return current table head page index plus one', () => {});
  //     });
  //     await ccc.step('update table head page index cache', () => {});
  //   })
  //   await bbb.step(
  //     'backfill unresolved page index byte windows waiting for its page index resolution',
  //     async (ccc) => {
  //       await ccc.step(
  //         'calculates page index byte window offset',
  //         () => {
  //           // unable to reliably use a cached version of pageIndexByteWindowOffset
  //           // from time of registration because of possible updates to the table file that
  //           // happened between time of registration and resolution, which were due to rows
  //           // located in the same file and preempt the target row with the unresolved byte window
  //         },
  //       );
  //     },
  //   );
  //   await bbb.step('retrieve current / stale table head page bytes', async (ccc) => {
  //     await ccc.step('if cached read and return', () => {})
  //     await ccc.step('else if preexisting file exists then read and return', () => {})
  //     await ccc.step('else return empty uint8array', () => {})
  //   });
  //   await bbb.step('make next version of table head page', async (ccc) => {
  //     await ccc.step('initialize new table file buffer with size of tableFileResultBufferSize', () => {})
  //     await ccc.step('prepend existing table file bytes',() => {})
  //     await ccc.step('append new row bytes', () => {})
  //   });
  //   await bbb.step('update table file cache with next version', async (ccc) => {
  //     await ccc.step('truncate empty bytes from next version with subarray', () => {})
  //   });
  // });
  // await aaa.step('updateTableRow', async (bbb) => {
  //   await bbb.step('retrieve current / stale table file bytes', async (ccc) => {
  //     await ccc.step('if cached read and return', () => {})
  //     await ccc.step('else read preexisting file and return', () => {})
  //   });
  //   await bbb.step('make next version of table head page', async (ccc) => {
  //     await ccc.step('initialize new table file buffer with size of tableFileResultBufferSize', () => {})
  //     await ccc.step('iterate over table rows in current / stable table file bytes', async (ddd) => {
  //       await ddd.step('if target row apply updated bytes', () => {})
  //       await ddd.step('else apply existing row bytes', () => {})
  //     })
  //   });
  //   await bbb.step('update table file cache with next version', async (ccc) => {
  //     await ccc.step('truncate empty bytes from next version with subarray', () => {})
  //   });
  // });
  // await aaa.step('applyTableRowBytes', async (bbb) => {
  //   await bbb.step('data model property', async (ccc) => {
  //     await ccc.step('unresolved new record', async () => {});
  //     await ccc.step('resolved new record', async () => {});
  //     await ccc.step('unresolved filed record', async () => {});
  //     await ccc.step('resolved filed record', async () => {});
  //   });
  // });
});

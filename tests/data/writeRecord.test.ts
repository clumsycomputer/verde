import {
  getEncodedString,
} from '../../source/library/data/helpers/getEncodedData.ts';
import { writeRecord } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { setupTestDatabase } from './helpers/setupTestDatabase.ts';
import {
  createDataModelPropertyRecord,
  createTopLevelRecord,
  TopLevelPropertyModelRecord,
} from './helpers/dataSchema__EXAMPLE.ts';
import { dataSchema__EXAMPLE } from './helpers/dataSchema__EXAMPLE.ts';
import { FiledShallowWellFormedRecord } from '../../source/library/data/helpers/isShallowWellFormedRecord.ts';

Deno.test('writeRecord', async (writeRecordContext) => {
  const writeRecordTableFileFinishlineSize = 4096;
  const writeRecordTableFileResultBufferSize = 2 *
    writeRecordTableFileFinishlineSize;
  const writeRecordDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__data__writeRecord',
  );
  await setupTestDatabase({
    dataDirectoryPath: writeRecordDataDirectoryPath,
    dataSchema: dataSchema__EXAMPLE,
  });
  const inputRecord__AAA = createTopLevelRecord({
    booleanProperty__EXAMPLE: true,
    numberProperty__EXAMPLE: 1,
    stringProperty__EXAMPLE: 'howdy',
    dataModelProperty__EXAMPLE: createDataModelPropertyRecord({
      parentModelProperty__EXAMPLE: null as any,
    }),
  });
  inputRecord__AAA.dataModelProperty__EXAMPLE.parentModelProperty__EXAMPLE =
    inputRecord__AAA;
  const inputRecordModel__AAA = dataSchema__EXAMPLE
    .schemaMap[inputRecord__AAA.__modelSymbol]!;
  const outputRecord__AAA = await writeRecord({
    dataSchema: dataSchema__EXAMPLE,
    tableFileFinishlineSize: writeRecordTableFileFinishlineSize,
    tableFileResultBufferSize: writeRecordTableFileResultBufferSize,
    dataDirectoryPath: writeRecordDataDirectoryPath,
    dataRecord: inputRecord__AAA,
  });
  const outputDataModelPropertyRecord__AAA = outputRecord__AAA
    .dataModelProperty__EXAMPLE as FiledShallowWellFormedRecord;
  const outputParentModelPropertyRecord__AAA =
    outputDataModelPropertyRecord__AAA
      .parentModelProperty__EXAMPLE as FiledShallowWellFormedRecord;
  const topLevelTableFileBytes__AAA = await Deno.readFile(
    Path.join(
      writeRecordDataDirectoryPath,
      `./${outputRecord__AAA.__modelSymbol}/${outputRecord__AAA.__fileIndex}.data`,
    ),
  );
  const topLevelRowByteSize__AAA = new DataView(
    topLevelTableFileBytes__AAA.buffer,
  ).getUint32(0);
  const topLevelRowBytes__AAA = topLevelTableFileBytes__AAA.subarray(
    4,
    4 + topLevelRowByteSize__AAA,
  );
  const topLevelRowView__AAA = new DataView(
    topLevelRowBytes__AAA.buffer,
    topLevelRowBytes__AAA.byteOffset,
  );
  const dataModelPropertyTableFileBytes__AAA = await Deno.readFile(
    Path.join(
      writeRecordDataDirectoryPath,
      `./${outputDataModelPropertyRecord__AAA.__modelSymbol}/${outputDataModelPropertyRecord__AAA.__fileIndex}.data`,
    ),
  );
  const dataModelPropertyRowByteSize__AAA = new DataView(
    dataModelPropertyTableFileBytes__AAA.buffer,
  ).getUint32(0);
  const dataModelPropertyRowBytes__AAA = dataModelPropertyTableFileBytes__AAA
    .subarray(
      4,
      4 + dataModelPropertyRowByteSize__AAA,
    );
  const dataModelPropertyRowView__AAA = new DataView(
    dataModelPropertyRowBytes__AAA.buffer,
    dataModelPropertyRowBytes__AAA.byteOffset,
  );
  const updatedInputRecord__AAA = {
    ...outputRecord__AAA,
    stringProperty__EXAMPLE: 'rowdy',
  } as Exclude<TopLevelPropertyModelRecord, { __status: 'new' }>;
  const outputRecord__BBB = await writeRecord({
    dataSchema: dataSchema__EXAMPLE,
    tableFileFinishlineSize: writeRecordTableFileFinishlineSize,
    tableFileResultBufferSize: writeRecordTableFileResultBufferSize,
    dataDirectoryPath: writeRecordDataDirectoryPath,
    dataRecord: updatedInputRecord__AAA,
  });
  const outputDataModelPropertyRecord__BBB = outputRecord__BBB
    .dataModelProperty__EXAMPLE as FiledShallowWellFormedRecord;
  const outputParentModelPropertyRecord__BBB =
    outputDataModelPropertyRecord__BBB
      .parentModelProperty__EXAMPLE as FiledShallowWellFormedRecord;
  const topLevelTableFileBytes__BBB = await Deno.readFile(
    Path.join(
      writeRecordDataDirectoryPath,
      `./${outputRecord__BBB.__modelSymbol}/${outputRecord__BBB.__fileIndex}.data`,
    ),
  );
  const topLevelRowByteSize__BBB = new DataView(
    topLevelTableFileBytes__BBB.buffer,
  ).getUint32(0);
  const topLevelRowBytes__BBB = topLevelTableFileBytes__BBB.subarray(
    4,
    4 + topLevelRowByteSize__BBB,
  );
  const topLevelRowView__BBB = new DataView(
    topLevelRowBytes__BBB.buffer,
    topLevelRowBytes__BBB.byteOffset,
  );
  const dataModelPropertyTableFileBytes__BBB = await Deno.readFile(
    Path.join(
      writeRecordDataDirectoryPath,
      `./${outputDataModelPropertyRecord__BBB.__modelSymbol}/${outputDataModelPropertyRecord__BBB.__fileIndex}.data`,
    ),
  );
  const dataModelPropertyRowByteSize__BBB = new DataView(
    dataModelPropertyTableFileBytes__BBB.buffer,
  ).getUint32(0);
  const dataModelPropertyRowBytes__BBB = dataModelPropertyTableFileBytes__BBB
    .subarray(
      4,
      4 + dataModelPropertyRowByteSize__BBB,
    );
  const dataModelPropertyRowView__BBB = new DataView(
    dataModelPropertyRowBytes__BBB.buffer,
    dataModelPropertyRowBytes__BBB.byteOffset,
  );
  await writeRecordContext.step(
    'internal row data',
    async (internalRowDataContext) => {
      const firstTopLevelTableRowByteSize = new DataView(
        topLevelTableFileBytes__AAA.buffer,
      ).getUint32(0);
      const firstTopLevelTableRowView = new DataView(
        topLevelTableFileBytes__AAA.subarray(
          4,
          4 + firstTopLevelTableRowByteSize,
        )
          .buffer,
        4,
      );
      await internalRowDataContext.step('row byte size', () => {
        Assert.assertEquals(
          firstTopLevelTableRowView.getUint8(firstTopLevelTableRowByteSize - 1),
          10,
        );
      });
      await internalRowDataContext.step('row terminator', () => {
        Assert.assertEquals(
          firstTopLevelTableRowView.getUint8(firstTopLevelTableRowByteSize - 1),
          new TextEncoder().encode('\n')[0],
        );
      });
    },
  );
  await writeRecordContext.step(
    'record metadata',
    async (recordMetadataContext) => {
      await recordMetadataContext.step('__modelSymbol', () => {
        Assert.assertExists(
          dataSchema__EXAMPLE.schemaMap[inputRecord__AAA.__modelSymbol],
        );
        Assert.assertEquals(
          outputRecord__AAA.__modelSymbol,
          inputRecord__AAA.__modelSymbol,
        );
      });
      await recordMetadataContext.step('__uuid', () => {
        Assert.assert(
          inputRecord__AAA.__uuid instanceof Array &&
            inputRecord__AAA.__uuid.length === 2 &&
            typeof inputRecord__AAA.__uuid[0] === 'number' &&
            typeof inputRecord__AAA.__uuid[1] === 'number',
        );
        Assert.assertEquals(
          outputRecord__AAA.__uuid,
          inputRecord__AAA.__uuid,
        );
        Assert.assertEquals(
          topLevelRowView__AAA.getFloat64(0),
          outputRecord__AAA.__uuid[0],
        );
        Assert.assertEquals(
          topLevelRowView__AAA.getFloat64(8),
          outputRecord__AAA.__uuid[1],
        );
      });
      await recordMetadataContext.step(
        '__status',
        async (__statusContext) => {
          await __statusContext.step('new', () => {
            Assert.assertEquals(inputRecord__AAA.__status, 'new');
            Assert.assertEquals(outputRecord__AAA.__status, 'filed');
            Assert.assertEquals(outputRecord__AAA.__fileIndex, 0);
          });
          await __statusContext.step('filed', async (filedContext) => {
            Assert.assertEquals(updatedInputRecord__AAA.__status, 'filed');
            Assert.assertEquals(
              outputRecord__BBB.__status,
              updatedInputRecord__AAA.__status,
            );
            await filedContext.step('__fileIndex', () => {
              Assert.assertEquals(
                typeof updatedInputRecord__AAA.__fileIndex,
                'number',
              );
              Assert.assertEquals(
                outputRecord__BBB.__fileIndex,
                updatedInputRecord__AAA.__fileIndex,
              );
              // todo: assert updateInputRecord exists in specified table file before writing update
              // todo: assert outputRecord__BBB exists in specified table file after writing update
            });
          });
        },
      );
    },
  );
  await writeRecordContext.step(
    'record properties',
    async (recordPropertiesContext) => {
      await recordPropertiesContext.step('boolean literal', () => {
        const booleanLiteralModelProperty = inputRecordModel__AAA
          .modelProperties['booleanLiteralProperty__EXAMPLE']!;
        Assert.assert(
          booleanLiteralModelProperty.propertyElement.elementKind ===
              'booleanLiteral' &&
            Boolean(
                booleanLiteralModelProperty.propertyElement.literalSymbol,
              ) === inputRecord__AAA.booleanLiteralProperty__EXAMPLE,
        );
        Assert.assertEquals(
          outputRecord__AAA.booleanLiteralProperty__EXAMPLE,
          inputRecord__AAA.booleanLiteralProperty__EXAMPLE,
        );
      });
      await recordPropertiesContext.step('number literal', () => {
        const numberLiteralModelProperty = inputRecordModel__AAA
          .modelProperties['numberLiteralProperty__EXAMPLE']!;
        Assert.assert(
          numberLiteralModelProperty.propertyElement.elementKind ===
              'numberLiteral' &&
            Number(
                numberLiteralModelProperty.propertyElement.literalSymbol,
              ) === inputRecord__AAA.numberLiteralProperty__EXAMPLE,
        );
        Assert.assertEquals(
          outputRecord__AAA.numberLiteralProperty__EXAMPLE,
          inputRecord__AAA.numberLiteralProperty__EXAMPLE,
        );
      });
      await recordPropertiesContext.step('string literal', () => {
        const stringLiteralModelProperty = inputRecordModel__AAA
          .modelProperties['stringLiteralProperty__EXAMPLE']!;
        Assert.assert(
          stringLiteralModelProperty.propertyElement.elementKind ===
              'stringLiteral' &&
            stringLiteralModelProperty
                .propertyElement.literalSymbol
                .slice(1, -1) ===
              inputRecord__AAA.stringLiteralProperty__EXAMPLE,
        );
        Assert.assertEquals(
          outputRecord__AAA.stringLiteralProperty__EXAMPLE,
          inputRecord__AAA.stringLiteralProperty__EXAMPLE,
        );
      });
      await recordPropertiesContext.step('boolean primitive', () => {
        Assert.assertEquals(
          inputRecordModel__AAA
            .modelProperties['booleanProperty__EXAMPLE']!.propertyElement
            .elementKind,
          'booleanPrimitive',
        );
        Assert.assertEquals(
          typeof inputRecord__AAA.booleanProperty__EXAMPLE,
          'boolean',
        );
        Assert.assertEquals(
          outputRecord__AAA.booleanProperty__EXAMPLE,
          inputRecord__AAA.booleanProperty__EXAMPLE,
        );
        Assert.assertEquals(
          Boolean(topLevelRowView__AAA.getUint8(16)),
          outputRecord__AAA.booleanProperty__EXAMPLE,
        );
      });
      await recordPropertiesContext.step('number primitive', () => {
        Assert.assertEquals(
          inputRecordModel__AAA
            .modelProperties['numberProperty__EXAMPLE']!.propertyElement
            .elementKind,
          'numberPrimitive',
        );
        Assert.assertEquals(
          typeof inputRecord__AAA.numberProperty__EXAMPLE,
          'number',
        );
        Assert.assertEquals(
          outputRecord__AAA.numberProperty__EXAMPLE,
          inputRecord__AAA.numberProperty__EXAMPLE,
        );
        Assert.assertEquals(
          topLevelRowView__AAA.getFloat64(17),
          outputRecord__AAA.numberProperty__EXAMPLE,
        );
      });
      await recordPropertiesContext.step('string primitive', () => {
        Assert.assertEquals(
          inputRecordModel__AAA
            .modelProperties['stringProperty__EXAMPLE']!.propertyElement
            .elementKind,
          'stringPrimitive',
        );
        Assert.assertEquals(
          typeof inputRecord__AAA.stringProperty__EXAMPLE,
          'string',
        );
        Assert.assertEquals(
          outputRecord__AAA.stringProperty__EXAMPLE,
          inputRecord__AAA.stringProperty__EXAMPLE,
        );
        const expectedEncodedString = getEncodedString({
          someString: outputRecord__AAA.stringProperty__EXAMPLE as string,
        });
        Assert.assertEquals(
          topLevelRowView__AAA.getUint32(25),
          expectedEncodedString.length,
        );
        Assert.assertEquals(
          topLevelRowBytes__AAA.subarray(
            29,
            29 + expectedEncodedString.length,
          ),
          expectedEncodedString,
        );
      });
      await recordPropertiesContext.step(
        'data model',
        async (dataModelContext) => {
          Assert.assertEquals(
            inputRecordModel__AAA
              .modelProperties['dataModelProperty__EXAMPLE']!.propertyElement
              .elementKind,
            'dataModel',
          );
          await dataModelContext.step('new unresolved record', () => {
            Assert.assertEquals(
              inputRecord__AAA.dataModelProperty__EXAMPLE.__status,
              'new',
            );
            Assert.assertEquals(
              outputDataModelPropertyRecord__AAA.__status,
              'filed',
            );
            Assert.assertEquals(
              outputDataModelPropertyRecord__AAA.__fileIndex,
              0,
            );
            Assert.assertEquals(
              topLevelRowView__AAA.getUint32(34),
              outputDataModelPropertyRecord__AAA.__fileIndex,
            );
            Assert.assertEquals(
              topLevelRowView__AAA.getFloat64(38),
              outputDataModelPropertyRecord__AAA.__uuid[0],
            );
            Assert.assertEquals(
              topLevelRowView__AAA.getFloat64(46),
              outputDataModelPropertyRecord__AAA.__uuid[1],
            );
          });
          await dataModelContext.step('new resolved record', () => {
            Assert.assert(
              inputRecord__AAA.__uuid[0] ===
                inputRecord__AAA.dataModelProperty__EXAMPLE
                  .parentModelProperty__EXAMPLE.__uuid[0] && inputRecord__AAA.__uuid[1] ===
                  inputRecord__AAA.dataModelProperty__EXAMPLE
                    .parentModelProperty__EXAMPLE.__uuid[1],
            );
            Assert.assertEquals(inputRecord__AAA.__status, 'new');
            Assert.assert(
              outputRecord__AAA === outputParentModelPropertyRecord__AAA,
            );
            Assert.assertEquals(outputRecord__AAA.__status, 'filed');
            Assert.assertEquals(outputRecord__AAA.__fileIndex, 0);
            Assert.assertEquals(
              dataModelPropertyRowView__AAA.getUint32(16),
              outputRecord__AAA.__fileIndex,
            );
            Assert.assertEquals(
              dataModelPropertyRowView__AAA.getFloat64(20),
              outputRecord__AAA.__uuid[0],
            );
            Assert.assertEquals(
              dataModelPropertyRowView__AAA.getFloat64(28),
              outputRecord__AAA.__uuid[1],
            );
          });
          await dataModelContext.step('filed unresolved record', () => {
            Assert.assert(
              updatedInputRecord__AAA.dataModelProperty__EXAMPLE.__status ===
                  'filed' &&
                updatedInputRecord__AAA.dataModelProperty__EXAMPLE
                    .__fileIndex ===
                  outputDataModelPropertyRecord__AAA.__fileIndex,
            );
            Assert.assertEquals(
              outputDataModelPropertyRecord__BBB.__status,
              updatedInputRecord__AAA.dataModelProperty__EXAMPLE.__status,
            );
            Assert.assertEquals(
              outputDataModelPropertyRecord__BBB.__fileIndex,
              updatedInputRecord__AAA.__fileIndex,
            );
            Assert.assertEquals(
              topLevelRowView__BBB.getUint32(34),
              outputDataModelPropertyRecord__BBB.__fileIndex,
            );
            Assert.assertEquals(
              topLevelRowView__BBB.getFloat64(38),
              outputDataModelPropertyRecord__BBB.__uuid[0],
            );
            Assert.assertEquals(
              topLevelRowView__BBB.getFloat64(46),
              outputDataModelPropertyRecord__BBB.__uuid[1],
            );
          });
          await dataModelContext.step('filed resolved record', () => {
            Assert.assert(
              updatedInputRecord__AAA.__uuid[0] ===
                updatedInputRecord__AAA.dataModelProperty__EXAMPLE
                  .parentModelProperty__EXAMPLE.__uuid[0] && updatedInputRecord__AAA.__uuid[1] ===
                  updatedInputRecord__AAA.dataModelProperty__EXAMPLE
                    .parentModelProperty__EXAMPLE.__uuid[1],
            );
            Assert.assertEquals(updatedInputRecord__AAA.__status, 'filed');
            Assert.assert(
              outputRecord__BBB === outputParentModelPropertyRecord__BBB,
            );
            Assert.assertEquals(
              outputRecord__BBB.__status,
              updatedInputRecord__AAA.__status,
            );
            Assert.assertEquals(
              outputRecord__BBB.__fileIndex,
              updatedInputRecord__AAA.__fileIndex,
            );
            Assert.assertEquals(
              dataModelPropertyRowView__BBB.getUint32(16),
              outputRecord__BBB.__fileIndex,
            );
            Assert.assertEquals(
              dataModelPropertyRowView__BBB.getFloat64(20),
              outputRecord__BBB.__uuid[0],
            );
            Assert.assertEquals(
              dataModelPropertyRowView__BBB.getFloat64(28),
              outputRecord__BBB.__uuid[1],
            );
          });
        },
      );
    },
  );
});

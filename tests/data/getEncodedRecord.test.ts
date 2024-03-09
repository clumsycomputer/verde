import { getEncodedRecord } from '../../source/library/data/getEncodedRecord.ts';

Deno.test('getEncodedRecord', async (testContext) => {
  console.log(new TextEncoder().encode(`\\`))
  console.log(new TextEncoder().encode(`n`))
  console.log(new TextEncoder().encode(`\n`))
  const fooAaa = new Uint8Array(1)
  fooAaa[0] = 92
  console.log(new TextDecoder().decode(fooAaa))
  const fooBbb = new Uint8Array(1)
  fooBbb[0] = 110
  console.log(new TextDecoder().decode(fooBbb))
  const fooCcc = new Uint8Array(1)
  fooCcc[0] = 10
  console.log(new TextDecoder().decode(fooCcc))
  const fooDdd = new Uint8Array(2)
  fooDdd[0] = 92
  fooDdd[1] = 110
  console.log(new TextDecoder().decode(fooDdd))
  console.log(new TextEncoder().encode(new TextDecoder().decode(fooDdd)))
  console.log(new TextEncoder().encode("\\n"))
  // getEncodedRecord({
  //   recordModel: {
      
  //   },
  //   recordData: {

  //   }
  // })
});

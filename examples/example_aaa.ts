
runExample__AAA()

async function runExample__AAA() {
  await writeCommit({
    commitEncodedData: encodeCommit({
      commitEncoderSchema: {},
      commitRecord: createExampleUser({
        username: 'billy_bob',
        email: {
          emailName: 'billythebob',
          emailDomain: 'gmail.com'
        }
      })
    })
  })
  await queryRecords({
    dataDecoderSchema: {},
    dataQuery: {}
  })
}
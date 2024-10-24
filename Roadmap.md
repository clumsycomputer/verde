## client api

### commitData

- single entry point for commiting created, updated, and deleted records

- should batch sequence be a thing ??? (not for first iteration)

- decomposes data into row byte operations (encoded???)

  - encoding property values client sided performs a level of validation/verification and minimizes deocding and then reencoding on the server (does the server need to perform validation on field values, or put differently can the client run all necessary property value validations)

- sends decomposed row data to server for writing to table file

- row data can't be entire encoded byte row, because updates might be partial

- todo figure out shape / encoding of commit data request body

  - want to encode property values on the client-side as a form of validation

  - trying to think through i want to pass json or custom byte encoding across the wire

  - im leaning towards custom encoding, especially will pay off on larger payloads

  - json types dont necessarily align with our use-case (one example, passing raw bytes as a keys value)

#### create

- all metadata (__uuid, __modelSymbol, __status) needs be created on the client-side and provided to server

- requires fully-formed record

#### updates

- all metadata needs to be provided to server

- partially-formed records with just updates (properties that aren't changing dont need to be provided, but can be)

  - when property is VerdeArray, entire array needs to be specified

  - when property is VerdeTable, only updated entries need to be provided

    - entries can be a create, update, delete, or removal

      - to remove an entry without deleting it, assign null (??? not sure null would be valid) instead of undefined

#### deletions

- { [record.__uuid]: undefined }

#### examples

```typescript
interface User {
  firstName: string;
  lastName: string;
  email: {
    emailName: string;
    emailDomain: string;
  }
}

const newUser = createUser({
  firstName: 'Bob',
  lastName: 'Todd',
  email: 'bob.todd@gmail.com'
})

await commitData({
  dataEncodingSchema: <dataSchema>,
  dataRecord: newUser
})
```

#### EncodingDataSchema

- just need DataModels

- flatten solidified template heirarchy into DataModel

### queryData

- a `dataQuery` has two main types of filters/operations, model-level and value-level

  - model-level operations include `AND`, `OR`, `MODEL`

  - property-level operations depend on type

    - booleanLiteral:

    - numberLiteral:

    - stringLiteral: `ALL`, `EQUALS`, `OR`, `NOT`

    - boolean: `ALL`, `EQUALS`

    - number: `ALL`, `EQUALS`, `GREATER_THAN`, `LESSER_THAN`, `RANGE`

    - string: `ALL`, `EQUALS`, `OR`

    - object: 

    - tuple:

    - general union:

    - VerdeArray:

      - VerdeArrayUnionElement

    - VerdeTable:

      - VerdeTableUnionElement

    - DataModel: 



  - trying to figure out `NOT` operations for both model and value

  - thinking about as a possible future feature enable high-level string functions like startsWith, endsWith, contains, .etc

- to include / query properties include them in `queryProperties` for `MODEL`, if the value doesn't have constraints make it a `ALL`

```typescript
await queryData({
  dataDecodingSchema: <dataSchema>,
  dataQuery: {
    queryKind: 'AND',
    querySubOperations: [
      {
        queryKind: 'MODEL',
        queryModel: 'User',
        queryProperties: {
          firstName: '*',
          lastName: '*',
          email: {
            emailName: '*',
            emailDomain: 'gmail.com'
          }
        }
      }
    ]
  }
})
```

#### DecodingDataSchema

- need all models

- each template model needs map of data models and then a map of direct extenders

- each data model needs map of flattened template model heirarchy

- each model needs to flatten its underlying template heirarchy (solidified???)

??? do decoding models need map/s of underlying templates
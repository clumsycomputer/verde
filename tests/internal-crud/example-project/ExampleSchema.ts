export type ExampleSchema = [ExamplePerson]

interface ExamplePerson {
  personName: string
  personBirthYear: number
  personVerified: boolean
  // personLocation: ExampleLocation
}

// interface ExampleLocation {
//   locationCountry: string
//   locationCity: string
// }
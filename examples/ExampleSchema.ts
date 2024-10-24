
export type ExampleSchema = ExampleUser;

interface ExampleUser {
  username: string;
  email: {
    emailName: string;
    emailDomain: string;
  }
}

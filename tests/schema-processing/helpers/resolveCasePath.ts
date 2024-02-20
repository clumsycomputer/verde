import { Path} from '../../imports/Path.ts'

export interface ResolveCasePathApi {
  someCaseName: string
}

export function resolveCasePath(api: ResolveCasePathApi) {
  const {someCaseName} = api
  const thisFilePath = Path.fromFileUrl(import.meta.url)
  const thisDirectoryPath = Path.dirname(thisFilePath)
  const testsDirectoryPath = Path.join(thisDirectoryPath, '../');
  return Path.join(testsDirectoryPath, `./cases/${someCaseName}.ts`)
}
import { Path } from '../imports/Path.ts';

export interface GetPathFromThisDirectoryApi {
  thisImportMetaUrl: string;
  directoryPosfixPath: string
}

export function getPathFromThisDirectory(api: GetPathFromThisDirectoryApi) {
  const {thisImportMetaUrl, directoryPosfixPath} = api
  const thisFilePath = Path.fromFileUrl(thisImportMetaUrl);
  const thisDirectoryPath = Path.dirname(thisFilePath);
  return Path.join(thisDirectoryPath, directoryPosfixPath);
}
import fs from 'fs-extra';
import path from 'path-extra';
import { extractZipFile } from "../helpers/zipHelpers";
import * as bhpHelpers from '../helpers/bhpHelpers';

describe('ParseBHP', function() {
  const tempFilePath = './__tests__/output/bhp_help';

  afterEach(() => {
    if (tempFilePath) {
      fs.removeSync(tempFilePath);
    }
  });

  it('should output BHP chapter files', () => {
    return new Promise((resolve) => {
      const version = 'v0.0';
      const zipFileName = 'bhp.zip';
      const zipfilepath = path.join(tempFilePath, zipFileName);
      fs.copySync(path.join('./__tests__/fixtures/bhp', zipFileName), zipfilepath); // copy zip to new location since it will be deleted
      const resourceinputpath = path.join(tempFilePath,'dummyDestinationFolder');
      if(resourceinputpath) {
        fs.removeSync(resourceinputpath);
      }
      extractZipFile(zipfilepath, resourceinputpath);

      const testVersionFolder = path.join(resourceinputpath, 'bhp', version);
      const bhpOutputPath = path.join('__tests__', 'output', 'bhp-sources', version);
      fs.removeSync(bhpOutputPath);
      fs.moveSync(testVersionFolder, bhpOutputPath);

      bhpHelpers.generateBhpVersion(version, resolve);
    }).then(() => {
      console.log('bhp processing completed!');
    });
  }, 10000); // max timeout (should be long enough, but may need to be increased on a slow connection)
});

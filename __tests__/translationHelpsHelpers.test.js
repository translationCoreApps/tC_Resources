import fs from 'fs-extra';
import path from 'path-extra';
import * as translationHelpsHelpers from "../helpers/translationHelpsHelpers";
import { extractZipFile } from "../helpers/zipHelpers";


describe('Translation Helps Helpers', () => {
  const tempFilePath = path.join('.', '__tests__', 'output', 'trans_help');

  afterEach(() => {
    if (tempFilePath) {
      fs.removeSync(tempFilePath);
    }
  });

  test('getTranslationHelps with valid input', () => {
    const zipFileName = 'en_tw.zip';
    const zipfilepath = path.join(tempFilePath, zipFileName);
    fs.copySync(path.join('./__tests__/fixtures/th', zipFileName), zipfilepath); // copy zip to new location since it will be deleted
    const resourceinputpath = path.join(tempFilePath,'dummyDestinationFolder');
    if(resourceinputpath) {
      fs.removeSync(resourceinputpath);
    }
    extractZipFile(zipfilepath, resourceinputpath);

    const resourceOutputPath = path.join(tempFilePath,'dummyResourceFolder');
    translationHelpsHelpers.getTranslationHelps(path.join(resourceinputpath,'en_tw'), resourceOutputPath);
  });

  test('getTranslationHelps with invalid input', () => {
    let exception = true;
    try {
      translationHelpsHelpers.getTranslationHelps(null, null);
      exception = false;
    } catch (e) {
      console.log("failure: " + e);
      exception = true;
    }
    expect(exception).toEqual(true);
  });

});

describe('translationHelpsHelpers.compareByFirstUniqueWord() tests', () => {
  test('Compare two strings with first word the same', ()=>{
    const aString = {name:'god, gods'};
    const bString = {name:'god, false gods'};
    const expectedResult = 1;
    expect(translationHelpsHelpers.compareByFirstUniqueWord(aString, bString)).toEqual(expectedResult);
  });

  test('Compare two strings with first word different', ()=>{
    const aString = {name:'faith, faithful'};
    const bString = {name:'god, false gods'};
    const expectedResult = -1;
    expect(translationHelpsHelpers.compareByFirstUniqueWord(aString, bString)).toEqual(expectedResult);
  });

  test('Compare two strings with one having only one word', ()=>{
    const aString = {name:'god, father god'};
    const bString = {name:'god'};
    const expectedResult = 1;
    expect(translationHelpsHelpers.compareByFirstUniqueWord(aString, bString)).toEqual(expectedResult);
  });

  test('Compare where both strings are the same', ()=>{
    const aString = {name:'hour, hours'};
    const bString = {name:'hour, hours'};
    const expectedResult = 0;
    expect(translationHelpsHelpers.compareByFirstUniqueWord(aString, bString)).toEqual(expectedResult);
  });

  test('Test that case does not matter', ()=>{
    const aString = {name:'Zebra'};
    const bString = {name:'ant'};
    const expectedResult = 1;
    expect(translationHelpsHelpers.compareByFirstUniqueWord(aString, bString)).toEqual(expectedResult);
  });
});

const modulePath = 'steps/index';

const glob = require('glob');
const allSteps = require(modulePath);
const { expect } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const fileNameRegex = /^.*[\\\/]/g; // eslint-disable-line
const currentEnvironment = config.environment;

const findStepNames = location => {
  const files = [];
  glob.sync(location).forEach(file => {
    const stepName = file.replace(fileNameRegex, '').split('.')[0];
    files.push(stepName);
  });
  return files;
};

describe(modulePath, () => {
  it('finds all steps in the steps folder', () => {
    const steps = allSteps();

    const fileNames = findStepNames('steps/**/*.step.js');
    const stepNames = steps.map(step => {
      return step.name;
    });
    fileNames.forEach(fileName => {
      expect(stepNames.includes(fileName)).to.eql(true);
    });
  });

  it('finds all steps in the mock steps folder', () => {
    const steps = allSteps();

    const fileNames = findStepNames('mocks/steps/**/*.step.js');
    const stepNames = steps.map(step => {
      return step.name;
    });
    fileNames.forEach(fileName => {
      expect(stepNames.includes(fileName)).to.eql(true);
    });
  });
});

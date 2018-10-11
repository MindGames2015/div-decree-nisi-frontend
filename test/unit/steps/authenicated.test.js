const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const Undefended = require('steps/undefended/Undefended.step');
const ExitNoCase = require('steps/exit-no-case/ExitNoCase.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').returns(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.landingPage.restore();
      caseOrchestrationService.getApplication.restore();
    });

    it('to undefended page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Authenticated, Undefended);
    });

    it('to ExitNoCase page if get application fails', () => {
      caseOrchestrationService.getApplication.rejects();
      return redirect.navigatesToNext(Authenticated, ExitNoCase);
    });
  });
});

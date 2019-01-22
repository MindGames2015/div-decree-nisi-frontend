const modulePath = 'steps/resp-not-admit-adultery/RespNotAdmitAdultery.step';

const RespNotAdmitAdultery = require(modulePath);
const RespNotAdmitAdulteryContent = require(
  'steps/resp-not-admit-adultery/RespNotAdmitAdultery.content'
);
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const Exit = require('steps/exit/Exit.step');
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(RespNotAdmitAdultery, [ idam.protect() ]);
  });

  describe('Respondent not admitted to Adultery', () => {
    it('renders the content', () => {
      const session = {
        case: {
          state: 'DNAwaiting',
          data: {
            reasonForDivorce: 'Adultery',
            respAdmitOrConsentToFact: 'Yes'
          }
        }
      };
      return content(RespNotAdmitAdultery, session);
    });

    it('returns correct answers', () => {
      const expectedContent = [ RespNotAdmitAdulteryContent.en.fields.amendPetition.yes ];
      const session = {
        case: {
          data: {
            reasonForDivorce: 'Adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const fields = { amendPetition: 'yes' };
      return question.answers(RespNotAdmitAdultery, fields, expectedContent, session);
    });

    it('redirects to ApplyForDecreeNisi page', () => {
      const fields = { amendPetition: 'no' };
      return question.redirectWithField(RespNotAdmitAdultery, fields, ApplyForDecreeNisi);
    });

    it('redirects to AmendPetition page', () => {
      const fields = { amendPetition: 'yes' };
      return question.redirectWithField(RespNotAdmitAdultery, fields, Exit);
    });
  });
});

const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

class ExitIntolerable extends shimSessionStaticPage {
  static get path() {
    return config.paths.exitIntolerable;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get flowControl() {
    return stopHere(this);
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = ExitIntolerable;

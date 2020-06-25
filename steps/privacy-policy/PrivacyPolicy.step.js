const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

class PrivacyPolicy extends shimSessionStaticPage {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }

  static get path() {
    return config.paths.privacyPolicy;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = PrivacyPolicy;

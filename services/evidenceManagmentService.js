// eslint-disable-file complexity
const config = require('config');
const superagent = require('superagent');
const httpStatus = require('http-status-codes');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const errors = require('resources/errors');
const fileManagment = require('services/fileManagement');

const evidenceManagmentClientUploadUrl = `${config.services.evidenceManagmentClient.url}${config.services.evidenceManagmentClient.uploadEndpoint}`;
const defaultEMCErrorMessage = 'Error uploading to evidence management client';

const handleResponse = (body, resolve, reject) => {
  let error = body.error && body.error.length ? body.error : null;

  if (Array.isArray(body) && body[0].error) {
    error = body[0].error;
  }

  if (error) {
    logger.error({
      message: 'Error when uploading to Evidence Management:',
      body
    });
    return reject(error);
  }

  const dataIsNotValid = !Array.isArray(body) || !body[0].status || body[0].status !== 'OK';
  if (dataIsNotValid) {
    logger.error({
      message: 'Error when uploading to Evidence Management:',
      body
    });
    return reject(Array.isArray(body) ? body[0] : body);
  }

  logger.info({
    message: 'Uploaded files to Evidence Management Client',
    body
  });

  return resolve(body);
};

const sendFile = req => {
  const token = req.cookies['__auth-token'];

  return fileManagment.saveFileFromRequest(req)
    .then(file => {
      return new Promise((resolve, reject) => {
        superagent
          .post(evidenceManagmentClientUploadUrl)
          .set({ Authorization: token })
          .set('enctype', 'multipart/form-data')
          .attach('file', file.path, file.name)
          .end((error, response = { statusCode: null }) => {
            fileManagment.removeFile(file);

            if (error || response.statusCode !== httpStatus.OK) {
              const errorToReturn = new Error(error || response.body || defaultEMCErrorMessage);
              errorToReturn.status = response.statusCode;

              logger.error({
                message: 'Error when uploading to Evidence Management:',
                error: errorToReturn
              });

              if (response && response.errorCode === 'invalidFileType') {
                return reject(errors.fileTypeInvalid);
              }
              return reject(errorToReturn);
            }

            return handleResponse(response.body, resolve, reject);
          });
      });
    });
};

module.exports = {
  sendFile,
  handleResponse
};

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

const projectId = 'cdtn-54917';
const sessionId = 'code-du-travail-session-id';
const sessionPath = sessionClient.sessionPath(projectId, sessionId);


// https://github.com/dialogflow/dialogflow-nodejs-client-v2#using-the-client-library
const sendRequest = function (queryText) {

  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: 'fr-FR',
      },
    },
  };

  return sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      return result
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

};

module.exports = {
  sendRequest: sendRequest,
}

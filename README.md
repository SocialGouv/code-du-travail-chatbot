# Code du travail - Chat Bot

Ce dépôt de code contient un prototype d'agent conversationnel pour le code du travail.

## Installation de l'environnement de développement

```bash
$ npm install
```

[Le client Dialogflow](https://github.com/dialogflow/dialogflow-nodejs-client-v2) pour Node.JS nécessite de paramétrer l'[authentification Google Cloud API](https://cloud.google.com/docs/authentication/getting-started) afin d'obtenir un fichier `.json` contenant les identifiants du compte de service Google Cloud.


Vous devez ensuite ajouter la variable d'environnement `GOOGLE_APPLICATION_CREDENTIALS` contenant le chemin vers ce fichier `.json` :

```bash
$ export GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file.json>
```

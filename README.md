# Naive Bayes API

A Firebase powered API that allows you to build and train your own Machine Learning models and impress all of your friends and make your employers really rich and popular.


## Installation

```bash
git clone https://github.com/matthieunelmes/naive-bayes-api.git
cd naive-bayes-api
npm install
```

## Setting up Firebase
Setup a new Firebase project at firebase.google.com 
To get the account key.json go to:
Project Overview -> Project Settings -> Service accounts. Make note of the databaseURL then generate a new private key. This'll download a json file which you need to rename to `firebase-service-account-key.json` and put in the root directory. 

Then create a .env file in the root, there is only one param you need:
`FIREBASE_URL=<databaseURL>`

## Running

```bash
npm start
```
Starts local dev environment on localhost:9311

## Endpoints
| Endpoint  | Desc |Type | Params | Returns |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| /api/models  | Get list of models |GET | n/a  | (array) model |
| /api/model/<model-id> | Get single model | GET | n/a | (object) model |
| /api/model | Create new model | POST | name | (id) model-id |
| /api/model/<model-id>/addItem | Add trained item to model | POST| modelId, text, classification| (id) modelItemId|
| /api/model/<model-id>/train| Train model | GET | n/a | (bool) training complete|
| /api/model/<model-id>/test | Test model accuracy | GET | n/a | (object) model accuracy |
| /api/model/<model-id>/classify | Classify test against pre-trained model |POST | text | (object) classification |

## Example
//TODO






## Contributing 
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
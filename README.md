# Naive Bayes API

A Firebase powered API that allows you to build and train your own Machine Learning models and impress all of your friends and make you really rich and popular.


## Installation

```bash
git clone https://github.com/matthieunelmes/naive-bayes-api.git
cd naive-bayes-api
npm install
```

## Setting up Firebase
Setup a new Firebase project at firebase.google.com 
Within the newly created project dashboard, click `Database` on the side menu and select `Create database` under the **real-time database** section.

Next, you need to download the connection credentials which will allow the application to connect to the database. To do this go to:
Project Overview -> Project Settings -> Service accounts. Make note of the databaseURL then click `generate a new private key`. This'll download a json file which contains your connection credentials.

Create a copy of example.env and rename to .env Then copy across the values from the json file which you just downloaded from Firebase. The `FIREBASE_URL` is the databaseURL from the previous step.


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

import Config from '../config';
import service from '../service';
import bayes from 'bayes';
import { Router } from 'express';


function classifier(Config) {
    this.Service = new service(Config, bayes);
}


export default () => {

    const Classifier = new classifier(Config);
    const api = Router();

    //Get Models
    api.get('/models', function (req, res) {
        Classifier.Service.getModels(function (response) {
            res.end(JSON.stringify(response));
        });
    });


    //Get Model
    api.get('/model/:id', function (req, res) {
        Classifier.Service.getModel(req.params.id, function (response) {
            res.end(JSON.stringify(response));
        });
    });


    //Create Model
    api.post('/model', function (req, res) {
        var newModel = req.body;
        if (newModel.name) {
            Classifier.Service.createModel(newModel, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter name is required");
        }
    });

    //Add Model training item
    api.post('/model/:id/addItem', function (req, res) {
        var newTrainingItem = req.body;
        if (req.params.id) {
            Classifier.Service.addModelTrainingItem(newTrainingItem.modelId, newTrainingItem, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter modelId is required");
        }
    });

    //Train model
    api.get('/model/:id/train', function (req, res) {
        if (req.params.id) {
            Classifier.Service.trainModel(req.params.id, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter modelId is required");
        }
    });

    //Test model
    api.get('/model/:id/test', function (req, res) {
        if (req.params.id) {
            const percentageToTest = 15; //TODO allow users to specific test size, defaults to 15%
            Classifier.Service.testModel(req.params.id, percentageToTest, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter modelId is required");
        }
    });

    // 
    api.post('/model/:id/classify', function (req, res) {
        var item = req.body;
        if (req.params.id && item.text) {
            Classifier.Service.classify(req.params.id, item.text, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter modelId and text is required");
        }
    });

    //Get Probability
    api.post('/model/:id/probability', function (req, res) {
        var item = req.body;
        if (req.params.id && item.text) {
            Classifier.Service.probability(req.params.id, item.text, function (response) {
                res.end(JSON.stringify(response));
            });
        } else {
            res.status(400).json("parameter modelId and text is required");
        }
    });
    return api
}




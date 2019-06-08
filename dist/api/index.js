'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _service = require('../service');

var _service2 = _interopRequireDefault(_service);

var _bayes = require('bayes');

var _bayes2 = _interopRequireDefault(_bayes);

var _express = require('express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function classifier(Config) {
    this.Service = new _service2.default(Config, _bayes2.default);
}

exports.default = function () {

    var Classifier = new classifier(_config2.default);
    var api = (0, _express.Router)();

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
            var percentageToTest = 15; //TODO allow users to specific test size, defaults to 15%
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
    return api;
};
//# sourceMappingURL=index.js.map
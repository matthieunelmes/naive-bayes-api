'use strict';

/*jshint esversion: 6 */

function ModelService(firebase, bayes) {

  var _firebase = firebase;
  var _classifier = bayes();

  /**
   * Creates a new model and saves it to the database
   *
   * @param  {Object} model Object of the model including name (string)
   * @return {firebase UID} ID of the firebase model
   */
  ModelService.prototype.createModel = function (model, callback) {
    _firebase.database().ref('models/').push(model).then(function (response) {
      callback(response.key);
    }).catch(function (err) {
      callback(false);
    });
  },

  /**
   * Creates a new, pre-trained item and saves it to the database
   *
   * @param  {firebase UID} modelId of the model to add the training item to
   * @param  {Object} model Object of the model including name (string)
   * @return {firebase UID} ID of the firebase model
   */
  ModelService.prototype.addModelTrainingItem = function (modelId, item, callback) {
    _firebase.database().ref('modelTrainingItems/').push(item).then(function (response) {
      _firebase.database().ref('models/' + modelId + '/modelTrainingItems/').child(response.key).set(true).then(function (res) {
        callback(response.key);
      }).catch(function (err) {
        callback(false);
      });
    });
  },

  /**
   * Deletes all pre-trained items for a particular model
   *
   * @param  {firebase UID} modelId of the model
   * @param  {Object} model Object of the model including name (string)
   * @return {boolean} operation completed successfully
   */
  ModelService.prototype.clearModelTrainingItems = function (modelId, callback) {
    function deleteItems(items) {
      items.forEach(function (item) {
        _firebase.database().ref('models/' + modelId + '/modelTrainingItems/').child(item.key).set(null).then(function () {
          _firebase.database().ref('/modelTrainingItems/').child(item.key).set(null).then(function (response) {
            callback(true);
          }).catch(function (err) {
            callback(false);
          });
        }).catch(function (err) {
          callback(false);
        });
      });
    }

    _firebase.database().ref('models/' + modelId + '/modelTrainingItems/').once('value', function (snaps) {
      var snapshotsList = [];
      var snapshots = _firebase.database().ref('modelTrainingItems');
      var clientInstagramSnapshots = _firebase.database().ref('models/' + modelId + '/modelTrainingItems/');
      var snapshotLength = snaps.numChildren();
      clientInstagramSnapshots.on('child_added', function (snap) {
        snapshots.child(snap.key).once('value', function (snapshotSnap) {
          snapshotsList.push(snapshotSnap);
          if (snapshotsList.length === snapshotLength) {
            deleteItems(snapshotsList);
          }
        });
      });
    });
  },

  /**
   * Retreives an array of pre-trained items for a model
   *
   * @param  {firebase UID} modelId of the model
   * @return {Array [Object]} Array of pre-trained items
   */
  ModelService.prototype.getModelTrainingItems = function (modelId, callback) {
    _firebase.database().ref('models/' + modelId + '/modelTrainingItems/').once('value', function (snaps) {
      var snapshotsList = [];
      var snapshots = _firebase.database().ref('modelTrainingItems');
      var clientInstagramSnapshots = _firebase.database().ref('models/' + modelId + '/modelTrainingItems/');
      var snapshotLength = snaps.numChildren();
      clientInstagramSnapshots.on('child_added', function (snap) {
        snapshots.child(snap.key).once('value', function (snapshotSnap) {
          snapshotsList.push(snapshotSnap.val());
          if (snapshotsList.length === snapshotLength) {
            callback(snapshotsList);
          }
        });
      });
    });
  },

  /**
   * Retreives an array of models
   *
   * @return {Array [Object]} Array of models
   */
  ModelService.prototype.getModels = function (callback) {
    _firebase.database().ref('models').once('value', function (modelsSnap) {
      callback(modelsSnap.val());
    });
  },

  /**
   * Retreives a model by it's Id
   *
   * @param  {firebase UID} modelId of the model
   * @return {Object} Model
   */
  ModelService.prototype.getModel = function (modelId, callback) {
    _firebase.database().ref('models/' + modelId).once('value', function (modelSnap) {
      callback(modelSnap.val());
    });
  },

  /**
   * Classify an item using a specific model
   *
   * @param  {firebase UID} modelId of the model
   * @param  {string} itemText string to classify
   * @return {Object} classification
   */
  ModelService.prototype.classify = function (modelId, itemText, callback) {
    _firebase.database().ref('models/' + modelId + '/classifierJson').once('value', function (classifierJsonSnap) {
      var _trainedClassifier = bayes.fromJson(classifierJsonSnap.val());
      callback({
        text: itemText,
        classification: _trainedClassifier.categorize(itemText)
      });
    });
  },

  /**
   * Classify an item using a specific model
   *
   * @param  {firebase UID} modelId of the model
   * @param  {string} itemText string to classify
   * @return {Object} probability
   */
  ModelService.prototype.probability = function (modelId, itemText, callback) {
    _firebase.database().ref('models/' + modelId + '/classifierJson').once('value', function (classifierJsonSnap) {
      var _trainedClassifier = bayes.fromJson(classifierJsonSnap.val());
      callback({
        text: itemText,
        classification: _trainedClassifier.probabilities(itemText)
      });
    });
  },

  /**
   * Train a model with it's pre-trained items and save its classifier to Json in the database
   *
   * @param  {firebase UID} modelId of the model
   * @return {boolean} operation completed
   */
  ModelService.prototype.trainModel = function (modelId, callback) {
    ModelService.prototype.getModelTrainingItems(modelId, function (modelTrainingItems) {
      for (var x = 0; x < modelTrainingItems.length; x++) {
        _classifier.learn(modelTrainingItems[x].text, modelTrainingItems[x].classification);
      }
      //Save classifier to Json
      _firebase.database().ref('models/' + modelId).child('classifierJson').set(_classifier.toJson()).then(function (response) {
        callback(true);
      }).catch(function (err) {
        callback(false);
      });
    });
  };
}

module.exports = ModelService;
//# sourceMappingURL=modelService.js.map
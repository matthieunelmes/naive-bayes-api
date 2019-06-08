'use strict';

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Service(Config, bayes) {

  _firebaseAdmin2.default.initializeApp({
    credential: _firebaseAdmin2.default.credential.cert(Config.FIREBASE_SERVICE_ACCOUNT),
    databaseURL: Config.FIREBASE_URL
  });

  var _firebase = _firebaseAdmin2.default;
  var _classifier = bayes();

  /**
   * Creates a new model and saves it to the database
   *
   * @param  {Object} model Object of the model including name (string)
   * @return {firebase UID} ID of the firebase model
   */
  Service.prototype.createModel = function (model, callback) {
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
  Service.prototype.addModelTrainingItem = function (modelId, item, callback) {
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
  Service.prototype.clearModelTrainingItems = function (modelId, callback) {
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
  Service.prototype.getModelTrainingItems = function (modelId, callback) {
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
  Service.prototype.getModels = function (callback) {
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
  Service.prototype.getModel = function (modelId, callback) {
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
  Service.prototype.classify = function (modelId, itemText, callback) {
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
  Service.prototype.probability = function (modelId, itemText, callback) {
    _firebase.database().ref('models/' + modelId + '/classifierJson').once('value', function (classifierJsonSnap) {
      var _trainedClassifier = bayes.fromJson(classifierJsonSnap.val());
      callback({
        text: itemText,
        classification: _trainedClassifier.probabilities(itemText)
      });
    });
  },

  /**
  * Get Classifier from DB
  *
  * @param  {firebase UID} modelId of the model
  * @return {Object} classifier
  */
  Service.prototype.getClassifier = function (modelId, callback) {
    _firebase.database().ref('models/' + modelId + '/classifierJson').once('value', function (classifierJsonSnap) {
      callback(classifierJsonSnap.val());
    });
  },

  /**
  * Loads a model from the saved Json Classifier, then runs 15% of pre-trained items to test accuracy
  *
  * @param  {firebase UID} modelId of the model
  * @param  {number} percentage of items to test, default to 15%
  * @return {number} accuracy %
  */
  Service.prototype.testModel = function (modelId, percentage, callback) {
    var correctResults = 0;
    var incorrectResults = 0;
    // Load the saved Json Classifier for the model
    _firebase.database().ref('models/' + modelId + '/classifierJson').once('value', function (classifierJsonSnap) {
      var _trainedClassifier = bayes.fromJson(classifierJsonSnap.val());
      // Grab items to test
      Service.prototype.getModelTrainingItems(modelId, function (modelTrainingItems) {
        var itemsCount = (modelTrainingItems.length * (percentage / 100)).toFixed();
        // Foreach item, test it and compare against its pre-trained classifications
        for (var x = 0; x < itemsCount; x++) {
          if (_trainedClassifier.categorize(modelTrainingItems[x].text) === modelTrainingItems[x].classification) {
            correctResults++;
          } else {
            incorrectResults++;
          }
        }
        callback({
          itemsTested: itemsCount,
          accuracy: (correctResults / itemsCount * 100).toFixed(2)
        });
      });
    });
  };

  /**
   * Train a model with it's pre-trained items and save its classifier to Json in the database
   *
   * @param  {firebase UID} modelId of the model
   * @return {boolean} operation completed
   */
  Service.prototype.trainModel = function (modelId, callback) {
    Service.prototype.getModelTrainingItems(modelId, function (modelTrainingItems) {
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

module.exports = Service;
//# sourceMappingURL=index.js.map
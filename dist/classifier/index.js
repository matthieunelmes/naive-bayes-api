'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _bayes = require('bayes');

var _bayes2 = _interopRequireDefault(_bayes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function classifier(config) {
    // Initialise Firebase
    _firebaseAdmin2.default.initializeApp({
        credential: _firebaseAdmin2.default.credential.cert(config.FIREBASE_SERVICE_ACCOUNT),
        databaseURL: config.FIREBASE_URL
    });
    //Resolve Classifier services
    this.Db = new _db2.default(_firebaseAdmin2.default, _bayes2.default);
}

exports.default = classifier;
//# sourceMappingURL=index.js.map
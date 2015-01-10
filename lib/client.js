var _ = require('lodash');
var gcloud = require('gcloud');
var Promise = require('bluebird');

var helper = require('./helper');
var Subscription = require('./subscription');
var Topic = require('./topic');

function Client(options) {
  options = _.merge({}, options);

  this._credentials = options.credentials;
  this._projectId = options.projectId;

  this._client = Promise.promisifyAll(gcloud.pubsub({
    credentials: options.credentials,
    projectId: options.projectId
  }));
}

Client.prototype.ensureTopic = function (topicId) {
  return Promise.bind(this)
    .then(function () {
      return this._client.createTopicAsync(topicId);
    })
    .catch(helper.skipAlreadyExistsError)
    .then(function () {
      return this.topic(topicId);
    });
};

Client.prototype.ensureSubscription = function (topic, subscriptionId) {
  return Promise.resolve()
    .then(function () {
      return Promise.promisify(topic.subscribe, topic)(subscriptionId);
    })
    .catch(helper.skipAlreadyExistsError)
    .then(function () {
      return topic.subscription(subscriptionId);
    });
};

Client.prototype.getTopics = function () {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var result = [];
    _this._client.getTopics(cb);
    function runAgain(nextQuery) {
      _this._client.getTopics(nextQuery, cb);
    }
    function cb(err, topics, nextQuery) {
      if (err) {
        return reject(err);
      }
      if (nextQuery) {
        result.push(topics);
        return runAgain(nextQuery);
      }
      resolve(Topic.fromArray(result.concat(topics)));
    }
  });
};

Client.prototype.getSubscriptions = function () {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var result = [];
    _this._client.getSubscriptions(cb);
    function runAgain(nextQuery) {
      _this._client.getSubscriptions(nextQuery, cb);
    }
    function cb(err, subscriptions, nextQuery) {
      if (err) {
        return reject(err);
      }
      if (nextQuery) {
        result.push(subscriptions);
        return runAgain(nextQuery);
      }
      resolve(Subscription.fromArray(result.concat(subscriptions)));
    }
  });
};

Client.prototype.topic = function (topicId) {
  return new Topic(this._client.topic(topicId));
};

module.exports = Client;

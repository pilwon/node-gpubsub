var _ = require('lodash');
var Promise = require('bluebird');

var helper = require('./helper');
var Subscription = require('./subscription');

function Topic(topic) {
  if (_.isString(topic)) {
    _this._pubsub.topic(topicId)
  }

  this.id = helper.getStringAfterLastSlash(topic.name);

  this._topic = Promise.promisifyAll(topic);
}

Topic.prototype.delete = function () {
  return this._topic.deleteAsync();
};

Topic.prototype.publish = function (payload) {
  return this._topic.publishAsync(payload);
};

Topic.prototype.publishRaw = function (data, labels) {
  return this._topic.publishRawAsync({
    data: data,
    label: labels
  });
};

Topic.prototype.subscribe = function (subscriptionId, options) {
  options = _.merge({}, options);

  return Promise.bind(this)
    .then(function () {
      return this._topic.subscribeAsync(subscriptionId, options);
    })
    .catch(helper.skipAlreadyExistsError)
    .then(function () {
      return this.subscription(subscriptionId);
    });
};

Topic.prototype.subscription = function (subscriptionId) {
  return new Subscription(this._topic.subscription(subscriptionId));
};

Topic.fromArray = function (topics) {
  return topics.map(function (topic) {
    return new Topic(topic);
  });
};

module.exports = Topic;

var _ = require('lodash');
var Promise = require('bluebird');

var helper = require('./helper');

function Subscription(subscription) {
  this.id = helper.getStringAfterLastSlash(subscription.name);

  this._subscription = Promise.promisifyAll(subscription);
}

Subscription.prototype.ack = function (message) {
  return this._subscription.ackAsync(message.id);
};

Subscription.prototype.delete = function () {
  return this._subscription.deleteAsync();
};

Subscription.prototype.on = function () {
  return this._subscription.on.apply(this._subscription, arguments);
};

Subscription.prototype.pull = function (options) {
  options = _.merge({}, options);

  return this._subscription.pullAsync(options);
};

Subscription.prototype.removeListener = function () {
  return this._subscription.removeListener.apply(this._subscription, arguments);
};

Subscription.fromArray = function (subscriptions) {
  return subscriptions.map(function (subscription) {
    return new Subscription(subscription);
  });
};

module.exports = Subscription;

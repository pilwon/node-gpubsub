var _ = require('lodash');
// var gpubsub = require('gpubsub');
var gpubsub = require('../');
var Promise = require('bluebird');

var credentials = require('./credentials');

var PROJECT_ID = '<project-id>';

var pubsub = new gpubsub.Client({
  credentials: credentials,
  projectId: PROJECT_ID
});

Promise.resolve()
  // .then(function () {
  //   return pubsub.getTopics()
  //     .tap(function (topics) {
  //       console.log('Topics: ' + JSON.stringify(_.pluck(topics, 'id')));
  //     })
  //     .map(function (topic) {
  //       return topic.delete();
  //     });
  // })
  // .then(function () {
  //   return pubsub.getSubscriptions()
  //     .tap(function (subscriptions) {
  //       console.log('Subscriptions: ' + JSON.stringify(_.pluck(subscriptions, 'id')));
  //     })
  //     .map(function (subscription) {
  //       return subscription.delete();
  //     });
  // })
  // .then(function () {
  //   var topicId = 'test';
  //   return pubsub.ensureTopic(topicId)
  //     .then(function (topic) {
  //       console.log('Ensured topic: ' + topic.id);
  //       return topic.publish('TEST')
  //         .then(function () {
  //           console.log('Published message at topic: ' + topic.id);
  //         })
  //         .then(function () {
  //           return topic.delete();
  //         })
  //         .then(function () {
  //           console.log('Deleted topic: ' + topic.id);
  //         });
  //     });
  // })
  .then(function () {
    var subscriptionId = 'ping';
    var topicId = 'tasks';
    var subscription;
    var topic;

    return Promise.resolve()
      .then(function () {
        return pubsub.ensureTopic(topicId);
      })
      .then(function (t) {
        topic = t;
        console.log('Ensured topic: ' + topic.id);
      })
      .then(function () {
        return topic.subscribe(subscriptionId);
      })
      .then(function (s) {
        subscription = s;
        console.log('Subscription ID: ' + subscription.id);
      })
      .then(function () {
        return new Promise(function (resolve) {
          subscription
            .on('message', function (message) {
              console.log(message);
              subscription.ack(message);
            })
            .on('error', function (err) {
              console.error(err.message);
            });
        });
      });
  })
  .catch(console.error);

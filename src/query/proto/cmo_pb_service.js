// package: eidos
// file: cmo.proto
/* eslint-disable */

var cmo_pb = require('./cmo_pb');
var grpc = require('@improbable-eng/grpc-web').grpc;

var CMO = (function() {
  function CMO() {}
  CMO.serviceName = 'eidos.CMO';
  return CMO;
})();

CMO.get_all_actions = {
  methodName: 'get_all_actions',
  service: CMO,
  requestStream: false,
  responseStream: false,
  requestType: cmo_pb.AllActionsRequest,
  responseType: cmo_pb.AllActionsResponse
};

exports.CMO = CMO;

function CMOClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

CMOClient.prototype.get_all_actions = function get_all_actions(
  requestMessage,
  metadata,
  callback
) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CMO.get_all_actions, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function(response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function() {
      callback = null;
      client.close();
    }
  };
};

exports.CMOClient = CMOClient;

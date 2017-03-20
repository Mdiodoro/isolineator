angular.module('app')
.service('isolineatorService', function($http, $window) {

  this.getAll = function(callback) {
    $http.get('/logs')
    .then(function({data}) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function({err}) {
      console.log(err);
    });
  };

  this.searchLogs = function(query, callback) {
    var req = {};
    req.query = query;

    $http({
      method: 'POST',
      url: '/log', 
      data: JSON.stringify(req)
    })
    // $http.get('/log')
    .then(function(data) {
      console.log('success');
      if(callback) {
        callback(data);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  };

  this.postRecording = function(recording, callback) {
    $http.post('/record')
    .then(function({data}){
      if(callback) {
        callback(data);
      }
    })
     .catch(function({err}) {
      console.log(err);
    });
  };

});
angular.module('app')
.controller('AppCtrl', function($scope, isolineatorService) {
  isolineatorService.getAll((data) => {
    this.logs = data;
  });
  
  this.logs = [
    { __v: 0,
      vtext: 'go away',
      topic: 'grumpy',
      createdAt: '2017-03-16T05:08:52.020Z',
      _id: '58ca1de4f29fc9ab6188f066' 
    },
    { __v: 0,
      vtext: 'hi there',
      topic: 'hi',
      createdAt: '2017-03-16T05:08:52.009Z',
      _id: '58ca1de4f29fc9ab6188f065' 
    }
  ]

  console.log('logs', this.logs);

  this.recording = false;
  this.record = () => {
    // console.log('toggling');
    this.recording = !this.recording;
  }

  this.searchService = isolineatorService;
  this.searchResults = (data) => {
    this.logs = data;
  }

})

.directive('app', function() {
  return {
    scope: {},
    restrict: 'E',
    controller: 'AppCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'templates/app.html'
  }

})



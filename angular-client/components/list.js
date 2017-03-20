angular.module('app')
.directive('list', function() {
  return {
    scope: {
      logs: '<',
    },
    restrict: 'E',
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/templates/list.html'
  };
});
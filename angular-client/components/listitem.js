angular.module('app')
.directive('listItem', function() {
  return {
    scope: {
      log: '<',
    },
    restrict: 'E',
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/templates/list-item.html'
  };
});
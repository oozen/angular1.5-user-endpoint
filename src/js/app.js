var app = angular.module('app', []);
app.controller('userCtrl', function ($scope, $filter, userService) {

    $scope.userList = [];

});
app.factory("userService", ["$http", "$q", "$rootScope", userService]);

function userService($http, $q, $rootScope) {
    var service = {};
    return service;
}
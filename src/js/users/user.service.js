app.factory("userService", ["$http", "$q", "$filter", "$rootScope", userService]);

function userService($http, $q, $filter, $rootScope) {

    var serverBaseUrl = 'http://localhost:3000/users/';
    var service = {
        getUserList: getUserList,
        addUser: addUser,
        deleteUser: deleteUser,
        pageCount: pageCount,
        search:search
    };

    return service;

    //it takes care of sorting,ordering,paging.. 
    function getUserList(sortItem,sortOrder,page) {

        page = page || 1;
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: serverBaseUrl + '?_sort=' + sortItem + '&_order=' + sortOrder + '&_page=' + page + '&_limit=10',
            headers: { 'Content-Type': 'application/json' },
        }).success(function (data, status, headers, config) {

            $rootScope.USER_LIST = data;
            deferred.resolve($rootScope.USER_LIST);

        }).error(function (err, status) {
            console.log(err);
            deferred.reject(status);
        });

        return deferred.promise;
    }

    function addUser(model) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: 'http://localhost:3000/db',
            headers: { 'Content-Type': 'application/json' },
        }).success(function (data, status, headers, config) {

            // defines unique id of the new entry
            model.id = data.users[data.users.length - 1].id + 1;
            $rootScope.USER_LIST.push(model);

            deferred.resolve($rootScope.USER_LIST);

        }).error(function (err, status) {
            console.log(err);
            deferred.reject(status);
        });

        return deferred.promise;
    }

    function deleteUser(uId) {

        var result = $filter('removeItemFromArray')($rootScope.USER_LIST, uId, 'id');
        return result;
    }

    function pageCount() {

        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://localhost:3000/db',
            headers: { 'Content-Type': 'application/json' },
        }).success(function (data, status, headers, config) {

            var pages = data.users.length / 10;
            deferred.resolve(parseInt(pages));

        }).error(function (err, status) {
            console.log(err);
            deferred.reject(status);
        });

        return deferred.promise;
    }

    function search(text) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: serverBaseUrl + '?q=' + text,
            headers: { 'Content-Type': 'application/json' },
        }).success(function (data, status, headers, config) {

            $rootScope.USER_LIST = data;
            deferred.resolve($rootScope.USER_LIST);

        }).error(function (err, status) {
            console.log(err);
            deferred.reject(status);
        });

        return deferred.promise;
    }
}

angular.module('app').filter('removeItemFromArray', function () {
    return function (arr, id, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == id) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
});
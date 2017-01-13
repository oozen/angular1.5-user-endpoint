var app = angular.module('app', [])
.run(function ($rootScope) {
    $rootScope.USER_LIST = [];
});
app.controller('userCtrl', function ($scope, $filter, userService) {

    $scope.currentPage = 1;
    $scope.userList = [];
    $scope.userModel = {
        'id': 0,
        'first_name': '',
        'last_name': '',
        'email': '',
        'gender': 'Male',
        'password': ''
    }
    $scope.searchText = '';

    $scope.sortItems = {
        'id': false,
        'first_name': false,
        'last_name': false,
        'email': false,
        'gender': false,
        'password': false
    }

    var sortOrder = 'ASC';
    var sortItem = 'id';

    $scope.pagination = function (page) {

        $scope.currentPage = page || 1;

        userService.getUserList(sortItem,sortOrder,page).then(function (data) {
            $scope.userList = data;
            return userService.pageCount();

        }).then(function (pageCount) {
            
            $scope.pageNumbers = [];
            var isCurrent = false;

            for (var i = 1; i < pageCount + 1; i++) {
                
                if (i === $scope.currentPage) {
                    isCurrent = true;
                }
                $scope.pageNumbers.push({
                    'number': i,
                    'isCurrent' : isCurrent
                });

                isCurrent = false;
            }
        });
    }

    // toggles user adding pop-up
    $scope.togglePop = function (open) {
        var popUp = document.getElementById('addUserPop');

        if (open) {
            popUp.style.display = 'block';
        } else {
            popUp.style.display = 'none';
        } 
    }

    $scope.addUser = function () {

        userService.addUser($scope.userModel).then(function (data) {
            $scope.userList = data;
            $scope.togglePop(false);

            // flushing model
            $scope.userModel = {
                'id': 0,
                'first_name': '',
                'last_name': '',
                'email': '',
                'gender': 'Male',
                'password': ''
            }
        });
    }

    $scope.deleteUser = function (uId) {
        if (confirm('Are you sure?')) {
            $scope.userList = userService.deleteUser(uId);
        }
    }

    $scope.sort = function (sItem) {
        
        sortItem = sItem;
        sortOrder = $scope.sortItems[sortItem] ? 'ASC' : 'DESC';

        // changes sortItem value to opposite
        $scope.sortItems[sortItem] = $scope.sortItems[sortItem] ? false : true;

        userService.getUserList(sortItem, sortOrder, $scope.currentPage).then(function (data) {
            $scope.userList = data;
        });
    }

    $scope.search = function () {

        userService.search($scope.searchText).then(function (data) {
            $scope.userList = data;
            $scope.searchText = '';
        });
    }

    // init function
    $scope.pagination();

});
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
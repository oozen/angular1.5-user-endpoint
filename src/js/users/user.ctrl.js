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
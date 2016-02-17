imsApp = angular.module('imsApp', ['ui.materialize']);


imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.pages = ['login.html', 'student.html', 'admin.html'];
        $scope.current = $scope.pages[2];
        $scope.data = null;
        $scope.preload =
                {
                    allCountries: [],
                    skills: []
                };
        $scope.predicates = null;
        $scope.resetPredicates = function ()
        {
            default_predicates =
                    {
                        nationality: 0,
                        gender: 0,
                        status: 0,
                        skills: [null, [], [], []],
                        degrees: [0, 0, 0],
                        work: 0
                    };
            $scope.predicates = JSON.parse(JSON.stringify(default_predicates));
            angular.element('#work-experience-tab a').trigger('click');
            angular.element('#w1').trigger('click');
        };
        $scope.resetPredicates();
        $scope.loadAllSkills = function ()
        {
            if (0 !== $scope.preload.skills.length)
            {
                return;
            }
            loadSkills = function (stid)
            {
                $http({method: 'GET', url: 'http://localhost:8080/skilltype/' + stid + '/skill'})
                        .then(function (response) {
                            $scope.preload.skills[stid] = response.data.data;
                        }, function (response) {});
            };
            for (i = 1; i <= 3; i++)
            {
                loadSkills(i);
            }
        };
        $scope.loadAllCountries = function ()
        {
            if (0 === $scope.preload.allCountries.length)
            {
                $http({method: 'GET', url: 'http://localhost:8080/country/all'})
                        .then(function (response)
                        {
                            $scope.preload.allCountries = response.data.data;
                        }, function (response) {});
            }
        };
    }]);


imsApp.controller('adminController', ['$scope', '$http', function ($scope, $http) {
        $scope.print = function ()
        {
            console.log($scope.predicates);
        };
    }]);
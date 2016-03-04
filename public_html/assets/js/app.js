imsApp = angular.module('imsApp', ['ui.materialize']);

imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.pages = ['login.html', 'student/student.html', 'admin/admin.html'];
        $scope.current = $scope.pages[2];
        $scope.data = null;
        $scope.preload =
                {
                    certifications: [],
                    allCountries: [],
                    skills: [],
                    companies: []
                };
        $scope.loadAllCompanies = function ()
        {
            if (0 === $scope.preload.companies.length)
            {
                $http({method: 'GET', url: 'http://localhost:8080/company/all'})
                        .then(function (response)
                        {
                            $scope.preload.companies = response.data.data;
                        }, function (response) {});
            }
        };
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
                            $scope.preload.skills[stid - 1] = response.data.data;
                        }, function (response) {});
            };
            for (i = 1; i <= 3; i++)
            {
                loadSkills(i);
            }
        };
        $scope.loadAllCertifications = function ()
        {
            if (0 === $scope.preload.certifications.length)
            {
                $http({method: 'GET', url: 'http://localhost:8080/major/certification'})
                        .then(function (response)
                        {
                            $scope.preload.certifications = response.data.data;
                        }, function (response) {});
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

        $scope.predicates = null;
        $scope.resetPredicates = function ()
        {
            default_predicates =
                    {
                        personal:
                                {
                                    firstName: "",
                                    middleName: "",
                                    lastName: "",
                                    nationality: 0,
                                    gender: 0,
                                    status: 0,
                                    availability: 0
                                },
                        education:
                                {
                                    skills: [[], [], []],
                                    degrees: [0, 0, 0],
                                    certifications: []
                                },
                        experience:
                                {
                                    exp: [],
                                    work: 0,
                                    companyCountry: 0,
                                    since: 0
                                }
                    };
            $scope.predicates = JSON.parse(JSON.stringify(default_predicates));
            angular.element('#work-experience-tab a').trigger('click');
            angular.element('#w1').trigger('click');
        };
        $scope.resetPredicates();
        $scope.adminPages = ['admin/student.html', 'admin/company.html', 'admin/job.html'];
        $scope.adminCurrent = $scope.adminPages[0];
        $scope.print = function ()
        {
            console.log(JSON.stringify($scope.predicates));
        };
        $scope.searchStudent = function ()
        {
            $scope.predicates.education.skillsMerged =
                    $scope.predicates.education.skills[0]
                    .concat($scope.predicates.education.skills[1])
                    .concat($scope.predicates.education.skills[2]);
            $http({method: 'PUT', url: 'http://localhost:8080/admin/student', data: $scope.predicates})
                    .then(function (response) {}, function (response) {});
        };
        $scope.genderRadioBox = function ()
        {
            $scope.predicates.personal.gender = $("#genderRadioBox").prop('checked') ? 1 : 0;
        };
        $scope.statusRadioBox = function ()
        {
            $scope.predicates.personal.status = $("#statusRadioBox").prop('checked') ? 1 : 0;
        };
        $scope.availabilityRadioBox = function ()
        {
            $scope.predicates.personal.availability = $("#availabilityRadioBox").prop('checked') ? 1 : 0;
        };


        $scope.submitStudent = function ()
        {
            $scope.statusRadioBox();
            $scope.genderRadioBox();
            $scope.availabilityRadioBox();
            for (var i = 0; i < $scope.predicates.experience.exp.length; i++)
            {
                if ($scope.predicates.experience.exp[i].com === null)
                {
                    $scope.predicates.experience.exp[i] = null;
                }
            }
            $scope.print();
            $http({method: 'POST', url: 'http://localhost:8080/admin/student', data: $scope.predicates})
                    .then(function (response) {}, function (response) {});
        };
    }]);
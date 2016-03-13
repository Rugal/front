imsApp = angular.module('imsApp', ['ui.materialize', 'ngTable']);
imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.HOST = 'http://localhost:8080';
        $scope.pages = ['login.html', 'student/student.html', 'admin/admin.html'];
        $scope.current = $scope.pages[2];
//        $scope.data = null;
        $scope.preload =
                {
                    certifications: [],
                    allCountries: [],
                    skills: [],
                    majors: [],
                    universities: [],
                    companies: [],
                    students: []
                };
        $scope.loadAllCompanies = function ()
        {
            if (0 === $scope.preload.companies.length)
            {
                $http({method: 'GET', url: $scope.HOST + '/company/all'})
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
                $http({method: 'GET', url: $scope.HOST + '/skilltype/' + stid + '/skill'})
                        .then(function (response) {
                            $scope.preload.skills[stid - 1] = response.data.data;
                        }, function (response) {});
            };
            for (i = 1; i <= 3; i++)
            {
                loadSkills(i);
            }
        };
        $scope.loadAllUniversities = function ()
        {
            if (0 === $scope.preload.universities.length)
            {
                $http({method: 'GET', url: $scope.HOST + '/university/all'})
                        .then(function (response)
                        {
                            $scope.preload.universities = response.data.data;
                        }, function (response) {});
            }
        };
        $scope.loadAllMajors = function ()
        {
            if (0 === $scope.preload.majors.length)
            {
                $http({method: 'GET', url: $scope.HOST + '/major?type=major'})
                        .then(function (response)
                        {
                            $scope.preload.majors = response.data.data;
                        }, function (response) {});
            }
        };
        $scope.loadAllCertifications = function ()
        {
            if (0 === $scope.preload.certifications.length)
            {
                $http({method: 'GET', url: $scope.HOST + '/major?type=certification'})
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
                $http({method: 'GET', url: $scope.HOST + '/country/all'})
                        .then(function (response)
                        {
                            $scope.preload.allCountries = response.data.data;
                        }, function (response) {});
            }
        };
    }]);
imsApp.controller('adminController', ['$scope', '$http', function ($scope, $http) {

        $scope.predicates = null;
        $scope.getStudent = function (sid)
        {
            var getSkillsByStudent = function (sid) {
                $http({method: 'GET', url: $scope.HOST + '/skillset?student=' + sid})
                        .then(function (response) {
                            var get = response.data.data;
                            $scope.predicates.education.skills = get;
                        }, function (response) {});
            };
            var getEducationsByStudent = function (sid) {
                $http({method: 'GET', url: $scope.HOST + '/education?type=major&student=' + sid})
                        .then(function (response) {
                            var get = response.data.data;
                            for (var i = 0; i < get.length; i++)
                            {
                                $scope.predicates.education.deg[i].uid = get[i].university.uid;
                                $scope.predicates.education.deg[i].mid = get[i].major.mid;
                                $scope.predicates.education.deg[i].from = get[i].startDate;
                                $scope.predicates.education.deg[i].to = get[i].endDate;
                                $scope.predicates.education.deg[i].gpa = get[i].gpa;
                            }
                        }, function (response) {});
            };
            var getCertificationsByStudent = function (sid) {
                $http({method: 'GET', url: $scope.HOST + '/education?type=certification&student=' + sid})
                        .then(function (response) {
                            var get = response.data.data;
                            $scope.predicates.education.certifications = get;
                        }, function (response) {});
            };
            var getExperienceByStudent = function (sid) {
                $http({method: 'GET', url: $scope.HOST + '/experience?student=' + sid})
                        .then(function (response) {
                            var get = response.data.data;
                            for (var i = 0; i < get.length; i++)
                            {
                                $scope.predicates.experience.exp[i].com = get[i].company.cid;
                                $scope.predicates.experience.exp[i].from = get[i].startDate;
                                $scope.predicates.experience.exp[i].to = get[i].endDate;
                            }
                        }, function (response) {});
            };
            $http({method: 'GET', url: $scope.HOST + '/student/' + sid})
                    .then(function (response) {
                        var get = response.data.data;
                        $scope.predicates.personal.availability = get.availability;
                        $scope.predicates.personal.status = get.status;
                        $scope.predicates.personal.gender = get.gender;
                        $scope.predicates.personal.firstName = get.firstName;
                        $scope.predicates.personal.middleName = get.middleName;
                        $scope.predicates.personal.lastName = get.lastName;
                        getSkillsByStudent(get.sid);
                        getEducationsByStudent(get.sid);
                        getCertificationsByStudent(get.sid);
                        getExperienceByStudent(get.sid);
                    }, function (response) {});
        };
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
                                    deg: [{uid: 0, mid: 0}, {uid: 0, mid: 0}, {uid: 0, mid: 0}],
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
            $scope.preload.students = [];
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
            $http({method: 'PUT', url: $scope.HOST + '/admin/student',
                headers: {'Content-Type': 'application/json'}, data: $scope.predicates})
                    .then(function (response) {
                        $scope.preload.students = response.data.data;
                    }, function (response) {});
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
            $http({method: 'POST', url: $scope.HOST + '/admin/student', data: $scope.predicates})
                    .then(function (response) {}, function (response) {});
        };
    }]);
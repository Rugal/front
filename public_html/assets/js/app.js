imsApp = angular.module('imsApp', ['ui.materialize', 'ngTable']);
imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.HOST = 'http://localhost:8080';
        $scope.pages = ['login.html', 'student/student.html', 'admin/admin.html'];
        $scope.current = $scope.pages[0];
        $scope.preload = {
            login: null,
            skillTypes: [{stid: 1, name: "Technical"}, {name: "CMS", stid: 2}, {name: "Operating System", stid: 3}],
            types: [],
            certifications: [],
            allCountries: [],
            skills: [],
            majors: [],
            universities: [],
            companies: [],
            students: [],
            cities: [],
            jobGroups: [],
            jobs: []
        };
        $scope.signout = function ()
        {
            $scope.current = $scope.pages[0];
            $scope.login = null;
        };
        $scope.switchPage = function ()
        {
            console.log($scope.preload.login);
            if ($scope.preload.login === 'admin')
            {
                $scope.current = $scope.pages[2];
            } else
            {
                $scope.current = $scope.pages[1];
            }
            $scope.preload.login = null;
        };
        $scope.loadAllJobGroups = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/jobgroup/all'})
                    .then(function (response)
                    {
                        $scope.preload.jobGroups = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllTypes = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/company/type/all'})
                    .then(function (response)
                    {
                        $scope.preload.types = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllCities = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/city/all'})
                    .then(function (response)
                    {
                        $scope.preload.cities = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllCompanies = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/company/all'})
                    .then(function (response)
                    {
                        $scope.preload.companies = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllSkills = function ()
        {
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
            $http({method: 'GET', url: $scope.HOST + '/university/all'})
                    .then(function (response)
                    {
                        $scope.preload.universities = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllMajors = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/major?type=major'})
                    .then(function (response)
                    {
                        $scope.preload.majors = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllCertifications = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/major?type=certification'})
                    .then(function (response)
                    {
                        $scope.preload.certifications = response.data.data;
                    }, function (response) {});
        };
        $scope.loadAllCountries = function ()
        {
            $http({method: 'GET', url: $scope.HOST + '/country/all'})
                    .then(function (response)
                    {
                        $scope.preload.allCountries = response.data.data;
                    }, function (response) {});
        };
    }]);
imsApp.controller('adminController', ['$scope', '$http', function ($scope, $http) {
        $scope.companyPredicate = null;
        $scope.jobPredicate = null;
        $scope.skillPredicate = null;
        $scope.cityPredicate = null;
        $scope.predicates = null;
        $scope.print = function (obj)
        {
            console.log(JSON.stringify(obj));
        };
        $scope.getCompany = function (cid)
        {
            $http({method: 'GET', url: $scope.HOST + '/company/' + cid})
                    .then(function (response) {
                        $scope.companyPredicate = response.data.data;
                        $('#add-company-modal').openModal();
                    }, function (response) {});
        };
        $scope.getJob = function (jid)
        {
            $http({method: 'GET', url: $scope.HOST + '/job/' + jid})
                    .then(function (response) {
                        $scope.jobPredicate = response.data.data;
                        $('#add-job-modal').openModal();
                    }, function (response) {});
        };
        $scope.deleteCompany = function (cid)
        {
            $http({method: 'DELETE', url: $scope.HOST + '/company/' + cid})
                    .then(function (response) {
                    }, function (response) {});
        };
        $scope.deleteJob = function (jid)
        {
            $http({method: 'DELETE', url: $scope.HOST + '/job/' + jid})
                    .then(function (response) {
                    }, function (response) {});
        };
        $scope.getStudent = function (sid)
        {
            var getSkillsByStudent = function (sid) {
                $http({method: 'GET', url: $scope.HOST + '/skillset?student=' + sid})
                        .then(function (response) {
                            var get = response.data.data;
                            for (var i = 0; i < 3; i++)
                            {
                                $scope.predicates.education.skills[i] = get;
                            }
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
                            $scope.print();
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
                                $scope.predicates.experience.exp[i] = {};
                                $scope.predicates.experience.exp[i].com = get[i].company.cid;
                                $scope.predicates.experience.exp[i].from = get[i].startDate;
                                $scope.predicates.experience.exp[i].to = get[i].endDate;
                            }
                        }, function (response) {});
            };
            $http({method: 'GET', url: $scope.HOST + '/student/' + sid})
                    .then(function (response) {
                        var get = response.data.data;
                        $scope.print(get);
                        $scope.predicates.personal.availability = get.availability;
                        $scope.predicates.personal.nationality = get.country.cid;
                        $scope.predicates.personal.status = get.status;
                        $scope.predicates.personal.gender = get.gender;
                        $scope.predicates.personal.firstName = get.firstName;
                        $scope.predicates.personal.middleName = get.middleName;
                        $scope.predicates.personal.lastName = get.lastName;
                        $("#genderRadioBox").prop('checked', $scope.predicates.personal.gender);
                        $("#statusRadioBox").prop('checked', $scope.predicates.personal.status);
                        $("#availabilityRadioBox").prop('checked', $scope.predicates.personal.availability);
                        getSkillsByStudent(get.sid);
                        getEducationsByStudent(get.sid);
                        getCertificationsByStudent(get.sid);
                        getExperienceByStudent(get.sid);
                        $('#add-student-modal').openModal();
                    }, function (response) {});
        };
        $scope.resetPredicates = function ()
        {
            var resetCity = function ()
            {
                var default_city = {
                    name: null, country: {cid: 1}
                };
                $scope.cityPredicate = JSON.parse(JSON.stringify(default_city));
            };
            var resetSkill = function ()
            {
                var default_skill = {
                    name: null, skillType: {stid: 1}
                };
                $scope.skillPredicate = JSON.parse(JSON.stringify(default_skill));
            };
            var resetJob = function ()
            {
                var default_job = {
                    responsibility: null, salary: 1000, jobGroup: {jgid: 0}, requirements: [],
                    company: {city: {cid: 0}, companyType: {cid: 0}}, skills: [[], [], []]
                };
                $scope.jobPredicate = JSON.parse(JSON.stringify(default_job));
                $scope.preload.jobs = [];
            };
            var resetCompany = function ()
            {
                var default_company = {
                    name: null, address: null, note: null, postal: null,
                    city: {cid: 0}, email: null, website: null, telephone: null,
                    firstName: null, lastName: null, position: null, companyType: {cid: 0}
                };
                $scope.companyPredicate = JSON.parse(JSON.stringify(default_company));
                $scope.preload.companies = [];
            };
            var resetStudent = function ()
            {
                var default_predicates = {
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
                                degrees: [],
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
            };
            resetCompany();
            resetStudent();
            resetJob();
            resetSkill();
            resetCity();
            angular.element('#work-experience-tab a').trigger('click');
            angular.element('#w1').trigger('click');
        };
        $scope.resetPredicates();
        $scope.adminPages = ['admin/student.html', 'admin/company.html', 'admin/job.html'];
        $scope.adminCurrent = $scope.adminPages[0];
        $scope.searchJob = function ()
        {
            $scope.jobPredicate.requirements =
                    $scope.jobPredicate.skills[0]
                    .concat($scope.jobPredicate.skills[1])
                    .concat($scope.jobPredicate.skills[2]);
            $http({method: 'PUT', url: $scope.HOST + '/admin/job',
                headers: {'Content-Type': 'application/json'}, data: $scope.jobPredicate})
                    .then(function (response) {
                        $scope.preload.jobs = response.data.data;
                    }, function (response) {});
        };
        $scope.searchCompany = function ()
        {
            $http({method: 'PUT', url: $scope.HOST + '/admin/company',
                headers: {'Content-Type': 'application/json'}, data: $scope.companyPredicate})
                    .then(function (response) {
                        $scope.preload.companies = response.data.data;
                    }, function (response) {});
        };
        $scope.searchStudent = function ()
        {
            $scope.predicates.education.skillsMerged =
                    $scope.predicates.education.skills[0]
                    .concat($scope.predicates.education.skills[1])
                    .concat($scope.predicates.education.skills[2]);
            $scope.print($scope.predicates);
            $http({method: 'PUT', url: $scope.HOST + '/admin/student',
                headers: {'Content-Type': 'application/json'}, data: $scope.predicates})
                    .then(function (response) {
                        $scope.preload.students = response.data.data;
                    }, function (response) {});
        };
        $scope.deleteStudent = function (sid)
        {
            $http({method: 'DELETE', url: $scope.HOST + '/student/' + sid})
                    .then(function (response) {
//                        $scope.preload.students = response.data.data;
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
            $scope.predicates.education.skillsMerged =
                    $scope.predicates.education.skills[0]
                    .concat($scope.predicates.education.skills[1])
                    .concat($scope.predicates.education.skills[2]);
            $scope.print();
            $http({method: 'POST', url: $scope.HOST + '/admin/student', data: $scope.predicates})
                    .then(function (response) {}, function (response) {});
        };
        $scope.addCity = function ()
        {
            $http({method: 'POST', url: $scope.HOST + '/city', data: $scope.cityPredicate})
                    .then(function (response) {}, function (response) {});
        };
        $scope.addSkill = function ()
        {
            $http({method: 'POST', url: $scope.HOST + '/skill', data: $scope.skillPredicate})
                    .then(function (response) {}, function (response) {});
        };
        $scope.addJob = function ()
        {
            $scope.jobPredicate.requirements =
                    $scope.jobPredicate.skills[0]
                    .concat($scope.jobPredicate.skills[1])
                    .concat($scope.jobPredicate.skills[2]);
            $http({method: 'POST', url: $scope.HOST + '/admin/job', data: $scope.jobPredicate})
                    .then(function (response) {}, function (response) {});
        };
        $scope.addCompany = function ()
        {
            $http({method: 'POST', url: $scope.HOST + '/admin/company', data: $scope.companyPredicate})
                    .then(function (response) {}, function (response) {});
        };
    }]);
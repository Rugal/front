imsApp = angular.module('imsApp', ['ngRoute', 'ngAnimate']);

imsApp.config(function ($routeProvider)
{
    $routeProvider
            .when('/login', {templateUrl: 'login.html'})
            .when('/student', {templateUrl: 'student.html'})
            .when('/admin', {templateUrl: 'admin.html'});
});

imsApp.controller('Controller', function ($scope) {
});
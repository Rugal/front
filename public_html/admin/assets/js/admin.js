$(document).ready(function () {
    $('#wrapper .modal-trigger').leanModal();
    $('ul.tabs').tabs();
    $('select').material_select();
    $("#w1").click(function () {
        $("#company-country-tab").addClass('disabled');
        $("#time-tab").addClass('disabled');
    });
    $("#w3").click(function () {
        $("#company-country-tab").addClass('disabled');
        $("#time-tab").removeClass('disabled');
    });
    $("#w2").click(function () {
        $("#company-country-tab").removeClass('disabled');
        $("#time-tab").removeClass('disabled');
    });
});
$('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left' // Displays dropdown with edge aligned to the left of button
});
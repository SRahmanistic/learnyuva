$(document).ready(function () {
    $("#login").click(function()
    {
        $('#loginModal').modal('show');
        $('.container' ).addClass('blur' );
    });
    $(".close").click(function()
    {
        $("#loginModal").modal('hide');
        $('.cont' ).removeClass('blur' );
    });
    $("#signup").click(function()
    {
        $('#signupModal').modal('show');
        $('.container' ).addClass('blur' );
    });
    $(".close").click(function()
    {
        $("#signupModal").modal('hide');
        $('.cont' ).removeClass('blur' );
    });
});
/*
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }*/

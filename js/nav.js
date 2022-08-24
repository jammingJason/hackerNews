'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $userStoryNav.show();
  storySubmit();
}

function storySubmit() {
  $navSubStory.on('click', function () {
    $allStoriesList.hide();
    $storiesForm.show();
  });
  $btnSubmit.on('click', function (evt) {
    evt.preventDefault();

    console.log(
      addStory(currentUser, {
        title: 'New Book to Enjoy',
        author: 'VJC',
        url: 'www.google.com',
      })
    );
  });
}

'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// Show favorites
$navSubFav.on('click', function () {
  clearMyFavorites();
  hidePageComponents();
  $divFav.show();
  for (let i = 0; i < currentUser.favorites.length; i++) {
    const favStory = generateStoryMarkup(currentUser.favorites[i]);
    $favList.append(favStory);
  }
});

//  At the end of the list, add more stories
let intCount = 0;
window.onscroll = function (ev) {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    if (intCount === 0) {
      getMoreStories();
      intCount++;
    }
  }
};

async function getMoreStories() {
  // alert("you're at the bottom of the page");
  // query the /stories endpoint (no auth required)
  const response = await axios({
    url: `${BASE_URL}/stories?skip=25&limit=25`,
    method: 'GET',
  });

  // turn plain old story objects from API into instances of Story class
  const stories = response.data.stories.map((story) => new Story(story));
  // console.log(stories);
  for (let i = 0; i < stories.length; i++) {
    const favStory = generateStoryMarkup(stories[i]);
    $allStoriesList.append(favStory);
    console.log(favStory);
  }
}

//   Show My Stories
$navSubMyStories.on('click', () => {
  clearMyFavorites();
  hidePageComponents();
  $divMyStories.show();
  for (let i = 0; i < currentUser.ownStories.length; i++) {
    const myListStory = generateStoryMarkup(currentUser.ownStories[i]);
    $myStoriesList.append(myListStory);
  }
});

//  Clear the contents of DIV that makes the call (my stories OR favorites)
function clearMyFavorites() {
  const getLI = document.querySelectorAll('.listItems');
  for (const key in getLI) {
    if (Object.hasOwnProperty.call(getLI, key)) {
      const element = getLI[key];
      element.remove();
    }
  }
}

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const rndNum = Math.random();
  const hostName = story.getHostName();
  let color = 'black';
  for (let i = 0; i < currentUser.favorites.length; i++) {
    if (story.storyId === currentUser.favorites[i].storyId) {
      color = 'gold';
    }
  }
  return $(`
      <li id="${story.storyId}" class = "listItems">
      <a href="javascript:generateStarClick('${story.storyId}', ${rndNum})">
      <i class="fa-solid fa-star" id="${rndNum}" style="color:${color}"></i></a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <small class="story-remove">
        <a href="javascript:removeStory('${story.storyId}', '${story.title}', '${story.username}')">Remove</a>
        </small>
      </li>
      
    `);
}

//  Remove a specific story you have created
async function removeStory(storyID, storyTitle, storyUsername) {
  // alert(storyID);
  if (currentUser.username !== storyUsername) {
    alert('You cannot delete a story you did not post!');
    return;
  }
  const token = currentUser.loginToken;
  const res = await axios({
    method: 'DELETE',
    url: `${BASE_URL}/stories/${storyID}`,
    data: { token },
  });
  // console.log(response);
  // console.log(res);
  alert(storyTitle + ' has been removed!');
  location.reload();
}

async function generateStarClick(storyID, rndNum) {
  let method = 'POST';
  for (let i = 0; i < currentUser.favorites.length; i++) {
    if (storyID === currentUser.favorites[i].storyId) {
      method = 'DELETE';
    }
  }
  const token = currentUser.loginToken;
  const star = document.getElementById(rndNum);
  star.style.color = 'gold';
  const response = await axios({
    method: method,
    url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyID}`,
    data: { token },
  });
  // console.log(response);
  location.reload();
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//  Creates a new Story
function storySubmit() {
  $navSubStory.on('click', function () {
    hidePageComponents();
    $storiesForm.show();
  });
  $btnSubmit.on('click', function (evt) {
    evt.preventDefault();
    const strAuthor = document.querySelector('#stories-author');
    const strTitle = document.querySelector('#stories-title');
    const strURL = document.querySelector('#stories-url');

    let newStory = storyList.addStory(currentUser, {
      title: strTitle.value,
      author: strAuthor.value,
      url: strURL.value,
    });
    strTitle.value = '';
    strAuthor.value = '';
    strURL.value = '';
    newStory;
    setTimeout(start, 3000);
  });
}

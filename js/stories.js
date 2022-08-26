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
        <small class="story-remove"><a href="javascript:removeStory('${story.storyId}')">Remove</a>
        </small>
      </li>
      
    `);
}

async function removeStory(storyID) {
  // alert(storyID);

  const token = currentUser.loginToken;
  const res = await axios({
    method: 'DELETE',
    url: `${BASE_URL}/stories/${storyID}`,
    data: { token },
  });
  // console.log(response);
  // console.log(res);

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

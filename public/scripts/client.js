/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function(tweets) {
// loops through tweets
// calls createTweetElement for each tweet
  for (let tweet of tweets) {
    $('.tweet-container').prepend(createTweetElement(tweet));
  }
};

// function to protect from XSS (Cross-Site scripting)
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function(tweet) {
  let $tweet = `
  <section class="tweet-posted">
    <header class="header-unique">
      <div id="profile">
        <img id="resize" src="${tweet["user"]["avatars"]}">
        <h2>${tweet["user"]["name"]}</h2>
      </div>
      <div id="username">
        <div>
          <h2>${tweet["user"]["handle"]}</h2>
        </div>
      </div>
    </header>
    <div class="tweet-content">
      <article>${escape(tweet["content"]["text"])}</article>
    </div>
    <footer>
      <span>${moment(tweet["created_at"]).fromNow()}</span>
      <span id="tweet-links">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </span>
    </footer>
  </section>
  `;
  return $tweet;
};

// Gets the tweet from the database and renders it.
const loadAllTweets = () => {
  $.ajax({
    method: "GET",
    url: "/tweets",
  })
    .then(res => {
      $('.tweet-container').empty();
      renderTweets(res);
    });
};

// Add DOM Element to HTML file
const renderErrMsg = (message) => {
  $('.error-message').append(`
    <div>
      <i class="fas fa-exclamation-triangle"></i>
      ${message}
      <i class="fas fa-exclamation-triangle"></i>
    </div>
  `).slideDown(500);
};
$(()  =>{
  // Initial webpage load - it will load the messages
  // When new tweet is posted, it will post the data to /tweets and load the new tweet.
  $('form').on('submit', function(event) {
    event.preventDefault();
    $('.error-message').empty().slideUp(500);
    const $form = $(this);
    const $formData = $form.serialize();
    const $inputLen =  $('#tweet-text').val().length;
    if ($inputLen <= 140 && $inputLen > 0) {
      $.ajax({
        method: "POST",
        url: "/tweets",
        data: $formData,
      })
        .then(() => {
          $('.counter').text(140);
          loadAllTweets();
          this.reset();
        });
    } else if ($inputLen > 140) {
      renderErrMsg('Tweet is over character limit of 140');
    } else if ($inputLen <= 0) {
      renderErrMsg('Unable to post empty tweet');
    }
  });
  loadAllTweets();

  // strech work but do not like the implementation
  // $('.nav-redirect').on('click', function(event) {
  //   $('.new-tweet').slideToggle();
  // })

  // a button will appear when user scrolls the webpage, when clicked it will redirect user to the top of the page.
  $(window).scroll(function() {
    let height = $(window).scrollTop();
    if (height > 50) {
      $('.redirect-button').fadeIn();
    } else {
      $('.redirect-button').fadeOut();
    }

    $(".redirect-button").click(function(event) {
      event.preventDefault();
      $("html, body").stop().animate({ scrollTop: 0 }, "slow");
      return false;
    });
  });

  // When user clicks "Write a new tweet" on nav bar it will scroll to the form and focus on the form ready to type.
  $('.nav-redirect').on('click',function(event) {
    event.preventDefault;
    $("body, html").animate({
      scrollTop: $('.container').offset().top
    }, 600).find('#tweet-text').focus();
  });
});

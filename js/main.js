/**
 * File main.js.
 *
 * Everything is wrapped in an Immediately-Invoked
 * Function Expression (IIFE) for security/scope.
 *
 * See http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 */
(function() {

  // Initialize the API.
  const apiUrl = `https://voorhoede-colibri-api-zhmoaomjvy.now.sh/api/v1`

  function restRequest(query) {
    return fetch(`${apiUrl}${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
  };

  // Get the data back in a useable state.
  let blogInfo = new Promise(function(resolve, reject) {
    resolve(restRequest(`/blog`));
  });

  // Add the blog info to the page.
  blogInfo.then(function(blog) {
    let subtitle = document.querySelectorAll('.subtitle'),
      description = document.querySelectorAll('.description');
    subtitle[0].innerHTML = blog.subtitle;
    // description[0].innerHTML = blog.description;
  });

  // Now get all the posts and put them in an object.
  let allPosts = new Promise(function(resolve, reject) {
    resolve(restRequest(`/posts`));
  });

  // Primary search function.
  function searchResults(formData = '', searchByWeight) {

    // Prefer formData.get('search-box')... but iOS does not support.
    let searchTerm = '';
    if (formData.length != 0) {
      searchTerm = formData.toLowerCase();
    };

    // Apply toLowerCase to the formData argument.
    let searchResults = [],
      resultCount = document.querySelectorAll('.search-results-count'),
      resultPreview = document.querySelectorAll('.search-results');

    // Search the posts for matching strings.
    allPosts.then(function(posts) {
      // Debug - so we can see what's available.
      // console.log( posts[0] )
      let resultText = "";

      for (let i = 0; i < posts.length; i++) {
        // Apply toLowerCase to blogPosts.
        let blogPosts = posts[i].body.toLowerCase();

        // Create an object that has the post id and the count of terms.
        if (blogPosts.indexOf(searchTerm) >= 0) {
          let result = {};
          result.post = i;
          result.weight = (blogPosts.split(searchTerm).length - 1);
          searchResults.push(result);
        }
      }

      // Sort by weight.
      if (searchByWeight) {
        searchResults.sort(function(a, b) {
          return b.weight - a.weight;
        });
        resultText = 'sorted by relevance.';
      } else {
        resultText = 'sorted by most recent.';
      };

      // Update results count.
      let searchCount = searchResults.length,
        resultPlural = ' results, ';

      // 1 'results' makes me crazy.
      // Using logic operator for fun/compactness.
      searchCount == 0 && (resultText = 'perhaps try again?');
      searchCount == 1 && (resultPlural = ' result, ');

      // Show 3 blog posts by default.
      if (formData.length == 0) {
        resultCount[0].innerHTML = 'Showing most recent three out of ' + searchCount + ' blog posts.'
        searchCount = 3;
      } else {
        resultCount[0].innerHTML = searchCount + resultPlural + resultText;
      };

      // Get all the previews and post them as links.
      let postPreview = '';
      for (let j = 0; j < searchCount; j++) {
        let key = searchResults[j].post;

        postPreview += '<li>';
        postPreview += '<h4><a href="https://www.voorhoede.nl/en/blog/' + posts[key].slug + '/">' + posts[key].title + '</a></h4><cite>https://www.voorhoede.nl/en/blog/' + posts[key].slug + '</cite>';
        // Check that there's a preview!
        posts[key].teaser != null && (postPreview += posts[key].teaser);
        postPreview += '</li>';
      }

      resultPreview[0].innerHTML = postPreview;

    });
  };

  // Add event listner to the search form.
  window.onload = function() {

    document.querySelector("#search-form")
      .addEventListener("submit", function(e) {
        e.preventDefault();

        let formData = e.target[0].value
          searchByWeight = e.target[1].checked;

        // (ES6 only - doesn't work on mobile Safari!).
        // let formData = new FormData(e.target),
        //   searchByWeight = formData.get('sort-by-weight');

        searchResults(formData, searchByWeight);
        document.querySelector('main').classList.add('with-results');

      }, false);

    // Default search.
    searchResults();
  };


})();

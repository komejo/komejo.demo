/**
 * File main.js.
 *
 * Everything is wrapped in an Immediately-Invoked
 * Function Expression (IIFE) for security/scope.
 *
 * See http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 */
( function() {

  // Get all the blog posts.
  const apiUrl = `https://voorhoede-colibri-api-zhmoaomjvy.now.sh/api/v1`

  function restRequest(query) {
    return fetch(`${apiUrl}${query}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
  }

  // Get the data back in a useable state.
  let blogInfo = new Promise(function(resolve, reject) {
    resolve(restRequest(`/blog`));
  });

  // Add the blog info to the page.
  blogInfo.then(function(blog) {
    var title = document.querySelectorAll('.title'),
        subtitle = document.querySelectorAll('.subtitle'),
        description = document.querySelectorAll('.description');
    title[0].prepend(blog.title + ' ');
    subtitle[0].innerHTML += blog.subtitle;
    description[0].innerHTML += blog.description;
  });

  // Get all the posts and put them in an object.
  let allPosts = new Promise(function(resolve, reject) {
    resolve(restRequest(`/posts`));
  });


  // Add vanilla event listner to the search form.
  window.onload = function () {
    document.querySelector("#search")
    .addEventListener("submit", function(e) {
      e.preventDefault();

      // Get the submitted search string.
      const formData = new FormData(e.target);
      const searchTerm = formData.get('search-box');
      let searchResultsBody = [];
      let resultCount = document.querySelectorAll('.search-results-count');
      let resultPreview = document.querySelectorAll('.search-results');

      // Search the post body for matching strings.
      allPosts.then(function(posts) {
        console.log( posts[0] )

        for(var i = 0; i < posts.length; i++){
         var str = posts[i].body;
          if(str.indexOf(searchTerm) >= 0){
           searchResultsBody.push(i)
          }
        }
        // Update results count.
        let searchCount = searchResultsBody.length;
        resultCount[0].prepend(searchCount + ' Results');

        // Get all the previews and post them as links.
        let postPreview = '';
        for(var j = 0; j < searchCount; j++){
          let key = searchResultsBody[j];

          postPreview += '<li>'
          postPreview +=  '<h4><a href="https://www.voorhoede.nl/en/blog/' + posts[key].slug + '/">' + posts[key].title + '</a></h4>'
          postPreview +=  posts[key].teaser
          postPreview += '</li>'
        }

        resultPreview[0].innerHTML = postPreview;

      });


    }, false);
  }


} )();

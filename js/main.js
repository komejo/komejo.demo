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
  var blogInfo = new Promise(function(resolve, reject) {
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

  // 
  var allPosts = new Promise(function(resolve, reject) {
    resolve(restRequest(`/posts`));
  });

  allPosts.then(function(posts) {
    // console.log( posts )
  });

  // Add vanilla event listner to the search form.
  window.onload = function () {
    document.querySelector("#search")
    .addEventListener("submit", function(e) {
        e.preventDefault();






    }, false);
  }


} )();

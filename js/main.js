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

  // Get the data back in a useable/cacheable state.
  var blogInfo = new Promise(function(resolve, reject) {
    resolve(restRequest(`/blog`));
  });

  blogInfo.then(function(blog) {
    // console.log( blog )
  });

  var allPosts = new Promise(function(resolve, reject) {
    resolve(restRequest(`/posts`));
  });

  allPosts.then(function(posts) {
    // console.log( posts )
  });


} )();

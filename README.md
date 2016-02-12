# node-gh-trending

# Usage
```
const trending = require('node-gh-trending');

trending.findTopRepos(function(res) {
  console.log('top repos: ', res);
});

trending.findReposByLang('javascript', function(res) {
  console.log('top javascript repos: ', res);
});

trending.findTopDevs(function(res) {
  console.log('top devs: ', res);
});
```

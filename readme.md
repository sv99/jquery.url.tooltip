iQuery Url tooltip
==================

Based on http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/

This version compatible with jQuery 3.
Not used `title` attribute - only download tooltip from the server.

```javascript

getTooltip = (url, cb) => {
    fetch(url)
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        console.log('Request successful', text);
        cb('<pre>' + text + '</pre>')
      })
}

$("p.tooltip").tooltip({
  bodyHandler: (el, cb) => getTooltip('/tooltip/', cb)
});
```

`el` in the callback need for access to the tooltip element.

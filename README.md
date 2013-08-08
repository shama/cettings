# cettings

HTML setting inputs like for a game.

** Work in progress **

## example

[View this example](http://shama.github.io/cettings)

```js
var settings = require('cettings')({
  controls: {
    forward: {
      value: '<up>',
      type: 'bindkey',
      on: function(key, val) {
        return 'altered ' + val
      },
    },
  },
})

container.appendChild(settings.html())

settings.on('set', function(key, val) {
  console.log(key + ' was set to ' + val)
})
```

## api

### `var settings = require('cettings')(config)`
`config` is an object with the first level keys being the headings and second level is for fields. Each field accepts:

- `value` The value entered for the field
- `type` Either `'bindkey'` to enable it to prompt for a key binding or `'text'` for plain text.
- `label` For a custom label.
- `on` A callback function to alter the value.

#### `settings.html()`
Builds and returns the HTML for the settings:

```html
<div class="settings">
  <ul>
    <li>
      <h3>controls</h3>
      <ul>
        <li>
          <label for="controls.forward">forward</label>
          <input id="controls.forward" />
        </li>
      </ul>
    </li>
  </ul>
</div>
```

#### `settings.on('set', key, val)`
Called whenever a value has been set.

## install

With [npm](https://npmjs.org) do:

```
npm install cettings
```

Use [browserify](http://browserify.org) to `require('cettings')`.

## release history
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young  
Licensed under the MIT license.

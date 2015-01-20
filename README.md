# xget

Express middleware for GETing multiple resources in one go!

## Install

```bash
npm install xget
```

## API

```js
var express      = require('express')
var xget = require('xget')

var app = express()
app.use(xget(3000))
```

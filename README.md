# xget
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Express middleware for GETing multiple resources in one go!

## Install

```bash
npm install xget
```

## API

```js
var express = require('express')
var xget = require('xget')

var app = express()
app.use(xget(3000))
```

## About

Suppose you have an API 
- GET api/users, api/users/:id
- GET api/customers, api/customers:id
- GET api/countries etc

Probably you don’t want to make 3 or 5 or 10 subsequent ajax requests, instead you want to GET all resources in one go.

This is a reusable express middleware for GETting multiple resources in one go.

Example of final use
- GET api/multi ? users=api/users & customer=api/customers/23 & countries=api/countries ..
returns {users: [..], customer: {..}, countries: [..] } 

[npm-image]: https://img.shields.io/npm/v/xget.svg?style=flat
[npm-url]: https://npmjs.org/package/xget
[downloads-image]: https://img.shields.io/npm/dm/xget.svg?style=flat
[downloads-url]: https://npmjs.org/package/xget

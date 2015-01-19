/**
 * Created by mbenezra on 15-01-16.
 */
var url = require('url');
var HTTP = require('q-io/http');
var _ = require('underscore');
var Q = require('q');

function singleUrl(url, key) {
    var deferred = Q.defer();
    HTTP.request('http://localhost:3000/' + url)
        .then(function (response) {
            return response.body.read();
        })
        .then(function (body) {
            var obj = new Object();
            obj[key] = JSON.parse(body);
            deferred.resolve(obj);
        });

    return deferred.promise;
}

function multipleUrls(urls) {
    var promises = [];
    _.each(urls, function(url, key){
        promises.push(singleUrl(url, key));
    });
    return Q.all(promises);
}

function multiGet(urls) {
    var data = [],
        deferred = Q.defer();

        multipleUrls(urls).then(function (result) {
            _.each(result, function (html) {
                console.log('html -> ' + html);
                data.push(html);
        });

        deferred.resolve(data);
    });

    return deferred.promise;
}


module.exports = function (){
    return function (req, res, next){

        if (req.url.indexOf('/api/multi') != 0) {
            return next();
        }

        var params = url.parse(req.url, true).query;
        var data = multiGet(params)
            .then(function(result){
                console.log('result -> ' + result);
                res.send(result);
            });
//        res.send(data);
    };
};
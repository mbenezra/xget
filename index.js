/**
 * Created by mbenezra on 15-01-16.
 */
var url = require('url');
var HTTP = require('q-io/http');
var _ = require('underscore');
var Q = require('q');

function singleUrl(url, key, port) {
    var deferred = Q.defer();
    HTTP.read('http://localhost:' + port + '/' + url)
        .then(function (body) {
            var obj = {};
            obj[key] = JSON.parse(body);
            deferred.resolve(obj);
        })
        .fail(function(err){
            deferred.resolve({});
        })
        .done();

    return deferred.promise;
}

function multipleUrls(urls, port) {
    var promises = [];
    _.each(urls, function(url, key){
        promises.push(singleUrl(url, key, port));
    });
    return Q.all(promises);
}

function multiGet(urls, port) {

    var data = {},
        deferred = Q.defer();

        multipleUrls(urls, port).then(function (result) {
            _.each(result, function (json) {
                data = _.extend(data, json);
            });

            deferred.resolve(data);
        });

    return deferred.promise;
}

module.exports = function (port){
    return function (req, res, next){

        if (req.url.indexOf('/api/multi') != 0) {
            return next();
        }

        var params = url.parse(req.url, true).query;
        var data = multiGet(params, port)
            .then(function(result){
                res.json(result);
            });
    };
};
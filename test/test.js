var assert = require('assert');
var xget = require('..');
var express = require('express');
var request = require('supertest');
var should = require('should');

var app = express();

app.use(xget());

app.listen(3000);

app.get('/api/users', function(req, res){
	res.json(['michael', 'ann']);
});

app.get('/api/users/:id', function(req, res){
	res.json({name:'michael'});
});

app.get('/api/customers', function(req, res){
	res.json(['michael', 'ann', 'tonni', 'julie']);
});

app.get('/api/customers/:id', function(req, res){
	res.json({name:'michael'});
});

app.get('/api/countries', function(req, res){
	res.json(['canada', 'denmark', 'france']);
});

describe('module', function(){
	it('should export xget() function', function(){
		assert(typeof xget(), 'function');
	});
});

describe('middleware', function(){
	it('should act as API handle for GET request starting with /api/multi', function(done){
		request(app)
			.get('/api/multi')
			.expect(200, done);
	});

	it('should handle a single get request', function(done){
		request(app)
			.get('/api/multi?users=api/users')
			.expect(200)
			.end(function(err, res){
				if(err){
					throw err;
				}
				res.body.should.have.property('users').with.lengthOf(2);
				done();
			});
	});

	it('should handle two get requests', function(done){
		request(app)
			.get('/api/multi?users=api/users&customers=api/customers')
			.expect(200)
			.end(function(err, res){
				if(err){
					throw err;
				}
				res.body.should.have.property('users').with.lengthOf(2);
				res.body.should.have.property('customers').with.lengthOf(4);
				done();
			});
	});

	it('should handle multiple get requests', function(done){
		request(app)
			.get('/api/multi?users=api/users&user=api/users/1&customers=api/customers&customer=api/customers/1&countries=api/countries')
			.expect(200)
			.end(function(err, res){
				if(err){
					throw err;
				}
				res.body.should.have.property('users').with.lengthOf(2);
				res.body.should.have.property('customers').with.lengthOf(4);
				res.body.should.have.property('customer').with.property('name', 'michael');
				res.body.should.have.property('user').with.property('name', 'michael');
				res.body.should.have.property('countries').with.lengthOf(3);
				done();
			});
	});

	it('should handle get request while ignoring requests for non-existing APIs', function(done){
		request(app)
			.get('/api/multi?users=api/users&oranges=api/oranges')
			.expect(200)
			.end(function(err, res){
				if(err){
					throw err;
				}
				res.body.should.have.property('users').with.lengthOf(2);
				res.body.should.not.have.property('oranges');
				done();
			});
	});

	it('should ignore requests for non-existing APIs', function(done){
		request(app)
			.get('/api/multi?oranges=api/oranges')
			.expect(200)
			.end(function(err, res){
				if(err){
					throw err;
				}
				res.body.should.not.have.property('oranges');
				done();
			});
	});	
});

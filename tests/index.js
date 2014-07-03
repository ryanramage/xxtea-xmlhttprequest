var xxtea = require('..'),
		test = require('tape'),
		assert = require('assert');

test('decrypt url', function(t){
	t.plan(1);
	xxtea('https://raw.githubusercontent.com/ryanramage/xxtea-xmlhttprequest/master/tests/out.text.tea', 'ODMzOWQ5M2pkb29lMmR3ZA==', function(err, data){
		t.equal(data.toString('utf-8'), 'Something secret should not be seen. Very amaze.!')
	})	
})


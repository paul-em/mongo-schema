# mongo-schema [![Build Status](https://secure.travis-ci.org/paul-em/mongo-schema.png?branch=master)](http://travis-ci.org/paul-em/mongo-schema)

Basic schema for mongodb. Can be used on server and client!

## Getting Started
Install the module with: `npm install mongo-schema`

```javascript
var mongoSchema = require('mongo-schema');
var errors = mongoSchema.check(yourDataToCheck, yourSchema);
 if(errors.length === 0){
  // schema did not throw any errors! YEY!
 } else {
   console.log(errors); // returns where there was an error
 }
```

### Bower
```
$ bower install https://github.com/paul-em/tiny-webrtc.git
```
bower_components/tiny-webrtc/dist/tiny-webrtc.min.js

## Documentation

__ coming soon __

## Examples

See the tests for more examples!

```javascript
var numberSchemaTest = {
  successTestNumber1: 123,
  successTestNumber2: 123,
  convertTestNumber: "456",
  failTestNumber1: "34a",
  failTestNumber2: [],
  failTestNumber3: {},
  failTestNumber4: null,
  failTestNumber5: undefined,
  failTestNumber6: "asdf" * 2 // NaN
};

var numberSchema = {
  successTestNumber1: Number,
  successTestNumber2: Number,
  convertTestNumber: Number,
  failTestNumber1: Number,
  failTestNumber2: Number,
  failTestNumber3: Number,
  failTestNumber4: Number,
  failTestNumber5: Number,
  failTestNumber6: Number,
  failTestNumber7: Number
};


  it("should leave only success and converted numbers and return no errors", function (done) {
    var data = _.clone(numberSchemaTest);
    var errs = schema.check(data, numberSchema);
    assert.strictEqual(errs.length, 0);
    assert.strictEqual(data.successTestNumber1, 123);
    assert.strictEqual(data.successTestNumber2, 123);
    assert.strictEqual(data.convertTestNumber, 456);
    assert.strictEqual(data.hasOwnProperty("failTestNumber1"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber2"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber3"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber4"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber5"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber6"), false);
    assert.strictEqual(data.hasOwnProperty("failTestNumber7"), false);
    done();
  });
```

## License
Copyright (c) 2014 Paul em. Licensed under the MIT license.

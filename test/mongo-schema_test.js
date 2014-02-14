var schema = require("../lib/mongo-schema.js");
var _ = require('underscore')._;
var assert = require("assert");

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


var numberSchemaReq = {
    successTestNumber1: {type: Number, required: true},
    successTestNumber2: {type: Number, required: true},
    convertTestNumber: {type: Number, required: true},
    failTestNumber1: {type: Number, required: true},
    failTestNumber2: {type: Number, required: true},
    failTestNumber3: {type: Number, required: true},
    failTestNumber4: {type: Number, required: true},
    failTestNumber5: {type: Number, required: true},
    failTestNumber6: {type: Number, required: true},
    failTestNumber7: {type: Number, required: true}
};

var numberSchemaMinMax = {
    successTestNumber1: {type: Number, required: true, min: 124},
    successTestNumber2: {type: Number, required: true, max: 122},
    convertTestNumber: {type: Number, required: true},
    failTestNumber1: Number,
    failTestNumber2: Number,
    failTestNumber3: Number,
    failTestNumber4: Number,
    failTestNumber5: Number,
    failTestNumber6: Number,
    failTestNumber7: Number
};


describe("testNumberSchema", function () {
    it("should leave only success and converted numbers and return no errors", function (done) {
        var re = schema.check(numberSchemaTest, numberSchema);
        var data = re.data;
        var errs = re.errors;
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

    it("should return errors where and tell me required fields shoule be set", function (done) {
        var re = schema.check(numberSchemaTest, numberSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 7);
        assert.equal(errs[0].toLowerCase().indexOf("required") !== -1, true);
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

    it("should return min max errors", function (done) {
        var re = schema.check(numberSchemaTest, numberSchemaMinMax);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 2);
        assert.equal(errs[0].toLowerCase().indexOf("min") !== -1, true);
        assert.equal(errs[1].toLowerCase().indexOf("max") !== -1, true);
        assert.strictEqual(data.hasOwnProperty("successTestNumber1"), false);
        assert.strictEqual(data.hasOwnProperty("successTestNumber2"), false);
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
});


var stringSchemaTest = {
    successTestString1: "Hellow",
    successTestString2: "asdf  asdfasdf ekjk3df*()^&%^$%",
    convertTestString: 34536,
    failTestString1: [],
    failTestString2: {},
    failTestString3: null,
    failTestString4: undefined,
    failTestString5: "asdf" * 2 // NaN
};

var stringSchema = {
    successTestString1: String,
    successTestString2: String,
    convertTestString: String,
    failTestString1: String,
    failTestString2: String,
    failTestString3: String,
    failTestString4: String,
    failTestString5: String,
    failTestString6: String
};

var stringSchemaReq = {
    successTestString1: {type: String, required: true},
    successTestString2: {type: String, required: true},
    convertTestString: {type: String, required: true},
    failTestString1: {type: String, required: true},
    failTestString2: {type: String, required: true},
    failTestString3: {type: String, required: true},
    failTestString4: {type: String, required: true},
    failTestString5: {type: String, required: true},
    failTestString6: {type: String, required: true}
};

var stringSchemaMinMax = {
    successTestString1: {type: String, required: true, minLength: 10},
    successTestString2: {type: String, required: true, maxLength: 10},
    convertTestString: {type: String, required: true, maxLength: 10}
};

var stringSchemaRegex = {
    successTestString1: {type: String, required: true, regex: /Hellow/ig},
    successTestString2: {type: String, required: true, regex: /NOTINSIDE/g},
    convertTestString: {type: String, required: true, maxLength: /34/g}
};


describe("testStringSchema", function () {
    it("should leave only success and converted strings and return no errors", function (done) {
        var re = schema.check(stringSchemaTest, stringSchema);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.successTestString1, "Hellow");
        assert.strictEqual(data.successTestString2, "asdf  asdfasdf ekjk3df*()^&%^$%");
        assert.strictEqual(data.convertTestString, "34536");
        assert.strictEqual(data.hasOwnProperty("failTestString1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString6"), false);
        done();
    });

    it("should return errors where and tell me required fields shoule be set", function (done) {
        var re = schema.check(stringSchemaTest, stringSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 6);
        assert.equal(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.successTestString1, "Hellow");
        assert.strictEqual(data.successTestString2, "asdf  asdfasdf ekjk3df*()^&%^$%");
        assert.strictEqual(data.convertTestString, "34536");
        assert.strictEqual(data.hasOwnProperty("failTestString1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestString6"), false);
        done();
    });

    it("should return min max errors", function (done) {
        var re = schema.check(stringSchemaTest, stringSchemaMinMax);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 2);
        assert.equal(errs[0].toLowerCase().indexOf("minlength") !== -1, true);
        assert.equal(errs[1].toLowerCase().indexOf("maxlength") !== -1, true);
        assert.strictEqual(data.hasOwnProperty("successTestString1"), false);
        assert.strictEqual(data.successTestString2, "asdf  asdf");
        assert.strictEqual(data.convertTestString, "34536");
        done();
    });

    it("should correctly detect regexes", function (done) {
        var re = schema.check(stringSchemaTest, stringSchemaRegex);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 1);
        assert.equal(errs[0].toLowerCase().indexOf("regex") !== -1, true);
        assert.strictEqual(data.successTestString1, "Hellow");
        assert.strictEqual(data.hasOwnProperty("successTestString2"), false);
        assert.strictEqual(data.convertTestString, "34536");
        done();
    })
});


var boolSchemaTest = {
    successTestBool1: true,
    successTestBool2: false,
    convertTestBool1: 0,
    convertTestBool2: 1,
    convertTestBool3: null,
    convertTestBool4: [],
    convertTestBool5: {},
    convertTestBool6: "asdf" * 2, // NaN
    failTestBool1: undefined
};

var boolSchema = {
    successTestBool1: Boolean,
    successTestBool2: Boolean,
    convertTestBool1: Boolean,
    convertTestBool2: Boolean,
    convertTestBool3: Boolean,
    convertTestBool4: Boolean,
    convertTestBool5: Boolean,
    convertTestBool6: Boolean,
    failTestBool1: Boolean,
    failTestBool2: Boolean
};

var boolSchemaReq = {
    successTestBool1: {type: Boolean, required: true},
    successTestBool2: {type: Boolean, required: true},
    convertTestBool1: {type: Boolean, required: true},
    convertTestBool2: {type: Boolean, required: true},
    convertTestBool3: {type: Boolean, required: true},
    convertTestBool4: {type: Boolean, required: true},
    convertTestBool5: {type: Boolean, required: true},
    convertTestBool6: {type: Boolean, required: true},
    failTestBool1: {type: Boolean, required: true},
    failTestBool2: {type: Boolean, required: true}
};


describe("testBoolSchema", function () {
    it("should leave only success and converted booleans and return no errors", function (done) {
        var re = schema.check(boolSchemaTest, boolSchema);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.successTestBool1, true);
        assert.strictEqual(data.successTestBool2, false);
        assert.strictEqual(data.convertTestBool1, false);
        assert.strictEqual(data.convertTestBool2, true);
        assert.strictEqual(data.convertTestBool3, false);
        assert.strictEqual(data.convertTestBool4, true);
        assert.strictEqual(data.convertTestBool5, true);
        assert.strictEqual(data.convertTestBool6, false);
        assert.strictEqual(data.hasOwnProperty("failTestBool1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestBool2"), false);
        done();
    });


    it("should leave only success and converted booleans and return no errors", function (done) {
        var re = schema.check(boolSchemaTest, boolSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 2);
        assert.strictEqual(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.successTestBool1, true);
        assert.strictEqual(data.successTestBool2, false);
        assert.strictEqual(data.convertTestBool1, false);
        assert.strictEqual(data.convertTestBool2, true);
        assert.strictEqual(data.convertTestBool3, false);
        assert.strictEqual(data.convertTestBool4, true);
        assert.strictEqual(data.convertTestBool5, true);
        assert.strictEqual(data.convertTestBool6, false);
        assert.strictEqual(data.hasOwnProperty("failTestBool1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestBool2"), false);
        done();
    });
});


var objectIdSchemaTest = {
    successTestObjectId1: "529c3acb044bdcc93700006f",
    failTestObjectId1: "asdfasdfasdf",
    failTestObjectId2: 123456789123456789012345,
    failTestObjectId3: false,
    failTestObjectId4: true,
    failTestObjectId5: null,
    failTestObjectId6: []
};

var objectIdSchema = {
    successTestObjectId1: "ObjectId",
    failTestObjectId1: "ObjectId",
    failTestObjectId2: "ObjectId",
    failTestObjectId3: "ObjectId",
    failTestObjectId4: "ObjectId",
    failTestObjectId5: "ObjectId",
    failTestObjectId6: "ObjectId",
    failTestObjectId7: "ObjectId"
};

var objectIdSchemaReq = {
    successTestObjectId1: {type: "ObjectId", required: true},
    failTestObjectId1: {type: "ObjectId", required: true},
    failTestObjectId2: {type: "ObjectId", required: true},
    failTestObjectId3: {type: "ObjectId", required: true},
    failTestObjectId4: {type: "ObjectId", required: true},
    failTestObjectId5: {type: "ObjectId", required: true},
    failTestObjectId6: {type: "ObjectId", required: true},
    failTestObjectId7: {type: "ObjectId", required: true}
};


describe("testObjectIdSchema", function () {
    it("should leave only success and converted objectId and return no errors", function (done) {
        var re = schema.check(objectIdSchemaTest, objectIdSchema);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.successTestObjectId1, "529c3acb044bdcc93700006f");
        assert.strictEqual(data.hasOwnProperty("failTestObjectId1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId6"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId7"), false);
        done();
    });


    it("should leave only success and converted objectIdeans and return no errors", function (done) {
        var re = schema.check(objectIdSchemaTest, objectIdSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 7);
        assert.strictEqual(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.successTestObjectId1, "529c3acb044bdcc93700006f");
        assert.strictEqual(data.hasOwnProperty("failTestObjectId1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId6"), false);
        assert.strictEqual(data.hasOwnProperty("failTestObjectId7"), false);
        done();
    });
});


var dateSchemaTest = {
    successTestDate1: 1390528951007,
    successTestDate2: "1390528951007",
    successTestDate3: 1390528951,
    successTestDate4: "1390528951",
    successTestDate5: new Date(1390528951007),
    failTestDate1: 13905289510071,
    failTestDate2: "asdf",
    failTestDate3: false,
    failTestDate4: true,
    failTestDate5: null,
    failTestDate6: []
};

var dateSchema = {
    successTestDate1: Date,
    successTestDate2: Date,
    successTestDate3: Date,
    successTestDate4: Date,
    successTestDate5: Date,
    failTestDate1: Date,
    failTestDate2: Date,
    failTestDate3: Date,
    failTestDate4: Date,
    failTestDate5: Date,
    failTestDate6: Date,
    failTestDate7: Date
};

var dateSchemaReq = {
    successTestDate1: {type: Date, required: true},
    successTestDate2: {type: Date, required: true},
    successTestDate3: {type: Date, required: true},
    successTestDate4: {type: Date, required: true},
    successTestDate5: {type: Date, required: true},
    failTestDate1: {type: Date, required: true},
    failTestDate2: {type: Date, required: true},
    failTestDate3: {type: Date, required: true},
    failTestDate4: {type: Date, required: true},
    failTestDate5: {type: Date, required: true},
    failTestDate6: {type: Date, required: true},
    failTestDate7: {type: Date, required: true}
};


describe("testDateSchema", function () {
    it("should leave only success and converted date and return no errors", function (done) {
        var re = schema.check(dateSchemaTest, dateSchema);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.successTestDate1, 1390528951);
        assert.strictEqual(data.successTestDate2, 1390528951);
        assert.strictEqual(data.successTestDate3, 1390528951);
        assert.strictEqual(data.successTestDate4, 1390528951);
        assert.strictEqual(data.successTestDate5, 1390528951);
        assert.strictEqual(data.hasOwnProperty("failTestDate1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate6"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate7"), false);
        done();
    });


    it("should leave only success and converted date and return no errors", function (done) {
        var re = schema.check(dateSchemaTest, dateSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 7);
        assert.strictEqual(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.successTestDate1, 1390528951);
        assert.strictEqual(data.successTestDate2, 1390528951);
        assert.strictEqual(data.successTestDate3, 1390528951);
        assert.strictEqual(data.successTestDate4, 1390528951);
        assert.strictEqual(data.successTestDate5, 1390528951);
        assert.strictEqual(data.hasOwnProperty("failTestDate1"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate2"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate3"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate4"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate5"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate6"), false);
        assert.strictEqual(data.hasOwnProperty("failTestDate7"), false);
        done();
    });
});


var collectionSchemaTest = {
    collection: [
        {
            test: 123,
            test1: "asdf"
        },
        {
            test: "asdfa",
            test1: null
        },
        {
            test: 456,
            test1: "qwert"
        }
    ]
};

var collectionSchema = {
    collection: [
        {
            test: Number,
            test1: String
        }
    ]
};

var collectionSchemaReq = {
    collection: [
        {
            test: {type: Number, required: true},
            test1: {type: String, required: true}
        }
    ]
};

describe("testCollectionSchema", function () {
    it("should leave only success and converted date and return no errors", function (done) {
        var re = schema.check(collectionSchemaTest, collectionSchema);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.collection[0].test, 123);
        assert.strictEqual(data.collection[0].test1, "asdf");
        assert.strictEqual(data.collection[1].hasOwnProperty("test"), false);
        assert.strictEqual(data.collection[1].hasOwnProperty("test1"), false);
        assert.strictEqual(data.collection[2].test, 456);
        assert.strictEqual(data.collection[2].test1, "qwert");
        done();
    });

    it("should leave only success and converted date and return no errors", function (done) {
        var re = schema.check(collectionSchemaTest, collectionSchemaReq);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 2);
        assert.strictEqual(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(errs[1].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.collection[0].test, 123);
        assert.strictEqual(data.collection[0].test1, "asdf");
        assert.strictEqual(data.collection[1].hasOwnProperty("test"), false);
        assert.strictEqual(data.collection[1].hasOwnProperty("test1"), false);
        assert.strictEqual(data.collection[2].test, 456);
        assert.strictEqual(data.collection[2].test1, "qwert");
        done();
    });
});


var updateSchemaTest = {
    deleteTest: null,
    deleteTest2: undefined,
    deleteTest3: "asdf" * 2
};

var updateSchema = {
    deleteTest: String,
    deleteTest2: String,
    deleteTest3: String
};

var updateSchemaReq = {
    deleteTest: {type: String, required: true},
    deleteTest2: {type: String, required: true},
    deleteTest3: {type: String, required: true}
};

describe("testUpdateSchema", function () {
    it("should ignore wrong formats and return no errors", function (done) {
        var re = schema.check(updateSchemaTest, updateSchema, true);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 0);
        assert.strictEqual(data.deleteTest, null);
        assert.strictEqual(data.hasOwnProperty("deleteTest"), true);
        assert.strictEqual(data.hasOwnProperty("deleteTest2"), false);
        assert.strictEqual(data.hasOwnProperty("deleteTest3"), false);
        done();
    });

    it("should warn me of wrong formats for ", function (done) {
        var re = schema.check(updateSchemaTest, updateSchemaReq, true);
        var data = re.data;
        var errs = re.errors;
        assert.strictEqual(errs.length, 3);
        assert.strictEqual(errs[0].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(errs[1].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(errs[2].toLowerCase().indexOf("required") !== -1, true);
        assert.strictEqual(data.hasOwnProperty("deleteTest"), false);
        assert.strictEqual(data.hasOwnProperty("deleteTest2"), false);
        assert.strictEqual(data.hasOwnProperty("deleteTest3"), false);
        done();
    });
});


var defaultSchema = {
    defaultStr: String,
    defaultNumber: Number,
    defaultBoolean: Boolean,
    defaultObjectId: "ObjectId",
    defaultDate: Date,
    defaultCollection: [
        {val: String}
    ],
    defaultObj: {
        defaultNumber: Number
    },
    defaultStrReq: { type: String, required: true },
    defaultNumberReq: { type: Number, required: true },
    defaultBooleanReq: { type: Boolean, required: true },
    defaultObjectIdReq: { type: "ObjectId", required: true },
    defaultDateReq: { type: Date, required: true },
    defaultCollectionReq: [
        {val: { type: String, required: true }}
    ],
    defaultObjReq: {
        defaultNumber: { type: Number, required: true }
    },
    defaultStrGiven: { type: String, default: "Given" },
    defaultNumberGiven: { type: Number, default: 17 },
    defaultBooleanGiven: { type: Boolean, default: true },
    defaultObjectIdGiven: { type: "ObjectId", default: "5282da0c1341462d029f608e" },
    defaultDateGiven: { type: Date, default: 946681200 },
    defaultCollectionGiven: [
        {val: { type: String, default: "Given" }}
    ],
    defaultObjGiven: {
        defaultNumber: { type: Number, default: 17 }
    }
};

describe("testDefaultSchema", function () {
    it("should ignore wrong formats and return no errors", function (done) {
        var defaults = schema.defaults(defaultSchema);
        assert.strictEqual(defaults.defaultStr, undefined);
        assert.strictEqual(defaults.hasOwnProperty("defaultStr"), true);

        assert.strictEqual(defaults.defaultNumber, undefined);
        assert.strictEqual(defaults.hasOwnProperty("defaultNumber"), true);

        assert.strictEqual(defaults.defaultBoolean, undefined);
        assert.strictEqual(defaults.hasOwnProperty("defaultBoolean"), true);

        assert.strictEqual(defaults.defaultObjectId, undefined);
        assert.strictEqual(defaults.hasOwnProperty("defaultObjectId"), true);

        assert.strictEqual(defaults.defaultDate, undefined);
        assert.strictEqual(defaults.hasOwnProperty("defaultDate"), true);

        assert.strictEqual(typeof defaults.defaultCollection, "object");
        assert.strictEqual(defaults.defaultCollection.length, 0);

        assert.strictEqual(typeof defaults.defaultObj, "object");
        assert.strictEqual(defaults.defaultObj.defaultNumber, undefined);
        assert.strictEqual(defaults.defaultObj.hasOwnProperty("defaultNumber"), true);

        assert.strictEqual(defaults.defaultStrReq, "");
        assert.strictEqual(defaults.defaultNumberReq, 0);
        assert.strictEqual(defaults.defaultBooleanReq, true);
        assert.strictEqual(defaults.defaultObjectIdReq, "");
        assert.strictEqual(Math.abs(Math.round(new Date().getTime() / 1000) - defaults.defaultDateReq) < 5, true);
        assert.strictEqual(typeof defaults.defaultCollectionReq, "object");
        assert.strictEqual(defaults.defaultCollectionReq.length, 0);
        assert.strictEqual(typeof defaults.defaultObjReq, "object");
        assert.strictEqual(defaults.defaultObjReq.defaultNumber, 0);

        assert.strictEqual(defaults.defaultStrGiven, "Given");
        assert.strictEqual(defaults.defaultNumberGiven, 17);
        assert.strictEqual(defaults.defaultBooleanGiven, true);
        assert.strictEqual(defaults.defaultObjectIdGiven, "5282da0c1341462d029f608e");
        assert.strictEqual(defaults.defaultDateGiven, 946681200);
        assert.strictEqual(defaults.defaultCollectionGiven.length, 0);
        assert.strictEqual(typeof defaults.defaultObjGiven, "object");
        assert.strictEqual(defaults.defaultObjGiven.defaultNumber, 17);
        done();
    });
});
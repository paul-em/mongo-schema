var MongoSchema = function () {
        var self = this;
        var types = [
            'string',
            'number',
            'boolean',
            'objectid',
            'date'
        ];

        var factoryDefs = {
            'string': function () {
                return ''
            },
            'number': function () {
                return 0;
            },
            'boolean': function () {
                return true;
            },
            'objectid': function () {
                return '';
            },
            'date': function () {
                return Math.floor(+new Date() / 1000)
            }
        };

        this.check = function (data, schema, update) {
            var newData = {};
            var errors = [];
            var re;
            var type;
            for (var key in schema) {

                var value = data[key];
                var properties = schema[key];


                if (isArray(properties)) {
                    var firstEl;
                    for (var f in value) {
                        firstEl = f;
                        break;
                    }
                    if (isObject(value) && !isArray(value) && isNaN(parseInt(firstEl))) { // entry in collection
                        re = self.check(value, properties[0], update);
                        newData[key] = re.data;
                        errors = errors.concat(re.errors);
                    } else if (isArray(value) || (isObject(value) && !isNaN(parseInt(firstEl)))) { // array
                        newData[key] = [];
                        for (var i in value) {
                            if (value[i] === null && update) {
                                newData[key][i] = null;
                                continue;
                            }

                            if(typeof properties[0] === 'object' && properties[0].type === undefined){
                                re = self.check(value[i], properties[0], update);
                                newData[key][i] = re.data;
                                errors = errors.concat(re.errors);
                            } else {

                                console.log('check', value[i], properties[0]);
                                re = checkPrimitive(value[i], properties[0], {}, key, errors);
                                if(re !== undefined){
                                    newData[key][i] = re;
                                }
                            }
                        }
                    } else if (!update) {
                        newData[key] = [];
                    }
                } else if (isObject(properties) && !isNull(properties) && !isDefObject(properties) && !normalizeType(properties)) {
                    if (!isUndefined(value)) {
                        re = self.check(value, properties, update);
                        newData[key] = re.data;
                        errors = errors.concat(re.errors);
                    }
                } else {
                    var type;
                    if (isDefObject(properties)) {
                        type = properties.type;
                    } else {
                        type = properties;
                        properties = {};
                    }
                    if (isNull(value) && update && !properties.required) {
                        newData[key] = null;
                        continue;
                    }

                    if (isUndefined(value) && update) {
                        continue;
                    }

                    var re = checkPrimitive(value, type, properties, key, errors);
                    if(re !== undefined){
                        newData[key] = re;
                    }

                }
            }
            return {errors: errors, data: newData};
        };




        this.defs = function (schema) {
            if (isArray(schema) && schema.length === 1) {
                schema = schema[0];
            }
            var defs = {};
            for (var key in schema) {
                var properties = schema[key];
                if (isArray(properties)) {
                    defs[key] = [];
                } else if (isObject(properties) && !isNull(properties) && !isDefObject(properties) && !normalizeType(properties)) {
                    defs[key] = self.defs(properties);
                } else if (properties) {
                    var type;
                    if (isDefObject(properties)) {
                        type = properties.type;
                    } else {
                        type = properties;
                        properties = {};
                    }
                    type = normalizeType(type);
                    if ((properties.required || !isUndefined(getDef(properties))) && !isUndefined(factoryDefs[type])) {

                        defs[key] = getDef(properties);
                        if (defs[key] === undefined) {
                            defs[key] = factoryDefs[type]();
                        }
                    } else {
                        defs[key] = undefined;
                    }
                }
            }
            return defs;
        };

        function checkPrimitive(value, type, properties, key, errors){
            var normType = normalizeType(type);
            if (!normType) {
                throw new Error("type " + type + " not available");
            }
            switch (normType) {
                case 'string':
                    if ((!isString(value) && !isNumber(value)) || isNaN(value)) {
                        value = undefined;
                        if (properties.required) {
                            errors.push(key + " - required not set on '" + value + "'");
                        }
                    } else {
                        value = value + '';

                        if (!isUndefined(properties.minLength) && value.length < properties.minLength) {
                            if (properties.required) {
                                errors.push(key + " - minLength " + properties.minLength + " not fulfilled on '" + value + "'");
                            }
                            return;
                        }

                        if (!isUndefined(properties.maxLength) && value.length > properties.maxLength) {
                            if (properties.required) {
                                errors.push(key + " - maxLength " + properties.regex + " not fulfilled on '" + value + "'");
                            }
                            value = value.substr(0, properties.maxLength);
                        }

                        if (!isUndefined(properties.regex) && !properties.regex.test(value)) {
                            if (properties.required) {
                                errors.push(key + " - regex " + properties.regex + " not fulfilled '" + value + "'");
                            }
                            return;
                        }
                    }

                    if (!isUndefined(value)) {
                        return value;
                    }
                    return;
                case 'number':
                    if (isArray(value) || isNull(value)) {
                        value = undefined;
                    }

                    value = value * 1;
                    if (isNaN(value)) {
                        value = undefined;
                    }

                    if (properties.required && isUndefined(value)) {
                        errors.push(key + " - required not set on '" + value + "'");
                        return;
                    }

                    if (!isUndefined(value) && !isUndefined(properties.min) && value < properties.min) {
                        if (properties.required) {
                            errors.push(key + " - min " + properties.min + " not fulfilled '" + value + "'");
                        }
                        return;
                    }
                    if (!isUndefined(value) && !isUndefined(properties.max) && value > properties.max) {
                        if (properties.required) {
                            errors.push(key + " - max " + properties.max + " not fulfilled on '" + value + "'");
                        }
                        return;
                    }
                    if (!isUndefined(value)) {
                        return value;
                    }
                    return;
                case 'boolean':
                    if (properties.required && isUndefined(value)) {
                        errors.push(key + " - required not set '" + value + "'");
                        return;
                    } else if (isUndefined(value)) {
                        return;
                    }
                    return !!value;
                    return;
                case 'date':
                    if (value instanceof Date) {
                        value = Math.floor(value.getTime() / 1000);
                    }
                    value = value * 1;
                    if (isNaN(value)) {
                        value = undefined;
                    } else {
                        if (value.toString().length === 13) {
                            value = Math.floor(value / 1000);
                        }
                        if (value.toString().length !== 10) {
                            value = undefined;
                        }
                    }

                    if (properties.required && isUndefined(value)) {
                        errors.push(key + " - required not set on '" + value + "'");
                        return;
                    }

                    if (!isUndefined(value)) {
                        return value;
                    }
                    return;
                case 'objectid':
                    if (typeof value !== "string" || (typeof value == "string" && value.length !== 24)) {
                        value = undefined;
                    }

                    if (properties.required && isUndefined(value)) {
                        errors.push(key + " - required not set '" + value + "'");
                        return;
                    }

                    if (!isUndefined(value)) {
                        return value;
                    }
                    return;
            }
        }


        function getDef(prop) {
            if (isObject(prop) && !isNull(prop) && !isUndefined(prop.def)) {
                return prop.def;
            }
            return undefined;
        }

        function normalizeType(type) {
           /* if (isObject(type) && type.name && !type.hasOwnProperty('name')) {
                type = type.name.toLowerCase();
                if (types.indexOf(type) !== -1) {
                    return type;
                } else {
                    return false;
                }
            }*/
            if (isString(type)) {
                type = type.toLowerCase();
                if (types.indexOf(type) !== -1) {
                    return type;
                } else {
                    return false;
                }
            }
            return false;
        }

        function isDefObject(obj) {
            return isObject(obj) && !isNull(obj) && !isArray(obj) && !isUndefined(obj.type);
        }

        function isArray(value) {
            return Object.prototype.toString.call(value) === '[object Array]'
        }

        function isObject(value) {
            return value === Object(value);
        }

        function isNumber(value) {
            return typeof value == 'number' || Object.prototype.toString.call(value) === '[object Number]'
        }

        function isNaN(value) {
            return isNumber(value) && value != +value;
        }

// Is a given value a boolean?
        function isBoolean(value) {
            return value === true || value === false || Object.prototype.toString.call(value) == '[object Boolean]';
        }

// Is a given value equal to null?
        function isNull(value) {
            return value === null;
        }

// Is a given variable undefined?
        function isUndefined(value) {
            return value === void 0;
        }

        function isString(value) {
            return typeof value == 'string' || Object.prototype.toString.call(value) == '[object String]';
        }
    }
    ;


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    var mongoSchema = new MongoSchema();
    exports.check = mongoSchema.check;
    exports.defs = mongoSchema.defs;
}
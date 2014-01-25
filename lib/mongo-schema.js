var has_require = typeof require !== 'undefined';

if (typeof _ === 'undefined') {
  if (has_require) {
    _ = require('underscore')._;
  }
  else throw new Error('mymodule requires underscore, see http://underscorejs.org');
}


var MongoSchema = function () {
  var self = this;
  var types = [
    'string',
    'number',
    'boolean',
    'objectid',
    'date'
  ];

  this.check = function (data, schema, update) {
    var errors = [];

    _.each(schema, function (properties, key) {
      var value = data[key];
      if (_.isArray(properties)) {
        if (!_.isArray(value)) {
          delete data[key];
          return;
        } else {
          _.each(value, function (value) {
            errors = errors.concat(self.check(value, properties[0]));
          });
        }
      } else if (_.isObject(properties) && !_.isNull(properties) && !isDefObject(properties) && !normalizeType(properties)) {
        var errs = self.check(value, properties);
        errors = errors.concat(errs);
      } else {
        var type;
        if (isDefObject(properties)) {
          type = properties.type;
        } else {
          type = properties;
          properties = {};
        }

        if (_.isNull(value) && update && !properties.required) {
          data[key] = undefined;
          return;
        }

        var normType = normalizeType(type);
        if (!normType) {
          throw new Error("type " + type + " not available");
        }

        switch (normType) {
          case 'string':
            if ((!_.isString(value) && !_.isNumber(value)) || _.isNaN(value)) {
              value = undefined;
              if (properties.required) {
                errors.push(key + " - required not set on '" + value + "'");
              }
            } else {
              value = value + '';

              if (!_.isUndefined(properties.minLength) && value.length < properties.minLength) {
                errors.push(key + " - minLength " + properties.minLength + " not fulfilled on '" + value + "'");
                delete data[key];
                return;
              }

              if (!_.isUndefined(properties.maxLength) && value.length > properties.maxLength) {
                errors.push(key + " - maxLength " + properties.regex + " not fulfilled on '" + value + "'");
                value = value.substr(0, properties.maxLength);
              }

              if (!_.isUndefined(properties.regex) && !properties.regex.test(value)) {
                errors.push(key + " - regex " + properties.regex + " not fulfilled '" + value + "'");
                delete data[key];
                return;
              }
            }

            if (value === undefined) {
              delete data[key];
            } else {
              data[key] = value;
            }
            break;
          case 'number':
            if (_.isArray(value) || _.isNull(value)) {
              value = undefined;
            }

            value = value * 1;
            if (_.isNaN(value)) {
              value = undefined;
            }

            if (properties.required && _.isUndefined(value)) {
              errors.push(key + " - required not set on '" + value + "'");
              delete data[key];
              return;
            }

            if (!_.isUndefined(value) && !_.isUndefined(properties.min) && value < properties.min) {
              errors.push(key + " - min " + properties.min + " not fulfilled '" + value + "'");
              delete data[key];
              return;
            }
            if (!_.isUndefined(value) && !_.isUndefined(properties.max) && value > properties.max) {
              errors.push(key + " - max " + properties.max + " not fulfilled on '" + value + "'");
              delete data[key];
              return;
            }
            if (value === undefined) {
              delete data[key];
            } else {
              data[key] = value;
            }
            break;
          case 'boolean':
            if (properties.required && _.isUndefined(value)) {
              errors.push(key + " - required not set '" + value + "'");
              delete data[key];
              return;
            } else if (_.isUndefined(value)) {
              delete data[key];
              return;
            }
            data[key] = !!value;
            break;
          case 'date':
            if (value instanceof Date) {
              value = Math.floor(value.getTime() / 1000);
            }
            value = value * 1;
            if (_.isNaN(value)) {
              value = undefined;
            } else {
              if (value.toString().length === 13) {
                value = Math.floor(value / 1000);
              }
              if (value.toString().length !== 10) {
                value = undefined;
              }
            }

            if (properties.required && _.isUndefined(value)) {
              errors.push(key + " - required not set on '" + value + "'");
              delete data[key];
              return;
            }

            if (value === undefined) {
              delete data[key];
            } else {
              data[key] = value;
            }
            break;
          case 'objectid':
            if (typeof value !== "string" || (typeof value == "string" && value.length !== 24)) {
              delete data[key];
              value = undefined;
            }

            if (properties.required && _.isUndefined(value)) {
              errors.push(key + " - required not set '" + value + "'");
              delete data[key];
              return;
            }

            if (value === undefined) {
              delete data[key];
            } else {
              data[key] = value;
            }
            break;
        }

      }
    });
    return errors;
  };

  function normalizeType(type) {
    if (_.isObject(type) && type.name) {
      type = type.name.toLowerCase();
      if (types.indexOf(type) !== -1) {
        return type;
      } else {
        return false;
      }
    }
    if (_.isString(type)) {
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
    return _.isObject(obj) && !_.isNull(obj) && !_.isArray(obj) && !_.isUndefined(obj.type);
  }
};


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  var mongoSchema = new MongoSchema();
  exports = module.exports = function (data, schema, update) {
    return mongoSchema.check(data, schema, update);
  };
}
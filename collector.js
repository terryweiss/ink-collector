/**
@fileOverview An object and array collector
@module ink/collector
*/


(function() {
  var ACollector, CollectorBase, OCollector, probe, sys, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  probe = require("ink-probe");

  sys = require("lodash");

  /**
  A collector
  @constructor
  */


  CollectorBase = (function() {
    function CollectorBase(obj) {
      if (obj && !sys.isObject(obj)) {
        throw new Error("The Collector expects an object");
      }
      /**
      The collection that being managed
      @type {object|array}
      */

      this.heap = obj || {};
      probe.mixTo(this, this.heap);
    }

    /**
    Adds an item to the collection
    @param {*} key The key to use for the item being added.
    @param {*} item The item to add to the collection. The item is not iterated so that you could add bundled items to the collecion
    */


    CollectorBase.prototype.add = function(key, item) {
      return this.heap[key] = item;
    };

    /**
    Get the size of the collection
    @name length
    @type {integer}
    @memberOf module:ink/collector~CollectorBase#
    */


    Object.defineProperty(CollectorBase.prototype, "length", {
      get: function() {
        return sys.size(this.heap);
      }
    });

    /**
    Iterate over each item in the collection, or a subset that matches a query. This supports two signatures:
    `.each(query, function)` and `.each(function)`. If you pass in a query, only the items that match the query
    are iterated over.
    @param {object=} query A query to evaluate
    @param {function(val, key)} iterator Function to execute against each item in the collection
    @param {object=} thisobj The value of `this`
    */


    CollectorBase.prototype.each = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.each(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.each(this.heap, query, thisobj);
      }
    };

    /**
    Returns the collection as an array. If it is already an array, it just returns that.
    @return {array}
    */


    CollectorBase.prototype.toArray = function() {
      return sys.toArray(this.heap);
    };

    /**
    Supports conversion to a JSON string or for passing over the wire
    @return {object}
    */


    CollectorBase.prototype.toJSON = function() {
      return this.heap;
    };

    /**
    Maps the contents to an array by iterating over it and transforming it. You supply the iterator. Supports two signatures:
    `.map(query, function)` and `.map(function)`. If you pass in a query, only the items that match the query
    are iterated over.
    @param {object=} query A query to evaluate
    @param {function(val, key)} iterator The function that will be executed in each item in the collection
    @param {object=} thisobj The value of `this`
    @return {array}
    */


    CollectorBase.prototype.map = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.map(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.map(this.heap, query, thisobj);
      }
    };

    /**
    Reduces a collection to a value which is the accumulated result of running each element in the collection through the
    callback, where each successive callback execution consumes the return value of the previous execution. If accumulator
    is not passed, the first element of the collection will be used as the initial accumulator value.
    are iterated over.
    @param {object=} query A query to evaluate
    @param {function(result, val, key)} iterator The function that will be executed in each item in the collection
    @param {*=} accumulator Initial value of the accumulator.
     @param {object=} thisobj The value of `this`
    @return {*}
    */


    CollectorBase.prototype.reduce = function(query, iterator, accumulator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.reduce(this.find(query), iterator, accumulator, thisobj);
      } else {
        thisobj = accumulator || this;
        return sys.reduce(this.heap, query, iterator, thisobj);
      }
    };

    /**
    Creates an object composed of keys returned from running each element
    of the collection through the given callback. The corresponding value of each key
    is the number of times the key was returned by the callback.
    @param {object=} query A query to evaluate. If you pass in a query, only the items that match the query
    are iterated over.
    @param  {function(value, key, collection)} iterator
    @param {object=} thisobj The value of `this`
    @return {object}
    */


    CollectorBase.prototype.countBy = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.countBy(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.countBy(this.heap, query, thisobj);
      }
    };

    /**
    Creates an object composed of keys returned from running each element of the collection through the callback.
    The corresponding value of each key is an array of elements passed to callback that returned the key.
    The callback is invoked with three arguments: (value, index|key, collection).
    @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
    are iterated over.
    @param {function(value, key, collection)} iterator
    @param {object=} thisobj The value of `this`
    @return {object}
    */


    CollectorBase.prototype.groupBy = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.groupBy(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.groupBy(this.heap, query, thisobj);
      }
    };

    /**
    Reduce the collection to a single value. Supports two signatures:
    `.pluck(query, function)` and `.pluck(function)`
    @param {object=} query The query to evaluate. If you pass in a query, only the items that match the query
    are iterated over.
    @param {string} property The property that will be 'plucked' from the contents of the collection
    @return {*}
    */


    CollectorBase.prototype.pluck = function(query, property) {
      if (arguments.length === 2) {
        return sys.map(this.find(query), function(record) {
          return probe.get(record, property);
        });
      } else {
        return sys.map(this.heap, function(record) {
          return probe.get(record, query);
        });
      }
    };

    /**
    Creates an array of shuffled array values, using a version of the Fisher-Yates shuffle.
    See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
    @function
    @returns {array}
    */


    CollectorBase.prototype.shuffle = sys.bind(sys.shuffle, CollectorBase, CollectorBase.heap);

    /**
    Returns a sorted copy of the collection.
    @param {object=} query The query to evaluate. If you pass in a query, only the items that match the query
    are iterated over.
    @param {function(value, key)} iterator
     @param {object=} thisobj The value of `this`
    @return {array}
    */


    CollectorBase.prototype.sortBy = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.sortBy(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.sortBy(this.heap, query, thisobj);
      }
    };

    /**
    Retrieves the maximum value of an array. If callback is passed,
    it will be executed for each value in the array to generate the criterion by which the value is ranked.
    @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
    are iterated over.
    @param {function(value, key, collection)} iterator
    @param {object=} thisobj The value of `this`
    @return {number}
    */


    CollectorBase.prototype.max = function(query, iterator, thisobj) {
      if (sys.isObject(query)) {
        thisobj = thisobj || this;
        return sys.max(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.max(this.heap, query, thisobj);
      }
    };

    /**
    Retrieves the minimum value of an array. If callback is passed, it will be executed for each value in the array to generate
    the criterion by which the value is ranked.
    @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
    are iterated over.
    @param {function(value, key, collection)} iterator
    @param {object=} thisobj The value of `this`
    @return {number}
    */


    CollectorBase.prototype.min = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.min(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.min(this.heap, query, thisobj);
      }
    };

    return CollectorBase;

  })();

  /**
  An object based collector
  @extends module:ink/collector~CollectorBase
  @constructor
  */


  OCollector = (function(_super) {
    __extends(OCollector, _super);

    function OCollector() {
      _ref = OCollector.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OCollector.prototype.key = function(key) {
      return this.heap[key];
    };

    return OCollector;

  })(CollectorBase);

  /**
  Gets an items by its key
  @param {*} key The key to get
  @return {object}
  @method
  @name key
  @memberof module:ink/collector~OCollector#
  */


  /**
  An array based collector
  @extends module:ink/collector~CollectorBase
  @constructor
  */


  ACollector = (function(_super) {
    __extends(ACollector, _super);

    function ACollector(obj) {
      if (obj && !sys.isArray(obj)) {
        throw new Error("The Collector Array expects an array");
      }
      this.heap = obj || [];
      probe.mixTo(this, this.heap);
    }

    /**
    Adds to the top of the collection
    @param {*} item The item to add to the collection. Only one item at a time can be added
    */


    ACollector.prototype.add = function(item) {
      return this.heap.unshift(item);
    };

    /**
    Add to the bottom of the list
    @param {*} item The item to add to the collection.  Only one item at a time can be added
    */


    ACollector.prototype.append = function(item) {
      return this.heap.push(item);
    };

    /**
    Add an item to the top of the list. This is identical to `add`, but is provided for stack semantics
     @param {*} item The item to add to the collection. Only one item at a time can be added
    */


    ACollector.prototype.push = function(item) {
      return this.add(item);
    };

    /**
    Modifies the collection with all falsey values of array removed. The values false, null, 0, "", undefined and NaN are all falsey.
    */


    ACollector.prototype.compact = function() {
      return this.heap = sys.compact(this.heap);
    };

    /**
    Creates an array of array elements not present in the other arrays using strict equality for comparisons, i.e. ===.
    @returns {array}
    */


    ACollector.prototype.difference = sys.bind(sys.difference, ACollector, ACollector.heap);

    /**
    This method gets all but the first values of array
    @param {number=} n The numer of items to return
    @returns {*}
    */


    ACollector.prototype.tail = sys.bind(sys.tail, ACollector, ACollector.heap);

    /**
    Gets the first n values of the array
    @param {number=} n The numer of items to return
    @returns {*}
    */


    ACollector.prototype.head = sys.bind(sys.head, ACollector, ACollector.heap);

    /**
    Creates an array of elements from the specified indexes, or keys, of the collection. Indexes may be specified as
    individual arguments or as arrays of indexes
    @param {indexes} args The indexes to use
    */


    ACollector.prototype.at = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return sys.at.apply(sys, [this.heap].concat(__slice.call(args)));
    };

    /**
    Flattens a nested array (the nesting can be to any depth). If isShallow is truthy, array will only be flattened a single level.
    If callback is passed, each element of array is passed through a callback before flattening.
    @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
    are iterated over.
    @param {function(value, key, collection)} iterator,
    @param {object=} thisobj The value of `this`
    @return {number}
    */


    ACollector.prototype.flatten = function(query, iterator, thisobj) {
      if (sys.isPlainObject(query)) {
        thisobj = thisobj || this;
        return sys.flatten(this.find(query), iterator, thisobj);
      } else {
        thisobj = iterator || this;
        return sys.flatten(this.heap, query, thisobj);
      }
    };

    /**
    Gets an items by its index
    @param {number} key The index to get
    @return {*}
    */


    ACollector.prototype.index = function(index) {
      return this.heap[index];
    };

    return ACollector;

  })(CollectorBase);

  /**
    Collect an object
    @param {array|object} obj What to collect
    @return {ACollector|OCollector}
  */


  exports.collect = function(obj) {
    if (sys.isArray(obj)) {
      return new ACollector(obj);
    } else {
      return new OCollector(obj);
    }
  };

  /**
    Create an array collector
    @return {ACollector}
  */


  exports.array = function(obj) {
    return new ACollector(obj);
  };

  /**
  Create an object collector
  @return {OCollector}
  */


  exports.object = function(obj) {
    return new OCollector(obj);
  };

  /**
  Returns true if all items match the query. Aliases as `all`
  @function
  
  @param {object} qu The query to execute
  @returns {boolean}
  @name every
  @memberOf module:ink/collector~CollectorBase#
  */


  /**
  Returns true if any of the items match the query. Aliases as `any`
  @function
  
  @param {object} qu The query to execute
  @returns {boolean}
  @memberOf module:ink/collector~CollectorBase#
  @name some
  */


  /**
Returns the set of unique records that match a query

@param {object} qu The query to execute.
@return {array}
@memberOf module:ink/collector~CollectorBase#
@name unique
@method
**/;

  /**
  Returns true if all items match the query. Aliases as `every`
  @function
  
  @param {object} qu The query to execute
  @returns {boolean}
  @name all
  @memberOf module:ink/collector~CollectorBase#
  */


  /**
  Returns true if any of the items match the query. Aliases as `all`
  @function
  
  @param {object} qu The query to execute
  @returns {boolean}
  @memberOf module:ink/collector~CollectorBase#
  @name any
  */


  /**
Remove all items in the object/array that match the query

@param {object} qu The query to execute. See {@link module:ink/probe.queryOperators} for the operators you can use.
@return {object|array} The array or object as appropriate without the records.
@memberOf module:ink/collector~CollectorBase#
@name remove
@method
**/;

  /**
  Returns the first record that matches the query and returns its key or index depending on whether `obj` is an object or array respectively.
  Aliased as `seekKey`.
  
  @param {object} qu The query to execute.
  @returns {object}
  @memberOf module:ink/collector~CollectorBase#
  @name findOneKey
  @method
  */


  /**
  Returns the first record that matches the query. Aliased as `seek`.
  
  @param {object} qu The query to execute.
  @returns {object}
  @memberOf module:ink/collector~CollectorBase#
  @name findOne
  @method
  */


  /**
  Find all records that match a query and returns the keys for those items. This is similar to {@link module:ink/probe.find} but instead of returning
  records, returns the keys. If `obj` is an object it will return the hash key. If 'obj' is an array, it will return the index
  
  @param {object} qu The query to execute.
  @returns {array}
  @memberOf module:ink/collector~CollectorBase#
  @name findKeys
  @method
  */


  /**
Find all records that match a query

@param {object} qu The query to execute.
@returns {array} The results
@memberOf module:ink/collector~CollectorBase#
@name find
@method
**/;

  /**
Updates all records in obj that match the query. See {@link module:ink/probe.updateOperators} for the operators that are supported.

@param {object} qu The query which will be used to identify the records to updated
@param {object} setDocument The update operator. See {@link module:ink/probe.updateOperators}
@memberOf module:ink/collector~CollectorBase#
@name update
@method
 */;

}).call(this);

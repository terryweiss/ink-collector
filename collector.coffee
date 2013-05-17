###*
@fileOverview An object and array collector
@module ink/collector
###
probe = require( "ink-probe" )
sys = require( "lodash" )

###*
A collector
@constructor
@mixes module:ink/probe
###
class CollectorBase
  constructor: ( obj )->
    if (obj && !sys.isObject( obj ))
      throw new Error( "The Collector expects an object" )
    ###*
    The collection that being managed
    @type {object|array}
    ###
    @heap = obj || {}

    probe.mixTo( @, @heap )

  ###*
  Adds an item to the collection
  @param {*} key The key to use for the item being added.
  @param {*} item The item to add to the collection. The item is not iterated so that you could add bundled items to the collecion
  ###
  add        : ( key, item )->
    @heap[ key ] = item


  ###*
  Get the size of the collection
  @name length
  @type {integer}
  @memberOf module:ink/collector~CollectorBase
  ###
  Object.defineProperty( @::, "length",
    get: ->
      return sys.size( @heap )
  )
  ###*
  Iterate over each item in the collection, or a subset that matches a query. This supports two signatures:
  `.each(query, function)` and `.each(function)`. If you pass in a query, only the items that match the query
  are iterated over.
  @param {object=} query A query to evaluate
  @param {function(val, key)} iterator Function to execute against each item in the collection
  @param {object=} thisobj The value of `this`
  ###
  each   : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      sys.each( @.find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      sys.each( @heap, query, thisobj )

  ###*
  Returns the collection as an array. If it is already an array, it just returns that.
  @return {array}
  ###
  toArray: ->
    sys.toArray( @heap )

  ###*
  Supports conversion to a JSON string or for passing over the wire
  @return {object}
  ###
  toJSON : ->
    @heap

  ###*
  Maps the contents to an array by iterating over it and transforming it. You supply the iterator. Supports two signatures:
  `.map(query, function)` and `.map(function)`. If you pass in a query, only the items that match the query
  are iterated over.
  @param {object=} query A query to evaluate
  @param {function(val, key)} iterator The function that will be executed in each item in the collection
  @param {object=} thisobj The value of `this`
  @return {array}
  ###
  map    : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.map( @.find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.map( @heap, query, thisobj )


  ###*
  Reduces a collection to a value which is the accumulated result of running each element in the collection through the
  callback, where each successive callback execution consumes the return value of the previous execution. If accumulator
  is not passed, the first element of the collection will be used as the initial accumulator value.
  are iterated over.
  @param {object=} query A query to evaluate
  @param {function(result, val, key)} iterator The function that will be executed in each item in the collection
  @param {*=} accumulator Initial value of the accumulator.
   @param {object=} thisobj The value of `this`
  @return {*}
  ###
  reduce : ( query, iterator, accumulator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.reduce( @.find( query ), iterator, accumulator, thisobj )
    else
      thisobj = accumulator || @
      return sys.reduce( @heap, query, iterator, thisobj )

  ###*
  Creates an array of elements from the specified indexes, or keys, of the collection. Indexes may be specified as
  individual arguments or as arrays of indexes
  @param {indexes} args The indexes to use
  ###
  at     : ( args... )->
    return sys.at( @heap, args... )

  ###*
  Creates an object composed of keys returned from running each element
  of the collection through the given callback. The corresponding value of each key
  is the number of times the key was returned by the callback.
  @param {object=} query A query to evaluate. If you pass in a query, only the items that match the query
  are iterated over.
  @param  {function(value, key, collection)} iterator
  @param {object=} thisobj The value of `this`
  @return {object}
  ###
  countBy: ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.countBy( @.find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.countBy( @heap, query, thisobj )


  ###*
  Creates an object composed of keys returned from running each element of the collection through the callback.
  The corresponding value of each key is an array of elements passed to callback that returned the key.
  The callback is invoked with three arguments: (value, index|key, collection).
  @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
  are iterated over.
  @param {function(value, key, collection)} iterator
  @param {object=} thisobj The value of `this`
  @return {object}
  ###
  groupBy: ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.groupBy( @.find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.groupBy( @heap, query, thisobj )

  ###*
  Reduce the collection to a single value. Supports two signatures:
  `.pluck(query, function)` and `.pluck(function)`
  @param {object=} query The query to evaluate. If you pass in a query, only the items that match the query
  are iterated over.
  @param {string} property The property that will be 'plucked' from the contents of the collection
  @return {*}
  ###
  pluck  : ( query, property )->
    if (arguments.length == 2)
      return sys.map( @find( query ), (record)->
        return probe.get(record, property) ;
      )
    else
      return sys.map( @heap, (record)->
        return probe.get(record, query) ;
      )

  ###*
  Creates an array of shuffled array values, using a version of the Fisher-Yates shuffle.
  See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
  ###
  shuffle: sys.bind( sys.shuffle, @, @heap )

  ###*
  Returns a sorted copy of the collection.
  @param {object=} query The query to evaluate. If you pass in a query, only the items that match the query
  are iterated over.
  @param {function(value, key)} iterator
   @param {object=} thisobj The value of `this`
  @return {array}
  ###
  sortBy : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.sortBy( @find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.sortBy( @heap, query, thisobj )


###*
An object based collector
@extends module:ink/collector~CollectorBase
@constructor
###
class OCollector extends CollectorBase

  key: ( key )->
    return @heap[ key ]

###*
Gets an items by its key
@param {*} key The key to get
@return {object}
@method
@name key
@memberof module:ink/collector~OCollector
###

###*
An array based collector
@extends module:ink/collector~CollectorBase
@constructor

###
class ACollector extends CollectorBase
  constructor: ( obj )->
    if (obj && !sys.isArray( obj ))
      throw new Error( "The Collector Array expects an array" )
    # make sure the constructor is called
    CollectorBase.call( this, obj );


    @heap = obj || []


  ###*
  Adds to the top of the collection
  @param {*} item The item to add to the collection. Only one item at a time can be added
  ###
  add        : ( item )->
    @heap.unshift( item )

  ###*
  Add to the bottom of the list
  @param {*} item The item to add to the collection.  Only one item at a time can be added
  ###
  append     : ( item )->
    @heap.push( item )

  ###*
  Add an item to the top of the list. This is identical to `add`, but is provided for stack semantics
   @param {*} item The item to add to the collection. Only one item at a time can be added
  ###
  push       : ( item )->
    @add( item )

  ###*
  Retrieves the maximum value of an array. If callback is passed,
  it will be executed for each value in the array to generate the criterion by which the value is ranked.
  @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
  are iterated over.
  @param {function(value, key, collection)} iterator
  @param {object=} thisobj The value of `this`
  @return {number}
  ###
  max        : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.max( @find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.max( @.heap, query, thisobj )



  ###*
  Retrieves the minimum value of an array. If callback is passed, it will be executed for each value in the array to generate
  the criterion by which the value is ranked.
  @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
  are iterated over.
  @param {function(value, key, collection)} iterator
  @param {object=} thisobj The value of `this`
  @return {number}
  ###
  min        : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.min( @find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.min( @.heap, query, thisobj )

  ###*
  Modifies the collection with all falsey values of array removed. The values false, null, 0, "", undefined and NaN are all falsey.
  ###
  compact    : ()->
    @heap = sys.compact( @heap )

  ###*
  Creates an array of array elements not present in the other arrays using strict equality for comparisons, i.e. ===.
  @returns {array}
  ###
  difference : sys.bind( sys.difference, @, @heap )

  ###*
  This method gets all but the first values of array
  @param {number=} n The numer of items to return
  @returns {*}
  ###
  tail       : sys.bind( sys.tail, @, @heap )

  ###*
  Gets the first n values of the array
  @param {number=} n The numer of items to return
  @returns {*}
  ###
  head       : sys.bind( sys.head, @, @heap )

  ###*
  Flattens a nested array (the nesting can be to any depth). If isShallow is truthy, array will only be flattened a single level.
  If callback is passed, each element of array is passed through a callback before flattening.
  @param {object=} query A query to evaluate . If you pass in a query, only the items that match the query
  are iterated over.
  @param {function(value, key, collection)} iterator,
  @param {object=} thisobj The value of `this`
  @return {number}
  ###
  flatten    : ( query, iterator, thisobj )->
    if (sys.isFunction( iterator ))
      thisobj = thisobj || @
      return sys.flatten( @find( query ), iterator, thisobj )
    else
      thisobj = iterator || @
      return sys.flatten( @.heap, query, thisobj )
  ###*
  Gets an items by its index
  @param {number} key The index to get
  @return {*}
  ###
  index      : ( index )->
    @heap[ index ]


###*
  Collect an object
  @param {array|object} obj What to collect
  @return {ACollector|OCollector}
 ###
exports.collect = ( obj )->
  if (sys.isArray( obj ))
    return new ACollector( obj )
  else
    return new OCollector( obj )

###*
  Create an array collector
  @return {ACollector}
###
exports.array = ( obj )->
  return new ACollector( obj )

###*
Create an object collector
@return {OCollector}
###
exports.object = ( obj )->
  return new OCollector( obj )


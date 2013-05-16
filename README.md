# ink-strings #
![ink strings logo](etc/splat.png "ink!")
Part of the *ink* tool suite

This is a nifty little tool that allows you to query objects and arrays using a reach-in syntax and query language based on Mongo's. Some
intended actions the tool was meant to support:

	  var probe = require("ink-probe");
      /*
      for an object or array that contains records with a field that looks like {name: {first: "string", last: "string"}}
      you can query it like os
      */
      var arr = probe.find(objectOrArray, {"name.first": "Terry", "name.last": "Flinstone"});

Now arr contains all of the records in objectOrArray that match the query.

      /* to update records */
      probe.update(objectOrArray, {"name.first": "Terry", "name.last": "Flinstone"}, {$set: {"name.first": "Fred"}});

Now all records that match "Terry Flinstone" will have been updated to "Fred Flinstone".

But wait! Put your checkbook away! You can also `findOne`, `findKeys` and check for `all` and `some` conditions. Finally, you can
also reach in directly using `reachin` and force an update directly on a field for a single record using `pushin`. How? Good question. See
the...

## Documentation ##
*ink-probe* comes with a comprehensive set of methods.

* [Supported Query Operators](http://terryweiss.github.io/ink-probe/probe.queryOperators.html)
* [Supported Update Operators](http://terryweiss.github.io/ink-probe/probe.updateOperators.html)
* [Methods/API](http://terryweiss.github.io/ink-probe/probe.html)


## Contributing ##
Yes! Contribute. Make sure your code looks essentially like the code you see. Document using JSDoc tags.

## Installation ##

	npm install ink-probe

## Usage ##
From node:
	var probe = require("ink-probe");

On the web:
Copy `dist/ink.probe.js` or `dist/ink.probe.min.js` to your assets directory and then load it directly

	<script src="js/ink.probe.js"></script>
	<script>
		// all of the methods hang right off of window.ink.probe
        var goHome = ink.probe.find(obj, {field: "value");
	</script>


## Contributing ##
Yes! Contribute. Make sure your code looks essentially like the code you see. Document using JSDoc tags.

Make sure you have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed globally. To test, you will also need
[nodeunit](https://github.com/caolan/nodeunit) installed globally. To test:

	nodeunit tests/

## Roadmap ##
* Translate from coffee to JS.
* Support the `.$.` positional operator for array updates
* Support indexing
* Improve performance for non-indexed operations

## ink tools ##
Also see

+ [ink-probe](https://github.com/terryweiss/ink-probe)
+ [ink-strings](https://github.com/terryweiss/ink-strings)
+ ink-collector (coming soon)
+ ink-scene (coming soon)
+ ink-dox (coming, but a long way off yet)

## License ##
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

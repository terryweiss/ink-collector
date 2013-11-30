"use strict";
"use strict";
var fs = require( "fs" );
var path = require( "path" );
var sys = require( "lodash" );
var generator = require( "./nottests/data.generator.js" );

var collector = require( "../collector" );
var ocoll, acoll;

exports["get data"] = function ( test ) {
	generator.generate( function ( a, o ) {
		ocoll = o;
		acoll = a;
		test.equal( ocoll.length, 60000 );
		test.equal( acoll.length, 60000 );
		test.done();
	} );
};

exports["test o each"] = function ( test ) {
	var count = 0;
	ocoll.each( function ( row, key ) {
		count++;
	} );
	test.equal( ocoll.length, count );
	test.done();
};

exports["test a each"] = function ( test ) {
	var count = 0;
	acoll.each( function ( row, key ) {
		count++;
	} );
	test.equal( acoll.length, count );
	test.done();
};

exports["test o each filter"] = function ( test ) {
	// first work up the data set
	var count = 0;
	ocoll.each( function ( row, key ) {
		if ( row.color && row.color.name === "Cerise" ) {
			count++;
		}
	} );
	var found = 0;

	ocoll.each( {"color.name" : "Cerise"}, function ( row, key ) {
		found++;
	} );
	test.equal( count, found );

	test.done();
};

exports["test a each filter"] = function ( test ) {
	// first work up the data set
	var count = 0;
	ocoll.each( function ( row, key ) {
		if ( row.color && row.color.name === "Fern" ) {
			count++;
		}
	} );
	var found = 0;

	ocoll.each( {"color.name" : "Fern"}, function ( row, key ) {
		found++;
	} );
	test.equal( count, found );

	test.done();
};

exports["test a map"] = function ( test ) {
	var baseline = [];
	acoll.each( function ( row ) {
		baseline.push( row.name.first );
	} );

	var map = acoll.map( function ( row ) {
		return row.name.first;
	} );
	test.deepEqual( baseline, map );
	test.done();
};

exports["test o map"] = function ( test ) {
	var baseline = [];
	ocoll.each( function ( row ) {
		baseline.push( row.name.last );
	} );

	var map = ocoll.map( function ( row ) {
		return row.name.last;
	} );
	test.deepEqual( baseline, map );
	test.done();
};

exports["test a map filter"] = function ( test ) {
	var baseline = [];
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Green" ) {
			baseline.push( row.name.last );
		}
	} );

	var map = acoll.map( {"color.name" : "Green"}, function ( row ) {
		return row.name.last;
	} );
	test.deepEqual( baseline, map );
	test.done();
};

exports["test o map filter"] = function ( test ) {
	var baseline = [];
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Mahogany" ) {
			baseline.push( row.name.first );
		}
	} );

	var map = ocoll.map( {"color.name" : "Mahogany"}, function ( row ) {
		return row.name.first;
	} );
	test.deepEqual( baseline, map );
	test.done();
};

exports["test o reduce"] = function ( test ) {
	var baseline = 0;
	ocoll.each( function ( row ) {
		baseline += row.purchases;
	} );

	var total = ocoll.reduce( function ( res, row ) {
		return res += row.purchases;
	}, 0 );
	test.deepEqual( baseline, total );
	test.done();
};

exports["test a reduce"] = function ( test ) {
	var baseline = 0;
	acoll.each( function ( row ) {
		baseline += row.purchases;
	} );

	var total = acoll.reduce( function ( res, row ) {
		return res + row.purchases;
	}, 0 );
	test.deepEqual( baseline, total );
	test.done();
};

exports["test o reduce filter"] = function ( test ) {
	var baseline = 0;
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Olive Green" ) {
			baseline += row.purchases;
		}
	} );

	var total = ocoll.reduce( {"color.name" : "Olive Green"}, function ( res, row ) {
		return res + row.purchases;
	}, 0 );
	test.deepEqual( baseline, total );
	test.done();
};

exports["test a reduce filter"] = function ( test ) {
	var baseline = 0;
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Red Violet" ) {
			baseline += row.purchases;
		}
	} );

	var total = acoll.reduce( {"color.name" : "Red Violet"}, function ( res, row ) {
		return res += row.purchases;
	}, 0 );
	test.deepEqual( baseline, total );
	test.done();
};

exports["test a at"] = function ( test ) {
	var indices = sys.times( sys.random( 0, acoll.length - 1 ), function () {
		return sys.random( 0, acoll.length - 1 );
	} );
	var baseline = sys.map( indices, function ( index ) {
		return acoll.heap[index];
	} );

	var found = acoll.at( indices );
	test.deepEqual( baseline, found );

	test.done();
};

exports["test a countBy"] = function ( test ) {
	var hash = {};
	acoll.each( function ( row ) {
		if ( row.work ) {
			if ( hash[row.work.company] ) {
				hash[row.work.company]++;
			} else {
				hash[row.work.company] = 1;
			}
		} else {
			if ( hash[null] ) {
				hash[null]++;
			} else {
				hash[null] = 1;
			}
		}
	} );
	var res = acoll.countBy( function ( row ) {
		if ( row.work ) {
			return row.work.company;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test o countBy"] = function ( test ) {
	var hash = {};
	ocoll.each( function ( row ) {
		if ( row.work ) {
			if ( hash[row.work.company] ) {
				hash[row.work.company]++;
			} else {
				hash[row.work.company] = 1;
			}
		} else {
			if ( hash[null] ) {
				hash[null]++;
			} else {
				hash[null] = 1;
			}
		}
	} );
	var res = ocoll.countBy( function ( row ) {
		if ( row.work ) {
			return row.work.company;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test a groupBy"] = function ( test ) {
	var hash = {};
	acoll.each( function ( row ) {
		if ( row.work ) {
			if ( hash[row.work.city] ) {
				hash[row.work.city].push( row );
			} else {
				hash[row.work.city] = [row];
			}
		} else {
			if ( hash[null] ) {
				hash[null].push( row );
			} else {
				hash[null] = [row];
			}
		}
	} );
	var res = acoll.groupBy( function ( row ) {
		if ( row.work ) {
			return row.work.city;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test o groupBy"] = function ( test ) {
	var hash = {};
	ocoll.each( function ( row ) {
		if ( row.work ) {
			if ( hash[row.work.city] ) {
				hash[row.work.city].push( row );
			} else {
				hash[row.work.city] = [row];
			}
		} else {
			if ( hash[null] ) {
				hash[null].push( row );
			} else {
				hash[null] = [row];
			}
		}
	} );
	var res = ocoll.groupBy( function ( row ) {
		if ( row.work ) {
			return row.work.city;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test a pluck"] = function ( test ) {
	var baseline = acoll.map( function ( row ) {
		return row.purchases;
	} );

	var res = acoll.pluck( "purchases" );
	test.deepEqual( baseline, res );
	test.done();

};

exports["test o pluck"] = function ( test ) {
	var baseline = ocoll.map( function ( row ) {
		return row.purchases;
	} );

	var res = ocoll.pluck( "purchases" );
	test.deepEqual( baseline, res );
	test.done();

};

exports["test a countBy filter"] = function ( test ) {
	var hash = {};
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Silver" ) {
			if ( row.work ) {
				if ( hash[row.work.company] ) {
					hash[row.work.company]++;
				} else {
					hash[row.work.company] = 1;
				}
			} else {
				if ( hash[null] ) {
					hash[null]++;
				} else {
					hash[null] = 1;
				}
			}
		}
	} );
	var res = acoll.countBy( {"color.name" : "Silver"}, function ( row ) {
		if ( row.work ) {
			return row.work.company;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test o countBy filter"] = function ( test ) {
	var hash = {};
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Shamrock" ) {
			if ( row.work ) {
				if ( hash[row.work.company] ) {
					hash[row.work.company]++;
				} else {
					hash[row.work.company] = 1;
				}
			} else {
				if ( hash[null] ) {
					hash[null]++;
				} else {
					hash[null] = 1;
				}
			}
		}
	} );
	var res = ocoll.countBy( {"color.name" : "Shamrock"}, function ( row ) {
		if ( row.work ) {
			return row.work.company;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test a groupBy filter"] = function ( test ) {
	var hash = {};
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Raw Umber" ) {
			if ( row.work ) {
				if ( hash[row.work.city] ) {
					hash[row.work.city].push( row );
				} else {
					hash[row.work.city] = [row];
				}
			} else {
				if ( hash[null] ) {
					hash[null].push( row );
				} else {
					hash[null] = [row];
				}
			}
		}
	} );
	var res = acoll.groupBy( {"color.name" : "Raw Umber"}, function ( row ) {
		if ( row.work ) {
			return row.work.city;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test o groupBy filter"] = function ( test ) {
	var hash = {};
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Vivid Violet" ) {
			if ( row.work ) {
				if ( hash[row.work.city] ) {
					hash[row.work.city].push( row );
				} else {
					hash[row.work.city] = [row];
				}
			} else {
				if ( hash[null] ) {
					hash[null].push( row );
				} else {
					hash[null] = [row];
				}
			}
		}
	} );
	var res = ocoll.groupBy( {"color.name" : "Vivid Violet"}, function ( row ) {
		if ( row.work ) {
			return row.work.city;
		} else {
			return null;
		}
	} );
	test.deepEqual( hash, res );
	test.done();
};

exports["test o sortBy"] = function ( test ) {
	var index = 0;

	var sortable = ocoll.map( function ( row, key ) {
		var val = { row : row.work ? row.work.company : "", index : index, record : row};
		index++;
		return val;
	} );

	var sortKeys = sortable.sort( function ( a, b ) {
		var ai = a.index,
			bi = b.index;

		var av = a.row;
		var bv = b.row;

		if ( av !== bv ) {
			if ( av > bv ) {
				return 1;
			}
			if ( av < bv ) {
				return -1;
			}
		}
		return ai < bi ? -1 : 1;
	} );

	var sorted = [];
	var length = sortKeys.length;
	while ( length-- ) {
		sorted[length] = sortKeys[length].record;
	}

	var res = ocoll.sortBy( function ( row ) {
		if ( row.work ) {
			return row.work.company;
		} else {
			return "";
		}
	} );

	test.deepEqual( sorted, res );
	test.done();
};

exports["test a sortBy"] = function ( test ) {
	var index = 0;

	var sortable = ocoll.map( function ( row, key ) {
		var val = { row : row.work ? row.work.city : "", index : index, record : row};
		index++;
		return val;
	} );

	var sortKeys = sortable.sort( function ( a, b ) {
		var ai = a.index,
			bi = b.index;

		var av = a.row;
		var bv = b.row;

		if ( av !== bv ) {
			if ( av > bv ) {
				return 1;
			}
			if ( av < bv ) {
				return -1;
			}
		}
		return ai < bi ? -1 : 1;
	} );

	var sorted = [];
	var length = sortKeys.length;
	while ( length-- ) {
		sorted[length] = sortKeys[length].record;
	}

	var res = ocoll.sortBy( function ( row ) {
		if ( row.work ) {
			return row.work.city;
		} else {
			return "";
		}
	} );

	test.deepEqual( sorted, res );
	test.done();
};

exports["test a max"] = function ( test ) {
	var max = 0;
	var maxRecord = null;
	acoll.each( function ( row ) {
		if ( row.purchases > max ) {
			max = row.purchases;
			maxRecord = row;
		}
	} );

	var found = acoll.max( "purchases" );
	test.deepEqual( maxRecord, found );
	test.done();

};

exports["test o max"] = function ( test ) {
	var max = 0;
	var maxRecord = null;
	ocoll.each( function ( row ) {
		if ( row.purchases > max ) {
			max = row.purchases;
			maxRecord = row;
		}
	} );

	var found = ocoll.max( "purchases" );
	test.deepEqual( maxRecord, found );
	test.done();

};

exports["test a max filter"] = function ( test ) {
	var max = 0;
	var maxRecord = null;
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Wisteria" ) {
			if ( row.purchases > max ) {
				max = row.purchases;
				maxRecord = row;
			}
		}
	} );

	var found = acoll.max( {"color.name" : "Wisteria"}, "purchases" );
	test.deepEqual( maxRecord, found );
	test.done();

};

exports["test o max filter"] = function ( test ) {
	var max = 0;
	var maxRecord = null;
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Screamin' Green" ) {
			if ( row.purchases > max ) {
				max = row.purchases;
				maxRecord = row;
			}
		}
	} );

	var found = ocoll.max( {"color.name" : "Screamin' Green"}, "purchases" );
	test.deepEqual( maxRecord, found );
	test.done();

};

exports["test a min"] = function ( test ) {
	var min = 10000000;
	var minRecord = null;
	acoll.each( function ( row ) {
		if ( row.purchases < min ) {
			min = row.purchases;
			minRecord = row;
		}
	} );

	var found = acoll.min( "purchases" );
	test.deepEqual( minRecord, found );
	test.done();

};

exports["test o min"] = function ( test ) {
	var min = 1000000;
	var minRecord = null;
	ocoll.each( function ( row ) {
		if ( row.purchases < min ) {
			min = row.purchases;
			minRecord = row;
		}
	} );

	var found = ocoll.min( "purchases" );
	test.deepEqual( minRecord, found );
	test.done();

};

exports["test a min filter"] = function ( test ) {
	var min = 10000;
	var minRecord = null;
	acoll.each( function ( row ) {
		if ( row.color && row.color.name === "Wisteria" ) {
			if ( row.purchases < min ) {
				min = row.purchases;
				minRecord = row;
			}
		}
	} );

	var found = acoll.min( {"color.name" : "Wisteria"}, "purchases" );
	test.deepEqual( minRecord, found );
	test.done();

};

exports["test o min filter"] = function ( test ) {
	var min = 100000;
	var minRecord = null;
	ocoll.each( function ( row ) {
		if ( row.color && row.color.name === "Screamin' Green" ) {
			if ( row.purchases < min ) {
				min = row.purchases;
				minRecord = row;
			}
		}
	} );

	var found = ocoll.min( {"color.name" : "Screamin' Green"}, "purchases" );
	test.deepEqual( minRecord, found );
	test.done();

};

exports["test a any"] = function ( test ) {
	var foundOne;
	acoll.each( function ( row ) {
		if ( row.color && row.color.name ) {
			foundOne = row.color.name;
			return false;
		}
	} );

	var res = acoll.any( {"color.name" : foundOne} );

	test.equal( !sys.isEmpty( foundOne ), res );
	test.done();
};

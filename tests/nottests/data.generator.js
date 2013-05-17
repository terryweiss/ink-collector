"use strict";
var fs = require( "fs" );
var path = require( "path" );
var async = require( "async" );
var collector = require( "../../collector" );
var sys = require( "lodash" );

var firstnames = null;
var lastnames = null;
var companies = null;
var colors = null;
var ocoll = collector.collect( {} );
var acoll = collector.collect( [] );

exports.generate = function ( cb ) {
	async.series( [
		function ( done ) {
			fs.readFile( path.resolve( __dirname, "./first.names.json" ), 'utf8', function ( err, d ) {
				var data = JSON.parse( d );
				firstnames = collector.collect( data );
				done();
			} );
		},
		function ( done ) {
			fs.readFile( path.resolve( __dirname, "./last.names.json" ), 'utf8', function ( err, d ) {
				var data = JSON.parse( d );
				lastnames = collector.collect( data );
				done();
			} );
		},
		function ( done ) {
			fs.readFile( path.resolve( __dirname, "./colors.json" ), 'utf8', function ( err, d ) {
				var data = JSON.parse( d );
				colors = collector.collect( data );
				done();
			} );
		},
		function ( done ) {
			fs.readFile( path.resolve( __dirname, "./companies.json" ), 'utf8', function ( err, d ) {
				var data = JSON.parse( d );
				companies = collector.collect( data );
				done();
			} );
		}
	], function () {
		acoll = collector.array( sys.times( 60000, function () {
			return {
				name      : {
					first : firstnames.index( sys.random( 0, firstnames.length - 1 ) ),
					last  : firstnames.index( sys.random( 0, lastnames.length - 1 ) )
				},
				color     : colors.index( sys.random( 0, colors.length ) ),
				work      : companies.index( sys.random( 0, companies.length ) ),
				purchases : sys.random( 0, 10000 )
			};
		} ) );

		ocoll = collector.object( {} );
		sys.times( 60000, function ( n ) {
			ocoll.add( n, {
				name      : {
					first : firstnames.index( sys.random( 0, firstnames.length - 1 ) ),
					last  : firstnames.index( sys.random( 0, lastnames.length - 1 ) )
				},
				color     : colors.index( sys.random( 0, colors.length ) ),
				work      : companies.index( sys.random( 0, companies.length ) ),
				purchases : sys.random( 0, 10000 )
			} );
		} );
		cb( acoll, ocoll );
	} );

};

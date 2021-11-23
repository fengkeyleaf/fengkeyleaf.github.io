"use strict"

/*
 * MyArray.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0 isEmpty(), getLast(), getFirst() on 9/12/2021$
 */

/**
 * Add methods to the Array class
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

Array.prototype.isEmpty = function () {
    return this.length === 0;
}

Array.prototype.getLast = function () {
    return this.isEmpty() ? null : this[ this.length - 1 ];
}

Array.prototype.getFirst = function () {
    return this.isEmpty() ? null : this[ 0 ];
}

/**
 * @param {Number} nums
 */

function getFloat32( ...nums ) {
    return new Float32Array( nums );
}

/**
 * @param {Number} nums
 */

Float32Array.prototype.push = function ( ...num ) {
    let res = [];
    this.forEach( n => res.push( n ) );
    return new Float32Array( res.concat( num ) );
}

/**
 * @param {[Number]} nums
 */

Float32Array.prototype.concat = function ( ...nums ) {
    let res = [];
    this.forEach( n => res.push( n ) );
    for ( const num of nums ) {
        res = res.concat( num );
    }

    return new Float32Array( res );
}
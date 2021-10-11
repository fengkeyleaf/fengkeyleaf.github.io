"use strict"

/*
 * ball.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../../myLibraries/lang/MyMath.js";

/**
 * data structure of a ball
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Ball {
    static IDStatic = 0;

    constructor( group, mesh, mass, radius, name ) {
        this.group = group; // translate
        this.mesh = mesh; // rotate
        this.m = mass; // kg
        this.radius = radius;

        this.fs = new THREE.Vector3( 0, 0, 0 ); // forces, kg * m / s ^ 2
        this.v = new THREE.Vector3( 0, 0, 0 ); // velocity, m / s
        this.M = new THREE.Vector3( 0, 0, 0 ); // Momentum, kg * m / s
        this.impulses = [];
        this.name = name;
        this.ID = Ball.IDStatic++;
    }

    printV() {
        console.log( this.name + " v: ", this.v );
    }

    printM() {
        console.log( this.name + " M: ", this.M );
    }

    printImpulses() {
        console.log( this.name + " impulses: ", this.impulses );
    }

    printPos() {
        console.log( this.name + " pos: ", this.group.position );
    }

    /**
     * @param {Ball} b1
     * @param {Ball} b2
     * @param {Number} e
     */

    static ballBallImpulse( b1, b2, e ) {
        console.assert( MyMath.doubleCompare( e , 0 ) >= 0 && MyMath.doubleCompare( e, 1 ) <= 0 );
        let j = b2.v.clone().sub( b1.v ).multiplyScalar( 1 + e );
        j.multiplyScalar( b1.m * b2.m / ( b1.m + b2.m ) );
        return j;
    }

    /**
     * @param {Number} dt
     */

    // update position ( integrate velocity )
    updatePos( dt ) {
        // s( t + Dt ) = s( t ) + v( t ) * Dt
        dt = dt === 0 ? 1 : dt;
        this.group.position.add( this.v.clone().multiplyScalar( dt ) );
        console.assert( this.group.position.y === 0, this.group.position.y );
        this.printPos();
    }

    /**
     * @param {Number} dt
     */

    // update Momentum ( integrate force / acceleration )
    updateM( dt) {
        // debugger
        // M( t + Dt ) = M( t ) + F( t ) * Dt + impulse( impulse_init + impulse_coll + impulse_fric )
        // console.log( this.name + " f", f );
        console.assert( dt, dt );
        let F = this.fs.clone().multiplyScalar( dt );
        // this.M.add( f );
        // this.impulses.forEach( i => this.M.add( i ) );
        console.log( this.name + " F", F );
        this.impulses.forEach( i => F.add( i ) );
        console.log( this.name + " F", F );
        // console.log( this.name + " ims", this.impulses );
        this.M.add( F );
        console.assert( this.M.y === 0, this.M.y );
        this.printM();
    }

    // Step 3
    // Calculate velocities
    calV() {
        // v(t +Dt) = M( t + Dt ) / m
        let M = this.M.clone().divideScalar( this.m );
        console.assert( M.y === 0, M.y );
        this.v.set( M.x, M.y, M.z );
        this.printV();
    }

    /**
     * @param {Ball} object
     */

    isColliding( object ) {
        let distance = this.group.position.clone().sub( object.group.position ).length();
        return MyMath.doubleCompare( this.radius + object.radius, distance ) > 0;
    }

    /**
     * @param {Ball} object
     */

    lineOfAction( object ) {
        return this.group.position.clone().sub( object.group.position ).normalize();
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */

    setPosition( x, y, z ) {
        this.group.position.set( x, y, z );
    }

    /**
     * @param {Number} us
     * @param {Number} g
     */

    addSlidingFric( us, g ) {
        let slidingFric = us * this.m * g;
        let sFricVec = this.v.clone().normalize().multiplyScalar( slidingFric ).negate();
        this.impulses.push( sFricVec );
    }

    /**
     * @param {Vector3} j
     * @param {Ball} ball
     */

    addCollidingImpulse( j, ball ) {
        let impulse = this.lineOfAction( ball ).multiply( j );
        this.impulses.push( impulse );
    }
}
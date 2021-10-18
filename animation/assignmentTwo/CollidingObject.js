"use strict"

import MyMath from "../../myLibraries/lang/MyMath.js";

export default class CollidingObject {
    static IDStatic = 0;

    constructor( group, mesh, mass, name ) {
        this.group = group; // translate
        this.mesh = mesh; // rotate
        this.m = mass; // kg

        this.fs = new THREE.Vector3( 0, 0, 0 ); // forces, kg * m / s ^ 2
        this.v = new THREE.Vector3( 0, 0, 0 ); // velocity, m / s
        this.M = new THREE.Vector3( 0, 0, 0 ); // Momentum, kg * m / s
        this.impulses = [];
        this.name = name;
        this.ID = CollidingObject.IDStatic++;

        this.isStatic = false;
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
     * @param {Number} dt
     */

    // update position ( integrate velocity )
    updatePos( dt ) {
        if ( this.isStatic ) return;
        // s( t + Dt ) = s( t ) + v( t ) * Dt
        dt = dt === 0 ? 1 : dt;
        this.group.position.add( this.v.clone().multiplyScalar( dt ) );
        // console.assert( this.group.position.y === 0, this.group.position.y );
        this.printPos();
    }

    /**
     * @param {Number} dt
     */

    // update Momentum ( integrate force / acceleration )
    updateM( dt) {
        if ( this.isStatic ) return;
        // debugger
        // M( t + Dt ) = M( t ) + F( t ) * Dt + impulse( impulse_init + impulse_coll + impulse_fric )
        // console.log( this.name + " f", f );
        dt = dt === 0 ? 1 : dt;
        console.assert( dt, dt );
        let F = this.fs.clone().multiplyScalar( dt );
        // this.M.add( f );
        // this.impulses.forEach( i => this.M.add( i ) );
        console.log( this.name + " F", F );
        this.impulses.forEach( i => F.add( i ) );
        console.log( this.name + " F", F );
        // console.log( this.name + " ims", this.impulses );
        this.M.add( F );
        // console.assert( this.M.y === 0, this.M.y );
        this.printM();
    }

    // Step 3
    // Calculate velocities
    calV() {
        if ( this.isStatic ) return;
        // v(t +Dt) = M( t + Dt ) / m
        let M = this.M.clone().divideScalar( this.m );
        // console.assert( M.y === 0, M.y );
        this.v.set( M.x, M.y, M.z );
        this.printV();
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
     * @param {Vector3} j
     * @param {{}} ball
     */

    addCollidingImpulse( j, ball ) {
        if ( this.isStatic ) return;

        let impulse = this.lineOfAction( ball ).multiply( j );
        console.log( this.lineOfAction( ball ), j )
        this.impulses.push( impulse );
    }

    /**
     * @param {Number} us
     * @param {Number} g
     */

    addSlidingFric( us, g ) {
        if ( this.isStatic ) return;

        let slidingFric = us * this.m * g;
        let sFricVec = this.v.clone().normalize().multiplyScalar( slidingFric ).negate();
        this.impulses.push( sFricVec );
    }
}
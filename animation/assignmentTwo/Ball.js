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
import CollidingObject from "./CollidingObject.js";
import Cushion from "./Cushion.js";

/**
 * data structure of a ball
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Ball extends CollidingObject {
    constructor( group, mesh, mass, radius, name ) {
        super( group, mesh, mass, name );
        this.radius = radius;
    }

    /**
     * @param {CollidingObject} b2 collided
     * @param {Number} e
     */

    collidingImpulse( b2, e ) {
        console.assert( MyMath.doubleCompare( e , 0 ) >= 0 && MyMath.doubleCompare( e, 1 ) <= 0 );
        let j = null;
        if ( b2 instanceof Ball ) {
            // let n1 = this.lineOfAction( b2 ).negate();
            // let theta = MyMath.isEqualZero( this.v.length() ) ? 1 : this.v.clone().dot( n1 ) / ( n1.length() * this.v.length() );
            // let v1 = this.v.clone().multiplyScalar( theta );
            // let n2 = b2.lineOfAction( this ).negate();
            // theta = MyMath.isEqualZero( b2.v.length() ) ? 1 : b2.v.clone().dot( n2 ) / ( n2.length() * b2.v.length() );
            // let v2 = b2.v.clone().multiplyScalar( theta );
            // j = v2.sub( v1 ).multiplyScalar( 1 + e );
            // j = b2.v.clone().sub( this.v ).multiplyScalar( 1 + e );
            j = b2.v.clone().sub( this.v );
            j.multiplyScalar( this.m * b2.m / ( this.m + b2.m ) );
        }

        if ( b2 instanceof Cushion ) {
            // let n1 = b2.n.negate();
            // let theta = MyMath.isEqualZero( this.v.length() ) ? 1 : this.v.clone().dot( n1 ) / ( n1.length() * this.v.length() );
            // let v1 = this.v.clone().multiplyScalar( theta );
            // console.log( v1 );
            // let v2 = b2.v.clone().multiplyScalar( theta );
            // console.assert( MyMath.isEqualZero( b2.v.length() ) );
            // console.log( v2 );
            // j = v2.sub( v1 ).multiplyScalar( 1 + e );
            // console.log( j );
            // // j.multiplyScalar( this.m * b2.m / ( this.m + b2.m ) );
            // j.multiplyScalar( 1 / this.m );

            console.log( "cushion ");
            // let n1 = b2.n.clone().negate();
            // let theta = MyMath.isEqualZero( this.v.length() ) ? 1 : this.v.clone().normalize().dot( n1 ) / ( n1.length() * this.v.length() );
            // console.log(theta, n1.clone().dot( this.v ) / ( n1.length() * this.v.length() ));
            // let v1 = this.v.clone().multiplyScalar( theta );
            // console.log( v1 );
            // j = v1.multiplyScalar( this.m ).multiplyScalar( ( 1 + e ) / e ).negate();
            // j = this.v.clone().multiplyScalar( this.m ).multiplyScalar( ( 1 + e ) / e ).negate();
            // j = this.v.clone().multiplyScalar( this.m ).multiplyScalar( ( 1 + e ) / e );
            // console.log(this.v.clone().multiplyScalar( this.m ));
            // console.log( ( 1 + e ) / e );

            j = b2.v.clone().sub( this.v ).multiplyScalar( 1 + e );
            j.multiplyScalar( this.m * b2.m / ( this.m + b2.m ) );
        }

        return j;
    }

    /**
     * @param {{}} object
     */

    isColliding( object ) {
        if ( object instanceof Ball ) {
            let distance = this.group.position.clone().sub( object.group.position ).length();
            return MyMath.doubleCompare( this.radius + object.radius, distance ) > 0;
        }

        console.assert( object instanceof Cushion );
        let p0 = object.group.position.clone();
        // p0.setX( this.group.position.x );
        p0.setZ( this.group.position.z );

        console.log( p0, this.group.position.clone());
        let d = this.group.position.clone().sub( p0 );
        let direction = d.clone().dot( object.n.clone() );

        console.log( object.n );
        console.log( this.group.position.clone().sub( p0 ).multiply( object.n ).length() );
        if ( MyMath.doubleCompare( direction, 0 ) > 0 )
            return MyMath.doubleCompare( d.length(), this.radius ) < 0;

        return true;
    }

    /**
     * @param {{}} object
     */

    lineOfAction( object ) {
        if ( object instanceof Ball )
            return this.group.position.clone().sub( object.group.position ).normalize();

        console.assert( object instanceof Cushion );
        // return  object.n.clone();
        return new THREE.Vector3( 1, 1, 1 );
    }
}
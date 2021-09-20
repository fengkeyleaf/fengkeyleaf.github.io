"use strict"

import MyMath from "../lang/MyMath.js";

export default class KeyFraming {

    /**
     * @param {Number} currentT
     * @param {Number} initT
     * @param {Number} EndT
     */

    static mapTtoU( currentT, initT, EndT ) {
        console.assert( !MyMath.isNegative( currentT ), currentT );
        console.assert( !MyMath.isNegative( initT ), initT );
        console.assert( !MyMath.isNegative( EndT ), EndT );
        console.assert( MyMath.doubleCompare( currentT, EndT ) <= 0 && MyMath.doubleCompare( currentT, initT ) >= 0, currentT );
        return ( currentT - initT ) / ( EndT - initT );
    }

    /**
     * @param {Number} u
     * @param {Number} P0
     * @param {Number} P1
     */

    static __LinearInterpolation( u, P0, P1 ) {
        console.assert( MyMath.doubleCompare( u, 1 ) <= 0 && MyMath.doubleCompare( u, 0 ) >= 0, u );
        return ( 1 - u ) * P0 + u * P1;
    }

    /**
     * @param {Vector3} position
     * @param {Number} u
     * @param {Vector3} currentKeyframe
     * @param {Vector3} nextKeyframe
     */

    static LinearInterpolation( position, u, currentKeyframe, nextKeyframe ) {
        position.setX( KeyFraming.__LinearInterpolation( u, currentKeyframe.x, nextKeyframe.x ) );
        position.setY( KeyFraming.__LinearInterpolation( u, currentKeyframe.y, nextKeyframe.y ) );
        position.setZ( KeyFraming.__LinearInterpolation( u, currentKeyframe.z, nextKeyframe.z ) );
    }

    /**
     * Spherical Linear Interpolation (Slerp)
     *
     * @param {Quaternion} q1
     * @param {Quaternion} q2
     * @param {Number} u
     */

    static __slerp( q1, q2, u ) {
        const res = q1.dot( q2 );
        if ( MyMath.equalsQuaternion( q1, q2 ) ) {
            console.assert( MyMath.equalsQuaternion( q1, q2 ) );
            return q1;
        }
        console.assert( !MyMath.equalsQuaternion( q1, q2 ) );
        console.assert( MyMath.doubleCompare( res, 1 ) <= 0 && MyMath.doubleCompare( res, -1 ) >= 0, q1, q2 );
        const THETA = Math.acos( res ); // in radians
        console.assert( THETA, THETA, q1, q2 );
        const SIN_THETA = Math.sin( THETA );
        console.assert( SIN_THETA, SIN_THETA );
        const RATIO1 = Math.sin( ( 1 - u ) * THETA ) / SIN_THETA;
        console.assert( RATIO1, RATIO1 );
        const RATIO2 = Math.sin( u * THETA ) / SIN_THETA;
        console.assert( RATIO1, RATIO1 );

        q1 = MyMath.multipleConstQuaternion( q1, RATIO1 );
        q2 = MyMath.multipleConstQuaternion( q2, RATIO2 );
        return MyMath.addQuaternion( q1, q2 );
    }

    /**
     * Spherical Linear Interpolation (Slerp)
     *
     * @param {Quaternion} q
     * @param {Number} u
     * @param {{}} currentQuaternion
     * @param {{}} nextQuaternion
     */

    static slerp( q, u, currentQuaternion, nextQuaternion ) {
        console.assert( MyMath.doubleCompare( u, 1 ) <= 0 && MyMath.doubleCompare( u, 0 ) >= 0, u );
        let newQuat = KeyFraming.__slerp( currentQuaternion.quaternion, nextQuaternion.quaternion, u );
        q.set( newQuat.x, newQuat.y, newQuat.z, newQuat.w );
    }
}
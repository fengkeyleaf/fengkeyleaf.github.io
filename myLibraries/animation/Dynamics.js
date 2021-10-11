"use strict"

/*
 * Dynamics.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0 isColliding(), binarySearchCollision on 10/11/2021$
 */

import MyMath from "../lang/MyMath.js";

/**
 * This class consists exclusively of static methods
 * that related to Dynamics
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Dynamics {

    /**
     * @param {Animator} animator
     * @param {Boolean} isUpdate
     */

    static isColliding( animator, isUpdate ) {
        if ( isUpdate ) animator.ballsCollided = [];

        let res = false;
        console.assert( !animator.balls.isEmpty() );
        for ( let i = 0; i < animator.balls.length; i++ ) {
            let ball1 = animator.balls[ i ];
            for ( let j = i + 1; j < animator.balls.length; j++ ) {
                let ball2 = animator.balls[ j ];
                if ( ball1.isColliding( ball2 ) ) {
                    if ( isUpdate ) animator.ballsCollided.push( [ ball1, ball2 ] );
                    res = true;
                }
            }
        }

        return res;
    }

    static tolerance = 0.0001;

    /**
     * @param {Animator} animator
     * @param {Number} t1
     * @param {Number} t2
     * @param {Boolean} isLeft
     */

    static binarySearchCollision( animator, t1, t2, isLeft ) {
        // No collision at time t, Penetration at time t + Dt
        // Test point at time t’ between t and t + Dt iteratively.
        // t' = ( t + Dt ) / 2
        let tMid = ( t2 - t1 ) / 2 + t1;
        console.assert( tMid, tMid, t1, t2 );
        // Dt = t' - t
        let dt = isLeft ? tMid - t1 : ( t2 - t1 ) - ( tMid - t1 );
        // update all objects' position with Dt
        animator.balls.forEach( b => {
            if ( !isLeft ) b.v.negate();
            b.updatePos( dt );
            if ( !isLeft ) b.v.negate();
        } );

        let isColliding = Dynamics.isColliding( animator, false );
        // Iterate until a predefined tolerance(tol) is achieved
        if ( MyMath.doubleCompare( t2 - t1, Dynamics.tolerance ) <= 0 )
            return tMid;

        // Test all pairs of objects, If No Collision, test at time between t’ and t + Dt
        if ( !isColliding ) return Dynamics.binarySearchCollision( animator, tMid, t2, true );
        // Else test at time between t and t’
        else return Dynamics.binarySearchCollision( animator, t1, tMid, false );
    }
}
"use strict"

/*
 * AnimatorZero.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../../myLibraries/lang/MyMath.js";
import AnimatorZero from "../assignmentZero/AnimatorZero.js";
import KeyFraming from "../../myLibraries/animation/KeyFraming.js";
import Animator from "../../myLibraries/animation/Animator.js";

/**
 * Assignment 1:
 * Write a simplified key framing system that will translate
 * and rotate a single object based on a set of key frames.
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class AnimatorOne extends AnimatorZero {

    static KEYFRAMES = [
        // 0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0
        {
            time: 0.0 * 1000,
            position: new THREE.Vector3( 0.0, 0.0, 0.0 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 1, -1 ), MyMath.radians( 0 ) ),
            degrees: 0
        },
        // 1.0  4.0 0.0 0.0 1.0 1.0 -1.0 30.0
        {
            time: 1.0 * 1000,
            position: new THREE.Vector3( 4.0, 0.0, 0.0 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 1, -1 ), MyMath.radians( 30 ) ),
            degrees: 30
        },
        // 2.0  8.0 0.0 0.0 1.0 1.0 -1.0 90.0
        {
            time: 2.0 * 1000,
            position: new THREE.Vector3( 8.0, 0.0, 0.0 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 1, -1 ), MyMath.radians( 90 ) ),
            degrees: 90
        },
        // 3.0  12.0 12.0 12.0 1.0 1.0 -1.0 180.0
        {
            time: 3.0 * 1000,
            position: new THREE.Vector3( 12.0, 12.0, 12.0 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 1, -1 ), MyMath.radians( 180 ) ),
            degrees: 180
        },
        // 4.0  12.0 18.0 18.0 1.0 1.0 -1.0 270.0
        {
            time: 4.0 * 1000,
            position: new THREE.Vector3( 12, 18, 18 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 1, -1 ), MyMath.radians( 270 ) ),
            degrees: 270
        },
        // 5.0  18.0 18.0 18.0 0.0 1.0 0.0 90.0
        {
            time: 5.0 * 1000,
            position: new THREE.Vector3( 18, 18, 18 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), MyMath.radians( 90 ) ),
            degrees: 90
        },
        // 6.0  18.0 18.0 18.0 0.0 0.0 1.0 90.0
        {
            time: 6.0 * 1000,
            position: new THREE.Vector3( 18, 18, 18 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), MyMath.radians( 90 ) ),
            degrees: 90
        },
        // 7.0  25.0 12.0 12.0 1.0 0.0 0.0 0.0
        {
            time: 7.0 * 1000,
            position: new THREE.Vector3( 25, 12, 12 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), MyMath.radians( 0 ) ),
            degrees: 0
        },
        // 8.0  25.0 0.0 18.0 1.0 0.0 0.0 0.0
        {
            time: 8.0 * 1000,
            position: new THREE.Vector3( 25, 0, 18 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), MyMath.radians( 0 ) ),
            degrees: 0
        },
        // 9.0 25.0 1.0 18.0 1.0 0.0 0.0 0.0
        {
            time: 9.0 * 1000,
            position: new THREE.Vector3( 25, 1, 18 ),
            quaternion: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), MyMath.radians( 0 ) ),
            degrees: 0
        }
    ];

    constructor() {
        super();
        // initializing keyframe - assign #1
        this.startIndex = 0;
        this.currentKeyframe = AnimatorOne.KEYFRAMES[ this.startIndex ];

        this.endIndex = 1;
        this.nextKeyframe = AnimatorOne.KEYFRAMES[ this.endIndex ];

        this.preTime = this.currentKeyframe.time;
        this.nextTime = this.nextKeyframe.time;
        // this.interval = this.nextTime - this.preTime;
    }

    printInfo() {
        console.log( Animator.animator );
        console.log( Animator.animator.group1 );
        console.log( "position", Animator.animator.group1.position );
        console.log( "rotation", Animator.animator.group1.rotation );
        console.log( "scale", Animator.animator.group1.scale );
    }

    static initData() {
        console.log( AnimatorOne.KEYFRAMES );
        AnimatorOne.KEYFRAMES.forEach( datum => {
            datum.quaternion.normalize();
        } );
        AnimatorOne.KEYFRAMES.forEach( k => console.log( k.quaternion ) );
    }

    // called by window.onload
    static run() {
        // assignment one
        AnimatorOne.initData();

        let animator = new AnimatorOne();
        Animator.animator = animator;
        animator.initZeroOne();

        // add the canvas to the HTML
        document.body.appendChild( animator.renderer.domElement );

        // Assignment #1
        AnimatorOne.renderOne();
    }


    static renderOne() {
        let current = new Date() - Animator.animator.initializingDate;

        if ( current >= Animator.animator.nextTime ) {
            Animator.animator.update();
            if ( Animator.animator.endIndex >= AnimatorOne.KEYFRAMES.length - 1 ) {
                console.log( "stop here" );
                Animator.animator.printInfo();
                return;
            }
        }

        requestAnimationFrame( AnimatorOne.renderOne );
        Animator.animator.renderer.render( Animator.animator.scene, Animator.animator.camera );

        // For each frame
        // Get time, t
        // Convert t to u
        let u = KeyFraming.mapTtoU( current, Animator.animator.preTime, Animator.animator.nextTime );
        // Perform interpolation, for u value
        // Translation
        let po = KeyFraming.LinearInterpolation( u, Animator.animator.currentKeyframe.position, Animator.animator.nextKeyframe.position );
        Animator.animator.group1.position.set( po.x, po.y, po.z );

        // Orientation
        // 1) As rotation assumes normalized axis, quaternions should
        // be normalized to be used for rotation.
        // 2) Allows for concatenation of rotations via quaternion
        // multiplication (with a caveat…e.g. must multiply in reverse order ).
        let newQuat = KeyFraming.slerp( u, Animator.animator.currentKeyframe, Animator.animator.nextKeyframe );
        Animator.animator.mesh1.quaternion.set( newQuat.x, newQuat.y, newQuat.z, newQuat.w );
        // Construct transformation matrix
        // Apply to object coordinates
        // Render
    }

    update() {
        this.startIndex = this.endIndex++;
        this.currentKeyframe = AnimatorOne.KEYFRAMES[ this.startIndex ];
        this.nextKeyframe = AnimatorOne.KEYFRAMES[ this.endIndex ];
        this.preTime = this.currentKeyframe.time;
        console.assert( this.nextKeyframe, this.endIndex );
        this.nextTime = this.nextKeyframe.time;
        // this.interval = this.nextTime - this.preTime;
        this.printInfo();
    }
}
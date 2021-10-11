"use strict"

/*
 * Animator.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../lang/MyMath.js";
import KeyFraming from "./KeyFraming.js";
import Ball from "../../animation/assignmentTwo/Ball.js";
import Dynamics from "./Dynamics.js";

/**
 * Assignment 0:
 * Create the framework and testbed for the animation
 * techniques to be explored during the semester.
 *
 * Assignment 1:
 * Write a simplified key framing system that will translate
 * and rotate a single object based on a set of key frames.
 *
 * Assignment 2:
 * Write a system that will simulate a single shot of a billiards
 * game.
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class Animator {
    static animator = null;
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

    static initData() {
        console.log( Animator.KEYFRAMES );
        Animator.KEYFRAMES.forEach( datum => {
            datum.quaternion.normalize();
        } );
        Animator.KEYFRAMES.forEach( k => console.log( k.quaternion ) );
    }

    constructor() {
        // initializing keyframe - assign #1
        this.startIndex = 0;
        this.currentKeyframe = Animator.KEYFRAMES[ this.startIndex ];

        this.endIndex = 1;
        this.nextKeyframe = Animator.KEYFRAMES[ this.endIndex ];

        // time
        this.preTime = this.currentKeyframe.time;
        this.nextTime = this.nextKeyframe.time;
        this.interval = this.nextTime - this.preTime;
        this.initializingDate = null;
        this.startingDate = null;

        // webgl
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.group1 = null;
        this.mesh1 = null;

        // assign #2
        this.group2 = null;
        this.mesh2 = null;
    }

    initDynamics() {

        this.us = 0.38 // sliding fraction, Dry wood on wood
        // this.us = 0.78 // sliding fraction, Dry steel on steel
        this.g = 9.80665; // N/kg
        this.e = 0.8; // 0 <= e <= 1
//         this.e = 0.2; // 0 <= e <= 1
        this.impulseStriking = new THREE.Vector3( 200, 0, 0 ); // kg * m / s ^ 2
        this.isInit = true;

        let mass = 0.23; // kg
        this.cue = new Ball( this.group1, this.mesh1, mass, this.radius, "cue" );
        this.cue.setPosition( 320, 0, 0 );
        this.ball1 = new Ball( this.group2, this.mesh2, mass, this.radius, "ballRed" );
        this.ball1.setPosition( 160, 0, 0 );
        this.ball2 = new Ball( this.group3, this.mesh3, mass, this.radius, "ballGreen" );
        this.ball2.setPosition( 80, 0, 0 );
        this.ball3 = new Ball( this.group4, this.mesh4, mass, this.radius, "ballYellow" );
        this.ball3.setPosition( 10, 0, 0 );

        this.balls = [];
        this.balls.push( this.cue );
        this.balls.push( this.ball1 );
        this.balls.push( this.ball2 );
        this.balls.push( this.ball3 );

        this.ballsCollided = [];
    }

    // called by window.onload
    static run() {
        // assignment one
        // Animator.initData();

        let animator = new Animator();
        Animator.animator = animator;
        // animator.initZeroOne();
        animator.initTwo();
        animator.initDynamics();

        // add the canvas to the HTML
        document.body.appendChild( animator.renderer.domElement );

        // start rendering
        // Assignment #0
        // Animator.renderZero();

        // Assignment #1
        // Animator.renderOne();

        // Assignment #2
        animator.renderer.render( animator.scene, animator.camera );
        // record last time we call the render function
        setTimeout( function () {
            animator.initializingDate = new Date().getTime() / 1000; // s
            animator.startingDate = animator.initializingDate;
            Animator.renderTwo();
        }, 1000 );
    }

    update() {
        this.startIndex = this.endIndex++;
        this.currentKeyframe = Animator.KEYFRAMES[ this.startIndex ];
        this.nextKeyframe = Animator.KEYFRAMES[ this.endIndex ];
        this.preTime = this.currentKeyframe.time;
        console.assert( this.nextKeyframe, this.endIndex );
        this.nextTime = this.nextKeyframe.time;
        this.interval = this.nextTime - this.preTime;
        this.printInfo();
    }

    printInfo() {
        console.log( "position", Animator.animator.group.position );
        console.log( "rotation", Animator.animator.group.rotation );
        console.log( "scale", Animator.animator.group.scale );
    }

    // render functions
    static renderTwo() {
        let animator = Animator.animator;
        let balls = animator.balls;

        // t + Dt = new Date() = t( t )
        let current = new Date().getTime() / 1000; // s
        // Dt = t + Dt - t
        let dt = current - animator.initializingDate; // s
        console.log( dt );

        // stop animating after 20s
        // console.log( current - animator.initializingDate );
        if ( current - animator.startingDate >= 1 ) {
            console.log( animator.group1.position );
            return;
        }
        // if ( !animator.isInit && animator.cue.v.length() < 0.001 ) {
        //     console.log( animator.group1.position );
        //     return;
        // }

        let tempDt = dt;
        // Step 1: Calculate Forces, F( t )
        if ( animator.isInit ) {
            balls[ 0 ].fs.add( animator.impulseStriking.clone().negate() );
            // balls[ 1 ].fs.add( animator.impulseStriking );
            // console.log( f );
            tempDt = dt;
            dt = 1;
            // animator.isInit = false;
        }

        // Step 2: update position ( integrate velocity )
        balls.forEach( b => b.updatePos( dt ) );

        // Render the scene
        animator.renderer.render( animator.scene, animator.camera );

        // Perform collision detection / response
        // Test all pairs of objects, if collision detected,
        // if ( false && Dynamics.isColliding( animator ) ) {
        if ( Dynamics.isColliding( animator, true ) ) {
            // debugger
            console.log( "coll" );
            // Binary search to find the point of collision
            let timeOfCollision = Dynamics.binarySearchCollision( animator, animator.initializingDate, current, false );
            console.assert( timeOfCollision, timeOfCollision );
            // backup object to p oint of collision. t'
            //     Dt = t' - t
            dt = timeOfCollision - animator.initializingDate;
            //     Calculate Forces with newer Dt
            //     update position with newer Dt

            console.assert( MyMath.isPositive( dt ) || MyMath.isEqualZero( dt ) );
            // Calculate impulse_coll ( realized as change to momentum )
            console.assert( !animator.ballsCollided.isEmpty(), animator.ballsCollided );
            animator.ballsCollided.forEach( pairs => {
                let ball1 = pairs[ 0 ];
                let ball2 = pairs[ 1 ];
                let j = Ball.ballBallImpulse( ball1, ball2, animator.e );
                console.log( "j", j );
                ball1.addCollidingImpulse( j, ball2 );
                ball2.addCollidingImpulse( j, ball1 );
                console.log( ball1.name + " co_im", ball1.impulses );
                console.log( ball2.name + " co_im", ball2.impulses );
            } );

            console.log( dt );
        }

        // console.log(animator.f);
        // update Momentum ( integrate force / acceleration )
        balls.forEach( b => {
            b.addSlidingFric( animator.us, animator.g )
            b.updateM( dt );
            b.impulses = [];
            b.fs.set( 0, 0, 0 );
        } );

        // Step 3: Calculate velocities
        balls.forEach( b => {
            b.calV();
            // console.log( b.name+" v", b.v );
        } );

        // update t to t + Dt
        if ( animator.isInit ) {
            dt = tempDt;
            animator.isInit = false;
        }
        animator.initializingDate += dt;

        // Go to step 1
        requestAnimationFrame( Animator.renderTwo );
        // balls.forEach( b=> console.log( b.group.position));
        console.log( "\n" );
    }

    static renderOne() {
        let current = new Date() - Animator.animator.initializingDate;

        if ( current >= Animator.animator.nextTime ) {
            Animator.animator.update();
            if ( Animator.animator.endIndex >= Animator.KEYFRAMES.length - 1 ) {
                console.log( "stop here" );
                Animator.animator.printInfo();
                return;
            }
        }

        requestAnimationFrame( Animator.renderOne );
        Animator.animator.renderer.render( Animator.animator.scene, Animator.animator.camera );

        // For each frame
        // Get time, t
        // Convert t to u
        let u = KeyFraming.mapTtoU( current, Animator.animator.preTime, Animator.animator.nextTime );
        // Perform interpolation, for u value
        // Translation
        KeyFraming.LinearInterpolation( Animator.animator.group.position, u, Animator.animator.currentKeyframe.position, Animator.animator.nextKeyframe.position );

        // Orientation
        // 1) As rotation assumes normalized axis, quaternions should
        // be normalized to be used for rotation.
        // 2) Allows for concatenation of rotations via quaternion
        // multiplication (with a caveat…e.g. must multiply in reverse order ).
        KeyFraming.slerp( Animator.animator.mesh.quaternion, u, Animator.animator.currentKeyframe, Animator.animator.nextKeyframe );
        // Construct transformation matrix
        // Apply to object coordinates
        // Render
    }

    static renderZero() {
        let current = new Date();

        // stop animating after 20s
        if ( current - Animator.animator.initializingDate >= 20 * 1000 ) {
            console.log( Animator.animator.group.position );
            return;
        }

        let t = ( current - Animator.animator.initializingDate ) / 1000;
        Animator.animator.initializingDate = current;

        requestAnimationFrame( Animator.renderZero );
        Animator.animator.renderer.render( Animator.animator.scene, Animator.animator.camera );

        // make sure translation first and then rotation by nesting
        // more info, see:
        // https://stackoverflow.com/questions/15292504/combine-rotation-and-translation-with-three-js
        // in short, we cannot use:
        // mesh.translateOnAxis( axis, 5 * t );
        // mesh.rotateY( 1.8 * t );
        // no mater how you define
        // the order of translation and rotation in this way.
        // three.js will apply rotation first and then translate,
        // not the opposite order.
        Animator.animator.group.translateOnAxis( new THREE.Vector3( 1, 1, 0 ), 5 * t );
        Animator.animator.mesh.rotateY( MyMath.radians( 18 ) * t );
    }

    initTwo() {
        // Setting up the basics, scene, lights and material, for three.js:
        // http://www.webgl3d.cn/Three.js/

        // set up our scene
        this.scene = new THREE.Scene();

        // create a cube with len 60
        this.radius = 10;
        let sphere1 = new THREE.SphereGeometry( this.radius, this.radius, this.radius );
        let sphere2 = new THREE.SphereGeometry( this.radius, this.radius, this.radius );
        let sphere3 = new THREE.SphereGeometry( this.radius, this.radius, this.radius );
        let sphere4 = new THREE.SphereGeometry( this.radius, this.radius, this.radius );

        // set up material
        let material1 = new THREE.MeshLambertMaterial( {
            color: 0x0000ff // blue
        } );
        let material2 = new THREE.MeshLambertMaterial( {
            color: 0xCC0033 // red
        } );
        let material3 = new THREE.MeshLambertMaterial( {
            color: 0x336666 // ink green
        } );
        let material4 = new THREE.MeshLambertMaterial( {
            color: 0xFFFF00 // Yellow
        } );

        // nest the cube in the mesh,
        // then nest the mesh in the parent group
        this.mesh1 = new THREE.Mesh( sphere1, material1 );
        this.mesh2 = new THREE.Mesh( sphere2, material2 );
        this.mesh3 = new THREE.Mesh( sphere3, material3 );
        this.mesh4 = new THREE.Mesh( sphere4, material4 );
        this.group1 = new THREE.Group();
        this.group2 = new THREE.Group();
        this.group3 = new THREE.Group();
        this.group4 = new THREE.Group();
        this.group1.add( this.mesh1 );
        this.group2.add( this.mesh2 );
        this.group3.add( this.mesh3 );
        this.group4.add( this.mesh4 );
        this.scene.add( this.group1 );
        this.scene.add( this.group2 );
        this.scene.add( this.group3 );
        this.scene.add( this.group4 );

        // set up point light
        let point = new THREE.PointLight( 0xffffff );
        point.position.set( 400, 200, 300 );
        this.scene.add( point );

        // setup ambient light
        let ambient = new THREE.AmbientLight( 0x444444 );
        this.scene.add( ambient );

        // set up the canvas covering the whole DOM
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const K = WIDTH / HEIGHT; // ratio of window
        const S = 190; // factor to control the size of showing area
        // const S = 200; // factor to control the size of showing area

        // set up Orthographic Camera
        this.camera = new THREE.OrthographicCamera( -S * K, S * K, S, -S, 1, 1000 );
        // this.camera.position.set( 200, 200, 200 );
        this.camera.position.set( 0, 0, 200 ); // looking from Z
        // this.camera.position.set( 0, 200, 0 ); // looking from Y
        this.camera.lookAt( this.scene.position );

        // set up renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( WIDTH, HEIGHT );
        this.renderer.setClearColor( 0xb9d3ff, 1 );

        // set up axis helpers
        let axisHelper = new THREE.AxesHelper( 250 );
        this.scene.add( axisHelper );
    }

    initZeroOne() {
        // Setting up the basics, scene, lights and material, for three.js:
        // http://www.webgl3d.cn/Three.js/

        // set up our scene
        this.scene = new THREE.Scene();

        // create a cube with len 60
        const LEN = 10;
        let cube = new THREE.BoxGeometry( LEN, LEN, LEN );

        // set up material
        let material = new THREE.MeshLambertMaterial( {
            color: 0x0000ff
        } );

        // nest the cube in the mesh,
        // then nest the mesh in the parent group
        this.mesh1 = new THREE.Mesh( cube, material );
        this.group1 = new THREE.Group();
        this.group1.add( this.mesh1 );
        this.scene.add( this.group1 );

        // set up point light
        let point = new THREE.PointLight( 0xffffff );
        point.position.set( 400, 200, 300 );
        this.scene.add( point );

        // setup ambient light
        let ambient = new THREE.AmbientLight( 0x444444 );
        this.scene.add( ambient );

        // set up the canvas covering the whole DOM
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const K = WIDTH / HEIGHT; // ratio of window
        const S = 38; // factor to control the size of showing area

        // set up Orthographic Camera
        this.camera = new THREE.OrthographicCamera( -S * K, S * K, S, -S, 1, 1000 );
        this.camera.position.set( 200, 300, 200 );
        this.camera.lookAt( this.scene.position );

        // set up renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( WIDTH, HEIGHT );
        this.renderer.setClearColor( 0xb9d3ff, 1 );

        // set up axis helpers
        let axisHelper = new THREE.AxesHelper( 250 );
        this.scene.add( axisHelper );

        // record last time we call the render function
        this.initializingDate = new Date();
    }
}

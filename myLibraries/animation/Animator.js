"use strict"

import MyMath from "../lang/MyMath.js";
import KeyFraming from "./KeyFraming.js";

/**
 * Write a simplified key framing system that will translate
 * and rotate a single object based on a set of key frames.
 *
 * Assignment 1
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
        // this.lastTime = null;
        // initializing keyframe
        this.startIndex = 0;
        this.currentKeyframe = Animator.KEYFRAMES[ this.startIndex ];

        this.endIndex = 1;
        this.nextKeyframe = Animator.KEYFRAMES[ this.endIndex ];

        this.preTime = this.currentKeyframe.time;
        this.nextTime = this.nextKeyframe.time;
        this.interval = this.nextTime - this.preTime;
        this.initializingDate = null;

        this.scene = null;
        this.group = null;
        this.renderer = null;
        this.camera = null;
        this.mesh = null;
    }

    // called by window.onload
    static run() {
        Animator.initData();

        let animator = new Animator();
        Animator.animator = animator;
        animator.init();
        // add the canvas to the HTML
        document.body.appendChild( animator.renderer.domElement );
        // start rendering
        // Assignment #0
        // Animator.renderZero();
        // Assignment #1
        Animator.renderOne();
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

        // if ( MyMath.equalsVector3( Animator.animator.group.position,
        //     Animator.KEYFRAMES[ Animator.KEYFRAMES.length - 1 ].position ) )
        //     return

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
        // TODO: 9/20/2021 cal theta with dot, normalize quate
        KeyFraming.slerp( Animator.animator.mesh.quaternion, u, Animator.animator.currentKeyframe, Animator.animator.nextKeyframe );
        // Construct transformation matrix
        // Apply to object coordinates
        // Render
    }

    // render function
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

    init() {
        // Setting up the basics, scene, lights and material, for three.js:
        // http://www.webgl3d.cn/Three.js/

        // set up our scene
        this.scene = new THREE.Scene();

        // create a cube with len 60
        const LEN = 5;
        let cube = new THREE.BoxGeometry( LEN, LEN, LEN );

        // set up material
        let material = new THREE.MeshLambertMaterial( {
            color: 0x0000ff
        } );

        // nest the cube in the mesh,
        // then nest the mesh in the parent group
        this.mesh = new THREE.Mesh( cube, material );
        this.group = new THREE.Group();
        this.group.add( this.mesh );
        this.scene.add( this.group );

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
        const K = WIDTH / HEIGHT;
        const S = 200;

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
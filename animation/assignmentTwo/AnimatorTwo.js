"use strict"

import Animator from "../../myLibraries/animation/Animator.js";
import Ball from "./Ball.js";
import Cushion from "./Cushion.js";
import Dynamics from "../../myLibraries/animation/Dynamics.js";
import MyMath from "../../myLibraries/lang/MyMath.js";

// TODO: 10/25/2021 missing ball-cushion collisions
export default class AnimatorTwo extends Animator {

    initDynamics() {
        this.us = 0.38 // sliding fraction, Dry wood on wood
        // this.us = 0.78 // sliding fraction, Dry steel on steel
        this.g = 9.80665; // N/kg
        // this.e = 0.2; // 0 <= e <= 1
        this.e = 0.8; // 0 <= e <= 1
        this.impulseStriking = new THREE.Vector3( -500, 0, -50 ); // kg * m / s ^ 2
        // this.impulseStriking = new THREE.Vector3( -30, -40, 0 ); // kg * m / s ^ 2
        this.isInit = true;

        let mass = 0.23; // kg
        this.cue = new Ball( this.group1, this.mesh1, mass, this.radius, "cue" );
        this.cue.setPosition( 50, 0, 30 );
        this.ball1 = new Ball( this.group2, this.mesh2, mass, this.radius, "ballRed" );
        this.ball1.setPosition( -160, 0, 0 );
        this.ball2 = new Ball( this.group3, this.mesh3, mass, this.radius, "ballGreen" );
        this.ball2.setPosition( -140, 0, 16 );
        this.ball3 = new Ball( this.group4, this.mesh4, mass, this.radius, "ballYellow" );
        this.ball3.setPosition( -140, 0, -16 );
        this.cushion = new Cushion( this.groupPlane, this.meshPlane, 10, Animator.yAxis, "cushion" );
        this.westCushion = new Cushion( this.groupWestCushion, this.westCushionMesh, 10, Animator.xAxis, "westCushion" );
        this.eastCushion = new Cushion( this.groupEastCushion, this.eastCushionMesh, 10, Animator.xAxis.clone().negate(), "eastCushion" );
        this.northCushion = new Cushion( this.groupNorthCushion, this.northCushionMesh, 10, Animator.zAxis, "eastCushion" );
        this.southCushion = new Cushion( this.groupSouthCushion, this.southCushion, 10, Animator.zAxis.clone().negate(), "eastCushion" );

        this.objects = [];
        this.objects.push( this.cue );
        this.objects.push( this.ball1 );
        this.objects.push( this.ball2 );
        this.objects.push( this.ball3 );
        // this.objects.push( this.cushion );
        this.objects.push( this.westCushion );
        this.objects.push( this.eastCushion );
        // this.objects.push( this.northCushion );
        // this.objects.push( this.southCushion );

        this.ballsCollided = [];
    }

    // called by window.onload
    static run() {
        // assignment one
        // Animator.initData();

        let animator = new AnimatorTwo();
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
            AnimatorTwo.renderTwo();
        }, 1000 );
    }

    // render functions
    static renderTwo() {
        let animator = Animator.animator;
        let objects = animator.objects;

        // t + Dt = new Date() = t( t )
        let current = new Date().getTime() / 1000; // s
        // Dt = t + Dt - t
        let dt = current - animator.initializingDate; // s
        console.log( dt );

        // stop animating after 20s
        // console.log( current - animator.initializingDate );
        if ( current - animator.startingDate >= 5 ) {
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
            objects[ 0 ].fs.add( animator.impulseStriking );
            // balls[ 1 ].fs.add( animator.impulseStriking );
            // console.log( f );
            tempDt = dt;
            dt = 1;
            // animator.isInit = false;
        }

        // Step 2: update position ( integrate velocity )
        objects.forEach( b => b.updatePos( dt ) );

        // objects.forEach( b => {
        //    if ( b.isStatic ) return;
        //    b.group.position.setY( 0 );
        // });

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
                let j = ball1.collidingImpulse( ball2, animator.e );
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
        objects.forEach( b => {
            b.addSlidingFric( animator.us, animator.g );
            b.updateM( dt );
            b.impulses = [];
            b.fs.set( 0, 0, 0 );
        } );

        // Step 3: Calculate velocities
        objects.forEach( b => {
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
        requestAnimationFrame( AnimatorTwo.renderTwo );
        // balls.forEach( b=> console.log( b.group.position));
        console.log( "\n" );
    }

    initTwo() {
        // Setting up the basics, scene, lights and material, for three.js:
        // http://www.webgl3d.cn/Three.js/
        // assign #2
        this.group2 = null;
        this.mesh2 = null;

        // set up our scene
        this.scene = new THREE.Scene();

        // create a cube with len 60
        this.radius = 10;
        const shapes = 20;
        const width = 700;
        const height = 500;
        let sphere1 = new THREE.SphereGeometry( this.radius, shapes, shapes );
        let sphere2 = new THREE.SphereGeometry( this.radius, shapes, shapes );
        let sphere3 = new THREE.SphereGeometry( this.radius, shapes, shapes );
        let sphere4 = new THREE.SphereGeometry( this.radius, shapes, shapes )
        let plane = new THREE.PlaneGeometry( width, height );
        let westCushion = new THREE.PlaneGeometry( this.radius*2, height );
        let eastCushion = new THREE.PlaneGeometry( this.radius*2, height );
        let northCushion = new THREE.PlaneGeometry( width, this.radius*2 );
        let southCushion = new THREE.PlaneGeometry( width, this.radius*2 );

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
        // #006633
        const materialPlane = new THREE.MeshBasicMaterial( { color: 0x009966, side: THREE.DoubleSide } );
        const materialCushion = new THREE.MeshBasicMaterial( { color: 0x006633, side: THREE.DoubleSide } );

        const rightAngleInRadian = MyMath.radians( 90 );
        // nest the cube in the mesh,
        // then nest the mesh in the parent group
        this.mesh1 = new THREE.Mesh( sphere1, material1 );
        this.mesh2 = new THREE.Mesh( sphere2, material2 );
        this.mesh3 = new THREE.Mesh( sphere3, material3 );
        this.mesh4 = new THREE.Mesh( sphere4, material4 );
        this.meshPlane = new THREE.Mesh( plane, materialPlane );
        this.meshPlane.rotateOnAxis( Animator.xAxis, rightAngleInRadian );

        this.westCushionMesh = new THREE.Mesh( westCushion, materialCushion );
        this.westCushionMesh.rotateOnAxis( Animator.xAxis, rightAngleInRadian );
        this.westCushionMesh.rotateOnAxis( Animator.yAxis, rightAngleInRadian );

        this.eastCushionMesh = new THREE.Mesh( eastCushion, materialCushion );
        this.eastCushionMesh.rotateOnAxis( Animator.xAxis, rightAngleInRadian );
        this.eastCushionMesh.rotateOnAxis( Animator.yAxis, rightAngleInRadian );

        this.northCushionMesh = new THREE.Mesh( northCushion, materialCushion );

        this.southCushionMesh = new THREE.Mesh( southCushion, materialCushion );

        this.group1 = new THREE.Group();
        this.group2 = new THREE.Group();
        this.group3 = new THREE.Group();
        this.group4 = new THREE.Group();
        this.groupPlane = new THREE.Group();
        this.groupWestCushion = new THREE.Group();
        this.groupEastCushion = new THREE.Group();
        this.groupNorthCushion = new THREE.Group();
        this.groupSouthCushion = new THREE.Group();

        this.group1.add( this.mesh1 );
        this.group2.add( this.mesh2 );
        this.group3.add( this.mesh3 );
        this.group4.add( this.mesh4 );

        this.groupPlane.add( this.meshPlane );
        this.groupPlane.translateY( -this.radius );

        this.groupWestCushion.add( this.westCushionMesh );
        // this.groupWestCushion.translateY( -this.radius );
        this.groupWestCushion.translateX( -width / 2 );

        this.groupEastCushion.add( this.eastCushionMesh );
        // this.groupEastCushion.translateY( -this.radius );
        this.groupEastCushion.translateX( width / 2 );

        this.groupNorthCushion.add( this.northCushionMesh );
        // this.groupEastCushion.translateY( -this.radius );
        this.groupNorthCushion.translateZ( -height / 2 );

        this.groupSouthCushion.add( this.southCushionMesh );
        // this.groupEastCushion.translateY( -this.radius );
        this.groupSouthCushion.translateZ( height / 2 );

        this.scene.add( this.group1 );
        this.scene.add( this.group2 );
        this.scene.add( this.group3 );
        this.scene.add( this.group4 );
        this.scene.add( this.groupPlane );
        this.scene.add( this.groupWestCushion );
        this.scene.add( this.groupEastCushion );
        this.scene.add( this.groupNorthCushion );
        this.scene.add( this.groupSouthCushion );

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
        // const S = 190; // factor to control the size of showing area
        const S = 260; // factor to control the size of showing area

        // set up Orthographic Camera
        this.camera = new THREE.OrthographicCamera( -S * K, S * K, S, -S, 1, 1000 );
        this.camera.position.set( 200, 200, 200 );
        // this.camera.position.set( 60, 200, 120 );
        // this.camera.position.set( 10, 10, 200 ); // looking from Z
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
}
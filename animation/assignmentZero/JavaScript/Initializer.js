"use strict"

/**
 * set up the initializing animation framework.
 * Assignment 0
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

// Setting up the basics, scene, lights and material, for three.js:
// http://www.webgl3d.cn/Three.js/

// set up our scene
let scene = new THREE.Scene();

// create a cube with len 60
const LEN = 30;
let cube = new THREE.BoxGeometry( LEN, LEN, LEN );

// set up material
let material = new THREE.MeshLambertMaterial( {
    color: 0x0000ff
} );

// nest the cube in the mesh,
// then nest the mesh in the parent group
let mesh = new THREE.Mesh( cube, material );
let group = new THREE.Group();
group.add( mesh );
scene.add( group );

// set up point light
let point = new THREE.PointLight( 0xffffff );
point.position.set( 400, 200, 300 );
scene.add( point );

// setup ambient light
let ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

// set up the canvas covering the whole DOM
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const K = WIDTH / HEIGHT;
const S = 200;

// set up Orthographic Camera
let camera = new THREE.OrthographicCamera( -S * K, S * K, S, -S, 1, 1000 );
camera.position.set( 200, 300, 200 );
camera.lookAt( scene.position );

// set up renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize( WIDTH, HEIGHT );
renderer.setClearColor( 0xb9d3ff, 1 );

// set up axis helpers
let axisHelper = new THREE.AxesHelper( 250 );
scene.add( axisHelper );

// record last time we call the render function
let lastTime = new Date();
const startTime = lastTime;
let axis = new THREE.Vector3( 1, 1, 0 );
let scaleFactor = 1;

// render function
function render() {
    let current = new Date();

    // stop animating after 20s
    if ( current - startTime >= 20 * 1000 ) {
        console.log( group.position );
        return;
    }

    let t = ( current - lastTime ) / 1000;
    lastTime = current;

    requestAnimationFrame( render );
    renderer.render( scene, camera );

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
    group.translateOnAxis( axis, 5 * t );
    mesh.rotateY( radians( 18 ) * t );
}

// called by window.onload
function init() {
    // add the canvas to the HTML
    document.body.appendChild( renderer.domElement );
    // start rendering
    render();
}

function radians( degrees ) {
    let pi = Math.PI;
    return degrees * ( pi / 180 );
}

function degrees( radians ) {
    let pi = Math.PI;
    return ( radians * 180 ) / pi;
}
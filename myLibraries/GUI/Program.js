"use strict"

/*
 * Program.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../lang/MyMath.js";
import DCEL from "../util/geometry/DCEL/DCEL.js";
import Drawer from "./geometry/Drawer.js";

/**
 *
 * Reference resource for setting up webgl:
 * assignments of CSCI-610 foundation of graphics
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class Program {
    // console.log( gl.TRIANGLE_FAN, gl.LINE_STRIP, gl.LINE_LOOP ); // 6 3 2
    static LINE_LOOP = 2;
    // static LINE_STRIP = 3;
    static TRIANGLE_FAN = 6;

    constructor( paras ) {
        Program.check( paras );

        // Global variables that are set and used
        // across the application
        this.canvas = null;
        this.gl = null;

        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;

        // original polygons points and their colors
        this.polygonsPoints = null;
        this.polygonsColors = null;
        this.monotonePoints = null;
        this.monotoneColors = null;
        this.triangulationPoints = null;
        this.triangulationColors = null;

        this.initWebGl( paras );
    }

    static check( paras ) {
        console.assert( paras.webgl );
        console.assert( paras.vertexShader );
        console.assert( paras.fragmentShader );
        console.assert( paras.aVertexPosition );
        console.assert( paras.aColor );
    }

    /**
     * Entry point to our application
     * */

    initWebGl( paras ) {
        // Retrieve the canvas
        this.canvas = document.getElementById( paras.webgl );
        // console.log( this.canvas.width, this.canvas.height );
        if ( !this.canvas ) {
            console.error( `There is no canvas with id ${ 'webgl-canvas' } on this page.` );
            return;
        }

        // Retrieve a WebGL context
        this.gl = this.canvas.getContext( 'webgl2' );

        // Set the clear color to be white
        this.gl.clearColor( 255, 255, 255, 1 );

        // some GL initialization
        this.gl.enable( this.gl.DEPTH_TEST );
        this.gl.enable( this.gl.CULL_FACE );

        this.gl.cullFace( this.gl.BACK );
        this.gl.frontFace( this.gl.CCW );
        this.gl.depthFunc( this.gl.LEQUAL )
        this.gl.clearDepth( 1.0 )

        // Read, compile, and link your shaders
        this.initProgram( paras );
    }

    /**
     * Create a program with the appropriate vertex and fragment shaders
     * */

    initProgram( paras ) {
        this.vertexShader = this.getShader( paras.vertexShader );
        this.fragmentShader = this.getShader( paras.fragmentShader );

        // Create a program
        this.program = this.gl.createProgram();
        // Attach the shaders to this program
        this.gl.attachShader( this.program, this.vertexShader );
        this.gl.attachShader( this.program, this.fragmentShader );
        this.gl.linkProgram( this.program );

        if ( !this.gl.getProgramParameter( this.program, this.gl.LINK_STATUS ) ) {
            console.error( 'Could not initialize shaders' );
        }

        // Use this program instance
        this.gl.useProgram( this.program );
        // We attach the location of these shader values to the program instance
        // for easy access later in the code
        this.program.aVertexPosition = this.gl.getAttribLocation( this.program, paras.aVertexPosition );
        this.program.aColor = this.gl.getAttribLocation( this.program, paras.aColor );
        // this.program.aBary = this.gl.getAttribLocation( this.program, 'bary' );
        // this.program.uTheta = this.gl.getUniformLocation( this.program, 'theta' );
    }

    /**
     * Given an id, extract the content's of a shader script
     * from the DOM and return the compiled shader
     * */

    getShader( id ) {
        const script = document.getElementById( id );
        const shaderString = script.text.trim();

        // Assign shader depending on the type of shader
        let shader;
        if ( script.type === 'x-shader/x-vertex' ) {
            shader = this.gl.createShader( this.gl.VERTEX_SHADER );
        } else if ( script.type === 'x-shader/x-fragment' ) {
            shader = this.gl.createShader( this.gl.FRAGMENT_SHADER );
        } else {
            return null;
        }

        // Compile the shader using the supplied shader code
        this.gl.shaderSource( shader, shaderString );
        this.gl.compileShader( shader );

        // Ensure the shader is valid
        if ( !this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS ) ) {
            console.error( this.gl.getShaderInfoLog( shader ) );
            return null;
        }

        return shader;
    }

    /**
     * @param {[[]]} points points
     * @param {[[]]} colors colors
     * @param {[]} drawingTypes drawingTypes
     */

    draw( points, colors, drawingTypes ) {
        // console.log( points, colors, drawingTypes );
        console.assert( points.length === colors.length, points, colors );
        console.assert( points.length === drawingTypes.length, points, drawingTypes );

        // Clear the scene
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.gl.viewport( 0, 0, this.gl.canvas.width, this.gl.canvas.height );

        let bufferPos = null;
        let bufferColor = null;
        for ( let i = 0; i < points.length; i++ ) {
            // console.log( points[i], colors[i] );
            bufferPos = this.gl.createBuffer();
            //绑定缓冲区对象,激活buffer
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, bufferPos );
            //顶点数组data数据传入缓冲区
            this.gl.bufferData( this.gl.ARRAY_BUFFER, points[ i ], this.gl.STATIC_DRAW );
            //缓冲区中的数据按照一定的规律传递给位置变量apos
            this.gl.vertexAttribPointer( this.program.aVertexPosition, 2, this.gl.FLOAT, false, 0, 0 );
            //允许数据传递
            this.gl.enableVertexAttribArray( this.program.aVertexPosition );

            /**
             创建缓冲区colorBuffer，传入顶点颜色数据colorData
             **/

            bufferColor = this.gl.createBuffer();
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, bufferColor );
            this.gl.bufferData( this.gl.ARRAY_BUFFER, colors[ i ], this.gl.STATIC_DRAW );
            this.gl.vertexAttribPointer( this.program.aColor, 4, this.gl.FLOAT, false, 0, 0 );
            this.gl.enableVertexAttribArray( this.program.aColor );

            //开始绘制图形

            // console.log( points.length );
            let n = drawingTypes[ i ] === 2 ? points[ i ].length / 2 : 38;
            console.assert( drawingTypes[ i ] === 6 || drawingTypes[ i ] === 2 && points[ i ].length % 2 === 0, drawingTypes );
            console.assert( drawingTypes[ i ] === 2 || ( drawingTypes[ i ] === 6 && points[ i ].length === 76 ), drawingTypes[ i ], points[ i ] );
            // console.log( drawingTypes[ i ] !== 2 || ( drawingTypes[ i ] === 6 && points[ i ].length === 38 ) );
            // console.log( drawingTypes[ i ], n );
            this.gl.drawArrays( drawingTypes[ i ], 0, n );

            // Clean
            this.gl.bindVertexArray( null );
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, null );
            // this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, null );
            // break;
        }
    }
}
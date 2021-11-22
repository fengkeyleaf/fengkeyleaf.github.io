"use strict"

/*
 * Main.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import ReadFromFile from "../../myLibraries/io/ReadFromFile.js";
import Vector from "../../myLibraries/util/geometry/elements/point/Vector.js";
import MonotoneVertex from "../../myLibraries/util/geometry/DCEL/MonotoneVertex.js";
import Program from "../../myLibraries/GUI/Program.js";
import Polygons from "../../myLibraries/util/geometry/tools/Polygons.js";
import MonotonePolygons from "../../myLibraries/util/geometry/tools/MonotonePolygons.js";
import Drawer from "../../myLibraries/GUI/geometry/Drawer.js";
import SnapShot from "../../myLibraries/GUI/geometry/SnapShot.js";
import Stack from "../../myLibraries/util/Stack.js";
import Vertex from "../../myLibraries/util/geometry/DCEL/Vertex.js";

/**
 * Main entry class
 *
 * The source code in java is from my own github:
 * @see <a href=https://github.com/fengkeyleaf/Algorithm/blob/main/ComputationalGeometry/ApplicationOfTriangulation/PA_2/problem_1/Main.java>MonotoneVertex</a>
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

// necessary
// TODO: 9/28/2021 pseudocode, animation timing is not right
// TODO: 9/26/2021 triangulation assuming partitioning monotone polygons have been done, reset the status of snapshot stack when manipulating other stack
// TODO: 11/17/2021 reset animation status, getStarted button -> reset button
// TODO: 11/18/2021 which monotone polygon is being triangulated

// extra
// TODO: 9/26/2021 adding points with cursors, as well as drawing line connecting two consecutive points
// TODO: 11/18/2021 delete points with the right cursor
// TODO: 11/19/2021 show hints when cursors hovering over the canvas
// TODO: 11/17/2021 provide three examples for users to select, simple, complex and maze
// TODO: 11/17/2021 switch between the three ways to import input data, run the last one before clicking getStarted button
// TODO: 11/19/2021 change CSS of buttons when cursors hovering over the canvas
// TODO: 9/28/2021 not prefect for skip animation, hard-code timing is not very good, though....
// TODO: 9/28/2021 easy-in, easy out

export default class Main {
    static PATTERN_START_END_POINT = "^-*\\d+ -*\\d+ -*\\d+ -*\\d+$";
    // global variable for the whole program
    static main = null;
    static animateTime = 2500;

    // test data
    static data = new Float32Array(
        [ 0.5, 0.5,
            -0.5, 0.5,
            -0.5, -0.5,
            0.5, -0.5 ] );

    static data2 = new Float32Array(
        [ 0.5, 0,
            0.4, 0.5,
            0.1, 0.3,
            -0.3, 0.4,
            -0.2, 0.1,
            0.1, -0.1 ]
    );

    // examole data
    static simpleExample = "// s\n" +
        "// 0\n" +
        "// e\n" +
        "-3 4 5 0\n" +
        "6\n" +
        "10 10\n" +
        "5 0\n" +
        "4 5\n" +
        "1 3\n" +
        "-3 4\n" +
        "-2 1\n" +
        "1 -1";

    static InputType = {
        FILE: 0,
        CANVAS: 1,
        EXAMPLE: 2
    }

    constructor( fileInput ) {
        Main.main = this;

        // input data
        this.fileInput = fileInput;
        this.vertices = [];
        this.startPoint = null;
        this.endPoint = null;

        // original window ratio of the imported data
        this.originalWidth = null;
        this.originalHeight = null;

        // visualized program
        this.drawer = new Program( {
            webgl: "webgl-canvas",
            vertexShader: "vertex-shader",
            fragmentShader: "fragment-shader",
            aVertexPosition: "aVertexPosition",
            aColor: "a_color"
        } );

        this.whichInput = Main.InputType.EXAMPLE;

        // bottons
        this.getStarted = null;

        this.buttonNextMono = null;
        this.buttonPreMono = null;
        this.buttonSkipMono = null;

        this.buttonNextTri = null;
        this.buttonPreTri = null;
        this.buttonSkipTri = null;

        // Monotone Polygons
        this.snapshotsCurrent = new Stack();
        this.snapshotsNext = new Stack();
        // Triangulation
        this.snapshotsCurrentTri = new Stack();
        this.snapshotsNextTri = new Stack();
        // snapshots
        this.snapshots = [];
        this.currentSnapshot = null;
        this.preSnapshot = null;
        this.countMono = 0;

        // time stamp
        this.initializingDate = null;
        this.start = null;
        this.middle = null;
        this.end = null;
        this.lineColor = null;

        // global drawing data,
        // which will be fee in webgl to draw
        this.allDrawingPoints = [];
        this.allDrawingColors = [];
        this.allDrawingTypes = [];

        // pseudocode element array
        this.monoPse = null;
        this.triPse = null;
        this.startV = null;
        this.endV = null;
        this.splitV = null;
        this.mergeV = null;
        this.regularV = null;

        this.__getPseElements();
        this.__addEvents();
    }

    // program entry for testing
    static startProgram( reader, files ) {
        // console.log( files );
        reader.readAsText( files );
        reader.onload = function () {
            new Main( reader.result ).doTheAlgorithm();
        };
    }

    /**
     * @param {Number} times
     * @param {Number} increment
     */

    static pop( times, increment ) {
        for ( let i = 0; i < times; i += increment ) {
            Main.main.allDrawingPoints.pop();
            Main.main.allDrawingColors.pop();
            Main.main.allDrawingTypes.pop();
        }
    }

    __getPseElements() {
        this.monoPse = document.getElementById( "monoPse" );
        // this.monoPseChildren = this.monoPse.children;
        this.triPse = document.getElementById( "triPse" );
        // this.triPseChildren = this.triPse.children;
        this.startV = document.getElementById( "startV" );
        // this.startVChildren = this.startV.children;
        this.endV = document.getElementById( "endV" );
        // this.endVChildren = this.endV.children;
        this.splitV = document.getElementById( "splitV" );
        // this.splitVChildren= this.splitV.children;
        this.mergeV = document.getElementById( "mergeV" );
        // this.mergeVChildren = this.mergeV.children;
        this.regularV = document.getElementById( "regularV" );
        // this.regularVChildren = this.regularV.children;
    }

    reset() {
        this.allDrawingPoints = [];
        this.allDrawingColors = [];
        this.allDrawingTypes = [];
    }

    /**
     * @param {Float32Array} points
     * @param {Float32Array} colors
     * @param {Number} drawingTypes
     */

    pushData( points, colors, drawingTypes ) {
        this.allDrawingPoints.push( points );
        this.allDrawingColors.push( colors );
        this.allDrawingTypes.push( drawingTypes );
    }

    draw() {
        this.drawer.draw( this.allDrawingPoints, this.allDrawingColors, this.allDrawingTypes );
    }

    __addMonoToneEvents() {
        // related functions for mono
        function nextMono() {
            if ( Main.main.snapshotsNext.size() > 0 ) {
                console.log( "next" );
                Main.main.snapshotsCurrent.push( Main.main.snapshotsNext.pop() );
                Main.main.snapshotsCurrent.peek().draw();
                return true;
            }
            return false;
        }

        // Monotone Polygons
        this.buttonPreMono = document.getElementById( "pre_mono" );
        this.buttonPreMono.addEventListener( "click", function () {
            if ( Main.main.snapshotsCurrent.size() > 1 ) {
                console.log( "pre" );
                Main.main.snapshotsNext.push( Main.main.snapshotsCurrent.pop() );
                Main.main.snapshotsCurrent.peek().draw();
            }
        } );

        this.buttonNextMono = document.getElementById( "next_mono" );
        this.buttonNextMono.addEventListener( "click", nextMono );

        this.buttonSkipMono = document.getElementById( "skip_mono" );
        this.buttonSkipMono.addEventListener( "click", function () {
            // draw all the next snapshots
            function skipMono() {
                return new Promise( function ( resolve, reject ) {
                    resolve = skipNext;
                    reject = console.log;
                    nextMono() ? setTimeout( resolve, Main.animateTime ) : reject( "Skipped Mono" );
                } );
            }

            function skipNext() {
                return new Promise( function ( resolve, reject ) {
                    resolve = skipMono;
                    reject = console.log;
                    nextMono() ? setTimeout( resolve, Main.animateTime ) : reject( "Skipped Mono" );
                } );
            }

            skipMono().then( null, null );
        } );
    }

    __addTriEvents() {
        // related functions for Tri
        function nextTri() {
            if ( Main.main.snapshotsNextTri.size() > 0 ) {
                console.log( "tri next" );
                Main.main.snapshotsCurrentTri.push( Main.main.snapshotsNextTri.pop() );
                Main.main.snapshotsCurrentTri.peek().draw();
                return true;
            }
            return false;
        }

        // Triangulation
        this.buttonPreTri = document.getElementById( "pre_tri" );
        this.buttonPreTri.addEventListener( "click", function () {
            if ( Main.main.snapshotsCurrentTri.size() > 1 ) {
                console.log( "tri pre" );
                Main.main.snapshotsNextTri.push( Main.main.snapshotsCurrentTri.pop() );
                Main.main.snapshotsCurrentTri.peek().draw();
            }
            // Main.main.drawer.draw( Main.main.drawer.polygonsPoints );
        } );

        this.buttonNextTri = document.getElementById( "next_tri" );
        this.buttonNextTri.addEventListener( "click", nextTri );

        this.buttonSkipTri = document.getElementById( "skip_tri" );
        this.buttonSkipTri.addEventListener( "click", function () {
            function skipTri() {
                return new Promise( function ( resolve, reject ) {
                    resolve = skipNextTri;
                    reject = console.log;
                    nextTri() ? setTimeout( resolve, Main.animateTime ) : reject( "Skipped Tri" );
                } );
            }

            function skipNextTri() {
                return new Promise( function ( resolve, reject ) {
                    resolve = skipTri;
                    reject = console.log;
                    nextTri() ? setTimeout( resolve, Main.animateTime ) : reject( "Skipped Tri" );
                } );
            }

            skipTri().then( null, null );
        } );
    }

    __addGetStartedEvents() {
        this.getStarted = document.getElementById( "getStarted" );
        this.getStarted.addEventListener( "click", function () {
            let program = Main.main;
            switch ( program.whichInput ) {
                case Main.InputType.EXAMPLE:
                case Main.InputType.FILE:
                    if ( program.fileInput == null ) {
                        alert( "No file imported!" );
                        return;
                    }
                    program.__processingFile();
                case Main.InputType.CANVAS:
                    program.reset();
                    program.doTheAlgorithm();
            }
        } );
    }

    __addEvents() {
        this.__addMonoToneEvents();
        this.__addTriEvents();
        this.__addGetStartedEvents();
    }

    __readInfo( initializeLength, info ) {
        switch ( initializeLength ) {
            case 0:
                // read start and end point
                console.assert( info.length === 4 );
                this.startPoint = new Vector( parseInt( info[ 0 ] ), parseInt( info[ 1 ] ), -1 );
                this.endPoint = new Vector( parseInt( info[ 2 ] ), parseInt( info[ 3 ] ), -1 );
                break;
            case 1:
                // read number of vertices
                console.assert( info.length === 1 );
                this.vertices = [];
                break;
            case 2:
                // read original canvas's width and height
                console.assert( info.length === 2 );
                this.originalWidth = parseInt( info[ 0 ] );
                this.originalHeight = parseInt( info[ 1 ] );
                break;
            default:
                console.assert( false );
        }
    }

    /**
     * process input data
     */

    __processingFile() {
        let initializeLength = 0;
        let lines = this.fileInput.split( "\n" );

        let last = null;
        for ( let line of lines ) {
            line = line.trim();
            // skip unnecessary input data
            if ( ReadFromFile.skipInputData(
                line, false ) )
                continue;

            let isLength = new RegExp( ReadFromFile.PATTERN_LENGTH ).test( line );
            let arePoints = new RegExp( Main.PATTERN_START_END_POINT ).test( line );
            if ( initializeLength < 3 &&
                ( isLength || arePoints ) ) {
                this.__readInfo( initializeLength++,
                    line.split( new RegExp( ReadFromFile.PATTERN_MULTI_WHITE_CHARACTERS ) ) );
                continue;
            }

            let numbers = line.split( new RegExp( ReadFromFile.PATTERN_MULTI_WHITE_CHARACTERS ) );
            let num1 = parseInt( numbers[ 0 ] );
            let num2 = parseInt( numbers[ 1 ] );
            let vertex = new MonotoneVertex( num1, num2 );

            // ignore duplicate points
            if ( last != null && last.equalsXAndY( vertex ) ) continue;
            last = vertex;

            this.vertices.push( vertex );
        }

        console.log( this.vertices );
    }

    doTheAlgorithm() {
        this.vertices = Polygons.removePointsOnTheSameLine( this.vertices );
        if ( this.vertices.length < 3 ) return -2;

        // console.log( this.vertices );
        // get DCEL
        let faces = Polygons.getDCEL( this.vertices );
        if ( faces == null ) return -2;

        // And also determine Vertex type for each vertex.
        MonotonePolygons.getVertexType( faces[ 1 ] );

        // set points for the original polygon
        let fragmentData = Drawer.drawPolygons( faces );
        // console.log( fragmentData );
        this.drawer.polygonsPoints = new Float32Array( fragmentData.points );
        this.drawer.polygonsColors = new Float32Array( fragmentData.colors );
        // initializing snapshot, this snapshot only has drawing data for the original polygon
        let initSnapshot = new SnapShot();
        initSnapshot.addPolygons( this.drawer.polygonsPoints, this.drawer.polygonsColors );
        // just above the canvas to make the sweep line invisible
        initSnapshot.addSweep( new Float32Array( [ -1, 1.1, 1, 1.1 ] ), new Float32Array( [].concat( Drawer.DeepSkyBlue, Drawer.DeepSkyBlue ) ) );

        this.snapshotsCurrent.push( initSnapshot );
        this.snapshots.push( initSnapshot );
        this.snapshotsCurrent.peek().draw();

        // load and animate corresponding pseudocode
        initSnapshot.setMainPse( this.monoPse );
        initSnapshot.addMainPseIndices( 1, 2 );
        initSnapshot.highlightPse();

        // partitioning monotone polygons
        let monotonePolygons = MonotonePolygons.makeMonotone( this.vertices );
        monotonePolygons = monotonePolygons.concat( faces );

        // set points for monotone polygons
        fragmentData = Drawer.drawPolygons( monotonePolygons );
        this.drawer.monotonePoints = new Float32Array( fragmentData.points );
        this.drawer.monotoneColors = new Float32Array( fragmentData.colors );

        // triangulation
        let triangles = MonotonePolygons.preprocessMonotonePolygon( monotonePolygons );
        triangles = triangles.concat( monotonePolygons );

        // set points for triangles after triangulation
        // console.log( triangles );
        fragmentData = Drawer.drawPolygons( triangles );
        this.drawer.triangulationPoints = new Float32Array( fragmentData.points );
        this.drawer.triangulationColors = new Float32Array( fragmentData.colors );

        console.assert( this.snapshots.length >= this.vertices.length );
        // add snapshots for monotone
        for ( let i = this.vertices.length; i > 0; i-- )
            this.snapshotsNext.push( this.snapshots[ i ] );

        // add snapshots for triangulation
        for ( let i = this.snapshots.length - 1; i > this.vertices.length; i-- )
            this.snapshotsNextTri.push( this.snapshots[ i ] );

        return -2;
    }
}


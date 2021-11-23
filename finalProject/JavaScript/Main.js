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
import Button from "./Button.js";

/**
 * Main entry class
 *
 * The source code in java is from my own github:
 * @see <a href=https://github.com/fengkeyleaf/Algorithm/blob/main/ComputationalGeometry/ApplicationOfTriangulation/PA_2/problem_1/Main.java>MonotoneVertex</a>
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

// necessary

// extra
// TODO: 11/19/2021 show hints when cursors hovering over the canvas
// TODO: 11/17/2021 provide three examples for users to select, simple, complex and maze
// TODO: 11/17/2021 switch between the three ways to import input data, run the last one before clicking getStarted button
// TODO: 11/23/2021 multi-clicks
// TODO: 9/28/2021 not prefect for skip animation, hard-code timing is not very good, though....
// TODO: 9/28/2021 easy-in, easy out

export default class Main {
    static PATTERN_START_END_POINT = "^-*\\d+ -*\\d+ -*\\d+ -*\\d+$";
    // global variable for the whole program
    static main = null;
    static animateTime = 2500; // ms

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

    static complexExample = "// s\n" +
        "// 1\n" +
        "// e\n" +
        "-2 -9 0 7\n" +
        "15\n" +
        "12 12\n" +
        "7 -3\n" +
        "4 2\n" +
        "-1 1\n" +
        "0 7\n" +
        "-3 3\n" +
        "-6 4\n" +
        "-8 2\n" +
        "-7 -3\n" +
        "-5 -1\n" +
        "-4 -4\n" +
        "-5 -6\n" +
        "-2 -9\n" +
        "1 -7\n" +
        "3 -8\n" +
        "4 -2";

    static mazeExample = "";

    static InputType = {
        FILE: 0,
        CANVAS: 1,
        EXAMPLE: 2
    }

    constructor( fileInput = Main.simpleExample ) {
        Main.main = this;

        // input data
        this.fileInput = fileInput;
        this.vertices = [];
        this.startPoint = null;
        this.endPoint = null;

        this.buttons = new Button();

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
        // deal with keypress
        window.addEventListener( 'keydown', Main.gotKey, false );
    }

    // program entry for testing
    static startProgram( reader, files ) {
        // console.log( files );
        reader.readAsText( files );
        reader.onload = function () {
            new Main( reader.result ).doTheAlgorithm();
        };
    }

    static gotKey( event ) {
        console.log( event );
        switch ( event.keyCode ) {
            case 8:
                Main.main.vertices.pop();
                Main.pop();

                Main.main.draw();
        }
    }

    /**
     * @param {Number} times
     * @param {Number} increment
     */

    static pop( times= 1, increment= 1 ) {
        let res = [];
        if ( Main.main.allDrawingPoints.isEmpty() ) return res;

        console.assert( Main.main.allDrawingPoints.length === Main.main.allDrawingColors.length );
        console.assert( Main.main.allDrawingColors.length === Main.main.allDrawingTypes.length );


        for ( let i = 0; i < times; i += increment ) {
            res.push(Main.main.allDrawingPoints.pop());
            res.push(Main.main.allDrawingColors.pop());
            res.push(Main.main.allDrawingTypes.pop());
        }

        return res;
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
        if ( this.allDrawingPoints.isEmpty() ) {
            this.drawer.reset();
            return;
        }

        this.drawer.draw( this.allDrawingPoints, this.allDrawingColors, this.allDrawingTypes );
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
        this.currentSnapshot.__hidden();

        this.__resetInputData();
        this.__setSnapshots();
        this.__resetSnapshotStacks();
        this.resetDrawingData();
        // clear the canvas
        this.drawer.reset();
        // pseudocode for mono should be visible
        this.monoPse.style.display = "block";
    }

    __resetInputData() {
        // this.fileInput = null;
        this.vertices = [];
        this.startPoint = null;
        this.endPoint = null;
        this.whichInput = Main.InputType.EXAMPLE;
    }

    __resetSnapshotStacks() {
        this.snapshots = [];
        this.snapshotsCurrent.clear();
        this.snapshotsNext.clear();
        this.snapshotsCurrentTri.clear();
        this.snapshotsNextTri.clear();
    }

    resetDrawingData() {
        this.allDrawingPoints = [];
        this.allDrawingColors = [];
        this.allDrawingTypes = [];
    }

    /**
     * @param {SnapShot} pre
     * @param {SnapShot} next
     */

    __setSnapshots( pre = null, next = null ) {
        this.preSnapshot = pre;
        this.currentSnapshot = next;
    }

    resetMonoSnapshots() {
        this.resetDrawingData();
        this.currentSnapshot.__hidden();
        this.__setSnapshots();

        Stack.pushAll( this.snapshotsCurrent, this.snapshotsNext );
        this.snapshotsCurrent.push( this.snapshotsNext.pop() );
        this.snapshotsCurrent.peek().draw();
        this.snapshotsCurrent.peek().highlightPse();
    }

    resetTriSnapshots() {
        this.resetDrawingData();
        this.currentSnapshot.__hidden();

        Stack.pushAll( this.snapshotsNext, this.snapshotsCurrent );
        this.__setSnapshots( this.snapshotsCurrent.array[ this.snapshotsCurrent.array.length - 2 ], this.snapshotsCurrent.peek() );
        this.snapshotsCurrent.peek().draw();

        Stack.pushAll( this.snapshotsCurrentTri, this.snapshotsNextTri );
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
        let fragmentData = Drawer.drawPolygons( faces, [ Drawer.black ] );
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
        fragmentData = Drawer.drawPolygons( monotonePolygons, [ Drawer.black ] );
        this.drawer.monotonePoints = new Float32Array( fragmentData.points );
        this.drawer.monotoneColors = new Float32Array( fragmentData.colors );

        // triangulation
        let triangles = MonotonePolygons.preprocessMonotonePolygon( monotonePolygons );
        triangles = triangles.concat( monotonePolygons );

        // set points for triangles after triangulation
        // console.log( triangles );
        fragmentData = Drawer.drawPolygons( triangles, [ Drawer.black ] );
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


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
import Example from "./Example.js";
import Pseudocode from "./Pseudocode.js";

/**
 * Main entry class
 *
 * The source code in java is from my own github:
 * @see <a href=https://github.com/fengkeyleaf/Algorithm/blob/main/ComputationalGeometry/ApplicationOfTriangulation/PA_2/problem_1/Main.java>MonotoneVertex</a>
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

// necessary
// TODO: 11/23/2021 multi-clicks
// TODO: 11/25/2021 stop animation when reset
// TODO: 11/25/2021 file format

// extra
// TODO: 11/22/2021 pop indication when drawing points clock-wise order
// TODO: 9/28/2021 not prefect for skip animation, hard-code timing is not very good, though....
// TODO: 9/28/2021 easy-in, easy out

export default class Main {
    static PATTERN_START_END_POINT = "^-*\\d+ -*\\d+ -*\\d+ -*\\d+$";
    // global variable for the whole program
    static main = null;
    static animateTime = 2500; // ms

    static InputType = {
        FILE: 0,
        CANVAS: 1,
        EXAMPLE: 2
    }

    constructor( fileInput = Example.simpleExample ) {
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

        this.isAnimating = false;
        this.isAnimatingSkip = false;

        // global drawing data,
        // which will be fee in webgl to draw
        this.allDrawingPoints = [];
        this.allDrawingColors = [];
        this.allDrawingTypes = [];

        this.pseudocodeEles = new Pseudocode();

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

    /**
     * @param {Number} waitTime
     */

    static synchronizeAnimation( waitTime ) {
        Main.main.isAnimating = true;
        setTimeout( function () {
            Main.main.isAnimating = false;
        }, waitTime );
    }

    static gotKey( event ) {
        // console.log( event );
        // console.log( event.keyCode );
        switch ( event.keyCode ) {
            case 8: // backspace
                // remove vertex
                Main.main.vertices.pop();
                let linesData = Main.pop();
                // remove vertex drawing data
                Main.pop();

                // remove vertex drawing data for drawing lines
                if ( !linesData.isEmpty() ) {
                    let points = linesData[ 0 ].remove( linesData[ 0 ].length - 3 );
                    let colors = linesData[ 1 ].remove( linesData[ 1 ].length - 4 );

                    if ( !linesData[ 0 ].isEmpty() ) {
                        Main.main.pushData( points, colors, linesData[ 2 ] );
                    }
                }

                Main.main.draw();
                break;
            case 17: // ctrl
                if ( Main.main.buttons.buttonSkipMono.innerText === "Skip" ) {
                    Main.main.buttons.buttonSkipMono.innerText = "Reset";
                    Main.main.buttons.buttonSkipTri.innerText = "Reset";
                }
                else {
                    Main.main.buttons.buttonSkipMono.innerText = "Skip";
                    Main.main.buttons.buttonSkipTri.innerText = "Skip";
                }
        }
    }

    /**
     * @param {Number} times
     * @param {Number} increment
     */

    static pop( times = 1, increment = 1 ) {
        let res = [];
        if ( Main.main.allDrawingPoints.isEmpty() ) return res;

        console.assert( Main.main.allDrawingPoints.length === Main.main.allDrawingColors.length );
        console.assert( Main.main.allDrawingColors.length === Main.main.allDrawingTypes.length );


        for ( let i = 0; i < times; i += increment ) {
            res.push( Main.main.allDrawingPoints.pop() );
            res.push( Main.main.allDrawingColors.pop() );
            res.push( Main.main.allDrawingTypes.pop() );
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

    reset() {
        this.currentSnapshot.__hidden();

        this.__resetInputData();
        this.__setSnapshots();
        this.__resetSnapshotStacks();
        this.resetDrawingData();
        // clear the canvas
        this.drawer.reset();
        // pseudocode for mono should be visible
        this.pseudocodeEles.monoPse.style.display = "block";
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
     * @param {SnapShot} curr
     */

    __setSnapshots( pre = null, curr = null ) {
        this.preSnapshot = pre;
        this.currentSnapshot = curr;
    }

    /**
     * @param {Boolean} isTri
     */

    setSnapShots( isTri = false ) {
        if ( isTri ) {
            this.__setSnapshots( this.snapshotsCurrentTri.peekSecond(), this.snapshotsCurrentTri.peek() );
            // The first tri previous snapshot is the one from the momo's
            if ( this.preSnapshot === null )
                this.preSnapshot = this.snapshotsCurrent.peek();
            return;
        }

        this.__setSnapshots( this.snapshotsCurrent.peekSecond(), this.snapshotsCurrent.peek() );
    }

    resetMonoSnapshots() {
        this.currentSnapshot.__hidden();
        this.__setSnapshots();

        Stack.pushAll( this.snapshotsCurrent, this.snapshotsNext );
        this.snapshotsCurrent.push( this.snapshotsNext.pop() );
        this.snapshotsCurrent.peek().draw();
        this.snapshotsCurrent.peek().highlightPse();
    }

    resetTriSnapshots() {
        this.currentSnapshot.__hidden();

        Stack.pushAll( this.snapshotsCurrentTri, this.snapshotsNextTri );
        Stack.pushAll( this.snapshotsNext, this.snapshotsCurrent );
        this.__setSnapshots( this.snapshotsCurrent.peekSecond(), this.snapshotsCurrent.peek() );
        this.snapshotsCurrent.peek().draw();
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
                // read original canvas's width and height
                console.assert( info.length === 2 );
                this.originalWidth = parseInt( info[ 0 ] );
                this.originalHeight = parseInt( info[ 1 ] );

                break;
            case 2:
                // read number of vertices
                console.assert( info.length === 1 );
                this.vertices = [];
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
        initSnapshot.addSweepAtTop();

        // load and animate corresponding pseudocode
        initSnapshot.setMainPse( this.pseudocodeEles.monoPse );
        initSnapshot.addMainPseIndices( 1, 2 );
        initSnapshot.highlightPse();

        this.snapshotsCurrent.push( initSnapshot );
        this.snapshots.push( initSnapshot );
        this.setSnapShots();
        this.snapshotsCurrent.peek().draw();

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

        // add final snapshot only showing triangles
        this.snapshotsNextTri.push( SnapShot.getLastSnapshot( this.snapshots[ this.snapshots.length - 1 ] ) );

        // add snapshots for triangulation
        for ( let i = this.snapshots.length - 1; i > this.vertices.length; i-- )
            this.snapshotsNextTri.push( this.snapshots[ i ] );

        return -2;
    }
}


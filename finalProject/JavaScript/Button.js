"use strict"

/*
 * Button.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import Main from "./Main.js";
import Example from "./Example.js";
import Program from "../../myLibraries/GUI/Program.js";
import Stack from "../../myLibraries/util/Stack.js";

/**
 * class holding all buttons from the webpage
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class Button {

    constructor() {
        // bottons
        this.getStarted = null;
        this.example = null;

        this.buttonNextMono = null;
        this.buttonPreMono = null;
        this.buttonSkipMono = null;

        this.buttonNextTri = null;
        this.buttonPreTri = null;
        this.buttonSkipTri = null;

        this.isUnable = false;
        this.#addEvents();
    }

    static enableUntil( waitTime ) {
        setTimeout( function () {
            Main.main.buttons.isUnable = false;
        }, waitTime );
    }

    #addExampleEvent() {
        this.example = document.getElementById( "examples" );
        this.example.onchange = function () {
            switch ( this.selectedIndex ) {
                case 0:
                    Main.main.fileInput = Example.simpleExample;
                    break;
                case 1:
                    Main.main.fileInput = Example.complexExample;
                    break;
                case 2:
                    Main.main.fileInput = Example.mazeExample;
            }
        }

        this.example.onclick = function () {
            Main.main.whichInput = Main.InputType.EXAMPLE;
        }
    }

    #addMonoToneEvents() {
        // related functions for mono
        function nextMono() {
            if ( Main.main.snapshotsNext.size() > 0 ) {
                console.log( "next" );
                Main.main.snapshotsCurrent.push( Main.main.snapshotsNext.pop() );
                Main.main.setSnapShots();

                Main.synchronizeAnimation( Main.animateTime + 50 );
                Main.main.snapshotsCurrent.peek().draw();
                return true;
            }

            return false;
        }

        function preMono() {
            if ( Main.main.snapshotsCurrent.size() > 1 ) {
                console.log( "pre" );
                // hide previous, only needed when jump mono, directly go into tri
                if ( Main.main.currentSnapshot != null )
                    Main.main.currentSnapshot.__hidden();

                Main.main.snapshotsNext.push( Main.main.snapshotsCurrent.pop() );
                Main.main.setSnapShots();

                Main.synchronizeAnimation( Main.animateTime + 50 );
                Main.main.snapshotsCurrent.peek().draw();
            }
        }

        // Monotone Polygons
        this.buttonPreMono = document.getElementById( "pre_mono" );
        this.buttonPreMono.addEventListener( "click", function () {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.animateTime );
            preMono();
        } );

        this.buttonNextMono = document.getElementById( "next_mono" );
        this.buttonNextMono.addEventListener( "click", function () {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.animateTime );
            nextMono();
        } );

        function skip() {
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
        }

        this.buttonSkipMono = document.getElementById( "skip_mono" );
        this.buttonSkipMono.addEventListener( "mousedown", function () {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.main.snapshotsNext.size() * Main.animateTime + 50 );

            switch ( this.innerText ) {
                case "Skip":
                    skip();
                    break;
                case "Reset":
                    Main.main.resetMonoSnapshots();
            }
        } );
    }

    #addTriEvents() {
        // related functions for Tri
        function nextTri() {
            // set the status of tri snapshot stack properly
            if ( !Main.main.snapshotsNext.isEmpty() ) {
                Stack.pushAll( Main.main.snapshotsNext, Main.main.snapshotsCurrent );
            }

            if ( Main.main.snapshotsNextTri.size() > 0 ) {
                console.log( "tri next" );
                Main.main.snapshotsCurrentTri.push( Main.main.snapshotsNextTri.pop() );
                Main.main.setSnapShots( true );
                Main.main.snapshotsCurrentTri.peek().draw();
                return true;
            }
            return false;
        }

        function preTri() {
            if ( Main.main.snapshotsCurrentTri.size() > 1 ) {
                console.log( "tri pre" );
                // hide previous, only needed when jump mono, directly go into tri
                if ( Main.main.currentSnapshot != null )
                    Main.main.currentSnapshot.__hidden();

                Main.main.snapshotsNextTri.push( Main.main.snapshotsCurrentTri.pop() );
                Main.main.setSnapShots( true );
                Main.main.snapshotsCurrentTri.peek().draw();
            }
        }

        // Triangulation
        this.buttonPreTri = document.getElementById( "pre_tri" );
        this.buttonPreTri.addEventListener( "click", function () {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.animateTime );
            preTri();
        } );

        this.buttonNextTri = document.getElementById( "next_tri" );
        this.buttonNextTri.addEventListener( "click", function () {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.animateTime );
            nextTri();
        } );

        function skip() {
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
        }

        this.buttonSkipTri = document.getElementById( "skip_tri" );
        this.buttonSkipTri.addEventListener( "mousedown", function ( e ) {
            if ( Main.main.buttons.isUnable ) return;
            Main.main.buttons.isUnable = true;
            Button.enableUntil( Main.main.snapshotsNextTri.size() * Main.animateTime + 50 );

            switch ( this.innerText ) {
                case "Skip":
                    // hide previous, only needed when jump mono, directly go into tri
                    if ( Main.main.currentSnapshot != null )
                        Main.main.currentSnapshot.__hidden();

                    Main.main.isAnimatingSkip = true;
                    skip();
                    break;
                case "Reset":
                    Main.main.resetTriSnapshots();
            }
        } );
    }

    #addGetStartedEvents() {
        this.getStarted = document.getElementById( "getStarted" );
        this.getStarted.onclick = init;

        function reset() {
            if ( Main.main.buttons.isUnable ) return;

            let program = Main.main, buttons = program.buttons;
            buttons.getStarted.innerText = "Get Started";
            // allow to add points on the canvas
            program.drawer.addCanvasEvents();
            // reset data
            program.reset();
            // enable the ability to add input data
            buttons.getStarted.onclick = init;
            // change instructions for init
            document.getElementById( "instructions" ).innerHTML = Example.initInstructions;
            Program.showCanvasInstructions();
        }

        function init() {
            let program = Main.main, buttons = program.buttons;
            // console.log( program );

            // run the program
            console.log( "run" );
            switch ( program.whichInput ) {
                case Main.InputType.EXAMPLE:
                case Main.InputType.FILE:
                    if ( program.fileInput == null || Button.isNotInputFromFile() ) {
                        alert( "No file imported!" );
                        return;
                    }
                    program.__processingFile();
                case Main.InputType.CANVAS:
                    if ( program.vertices.length < 3 ) {
                        alert( "Not enough vertices! # of vertices: " + program.vertices.length );
                        return;
                    }

                    buttons.getStarted.innerText = "Reset";
                    // prohibit adding points on the canvas
                    program.drawer.cancelCanvasEvents();
                    // enable the ability to reset the program
                    buttons.getStarted.onclick = reset;
                    // change instructions for the program
                    document.getElementById( "instructions" ).innerText = Example.programInstructions;
                    Program.hideCanvasInstructions();

                    program.resetDrawingData();
                    program.isCounterClockWiseInput();
                    program.doTheAlgorithm();
            }
        }
    }

    static isNotInputFromFile() {
        let main = Main.main;
        return main.whichInput === Main.InputType.FILE &&
                ( main.fileInput === Example.simpleExample || main.fileInput === Example.complexExample || main.fileInput === Example.mazeExample );
    }

    #addHoverEvents() {
        this.getStarted.onmouseover = function () {
            this.style.backgroundColor = "white";
            this.style.color = "#00CCFF";
            this.style.border = "2px solid #00CCFF";
        }

        this.getStarted.onmouseout = function () {
            this.style.backgroundColor = "#00CCFF";
            this.style.color = "white";
            this.style.border = "";
        }

        function normalHover() {
            this.style.backgroundColor = "#EEEEEE";
            this.style.color = "#000000";
            this.style.border = "2px solid #777777";
        }

        function normalOut() {
            this.style.backgroundColor = "#EEEEEE";
            this.style.color = "#000000";
            this.style.border = "";
        }

        this.buttonPreMono.onmouseover = normalHover;
        this.buttonPreMono.onmouseout = normalOut;
        this.buttonNextMono.onmouseover = normalHover;
        this.buttonNextMono.onmouseout = normalOut;
        this.buttonSkipMono.onmouseover = normalHover;
        this.buttonSkipMono.onmouseout = normalOut;

        this.buttonPreTri.onmouseover = normalHover;
        this.buttonPreTri.onmouseout = normalOut;
        this.buttonNextTri.onmouseover = normalHover;
        this.buttonNextTri.onmouseout = normalOut;
        this.buttonSkipTri.onmouseover = normalHover;
        this.buttonSkipTri.onmouseout = normalOut;
    }

    #addEvents() {
        this.#addMonoToneEvents();
        this.#addTriEvents();
        this.#addGetStartedEvents();
        this.#addHoverEvents();
        this.#addExampleEvent();
    }

}
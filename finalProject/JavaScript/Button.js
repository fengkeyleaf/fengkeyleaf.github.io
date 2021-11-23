"use strict"

import Main from "./Main.js";

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

        this.__addEvents();
    }

    __addExampleEvent() {
        this.example = document.getElementById( "examples" );
        this.example.onchange = function () {
            switch ( this.selectedIndex ) {
                case 0:
                    Main.main.fileInput = Main.simpleExample;
                    break;
                case 1:
                    Main.main.fileInput = Main.complexExample;
                    break;
                case 2:
                    Main.main.fileInput = Main.mazeExample;
            }
        }

        this.example.onclick = function () {
            Main.main.whichInput = Main.InputType.EXAMPLE;
        }
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
        this.buttonSkipMono.addEventListener( "mousedown", function ( e ) {
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

            switch ( e.button ) {
                case 0: // left mouse
                    skip();
                    break;
                case 2: // right mouse
                    Main.main.resetMonoSnapshots();
            }
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
        this.buttonSkipTri.addEventListener( "mousedown", function ( e ) {
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

            switch ( e.button ) {
                case 0: // left mouse
                    skip();
                    break;
                case 2: // right mouse
                    Main.main.resetTriSnapshots();
            }
        } );
    }

    __addGetStartedEvents() {
        this.getStarted = document.getElementById( "getStarted" );
        this.getStarted.onclick = init;

        function reset() {
            let program = Main.main, buttons = program.buttons;
            buttons.getStarted.innerText = "Get Started";
            // allow to add points on the canvas
            program.drawer.addCanvasEvents();
            // reset data
            program.reset();
            // enable the ability to add input data
            buttons.getStarted.onclick = init;
        }

        function init() {
            let program = Main.main, buttons = program.buttons;
            // console.log( program );

            // run the program
            console.log( "run" );
            switch ( program.whichInput ) {
                case Main.InputType.EXAMPLE:
                case Main.InputType.FILE:
                    if ( program.fileInput == null || Button.__isNotInputFromFile() ) {
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

                    program.resetDrawingData();
                    program.doTheAlgorithm();
            }
        }
    }

    static __isNotInputFromFile() {
        let main = Main.main;
        return main.whichInput === Main.InputType.FILE &&
                ( main.fileInput === Main.simpleExample || main.fileInput === Main.complexExample || main.fileInput === Main.mazeExample );
    }

    __addHoverEvents() {
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

    __addEvents() {
        this.__addMonoToneEvents();
        this.__addTriEvents();
        this.__addGetStartedEvents();
        this.__addHoverEvents();
        this.__addExampleEvent();
    }

}
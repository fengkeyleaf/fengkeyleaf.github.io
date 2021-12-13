"use strict"

/*
 * Synchronizer.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import Button from "./Button.js";
import Main from "./Main.js";
import Queue from "../../myLibraries/util/Queue.js";

/**
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class Synchronizer {
    static waitingTIme = Math.floor( 1000 / 60 ); // ms, 60 fps

    static AnimationStatus = {
        PENDING: 0,
        LOADING: 1,
        NORMAL_RUNNING: 2,
        SKIPPING_RUNNING: 3,
        INTERRUPTED: 4,
        RESET: 5,
        toString: function ( status ) {
            switch ( status ) {
                case Synchronizer.AnimationStatus.PENDING:
                    return "PENDING";
                case Synchronizer.AnimationStatus.LOADING:
                    return "LOADING";
                case Synchronizer.AnimationStatus.NORMAL_RUNNING:
                    return "NORMAL_RUNNING";
                case Synchronizer.AnimationStatus.SKIPPING_RUNNING:
                    return "SKIPPING_RUNNING";
                case Synchronizer.AnimationStatus.INTERRUPTED:
                    return "INTERRUPTED";
                case Synchronizer.AnimationStatus.RESET:
                    return "RESET";
                default:
                    console.assert( false, status );
            }

            return null;
        }
    }

    constructor() {
        this.animationStatus = Synchronizer.AnimationStatus.PENDING;
        this.event = null; // mouse event
        // requestAnimationFrame's ID
        // instance of Promise from selectAnimation()
        this.animationQueue = new Queue();
    }

    addAnimation( event ) {
        let animation = {
            ID: null,
            pse: null,
            cache: event,
            isTerminate: false
        };
        this.animationQueue.enqueue( animation );
    }

    startAnimation( pseFun ) {
        let animation = this.animationQueue.back();
        animation.pse = pseFun;

        setTimeout( function () {
            Main.main.synchronizer.animationStatus = Synchronizer.AnimationStatus.RESET;
            // console.log( "stop after complete" );
            Synchronizer.#stopAnimation( Main.main.synchronizer.animationQueue.front() === animation ? Main.main.synchronizer.animationQueue.dequeue() : animation );
        }, this.event === Button.ButtonEvents.GET_STARTED ? 500 : Main.animateTime );

        return pseFun;
    }

    /**
     * @param {Number} ID
     */

    setID( ID ) {
        this.animationQueue.front().ID = ID;
    }

    /**
     * @param {Function} pseFun
     */

    setPse( pseFun ) {
        this.animationQueue.front().pse = pseFun;
    }

    /**
     * @param {{}} animation
     */

    static #stopAnimation( animation = null ) {
        if ( !animation.isTerminate ) {
            if ( animation.pse ) animation.pse.terminateFlag = true;
            if ( animation.ID ) cancelAnimationFrame( animation.ID );
            animation.isTerminate = true;
        }

        // if ( status ) Main.main.synchronizer.animationStatus = status;
        Synchronizer.animationDFA();
    }

    stopAnimation() {
        console.log( this.animationQueue.size() );
        if ( this.animationQueue.front().cache == null ) this.animationStatus = Synchronizer.AnimationStatus.RESET;
        else this.animationStatus = Synchronizer.AnimationStatus.LOADING;

        let animation = this.animationQueue.dequeue();
        Synchronizer.#stopAnimation( animation );
    }

    /**
     * @param {Synchronizer.AnimationStatus} status
     */

    setStatus( status ) {
        this.animationStatus = status;
    }

    /**
     * @param {Button.ButtonEvents} event
     */

    request( event ) {
        if ( this.animationStatus === Synchronizer.AnimationStatus.PENDING ||
            this.animationStatus === Synchronizer.AnimationStatus.NORMAL_RUNNING ||
            this.animationStatus === Synchronizer.AnimationStatus.SKIPPING_RUNNING ) {
            this.addAnimation( this.event = event );
            console.log( this.animationQueue.size() );
            Synchronizer.animationDFA();
        }
    }

    static animationDFA() {
        let main = Main.main;
        let syn = main.synchronizer;
        console.assert( syn.animationQueue.size() < 3 );
        console.log( "status: " + Synchronizer.AnimationStatus.toString( syn.animationStatus ), "mouse event: " + Button.ButtonEvents.toString( syn.event ) );

        switch ( syn.animationStatus ) {
            case Synchronizer.AnimationStatus.PENDING: // 0
                syn.animationStatus = Synchronizer.AnimationStatus.LOADING;
                Synchronizer.animationDFA();
                break;
            case Synchronizer.AnimationStatus.LOADING: // 1
                syn.animationQueue.front().cache = null;

                if ( main.load() ) {
                    if ( syn.event === Button.ButtonEvents.SKIP_TRI ||
                        syn.event === Button.ButtonEvents.SKIP_MONO ) {
                        syn.animationStatus = Synchronizer.AnimationStatus.SKIPPING_RUNNING;
                        main.animate();
                    } else {
                        syn.animationStatus = Synchronizer.AnimationStatus.NORMAL_RUNNING;
                        main.animate();
                    }

                    return;
                }

                syn.animationStatus = Synchronizer.AnimationStatus.PENDING;
                break;
            case Synchronizer.AnimationStatus.NORMAL_RUNNING: // 2
                if ( !( syn.event === Button.ButtonEvents.GET_STARTED ) ) { // 1
                    // console.log( "INTERRUPTED" );
                    syn.animationStatus = Synchronizer.AnimationStatus.INTERRUPTED; // 4
                    Synchronizer.animationDFA();
                    // setTimeout( Synchronizer.animationDFA, Synchronizer.waitingTIme );
                }
                break;
            case Synchronizer.AnimationStatus.SKIPPING_RUNNING: // 3
                if ( syn.event === Button.ButtonEvents.RESET_TRI ||
                    syn.event === Button.ButtonEvents.RESET_GLOBAL ||
                    syn.event === Button.ButtonEvents.RESET_MONO ) {
                    syn.animationStatus = Synchronizer.AnimationStatus.INTERRUPTED;
                    Synchronizer.animationDFA();
                }
                break;
            case Synchronizer.AnimationStatus.INTERRUPTED: // 4
                // TODO: 11/25/2021 wait for the two animations to stop
                syn.stopAnimation();
                Synchronizer.animationDFA();
                // setTimeout( Synchronizer.animationDFA, Synchronizer.waitingTIme );
                break;
            case Synchronizer.AnimationStatus.RESET: // 5
                switch ( syn.event ) {
                    case Button.ButtonEvents.RESET_MONO:
                        main.resetMonoSnapshots();
                        break;
                    case Button.ButtonEvents.RESET_TRI:
                        main.resetTriSnapshots();
                        break;
                    case Button.ButtonEvents.RESET_GLOBAL:
                        main.reset();
                        break;
                }
                // console.log("rest");
                syn.animationStatus = Synchronizer.AnimationStatus.PENDING;
                break;
            default:
                console.assert( false, "No handling Animation status " );
        }
    }
}
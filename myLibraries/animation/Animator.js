"use strict"

/*
 * Animator.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../lang/MyMath.js";
import KeyFraming from "./KeyFraming.js";
import Ball from "../../animation/assignmentTwo/Ball.js";
import Dynamics from "./Dynamics.js";
import CollidingObject from "../../animation/assignmentTwo/CollidingObject.js";
import Cushion from "../../animation/assignmentTwo/Cushion.js";

/**
 * Assignment 0:
 * Create the framework and testbed for the animation
 * techniques to be explored during the semester.
 *
 * Assignment 1:
 * Write a simplified key framing system that will translate
 * and rotate a single object based on a set of key frames.
 *
 * Assignment 2:
 * Write a system that will simulate a single shot of a billiards
 * game.
 *
 * @author Xiaoyu Tongyang, or call me sora for short
 */

export default class Animator {
    static animator = null;
    static xAxis = new THREE.Vector3( 1, 0, 0 );
    static yAxis = new THREE.Vector3( 0, 1, 0 );
    static zAxis = new THREE.Vector3( 0, 0, 1 );

    constructor() {
        // time
        this.initializingDate = null;
        this.startingDate = null;

        // webgl
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.group1 = null;
        this.mesh1 = null;
    }
}
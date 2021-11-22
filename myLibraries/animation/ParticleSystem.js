"use strict"

/*
 * ParticleSystem.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import Particle from "../../animation/assignmentFour/Particle.js";
import Dynamics from "./Dynamics.js";

/**
 * data structure of ParticleSystem
 *
 * Reference material of setting up particle system:
 * https://soulwire.github.io/sketch.js/examples/particles.html
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class ParticleSystem {
    static color = 0xff00ff;
    static fourth = new THREE.Vector3( 0.4, 0.4, 1 );

    /**
     * @param {Number} MAX_PARTICLES
     * @param {Number} generateRate
     * @param {TextureLoader} texture
     * @param {Scene} scene
     * @param {Number} meanSpeed
     * @param {Number} maxSpeed
     * @param {Number} radius
     */

    constructor( MAX_PARTICLES, generateRate, texture, scene, meanSpeed, maxSpeed, radius ) {
        this.MAX_PARTICLES = MAX_PARTICLES;
        this.texture = texture;
        this.scene = scene;
        this.meanSpeed = meanSpeed;
        this.maxSpeed = maxSpeed;
        this.radius = radius;
        this.generateRate = generateRate;

        this.particles = [];
        this.pool = [];
    }

    /**
     * generate particles at the rate
     *
     * @param {Vector3} center
     * @param {Vector3} normal
     */

    generate( center, normal ) {

        for ( let i = 0; i < this.generateRate; i++ ) {
            this.spawn( center, normal );
        }
    }

    /**
     * initialize some particles
     */

    setup() {
        this.generate( Dynamics.origin, Dynamics.origin );
    }

    /**
     * set up particles either from the pool or a new one
     *
     * @param {Vector3} center
     * @param {Vector3} normal
     */

    spawn( center, normal ) {

        if ( this.particles.length >= this.MAX_PARTICLES )
            this.pool.push( this.particles.shift() );

        let lifeTime = 20 + Math.random() * 60;
        let particle = this.pool.length ? this.pool.shift() : new Particle( this.texture, ParticleSystem.color, this.scene );
        particle.init( center, normal, this.radius, this.getSpeed(), 60, ParticleSystem.fourth, lifeTime );

        this.particles.push( particle );
    }

    /**
     * update particles
     *
     * @param {Number} t, seconds
     */

    update( t ) {
        for ( let i = this.particles.length - 1; i >= 0; i-- ) {
            let particle = this.particles[ i ];

            if ( particle.alive ) {
                particle.updatePos( t );
                particle.updateLifetime();
                particle.updateOpacity();
            } else {
                let e = this.particles.splice( i, 1 );
                // console.log( e );
                this.pool.push( e[ 0 ] );
            }
        }
    }

    /**
     * get random speed in the range of [ meanSpeed, maxSpeed )
     */

    getSpeed() {
        return this.meanSpeed + Math.random() * this.maxSpeed;
    }
}
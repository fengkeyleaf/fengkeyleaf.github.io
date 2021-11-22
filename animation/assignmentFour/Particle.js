"use strict"

/*
 * Particle.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import CollidingObject from "../assignmentTwo/CollidingObject.js";
import MyMath from "../../myLibraries/lang/MyMath.js";
import Dynamics from "../../myLibraries/animation/Dynamics.js";

/**
 * data structure of Particle
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Particle extends CollidingObject {
    static IDStatic = 0;

    /**
     * @param {TextureLoader} texture
     * @param {Number} color
     * @param {Scene} scene
     */

    constructor( texture, color, scene ) {
        super( null, null, 0.01, "sprite" + Particle.IDStatic++ );

        this.material = new THREE.SpriteMaterial( {
            color: color,
            map: texture,
            transparent: true
        } );
        this.group = new THREE.Sprite( this.material );
        scene.add( this.group );

        this.alive = true;
    }

    updateOpacity() {
        this.material.opacity = this.alive ? this.remeanedLifeTime / this.lifeTime : 0;
    }

    updateLifetime() {
        this.alive = --this.remeanedLifeTime > 0;
    }

    /**
     *
     * @param {Vector3} center
     * @param {Vector3} direction
     * @param {Number} radius
     * @param {Number} speed
     * @param {Number} psi, emission angle
     * @param {Vector3} scale
     * @param {Number} lifeTime
     */

    init( center, direction, radius, speed, psi, scale, lifeTime ) {
        const k = radius / 0.5;
        // get position
        let x = ( Math.random() - 0.5 ) * k;
        let y = ( Math.random() - 0.5 ) * k;
        let z = ( Math.random() - 0.5 ) * k;
        let pos = new THREE.Vector3( x, y, z ).add( center );
        // console.log( pos, pos.clone().sub( center ).length() );

        // get velocity
        let unitDirection = Particle.randomUnitVector3InCone( direction );
        // hit it with a rotation matrix to get it aligned with the direction of the cone
        let rotation = new THREE.Matrix4().lookAt( center, direction.clone().add( center ), Dynamics.zAxis.clone() );
        let directionV = unitDirection.clone().transformDirection( rotation );
        this.v = directionV.clone().negate().multiplyScalar( speed );

        // set position and scale
        this.group.scale.set( scale.x, scale.y, 1 ); // set y scale only
        this.group.position.set( pos.x, pos.y, pos.z );

        // set life time
        this.lifeTime = lifeTime;
        this.remeanedLifeTime = lifeTime;
        this.alive = true;
    }

    /**
     * get random Unit Vector3 bounded by the Cone
     *
     * Reference resource:
     * Generating uniform unit random vectors in Rn, UMONS, Belgium, Andersen Ang
     *
     * @param {Vector3} direction  direction of the cone
     */

    static randomUnitVector3InCone( direction ) {
        let theta = Math.random() * 360;

        // side angle of the cone is 25 degrees
        let cosPhi = Math.cos( MyMath.radians( 25 ) );
        let z = MyMath.randomInRange( cosPhi, 1 );

        console.assert( MyMath.doubleCompare( 1 - z * z, 0 ) >= 0, 1 - z * z );
        let sinPhi = Math.sqrt( 1 - z * z );
        let x = sinPhi * Math.cos( MyMath.radians( theta ) );
        let y = sinPhi * Math.sin( MyMath.radians( theta ) );

        let directionV = new THREE.Vector3( x, y, z );
        // console.log( MyMath.degrees( direction.angleTo( directionV ) ), direction.length() );
        return directionV;
    }
}
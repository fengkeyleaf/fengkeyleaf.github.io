"use strict"

/*
 * Stack.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

/**
 * Data structure of stack
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Stack {

    /**
     * Creates an empty Stack.
     */

    constructor() {
        this.array = [];
    }

    /**
     * @param {Stack} s1
     * @param {Stack} s2
     */

    static pushAll( s1, s2 ) {
        while ( !s1.isEmpty() )
            s2.push( s1.pop() );
    }

    push( item ) {
        this.array.push( item );
    }

    /**
     * Removes the object at the top of this stack and returns that
     * object as the value of this function.
     */

    pop() {
        return this.isEmpty() ? null : this.array.pop();
    }

    /**
     * Looks at the object at the top of this stack without removing it
     * from the stack.
     */

    peek() {
        return this.isEmpty() ? null : this.array[ this.array.length - 1 ];
    }

    /**
     * Tests if this stack is empty
     */

    isEmpty() {
        return this.array.isEmpty();
    }

    size() {
        return this.array.length;
    }

    clear() {
        this.array = [];
    }
}
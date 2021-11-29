"use strict"

export default class Example {

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
        "10 10\n" +
        "6\n" +
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
        "12 12\n" +
        "15\n" +
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

    static mazeExample = "// s\n" +
        "// e\n" +
        "-10 10 16 -5\n" +
        "20 20\n" +
        "88\n" +
        "16 -5\n" +
        "16 -4\n" +
        "9 -4\n" +
        "9 -2\n" +
        "16 -2\n" +
        "16 7\n" +
        "15 7\n" +
        "15 5\n" +
        "14 5\n" +
        "14 8\n" +
        "16 8\n" +
        "16 10\n" +
        "10 10\n" +
        "10 9\n" +
        "8 9\n" +
        "8 10\n" +
        "2 10\n" +
        "2 -1\n" +
        "1 -1\n" +
        "1 -4\n" +
        "-4 -4\n" +
        "-4 -2\n" +
        "-2 -2\n" +
        "-2 -1\n" +
        "-5 -1\n" +
        "-5 -4\n" +
        "-8 -4\n" +
        "-8 -1\n" +
        "-6 -1\n" +
        "-6 0\n" +
        "-2 0\n" +
        "-2 1\n" +
        "-1 1\n" +
        "-1 3\n" +
        "-3 3\n" +
        "-3 1\n" +
        "-5 1\n" +
        "-5 3\n" +
        "-8 3\n" +
        "-8 9\n" +
        "-1 9\n" +
        "-1 5\n" +
        "-5 5\n" +
        "-5 7\n" +
        "-2 7\n" +
        "-2 8\n" +
        "-6 8\n" +
        "-6 4\n" +
        "0 4\n" +
        "0 10\n" +
        "-10 10\n" +
        "-10 2\n" +
        "-6 2\n" +
        "-6 1\n" +
        "-7 1\n" +
        "-7 0\n" +
        "-10 0\n" +
        "-10 -5\n" +
        "2 -5\n" +
        "2 -3\n" +
        "3 -3\n" +
        "3 -5\n" +
        "5 -5\n" +
        "5 -2\n" +
        "3 -2\n" +
        "3 3\n" +
        "5 3\n" +
        "5 -1\n" +
        "6 -1\n" +
        "6 5\n" +
        "3 5\n" +
        "3 9\n" +
        "4 9\n" +
        "4 8\n" +
        "7 8\n" +
        "7 4\n" +
        "11 4\n" +
        "11 7\n" +
        "10 7\n" +
        "10 5\n" +
        "9 5\n" +
        "9 8\n" +
        "12 8\n" +
        "12 3\n" +
        "8 3\n" +
        "8 1\n" +
        "7 1\n" +
        "7 -5";

    static initInstructions = "You can import polygon with the following ways:<br>" +
        "1) Click on the canvas to add points( counter-clock-wise order required );<br>" +
        "2) Select an example from the list;<br>" +
        "3) Import your input file; <a href=\"https://github.com/fengkeyleaf/fengkeyleaf.github.io/blob/master/finalProject/testCase_2/1_1\">file format info</a>;<br>" +
        "Click \"Get Started\" button to run the program when you're done.<br>";

    static canvasInstructions = "Must add points in counter-clock-wise order and press \"Backspace\" to delete points.";

    static programInstructions = "Click buttons under two algorithms to see how they work step by step:\n" +
        "Previous: go back to previous step;\n" +
        "Next go to next step;\n" +
        "Skip/Reset: Watch how a algorithm works from the start to the end; Reset the program to the status before applly this algorithm.\n" +
        "You can presss \"Ctrl\" to toggle those two.\n" +
        "Click \"Reset\" button( formally \"Get Started\" button ) to import input data again.";
}
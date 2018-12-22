"use strict";

const host = "localhost"
const port = 8033;

/**
 * Makes a POST fetch request.
 * @param {Json} data JSON struture. 
 * @param {String} command The type of request we want to do.
 */
async function makeRequestFetch(data,command) {
    return await fetch(`http://${host}:${port}/${command}`,{
        method: "POST",
        body: data
    });
}

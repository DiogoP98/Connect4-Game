"use strict";

const host = "twserver.alunos.dcc.fc.up.pt";
const port = 8008;

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

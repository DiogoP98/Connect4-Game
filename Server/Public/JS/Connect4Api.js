"use strict";

const host = location.hostname || "twserver.alunos.dcc.fc.up.pt"
const port = location.port ||  8133

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

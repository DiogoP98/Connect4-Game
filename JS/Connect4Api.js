"use strict";

const host = "twserver.alunos.dcc.fc.up.pt";
const port = 8008;

async function makeRequestFetch(data,command) {
    return await fetch(`http://${host}:${port}/${command}`,{
        method: "POST",
        body: data
    });
}

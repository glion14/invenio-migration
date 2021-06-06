"use strict";

global.fetch = require("node-fetch");
const token = process.env.RDM_TOKEN

const requestInit: RequestInit = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}
const apiResponse = fetch('https://test.researchdata.tuwien.ac.at/api/records', requestInit)
    .then(response => response.json())
    .then(json => json.hits)
    .then(hits => console.log(hits));
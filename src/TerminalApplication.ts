import 'reflect-metadata';
import {plainToClass} from "class-transformer";
import HitExtractor from "./HitExtractor";
import Hit from "./Hit";
"use strict";

global.fetch = require("node-fetch");
const token = process.env.RDM_TOKEN



const requestInit: RequestInit = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

async function init () {
    const hitId = "0f99d-w2e63";
    const apiResponse: Hit  = await fetch(`https://test.researchdata.tuwien.ac.at/api/records/${hitId}`, requestInit)
        .then(response => response.json())
        // .then(json => json.hits)
        .then(hit => plainToClass(Hit, hit))

    const hitExtractor = new HitExtractor();
    hitExtractor.process(apiResponse, hitId)
}

init()
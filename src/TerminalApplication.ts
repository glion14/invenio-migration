import 'reflect-metadata';
import {plainToClass} from "class-transformer";
import HitExtractor from "./HitExtractor";
import Hit from "./Hit";
"use strict";
require('dotenv').config()

global.fetch = require("node-fetch");
const token = process.env.SOURCE_TOKEN

const requestInit: RequestInit = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

const baseUrl = "https://inveniordm.web.cern.ch"

export async function init () {
    const hitId = "z0717-4qm62";
    const apiResponse: Hit  = await fetch(baseUrl + `/api/records/${hitId}`, requestInit)
        .then(response => response.json())
        // .then(json => json.hits)
        .then(hit => plainToClass(Hit, hit))

    const hitExtractor = new HitExtractor(baseUrl, baseUrl);
    hitExtractor.process(apiResponse, hitId)
}

init()
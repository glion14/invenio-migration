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
    const migrationIds = process.env.MIGRATION_IDS.split(",");
    for (const hitId of migrationIds) {
        const apiResponse: Hit = await fetch(baseUrl + `/api/records/${hitId}`, requestInit)
            .then(response => response.json())
            .then(hit => plainToClass(Hit, hit))

        const hitExtractor = new HitExtractor();
        await hitExtractor.process(apiResponse, hitId)
    }
}

init()
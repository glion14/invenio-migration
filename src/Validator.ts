import Record from "./Record";
import isEqual from 'lodash/isEqual'
export default class Validator {

    static validateMetadata(sourceRecord:Record, targetRecord:Record): boolean{
        return isEqual(sourceRecord.getMetadata(), targetRecord.getMetadata());
    }
}
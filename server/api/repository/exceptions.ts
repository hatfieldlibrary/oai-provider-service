

class Exceptions  {

    static badArgument: string = 'Illegal recordsQuery parameter';
    static badResumptionToken: string = 'The resumption token is invalid';
    static badVerb = 'Illegal OAI verb';
    static cannotDisseminateFormat = 'The metadata format identified by the value given for the metadataPrefix ' +
        'argument is not supported by the item or by the repository.';
    static idDoesNotExist = 'The value of the identifier argument is unknown or illegal in this repository.';
    static noRecordsMatch = 'The combination of the values of the from, until, set and metadataPrefix arguments ' +
        'results in an empty list.';
    static noMetadataFormats = 'There are no metadata formats available for the specified item.';
    static noSetHierarchy = 'The repository does not support sets.';
    public static UNKNOWN_CODE: string = 'unknown';

    public static getException(code: string) : string {
        switch(code) {
            case 'badArgument': {
               return this.badArgument;
            }
            case 'badResumptionToken': {
                return this.badResumptionToken;
            }
            case 'badVerb': {
                return this.badVerb;
            }
            case 'cannotDisseminateFormat': {
                return this.cannotDisseminateFormat;
            }
            case 'idDoesNotExist': {
                return this.idDoesNotExist;
            }
            case 'noRecordsMatch': {
                return this.noRecordsMatch
            }
            case 'noMetadataFormats': {
                return this.noMetadataFormats;
            }
            case 'noSetHierarchy': {
                return this.noSetHierarchy;
            }
            default: {
                return this.UNKNOWN_CODE;
            }

        }
    }
};

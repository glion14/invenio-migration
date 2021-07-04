# Invenio migration tool
A tool which let's you automatically migrate records between two different Invenio instances.

# Description

This tool performs migration of single or array of records from `source repository` to the `target repository`.
It migrates all metadata and files associated with each record. Performs checksum validation on all files uploaded to target repository 
and validates metadata against the source record. When all checks are satisfied it publishes the new record in `target repository`.

Uploaded files checksum validation is only **soft check**, meaning it will not stop the migration only log as warning.

Validation on draft record metadata is a strict check and failing this validation will result in record not being published. 

Such failed draft is **not** deleted by this tool to allow for debugging
and further investigation.

> Please always test and verify your migration on sandbox/staging environment.

For all actions it uses REST API defined in this [documentation](https://inveniordm.docs.cern.ch/reference/rest_api/).

# Installation
The prerequisites for running this application is nodejs and npm. Please follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install them.

Execute:
```bash
npm install
```
This should install all necessary dependecies for the application.

# Usage
1. Get your API keys for both Invenio instances you want to migrate between.
1. Make sure your API key for target repository has enough permissions to upload files and create new records.  
1. Clone the project ```git clone https://github.com/glion14/invenio-migration.git```
1. Create a ```.env``` file in the root directory of the application. 
1. 4 variables which needs to be filled - ```SOURCE_HOST, TARGET_HOST, TARGET_TOKEN, MIGRATION_IDS```.

Example:
```
SOURCE_HOST=https://test.researchdata.tuwien.ac.at
TARGET_HOST=https://inveniordm.web.cern.ch
TARGET_TOKEN=YOUR_CERN_INVENIO_TOKEN
MIGRATION_IDS=eaag3-tb638,7vm1m-z4t47
``` 

After those variables are set, run `npm run start`. This will start the migration.

# Support
If you have troubles with installation or running the application, please create an issue on [Github page of the project](https://github.com/glion14/invenio-migration/issues).


# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

# License
This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/) License - see the LICENSE file for details
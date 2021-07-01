# Invenio migration tool
A tool which let's you migrate content between two different Invenio instances. 

# Description


# Installation
The prerequisites for running this application is nodejs and npm. Please follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install them.

Execute:
```bash
npm install
```
This should install all necessary dependecies for the application.

# Usage
1. Get your API keys for both Invenio instances you want to migrate between.
2. Clone the project ```git clone https://github.com/glion14/invenio-migration.git```
3. Create a ```.env``` file in the root directory of the application. 
4. 5 variables which needs to be filled - ```SOURCE_HOST, TARGET_HOST, SOURCE_TOKEN, TARGET_TOKEN, MIGRATION_IDS```.

Example:
```
SOURCE_HOST=https://test.researchdata.tuwien.ac.at
TARGET_HOST=https://inveniordm.web.cern.ch
SOURCE_TOKEN=token_for_tuwien_researchdata
TARGET_TOKEN=cern_invenio_token
MIGRATION_IDS=z0717-4qm62,a1498-k0ui5
``` 

After those variables are set, run `npm run start`. This will start the migration.

# Support
If you have troubles with installation or running the application, please create an issue on [Github page of the project](https://github.com/glion14/invenio-migration/issues).


# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

# License
This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/) License - see the LICENSE file for details

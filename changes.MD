# Changes
in order to create a clean service:
 - removed currentDocument from the service, all methods using "currentDocument" require an object of type INodoxDocument to work on
 - removed linq.js from services, using Typescript alternatives find and findIndex
 - removed IUiservice from NodoxService, 
 - removed UNodeINodeDatabaseServiceData from NodoxService, 

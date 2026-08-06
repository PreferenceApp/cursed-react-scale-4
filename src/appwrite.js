import { Client, TablesDB, Account, Functions, OAuthProvider, ID, Query, Permission, Role} from "appwrite";

const client = new Client();
client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('cursedclas'); // Your project ID
    
export { OAuthProvider, ID, Query, Permission, Role }; 

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const functions = new Functions(client);

import { Client, Account, ID , Databases} from 'appwrite';

export const client: Client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your endpoint
  .setProject('681bddc10025a048377e'); // Replace with your project ID

  export const account = new Account(client);
  export const databases = new Databases(client);
  export { ID };
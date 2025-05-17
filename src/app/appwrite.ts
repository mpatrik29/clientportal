import { Client, Account, ID , Databases} from 'appwrite';

export const client: Client = new Client();

client
  .setEndpoint('https://appwrite.viewdns.net/v1') // Replace with your endpoint
  .setProject('68288a22003b3979af8d'); // Replace with your project ID

  export const account = new Account(client);
  export const databases = new Databases(client);
  export { ID };
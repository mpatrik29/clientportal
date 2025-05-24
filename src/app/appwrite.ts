import { Client, Account, ID , Databases, Storage } from 'appwrite';

export const client: Client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Replace with your endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string); // Replace with your project ID

  export const account = new Account(client);
  export const databases = new Databases(client);

  export const storage = new Storage(client);

  export { ID };
// import { storage } from "@/app/appwrite";

// // Storage bucket configuration interface
// export interface AppwriteBucketConfig {
//   bucketId: string;
//   name: string;
//   permissions?: string[];
//   fileSecurity?: boolean;
//   enabled?: boolean;
//   maximumFileSize?: number;
//   allowedFileExtensions?: string[];
//   compression?: 'none' | 'gzip' | 'zstd';
//   encryption?: boolean;
//   antivirus?: boolean;
// }

// export interface BucketResult {
//   success: boolean;
//   bucketId: string;
//   name: string;
//   error?: string;
//   bucket?: any; // Appwrite bucket object
// }

// // Appwrite Storage Bucket Utility
// export class AppwriteStorageBucketUtility {
 
//   /**
//    * Creates a new storage bucket with the given unique ID
//    */
//   async createBucket(
//     uniqueId: string,
//     name?: string,
//     options: Omit<AppwriteBucketConfig, 'bucketId' | 'name'> = {}
//   ): Promise<BucketResult> {
//     try {
//       if (!uniqueId || uniqueId.trim().length === 0) {
//         return {
//           success: false,
//           bucketId: uniqueId,
//           name: name || '',
//           error: 'Unique bucket ID is required'
//         };
//       }

//       // Check if bucket already exists
//       try {
//         const existingBucket = await this.storage.getBucket(uniqueId);
//         if (existingBucket) {
//           return {
//             success: false,
//             bucketId: uniqueId,
//             name: name || '',
//             error: 'Bucket with this ID already exists'
//           };
//         }
//       } catch {
//         // Bucket doesn't exist, which is what we want
//       }

//       const bucketName = name || `Bucket-${uniqueId}`;

//       // Default permissions - adjust based on your needs
//       const defaultPermissions = options.permissions || [
//         Permission.read(Role.any()),
//         Permission.create(Role.users()),
//         Permission.update(Role.users()),
//         Permission.delete(Role.users())
//       ];

//       const bucket = await this.storage.createBucket(
//         uniqueId,
//         bucketName,
//         defaultPermissions,
//         options.fileSecurity ?? false,
//         options.enabled ?? true,
//         options.maximumFileSize,
//         options.allowedFileExtensions,
//         options.compression ?? 'none',
//         options.encryption ?? true,
//         options.antivirus ?? true
//       );

//       return {
//         success: true,
//         bucketId: uniqueId,
//         name: bucketName,
//         bucket
//       };

//     } catch (error) {
//       return {
//         success: false,
//         bucketId: uniqueId,
//         name: name || '',
//         error: error instanceof Error ? error.message : 'Unknown error occurred'
//       };
//     }
//   }

//   /**
//    * Creates multiple buckets with unique IDs
//    */
//   async createBuckets(
//     configs: Array<{
//       bucketId: string;
//       name?: string;
//     } & Omit<AppwriteBucketConfig, 'bucketId' | 'name'>>
//   ): Promise<BucketResult[]> {
//     const results: BucketResult[] = [];
    
//     for (const config of configs) {
//       const { bucketId, name, ...options } = config;
//       const result = await this.createBucket(bucketId, name, options);
//       results.push(result);
//     }

//     return results;
//   }

//   /**
//    * Deletes a bucket by its unique ID
//    */
//   async deleteBucket(bucketId: string): Promise<boolean> {
//     try {
//       await this.storage.deleteBucket(bucketId);
//       return true;
//     } catch (error) {
//       console.error(`Failed to delete bucket ${bucketId}:`, error);
//       return false;
//     }
//   }

//   /**
//    * Updates an existing bucket
//    */
//   async updateBucket(
//     bucketId: string,
//     name?: string,
//     options: Omit<AppwriteBucketConfig, 'bucketId' | 'name'> = {}
//   ): Promise<BucketResult> {
//     try {
//       const bucket = await this.storage.updateBucket(
//         bucketId,
//         name,
//         options.permissions,
//         options.fileSecurity,
//         options.enabled,
//         options.maximumFileSize,
//         options.allowedFileExtensions,
//         options.compression,
//         options.encryption,
//         options.antivirus
//       );

//       return {
//         success: true,
//         bucketId,
//         name: bucket.name,
//         bucket
//       };
//     } catch (error) {
//       return {
//         success: false,
//         bucketId,
//         name: name || '',
//         error: error instanceof Error ? error.message : 'Unknown error occurred'
//       };
//     }
//   }

//   /**
//    * Checks if a bucket exists
//    */
//   async bucketExists(bucketId: string): Promise<boolean> {
//     try {
//       await this.storage.getBucket(bucketId);
//       return true;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * Gets bucket information
//    */
//   async getBucket(bucketId: string) {
//     try {
//       return await this.storage.getBucket(bucketId);
//     } catch (error) {
//       throw new Error(`Failed to get bucket ${bucketId}: ${error}`);
//     }
//   }

//   /**
//    * Lists all buckets in the project
//    */
//   async listBuckets(queries?: string[]) {
//     try {
//       return await this.storage.listBuckets(queries);
//     } catch (error) {
//       throw new Error(`Failed to list buckets: ${error}`);
//     }
//   }

//   /**
//    * Utility method to generate a unique bucket ID
//    */
//   static generateUniqueBucketId(prefix = 'bucket'): string {
//     return `${prefix}_${ID.unique()}`;
//   }

//   /**
//    * Helper method to create a bucket with common settings for file uploads
//    */
//   async createFileUploadBucket(
//     uniqueId: string,
//     name?: string,
//     maxFileSize = 50 * 1024 * 1024, // 50MB default
//     allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
//   ): Promise<BucketResult> {
//     return this.createBucket(uniqueId, name, {
//       maximumFileSize: maxFileSize,
//       allowedFileExtensions: allowedExtensions,
//       fileSecurity: true,
//       encryption: true,
//       antivirus: true,
//       permissions: [
//         Permission.read(Role.any()),
//         Permission.create(Role.users()),
//         Permission.update(Role.users()),
//         Permission.delete(Role.users())
//       ]
//     });
//   }

//   /**
//    * Helper method to create a public bucket for static assets
//    */
//   async createPublicAssetsBucket(
//     uniqueId: string,
//     name?: string,
//     allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'css', 'js']
//   ): Promise<BucketResult> {
//     return this.createBucket(uniqueId, name, {
//       allowedFileExtensions: allowedExtensions,
//       fileSecurity: false,
//       encryption: false,
//       antivirus: false,
//       permissions: [
//         Permission.read(Role.any()),
//         Permission.create(Role.users()),
//         Permission.update(Role.users()),
//         Permission.delete(Role.users())
//       ]
//     });
//   }
// }

// // Usage example
// export const createAppwriteStorageUtility = (
//   endpoint: string,
//   projectId: string,
//   apiKey?: string
// ) => {
//   return new AppwriteStorageBucketUtility(endpoint, projectId, apiKey);
// };

// // Example usage:
// /*
// const storageUtil = createAppwriteStorageUtility(
//   'https://cloud.appwrite.io/v1',
//   'your-project-id',
//   'your-api-key'
// );

// // Create a simple bucket
// const result = await storageUtil.createBucket('my-unique-bucket-id', 'My Bucket');

// // Create a file upload bucket with custom settings
// const uploadBucket = await storageUtil.createFileUploadBucket(
//   'user-uploads',
//   'User Uploads',
//   100 * 1024 * 1024, // 100MB
//   ['jpg', 'png', 'pdf']
// );

// // Create multiple buckets
// const multipleBuckets = await storageUtil.createBuckets([
//   { bucketId: 'bucket-1', name: 'First Bucket' },
//   { bucketId: 'bucket-2', name: 'Second Bucket', maximumFileSize: 10 * 1024 * 1024 }
// ]);
// */
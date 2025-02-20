import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_KEY
);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
    sharedKeyCredential 
);

const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);

export async function uploadImage(buffer, filename) {
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        await blockBlobClient.upload(buffer, buffer.length);
        return blockBlobClient.url;
    } catch (error) {
        console.error("Upload failed:", error.message);
        throw error;
    }
}

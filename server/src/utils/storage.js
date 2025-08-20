const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

function getBlobServiceClient() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  return BlobServiceClient.fromConnectionString(conn);
}

async function uploadBufferToBlob(containerName, buffer, contentType, filenameHint = 'upload') {
  const client = getBlobServiceClient();
  const containerClient = client.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: 'container' });

  const blobName = `${uuidv4()}-${filenameHint}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

module.exports = { uploadBufferToBlob };



/**
 * Document Sealing Service
 * Provides cryptographic sealing for uploaded documents with detection of pre-sealed documents
 */

export interface DocumentSeal {
  hash: string;           // SHA-512 hash of document content
  timestamp: string;      // ISO timestamp when sealed
  filename: string;       // Original filename
  fileType: string;       // MIME type
  size: number;          // File size in bytes
  sealed: boolean;       // Whether this document was already sealed
}

export interface SealedDocument {
  name: string;
  type: string;
  data: string;          // base64 data
  seal: DocumentSeal;
}

// Magic marker to identify Verum Omnis sealed documents
const VERUM_SEAL_MARKER = 'VERUM_OMNIS_SEAL:';
const SEAL_MARKER_REGEX = /VERUM_OMNIS_SEAL:([a-f0-9]{128})\|(\d+)\|(.+)/;

/**
 * Generate SHA-512 hash for document content
 */
export async function generateDocumentHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Check if a document has already been sealed by Verum Omnis
 * Looks for seal marker in document metadata or embedded content
 */
export function detectExistingSeal(filename: string, data: string): DocumentSeal | null {
  // Check if filename contains seal marker
  const filenameMatch = filename.match(SEAL_MARKER_REGEX);
  if (filenameMatch) {
    const [, hash, timestamp, originalName] = filenameMatch;
    return {
      hash,
      timestamp: new Date(parseInt(timestamp)).toISOString(),
      filename: originalName,
      fileType: '',
      size: 0,
      sealed: true,
    };
  }

  // For text-based files, check content for seal marker
  try {
    const decoded = atob(data);
    const sealMatch = decoded.match(SEAL_MARKER_REGEX);
    if (sealMatch) {
      const [, hash, timestamp, originalName] = sealMatch;
      return {
        hash,
        timestamp: new Date(parseInt(timestamp)).toISOString(),
        filename: originalName,
        fileType: '',
        size: decoded.length,
        sealed: true,
      };
    }
  } catch (e) {
    // Not a text file or couldn't decode, continue
  }

  return null;
}

/**
 * Seal a document with cryptographic hash and timestamp
 */
export async function sealDocument(
  filename: string,
  fileType: string,
  data: string,
  size: number
): Promise<SealedDocument> {
  // First check if document is already sealed
  const existingSeal = detectExistingSeal(filename, data);
  
  if (existingSeal) {
    // Document is already sealed, return with existing seal
    existingSeal.fileType = fileType;
    existingSeal.size = size;
    return {
      name: filename,
      type: fileType,
      data,
      seal: existingSeal,
    };
  }

  // Generate new seal for unsealed document
  const hash = await generateDocumentHash(data);
  const timestamp = new Date().toISOString();
  
  const seal: DocumentSeal = {
    hash,
    timestamp,
    filename,
    fileType,
    size,
    sealed: false,  // This is a newly sealed document
  };

  return {
    name: filename,
    type: fileType,
    data,
    seal,
  };
}

/**
 * Verify document integrity by comparing hash
 */
export async function verifyDocumentIntegrity(
  data: string,
  expectedHash: string
): Promise<boolean> {
  const currentHash = await generateDocumentHash(data);
  return currentHash === expectedHash;
}

/**
 * Format seal for display
 */
export function formatSealForDisplay(seal: DocumentSeal): string {
  return `${seal.hash.substring(0, 16)}...${seal.hash.substring(seal.hash.length - 16)}`;
}

/**
 * Create a seal marker string that can be embedded in documents
 */
export function createSealMarker(seal: DocumentSeal): string {
  const timestamp = new Date(seal.timestamp).getTime();
  return `${VERUM_SEAL_MARKER}${seal.hash}|${timestamp}|${seal.filename}`;
}

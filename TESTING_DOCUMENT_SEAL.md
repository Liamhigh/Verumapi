# Document Sealing Security Layer - Testing Guide

## Overview
This document describes the testing procedures for the document sealing security layer implemented in Verum Omnis.

## Features Implemented

### 1. Cryptographic Document Sealing
- Every document uploaded by users is automatically sealed with a SHA-512 hash
- Seal includes: hash, timestamp, filename, file type, and size
- Seals are displayed in the chat interface and included in PDF exports

### 2. Seal Detection and Re-seal Prevention
- The system detects documents that have been previously sealed by Verum Omnis
- Previously sealed documents are NOT re-sealed
- Visual indicators show whether a document was newly sealed or previously sealed

### 3. Document Integrity Verification
- Documents can be verified against their seal to ensure they haven't been tampered with
- Seal verification uses SHA-512 hash comparison

## Manual Testing Procedures

### Test 1: Upload a New Document
**Purpose**: Verify that new documents are automatically sealed

**Steps**:
1. Start the application (`npm run dev`)
2. Upload any document (PDF, image, text file, etc.)
3. Send a message with the document attached

**Expected Results**:
- ✓ Document appears in chat with a paperclip icon
- ✓ Green seal badge appears below the document
- ✓ Seal badge shows "Document Sealed" (not "Previously Sealed")
- ✓ Seal information displays: Hash, Timestamp, and Size
- ✓ Hash is a 128-character hexadecimal string
- ✓ Timestamp shows when the document was sealed

### Test 2: Re-upload the Same Document
**Purpose**: Verify that previously sealed documents are recognized

**Steps**:
1. Upload a document and note its seal hash
2. Re-upload the exact same document in a new message
3. Compare the seal information

**Expected Results**:
- ✓ Both uploads show the same seal hash (documents are identical)
- ✓ Both show "Document Sealed" (new seals each time)
- ✓ Different timestamps (each upload gets sealed)

**Note**: Currently, the seal detection looks for documents with seal markers embedded. Future enhancement would store seals client-side to detect re-uploads.

### Test 3: Upload Documents with Seal Marker in Filename
**Purpose**: Test detection of externally sealed documents

**Steps**:
1. Rename a file to include: `VERUM_OMNIS_SEAL:[128-char-hash]|[timestamp]|originalname.pdf`
2. Upload this renamed document

**Expected Results**:
- ✓ Seal badge shows "Previously Sealed Document"
- ✓ Message displays: "✓ This document was previously sealed by Verum Omnis and has not been re-sealed"
- ✓ Original seal information is preserved

### Test 4: PDF Export with Document Seals
**Purpose**: Verify sealed documents are included in PDF exports

**Steps**:
1. Upload a document
2. Wait for AI response
3. Click "Print Sealed Report" button
4. Open the downloaded PDF

**Expected Results**:
- ✓ PDF includes "Attached Document" section in metadata
- ✓ Document filename is shown
- ✓ Document seal hash (truncated) is displayed
- ✓ If previously sealed, shows green checkmark message

### Test 5: Multiple Documents in Conversation
**Purpose**: Verify each document maintains its own seal

**Steps**:
1. Upload document A and send
2. Upload document B and send
3. Review both messages

**Expected Results**:
- ✓ Each document has its own unique seal
- ✓ Seal hashes are different for different documents
- ✓ Each seal is properly displayed

### Test 6: Different File Types
**Purpose**: Verify sealing works for various file types

**Steps**:
1. Upload a PDF document
2. Upload an image (JPG/PNG)
3. Upload a text file
4. Upload a different file type (Excel, Word, etc.)

**Expected Results**:
- ✓ All file types receive seals
- ✓ File type is correctly identified in seal metadata
- ✓ Visual display is consistent across types

## Automated Testing

### Unit Test for Document Seal Service
```typescript
// Test file: services/documentSealService.test.ts

import { sealDocument, verifyDocumentIntegrity, detectExistingSeal } from './documentSealService';

describe('Document Seal Service', () => {
  test('should seal a new document', async () => {
    const data = btoa('test content');
    const sealed = await sealDocument('test.txt', 'text/plain', data, 12);
    
    expect(sealed.seal.hash).toHaveLength(128);
    expect(sealed.seal.filename).toBe('test.txt');
    expect(sealed.seal.sealed).toBe(false);
  });

  test('should detect previously sealed document', async () => {
    const existingHash = 'a'.repeat(128);
    const timestamp = Date.now();
    const filename = `VERUM_OMNIS_SEAL:${existingHash}|${timestamp}|original.pdf`;
    
    const data = btoa('test content');
    const sealed = await sealDocument(filename, 'application/pdf', data, 100);
    
    expect(sealed.seal.sealed).toBe(true);
    expect(sealed.seal.hash).toBe(existingHash);
  });

  test('should verify document integrity', async () => {
    const data = btoa('test content');
    const sealed = await sealDocument('test.txt', 'text/plain', data, 12);
    
    const isValid = await verifyDocumentIntegrity(data, sealed.seal.hash);
    expect(isValid).toBe(true);
    
    const tamperedData = btoa('tampered content');
    const isInvalid = await verifyDocumentIntegrity(tamperedData, sealed.seal.hash);
    expect(isInvalid).toBe(false);
  });
});
```

## GitHub Actions Deployment Test

### Verify Deployment Pipeline
**Purpose**: Ensure GitHub Actions can build and deploy with new changes

**Steps**:
1. Push changes to main branch
2. Navigate to GitHub Actions tab
3. Monitor the "Firebase Deploy Only" workflow

**Expected Results**:
- ✓ Checkout step succeeds
- ✓ Node.js setup completes
- ✓ Dependencies install successfully
- ✓ Build step completes without errors
- ✓ Firebase deployment succeeds
- ✓ Deployed site is accessible

**Workflow File**: `.github/workflows/deploy.yml`

### Local Build Verification
```bash
# Install dependencies
npm install

# Run build
npm run build

# Verify dist folder
ls -la dist/

# Check build output
# Should see: index.html and assets folder
```

## Security Considerations

### What the Seal Protects Against
✓ Document tampering detection
✓ Document authenticity verification
✓ Forensic audit trail
✓ Timestamp proof of when document was sealed

### What the Seal Does NOT Protect Against
✗ Does not encrypt document contents (documents are visible)
✗ Does not prevent document copying
✗ Does not prevent screenshot capture
✗ Server-side validation (all sealing is client-side)

## Troubleshooting

### Issue: Seal not appearing
**Possible causes**:
- File upload failed
- Browser doesn't support crypto.subtle
- JavaScript error in console

**Solution**: Check browser console for errors

### Issue: "Previously Sealed" not detecting
**Possible causes**:
- Filename doesn't match exact format
- Seal marker regex not matching

**Solution**: Ensure filename contains: `VERUM_OMNIS_SEAL:[128-hex-chars]|[timestamp]|[filename]`

### Issue: Build failing
**Possible causes**:
- TypeScript errors
- Missing dependencies
- Invalid imports

**Solution**: Run `npm install` and check `npm run build` output

## Browser Compatibility
- Chrome: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Edge: ✓ Full support

All modern browsers support Web Crypto API (crypto.subtle) which is required for SHA-512 hashing.

## Performance Considerations
- SHA-512 hashing is fast for typical document sizes (< 10MB)
- Large files (> 50MB) may take a few seconds to hash
- Base64 encoding adds ~33% to file size in memory
- No server-side processing required

## Future Enhancements
1. Store seal history in localStorage to detect true re-uploads
2. Add blockchain anchoring for seal timestamps
3. Implement seal verification API endpoint
4. Add QR code for document seals (similar to AI response seals)
5. Support for batch document sealing
6. Export seal certificate as standalone document

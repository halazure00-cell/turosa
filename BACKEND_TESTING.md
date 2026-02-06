# Backend Testing Guide

## API Endpoints Testing

### 1. Health Check Endpoint

**Endpoint:** `GET /api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T...",
  "uptime": 123.45,
  "environment": "development",
  "version": "0.1.0"
}
```

**Test Command:**
```bash
curl http://localhost:3000/api/health
```

---

### 2. OCR Endpoint

**Endpoint:** `POST /api/ocr`

**Valid Request (URL):**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Valid Request (Base64):**
```json
{
  "imageBase64": "base64_encoded_image_data"
}
```

**Test Cases:**

1. **Missing Parameters (400)**
```bash
curl -X POST http://localhost:3000/api/ocr \
  -H "Content-Type: application/json" \
  -d '{}'
```

2. **Invalid URL (400)**
```bash
curl -X POST http://localhost:3000/api/ocr \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"not-a-valid-url"}'
```

3. **File Too Large (413)**
```bash
# Test with base64 > 10MB
curl -X POST http://localhost:3000/api/ocr \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"<very_large_base64>"}'
```

4. **Success (200)**
```json
{
  "text": "Detected text...",
  "confidence": 0.95,
  "language": "ar",
  "detectionCount": 10
}
```

---

### 3. Chat AI Endpoint

**Endpoint:** `POST /api/chat`

**Valid Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Apa itu mubtada?"
    }
  ],
  "context": "Text from kitab..."
}
```

**Test Cases:**

1. **Missing Messages (400)**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
```

2. **Invalid Message Format (400)**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"invalid":"format"}]}'
```

3. **Ollama Server Unreachable (503)**
```bash
# When AI_BASE_URL is not accessible
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

4. **Success (200)**
```json
{
  "message": "Mubtada adalah...",
  "model": "llama2"
}
```

---

## Database Functions Testing

### 1. Progress Tracking

**Function:** `saveProgress(userId, chapterId)`

**Test Cases:**

```typescript
// Valid
await saveProgress('valid-uuid', 'valid-chapter-uuid')

// Invalid UUID
await saveProgress('invalid-uuid', 'chapter-uuid')
// Should return: { data: null, error: {...} }

// Invalid inputs
await saveProgress('', '')
// Should return: { data: null, error: {...} }
```

---

### 2. Get User Stats

**Function:** `getUserStats(userId)`

**Test Cases:**

```typescript
// User with no progress
await getUserStats('new-user-uuid')
// Should return: { chaptersRead: 0, chaptersCompleted: 0, ... }

// User with progress
await getUserStats('active-user-uuid')
// Should return: { chaptersRead: 5, chaptersCompleted: 3, ... }

// Completion rate calculation
// If chaptersRead = 0, completionRate should be 0 (not NaN or Infinity)
```

---

## Validation Functions Testing

### 1. Email Validation

```typescript
import { isValidEmail } from '@/lib/validation'

// Valid emails
isValidEmail('user@example.com') // true
isValidEmail('test.user@domain.co.id') // true

// Invalid emails
isValidEmail('invalid') // false
isValidEmail('@example.com') // false
isValidEmail('user@') // false
```

### 2. UUID Validation

```typescript
import { isValidUUID } from '@/lib/validation'

// Valid UUID
isValidUUID('123e4567-e89b-12d3-a456-426614174000') // true

// Invalid UUID
isValidUUID('not-a-uuid') // false
isValidUUID('12345') // false
```

### 3. String Sanitization

```typescript
import { sanitizeString } from '@/lib/validation'

// Remove HTML tags
sanitizeString('<script>alert("xss")</script>') // 'alert("xss")'

// Trim whitespace
sanitizeString('  test  ') // 'test'

// Limit length
sanitizeString('a'.repeat(20000)) // String of 10000 chars (max)
```

---

## Security Testing

### 1. Input Validation

- [ ] All UUIDs validated before database queries
- [ ] All emails validated before authentication
- [ ] All URLs validated before processing
- [ ] All strings sanitized to prevent XSS

### 2. Error Messages

- [ ] No sensitive data in production errors
- [ ] Generic messages in production mode
- [ ] Detailed messages only in development

### 3. Rate Limiting

- [ ] Request timeouts implemented (30s for OCR, 60s for chat)
- [ ] File size limits enforced (10MB for OCR)
- [ ] Message length limits enforced

---

## Performance Testing

### 1. Query Performance

```sql
-- Test getUserStats query performance
EXPLAIN ANALYZE
SELECT COUNT(*) FROM user_progress WHERE user_id = 'uuid';

-- Verify indexes are used
EXPLAIN ANALYZE
SELECT * FROM chapters WHERE book_id = 'uuid' ORDER BY order_index;
```

### 2. API Response Times

- [ ] Health check: < 50ms
- [ ] OCR with URL: < 5s
- [ ] Chat response: < 10s
- [ ] Progress save: < 100ms

---

## Integration Testing Checklist

### Authentication Flow

- [ ] Sign up with valid email/password
- [ ] Sign up with invalid email
- [ ] Sign up with short password
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong password
- [ ] Sign out

### Progress Tracking Flow

- [ ] Save progress for new chapter
- [ ] Update progress for existing chapter
- [ ] Mark chapter as completed
- [ ] Get user stats
- [ ] Get last read chapter

### OCR Flow

- [ ] Upload valid image URL
- [ ] Upload valid base64 image
- [ ] Handle invalid URL
- [ ] Handle oversized image
- [ ] Verify Tesseract.js processing
- [ ] Test Arabic text extraction

### Chat Flow

- [ ] Send message without context
- [ ] Send message with context
- [ ] Send multiple messages
- [ ] Handle invalid message format
- [ ] Handle rate limiting

---

## Error Scenarios to Test

1. **Network Errors**
   - Timeout scenarios
   - Connection refused
   - DNS resolution failures

2. **Database Errors**
   - Connection pool exhausted
   - Constraint violations
   - RLS policy violations

3. **External Service Errors**
   - Ollama server down/unreachable
   - Network timeout to Ollama
   - Model not available on Ollama server

4. **Edge Cases**
   - Empty inputs
   - Null values
   - Very large inputs
   - Special characters
   - Unicode handling

---

## Monitoring & Logging

### What to Monitor

1. **API Metrics**
   - Request count per endpoint
   - Response times
   - Error rates
   - Status code distribution

2. **Database Metrics**
   - Query performance
   - Connection pool usage
   - Transaction rates
   - Lock contention

3. **External Services**
   - Ollama server health
   - Response times
   - Model availability

### Error Logging

Errors should log:
- Timestamp
- Endpoint/function
- User ID (if available)
- Error message
- Stack trace (development only)

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Ollama server deployed and accessible
- [ ] AI model downloaded on Ollama server
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] SSL/TLS configured
- [ ] CORS configured (if needed)
- [ ] Rate limiting configured
- [ ] Health check accessible

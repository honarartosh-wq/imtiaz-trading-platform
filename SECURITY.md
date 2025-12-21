# Security Policy

## Overview

This document outlines security considerations, best practices, and guidelines for the Imtiaz Trading Platform. Security is critical for a financial trading platform, and all contributors must follow these guidelines.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please do NOT open a public issue. Instead:

1. Email security concerns to: [your-security-email@domain.com]
2. Include detailed information about the vulnerability
3. Allow up to 48 hours for initial response
4. Do not disclose publicly until we've had a chance to address it

## Security Considerations by Component

### 1. Authentication & Authorization

#### Current Implementation
- **Backend**: JWT-based authentication with access and refresh tokens
- **Frontend**: Tokens stored in localStorage (DEVELOPMENT ONLY)

#### Security Measures
- Passwords hashed using bcrypt with salt rounds
- JWT tokens signed with SECRET_KEY (minimum 32 characters)
- Access tokens expire after 30 minutes (configurable)
- Refresh tokens expire after 7 days (configurable)
- Role-based access control (Manager, Admin, Client)

#### Production Requirements
⚠️ **CRITICAL**: The current implementation uses localStorage for token storage, which is vulnerable to XSS attacks.

**MUST implement before production:**
1. **Use httpOnly Cookies** for token storage
   - Set `HttpOnly` flag to prevent JavaScript access
   - Set `Secure` flag to enforce HTTPS
   - Set `SameSite=Strict` to prevent CSRF attacks
   
2. **Implement Content Security Policy (CSP)**
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
   ```

3. **Backend Session Management**
   - Store refresh tokens in secure database
   - Implement token rotation on refresh
   - Maintain token blacklist for logout
   - Monitor for suspicious token usage patterns

### 2. Password Security

#### Requirements
- Minimum 8 characters (12+ strongly recommended)
- Must include:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- Cannot contain common words or patterns
- Cannot be the same as username/email

#### Backend Implementation
```python
# Passwords are hashed using bcrypt
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

#### Generate Secure Passwords
```bash
# For admin/system passwords:
python -c "import secrets; import string; chars = string.ascii_letters + string.digits + string.punctuation; print(''.join(secrets.choice(chars) for _ in range(16)))"
```

### 3. Environment Variables & Secrets

#### Critical Secrets
Never hardcode or commit these to version control:
- `SECRET_KEY`: JWT signing key
- `DATABASE_URL`: Database connection string
- `ADMIN_PASSWORD`: Admin account password
- `ADMIN_EMAIL`: Admin account email
- API keys and credentials

#### Best Practices
1. **Use `.env` files for development**
   - Always in `.gitignore`
   - Copy from `.env.example`
   - Never commit actual `.env` file

2. **Use secure vaults for production**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Environment variables in hosting platform

3. **Rotate secrets regularly**
   - Every 90 days minimum
   - Immediately if compromised
   - Keep audit log of rotations

4. **Generate strong secrets**
   ```bash
   # Generate SECRET_KEY:
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

### 4. Database Security

#### Connection Security
- Always use SSL/TLS for database connections
- Use connection pooling with reasonable limits:
  - `DB_POOL_SIZE`: 20 (default)
  - `DB_MAX_OVERFLOW`: 10 (default)
  - `DB_POOL_TIMEOUT`: 30 seconds
  - `DB_POOL_RECYCLE`: 3600 seconds

#### SQL Injection Prevention
- **Always use parameterized queries**
- Never concatenate user input into SQL
- Use SQLAlchemy ORM (prevents injection by default)
- Validate and sanitize all inputs

#### Data Protection
- Encrypt sensitive data at rest
- Use database-level encryption
- Regular backups with encryption
- Implement proper access controls

### 5. Frontend Security

#### XSS Prevention
⚠️ **CRITICAL VULNERABILITIES TO FIX**

1. **Input Sanitization**
   - Sanitize all user inputs before rendering
   - Use DOMPurify or similar library
   - Never use `dangerouslySetInnerHTML` with user data

2. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
   ```

3. **Output Encoding**
   - React escapes by default, but be cautious with:
     - `dangerouslySetInnerHTML`
     - Direct DOM manipulation
     - `innerHTML` usage

#### Current Issues
⚠️ **The following are for DEMO/DEVELOPMENT only and MUST be fixed:**

1. **localStorage for Sensitive Data**
   - File: `src/services/api.js`
   - Issue: Tokens in localStorage vulnerable to XSS
   - Fix: Migrate to httpOnly cookies

2. **Transaction Data in localStorage**
   - File: `src/services/transactionService.js`
   - Issue: Financial data exposed to XSS
   - Fix: Move all transaction logic to backend

3. **Client-side Validation Only**
   - Always implement server-side validation
   - Client-side is convenience, not security

### 6. API Security

#### Rate Limiting
Implement rate limiting to prevent abuse:
```python
# Recommended limits:
- Login attempts: 5 per minute per IP
- API requests: 100 per minute per user
- Registration: 3 per hour per IP
```

#### Input Validation
- Validate all inputs on backend
- Check data types, lengths, formats
- Use Pydantic models for validation
- Return generic error messages (don't leak info)

#### CORS Configuration
```python
# Only allow specific origins
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Never use "*" in production
```

#### Error Handling
- Never expose stack traces to users
- Log detailed errors server-side only
- Return generic error messages to clients
- Don't reveal system information in errors

### 7. File Upload Security

⚠️ **CRITICAL**: KYC document uploads need validation

#### Required Validations
1. **File Type Validation**
   ```python
   ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
   ALLOWED_MIME_TYPES = {
       'application/pdf',
       'image/jpeg',
       'image/png'
   }
   ```

2. **File Size Limits**
   - Maximum 10MB per file
   - Maximum total upload size per user

3. **Virus Scanning**
   - Scan all uploaded files
   - Use ClamAV or similar

4. **Storage Security**
   - Store outside web root
   - Generate random filenames
   - Don't trust user-provided filenames
   - Implement access controls

5. **Content Validation**
   - Verify file actually matches claimed type
   - Check magic bytes/file signatures
   - Re-encode images to strip metadata

### 8. Logging & Monitoring

#### What to Log
- Authentication attempts (success/failure)
- Authorization failures
- Suspicious activities
- API errors
- Database errors
- Configuration changes

#### What NOT to Log
- Passwords (even hashed)
- JWT tokens
- Credit card numbers
- Personal identification numbers
- Session IDs
- API keys

#### Monitoring
- Set up alerts for:
  - Multiple failed login attempts
  - Unusual API usage patterns
  - Large data exports
  - Configuration changes
  - Database errors

### 9. HTTPS & Transport Security

#### Production Requirements
- **MUST use HTTPS** for all traffic
- Enforce HTTPS redirects
- Use HSTS (HTTP Strict Transport Security)
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```
- Use modern TLS versions (1.2+)
- Strong cipher suites only

### 10. Dependencies & Updates

#### Dependency Management
- Regularly update dependencies
- Monitor for security advisories
- Use `npm audit` and `pip-audit`
- Pin versions in production

#### Update Schedule
- Security patches: Immediately
- Minor updates: Monthly
- Major updates: Quarterly (with testing)

## Development vs Production

### Development Mode
Current implementation is suitable for:
- Local development
- Testing
- Demo purposes
- Learning

### Production Requirements
Before deploying to production, MUST implement:

1. ✅ Remove all hardcoded credentials (COMPLETED)
2. ⚠️ Migrate to httpOnly cookies for tokens
3. ⚠️ Implement CSP headers
4. ⚠️ Move transaction logic to backend
5. ⚠️ Add file upload validation
6. ⚠️ Implement rate limiting
7. ⚠️ Set up proper monitoring
8. ⚠️ Enable HTTPS with HSTS
9. ⚠️ Use secrets management vault
10. ⚠️ Implement comprehensive logging

## Security Checklist for Deployment

Use this checklist before any production deployment:

### Backend Security
- [ ] All environment variables set securely
- [ ] DEBUG mode disabled
- [ ] SECRET_KEY is strong and unique (32+ chars)
- [ ] Database uses SSL connection
- [ ] Passwords hashed with bcrypt
- [ ] JWT expiration configured appropriately
- [ ] Rate limiting enabled
- [ ] CORS configured with specific origins
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak information
- [ ] Logging configured (excluding sensitive data)

### Frontend Security
- [ ] No hardcoded credentials
- [ ] Tokens moved to httpOnly cookies
- [ ] CSP headers configured
- [ ] XSS prevention measures in place
- [ ] Input sanitization implemented
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced
- [ ] Production build optimized

### Infrastructure Security
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Backups enabled and encrypted
- [ ] Monitoring and alerting set up
- [ ] SSL/TLS certificates valid
- [ ] DDoS protection enabled
- [ ] Secrets stored in vault

### Compliance
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy defined
- [ ] Audit logging enabled

## Security Best Practices Summary

1. **Never Trust User Input**: Validate and sanitize everything
2. **Defense in Depth**: Multiple layers of security
3. **Principle of Least Privilege**: Minimal necessary permissions
4. **Secure by Default**: Safe configuration out of the box
5. **Fail Securely**: Errors should deny access, not grant it
6. **Keep Secrets Secret**: No credentials in code or logs
7. **Regular Updates**: Stay current with security patches
8. **Monitor Everything**: Know what's happening in your system
9. **Plan for Compromise**: Have incident response plan
10. **Test Security**: Regular security audits and penetration testing

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contact

For security concerns or questions:
- Email: [security@yourdomain.com]
- Emergency: [emergency-contact]

---

**Remember**: Security is not a one-time task but an ongoing process. Regular reviews, updates, and improvements are essential.

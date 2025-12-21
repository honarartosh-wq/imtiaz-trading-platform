# Imtiaz Trading Platform

Complete multi-branch trading platform with Manager, Admin, and Client dashboards.

## Features
- Multi-role authentication
- Risk management system
- KYC/AML compliance
- Liquidity provider integration
- Branch referral system

## Setup
```bash
npm install
npm run dev
```

## Authentication
All authentication is handled through the backend API. Please ensure the backend server is running before attempting to login.

For demo credentials, contact your system administrator or refer to the backend initialization script.

## Security Notice

⚠️ **IMPORTANT**: This codebase contains development/demo implementations that are **NOT production-ready**.

### Current Status
- ✅ Hardcoded credentials removed from frontend
- ✅ Security warnings added to localStorage usage
- ⚠️ Tokens stored in localStorage (development only)
- ⚠️ Transactions in localStorage (demo only)

### Before Production Deployment
The following MUST be addressed (see [SECURITY.md](./SECURITY.md) for details):

1. **Token Storage**: Migrate from localStorage to httpOnly cookies
2. **Transaction Logic**: Move to backend API (currently localStorage)
3. **Content Security Policy**: Implement CSP headers
4. **File Upload Validation**: Add comprehensive validation for KYC documents
5. **Rate Limiting**: Implement API rate limiting
6. **HTTPS**: Enforce HTTPS with HSTS headers
7. **Secrets Management**: Use secure vault for production secrets

### Security Resources
- [SECURITY.md](./SECURITY.md) - Comprehensive security documentation
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- Backend README - Environment variable configuration

## Documentation
- [Build and Deploy Guide](./BUILD_AND_DEPLOY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Production Setup](./PRODUCTION_SETUP_GUIDE.md)
- [Quick Start](./QUICKSTART.md)

## License
[Your License Here]

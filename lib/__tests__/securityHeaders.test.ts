/**
 * Tests for security headers and HTTPS enforcement
 */

import {
  getSecurityHeaders,
  applySecurityHeaders,
  ensureHttps,
  verifyGeminiApiSecurity,
} from '../securityHeaders';

describe('Security Headers', () => {
  describe('getSecurityHeaders', () => {
    test('should return all required security headers', () => {
      const headers = getSecurityHeaders();

      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-XSS-Protection']).toBe('1; mode=block');
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });

    test('should include HTTPS enforcement in HSTS header', () => {
      const headers = getSecurityHeaders();
      expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
    });

    test('should allow Gemini API in CSP', () => {
      const headers = getSecurityHeaders();
      expect(headers['Content-Security-Policy']).toContain('generativelanguage.googleapis.com');
    });
  });

  describe('applySecurityHeaders', () => {
    test('should apply all security headers to Headers object', () => {
      const headers = new Headers();
      applySecurityHeaders(headers);

      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(headers.get('X-Frame-Options')).toBe('DENY');
      expect(headers.get('X-XSS-Protection')).toBe('1; mode=block');
      expect(headers.get('Strict-Transport-Security')).toBeDefined();
      expect(headers.get('Content-Security-Policy')).toBeDefined();
      expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('ensureHttps', () => {
    test('should accept HTTPS URLs', () => {
      expect(() => ensureHttps('https://example.com')).not.toThrow();
      expect(() => ensureHttps('https://api.example.com/endpoint')).not.toThrow();
      expect(() => ensureHttps('https://generativelanguage.googleapis.com')).not.toThrow();
    });

    test('should reject HTTP URLs', () => {
      expect(() => ensureHttps('http://example.com')).toThrow('Insecure protocol');
      expect(() => ensureHttps('http://api.example.com')).toThrow('Insecure protocol');
    });

    test('should reject other protocols', () => {
      expect(() => ensureHttps('ftp://example.com')).toThrow('Insecure protocol');
      expect(() => ensureHttps('ws://example.com')).toThrow('Insecure protocol');
    });
  });

  describe('verifyGeminiApiSecurity', () => {
    test('should verify Gemini API uses HTTPS', () => {
      // Should not throw since Gemini API uses HTTPS
      expect(() => verifyGeminiApiSecurity()).not.toThrow();
    });
  });
});

describe('CORS Configuration', () => {
  const { isSameOrigin, validateCors, applyCorsHeaders } = require('../securityHeaders');

  describe('isSameOrigin', () => {
    test('should return true for same-origin requests', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://example.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(isSameOrigin(request)).toBe(true);
    });

    test('should return true for requests without origin header', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(isSameOrigin(request)).toBe(true);
    });

    test('should return false for cross-origin requests', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://malicious.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(isSameOrigin(request)).toBe(false);
    });

    test('should handle different ports as different origins', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://example.com:3000';
            if (key === 'host') return 'example.com:8080';
            return null;
          },
        },
      } as any;

      expect(isSameOrigin(request)).toBe(false);
    });
  });

  describe('validateCors', () => {
    test('should not throw for same-origin requests', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://example.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(() => validateCors(request)).not.toThrow();
    });

    test('should not throw for requests without origin', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(() => validateCors(request)).not.toThrow();
    });

    test('should throw for cross-origin requests', () => {
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://malicious.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      expect(() => validateCors(request)).toThrow('Cross-origin requests are not allowed');
    });
  });

  describe('applyCorsHeaders', () => {
    test('should set CORS headers for same-origin requests', () => {
      const headers = new Headers();
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://example.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      applyCorsHeaders(headers, request);

      expect(headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
      expect(headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
      expect(headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    test('should deny cross-origin requests', () => {
      const headers = new Headers();
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'origin') return 'https://malicious.com';
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      applyCorsHeaders(headers, request);

      expect(headers.get('Access-Control-Allow-Origin')).toBe('null');
    });

    test('should handle requests without origin', () => {
      const headers = new Headers();
      const request = {
        headers: {
          get: (key: string) => {
            if (key === 'host') return 'example.com';
            return null;
          },
        },
      } as any;

      applyCorsHeaders(headers, request);

      // Should not set CORS headers for requests without origin
      expect(headers.get('Access-Control-Allow-Origin')).toBeNull();
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    });
  });
});

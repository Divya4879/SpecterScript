/**
 * Security headers configuration for API routes
 * Ensures secure communication and prevents common vulnerabilities
 */

import { NextRequest } from 'next/server';

export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Content-Security-Policy': string;
  'Referrer-Policy': string;
}

/**
 * Get security headers for API responses
 * Implements security best practices for web applications
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Enforce HTTPS (max-age: 1 year)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Content Security Policy
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com;",
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

/**
 * Apply security headers to a NextResponse
 */
export function applySecurityHeaders(headers: Headers): void {
  const securityHeaders = getSecurityHeaders();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
}

/**
 * Verify that a URL uses HTTPS protocol
 * Throws error if URL is not secure
 */
export function ensureHttps(url: string): void {
  const urlObj = new URL(url);
  
  if (urlObj.protocol !== 'https:') {
    throw new Error(`Insecure protocol detected: ${urlObj.protocol}. Only HTTPS is allowed.`);
  }
}

/**
 * Verify Gemini API endpoint uses HTTPS
 */
export function verifyGeminiApiSecurity(): void {
  // Gemini API base URL
  const geminiApiUrl = 'https://generativelanguage.googleapis.com';
  
  try {
    ensureHttps(geminiApiUrl);
  } catch (error) {
    throw new Error('Gemini API endpoint must use HTTPS');
  }
}

/**
 * Check if request is from same origin
 * Returns true if request is from same origin or has no origin (direct API call)
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  // If no origin header, it's likely a same-origin request or direct API call
  if (!origin) {
    return true;
  }
  
  // Extract hostname from origin
  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;
    
    // Compare with request host
    return originHost === host;
  } catch (error) {
    // Invalid origin URL
    return false;
  }
}

/**
 * Apply CORS headers for same-origin policy
 * Restricts API access to same-origin requests only
 */
export function applyCorsHeaders(headers: Headers, request: NextRequest): void {
  const origin = request.headers.get('origin');
  
  if (origin && isSameOrigin(request)) {
    // Allow same-origin requests
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  } else if (origin) {
    // Explicitly deny cross-origin requests
    headers.set('Access-Control-Allow-Origin', 'null');
  }
  
  // Additional security headers
  headers.set('X-Content-Type-Options', 'nosniff');
}

/**
 * Validate CORS and reject cross-origin requests
 * Throws error if request is from different origin
 */
export function validateCors(request: NextRequest): void {
  const origin = request.headers.get('origin');
  
  // If origin exists and is not same-origin, reject
  if (origin && !isSameOrigin(request)) {
    throw new Error('Cross-origin requests are not allowed');
  }
}

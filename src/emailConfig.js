/**
 * Email Configuration for Assessment Results Delivery
 * 
 * Supports both Netlify Environment Variables (VITE_*) and default constants.
 */

// Target recipient where test results are delivered automatically
export const RECIPIENT_EMAIL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RECIPIENT_EMAIL) ||
  'subhash@geotrixteam.com';

/**
 * PRIMARY (Recommended for Google Workspace): Google Apps Script Webhook URL
 */
export const GOOGLE_APPS_SCRIPT_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_APPS_SCRIPT_URL) ||
  'https://script.google.com/macros/s/AKfycbwjPu_JLINUIoLz1CU33aiRO2TrhKQtSbNoRoz8H-jnE_aNRiXg5lWPEXmarrYc5VMtrw/exec';

/**
 * SECONDARY / ALTERNATIVE: EmailJS Configuration (Optional)
 */
export const EMAILJS_SERVICE_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_SERVICE_ID) ||
  'service_placeholder';

export const EMAILJS_TEMPLATE_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_TEMPLATE_ID) ||
  'template_placeholder';

export const EMAILJS_PUBLIC_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_PUBLIC_KEY) ||
  'public_key_placeholder';

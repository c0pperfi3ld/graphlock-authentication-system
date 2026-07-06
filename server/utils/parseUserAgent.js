/**
 * Simple user-agent parser using regex extraction.
 * @param {string} ua - User-Agent header string
 * @returns {{ browser: string, os: string }}
 */
export function parseUA(ua) {
  if (!ua) {
    return { browser: 'Unknown', os: 'Unknown' };
  }

  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (/Edg\//i.test(ua)) {
    const match = ua.match(/Edg\/([\d.]+)/);
    browser = `Edge ${match ? match[1] : ''}`.trim();
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    const match = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    browser = `Opera ${match ? match[1] : ''}`.trim();
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    const match = ua.match(/Chrome\/([\d.]+)/);
    browser = `Chrome ${match ? match[1] : ''}`.trim();
  } else if (/Firefox\//i.test(ua)) {
    const match = ua.match(/Firefox\/([\d.]+)/);
    browser = `Firefox ${match ? match[1] : ''}`.trim();
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    const match = ua.match(/Version\/([\d.]+)/);
    browser = `Safari ${match ? match[1] : ''}`.trim();
  }

  // Detect OS
  if (/Windows NT 10/i.test(ua)) {
    os = 'Windows 10/11';
  } else if (/Windows NT 6\.3/i.test(ua)) {
    os = 'Windows 8.1';
  } else if (/Windows NT 6\.2/i.test(ua)) {
    os = 'Windows 8';
  } else if (/Windows NT 6\.1/i.test(ua)) {
    os = 'Windows 7';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
  } else if (/Mac OS X ([\d_]+)/i.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    os = `macOS ${match ? match[1].replace(/_/g, '.') : ''}`.trim();
  } else if (/Linux/i.test(ua) && /Android/i.test(ua)) {
    const match = ua.match(/Android ([\d.]+)/);
    os = `Android ${match ? match[1] : ''}`.trim();
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/);
    os = `iOS ${match ? match[1].replace(/_/g, '.') : ''}`.trim();
  }

  return { browser, os };
}

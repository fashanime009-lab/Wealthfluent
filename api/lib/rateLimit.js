const requests = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();

  const record = requests.get(ip);

  if (!record) {
    requests.set(ip, {
      count: 1,
      expires: now + windowMs,
    });
    return true;
  }

  if (now > record.expires) {
    requests.set(ip, {
      count: 1,
      expires: now + windowMs,
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;

  return true;
}
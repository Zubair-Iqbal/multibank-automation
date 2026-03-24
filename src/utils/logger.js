const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, silent: 4 };

const configured = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
const threshold = LEVELS[configured] ?? LEVELS.info;

function log(level, message, context) {
  if (LEVELS[level.toLowerCase()] < threshold) return;

  const ts = new Date().toISOString();
  const ctx = context ? '  ' + JSON.stringify(context) : '';
  process.stderr.write(`[${ts}] ${level.padEnd(5)}  ${message}${ctx}\n`);
}

const logger = {
  debug: (msg, ctx) => log('DEBUG', msg, ctx),
  info:  (msg, ctx) => log('INFO',  msg, ctx),
  warn:  (msg, ctx) => log('WARN',  msg, ctx),
  error: (msg, ctx) => log('ERROR', msg, ctx),
};

module.exports = { logger };

/**
 * Structured logger for the MultiBank automation framework.
 *
 * Levels (ascending severity): DEBUG < INFO < WARN < ERROR
 * Control output via the LOG_LEVEL environment variable:
 *   LOG_LEVEL=debug  — show everything
 *   LOG_LEVEL=info   — show INFO, WARN, ERROR  (default)
 *   LOG_LEVEL=warn   — show WARN, ERROR only
 *   LOG_LEVEL=error  — show ERROR only
 *   LOG_LEVEL=silent — suppress all output
 *
 * Each line is written to stderr so it does not pollute test reporter stdout.
 * Format: [ISO timestamp] LEVEL  message  {context?}
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, silent: 4 };

const configured = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
const threshold = LEVELS[configured] ?? LEVELS.info;

/**
 * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} level
 * @param {string} message
 * @param {object} [context]
 */
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

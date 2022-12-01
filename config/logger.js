class Logger {
    init() {
    }

    info(op_id, msg, ...params) { console.log({ op_id, msg, params }); }
    error(op_id, msg, ...params) { console.error({ op_id, msg, params }); }
    verbose(op_id, msg, ...params) { console.log({ op_id, msg, params }); }
}

const logger = new Logger();
logger.init();

module.exports = logger;
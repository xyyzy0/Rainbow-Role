const { default: chalk } = require("chalk");
const LogMessage = (Color, ...args) => console.log(Color("[" + new Date().toLocaleTimeString() + "]"), ...args);

module.exports = {
    LOG: (...args) => LogMessage(chalk.gray, ...args),
    WARN: (...args) => LogMessage(chalk.yellow, ...args),
    ERR: (...args) => LogMessage(chalk.red, ...args),
    INFO: (...args) => LogMessage(chalk.cyanBright, ...args)
}
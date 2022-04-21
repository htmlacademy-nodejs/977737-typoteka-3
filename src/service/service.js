'use strict';
const {Cli} = require(`./cli`);
const {ExitCode, DEFAULT_COMMAND, USER_ARGV_INDEX} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userCommand === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.error);
}

Cli[userCommand].run(userArguments.slice(1));

const chalk = require("chalk");
const log = console.log;




module.exports = {
	handleDbConnectionError(val){
		log(` DB_CONNECTION_ERROR:: ${chalk.red(val.message)}`);
	}
}
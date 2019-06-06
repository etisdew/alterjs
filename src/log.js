function Log(message, color) {
	const colors = {
		clear:   '\x1b[0m',
		black:   '\x1b[30m',
		red:     '\x1b[31m',
		green: 	 '\x1b[32m',
		yellow:  '\x1b[33m',
		blue:    '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: 	 '\x1b[36m',
		white:	 '\x1b[37m'
	};

	const arg_arr = Array.from(arguments).map((index) => {
			if (typeof index === 'object') index = (
				`\n{${
				Object.entries(index).map((sub_index) => {
					return '\n\t' + sub_index[0] + ': '+ sub_index[1]
					})
				}\n}\n`
			);
		return index;
	});

	const possible_color = arg_arr.pop();
	console.log((colors[possible_color]||possible_color), ...arg_arr, colors['clear']);
};

module.exports = Log;

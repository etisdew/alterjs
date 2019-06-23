const fs = require('fs');
const path = require('path');

const Log = require('./log.js');

class Monolith {
	constructor(
		props = {
			filepath: null,
			title: null,
			head: null,
			style: null,
			body: null,
			script: null
		}, 
		init = false, 
		withFS = false) {
		let {
			filepath = __dirname,
			title = '',
			head = '',
			style = '',
			body = '',
			script = ''
		} = props;
		this.filepath = filepath;
		this.title = title;
		this.head = head;
		this.style = style;
		this.body = body;
		this.script = script;
		
		if (withFS) {
			this.check = (filepath) => {
				try { fs.accessSync(filepath, fs.F_OK); }
				// allow a failure
				catch (e) { return false; };
				return true;
			};
			this.write = (overridePath = null) => {
				let outputPath = (typeof overridePath === 'string' ? overridePath : path.join(`${this.filepath}`, 'src', 'dist', `${this.title}.html`));
				if (typeof this.payload === 'string') { fs.writeFileSync(outputPath, this.payload); Log(`Exported ${outputPath}`, 'cyan'); }
				else { Log('Please invoke init before attempting to write to file.', 'red'); };
			};
			this.read = (filepath, key, append = true, refresh = false, encoding = 'utf8') => {
				if (this.check(filepath)) {
					let data = fs.readFileSync(filepath, encoding);
					
					if (!key) { return data; }
					else { this.reassign({ [key]: data }, append, refresh); };

					Log(`Imported ${filepath}`, 'cyan');
				} else { Log(`Unable to read ${filepath}`, 'red'); };
			};
		}
		if (init) this.initToHTML();
	};

	initToHTML() {
		this.payload = (		
`<!DOCTYPE html>
<html>
	<head>
		<title>${this.title}</title>${
			!!this.head ? `\n\t\t${this.head.trim()}`
				: ''}${
			!!this.style ? `\n\t\t<style>\n${this.style.trim()}\n\t\t</style>`
				: ''}
	</head>
	<body>${!!this.body ? `\n\t\t${this.body.trim()}`
				: ''}${
			!!this.script ? `\n\t\t<script>\n${this.script.trim()}\n\t\t</script>` : ''}
	</body>
</html>
`		);
	};

	reassign(
		props = {
			filepath: null,
			title: null,
			head: null,
			style: null,
			body: null,
			script: null,
		}, append = false,
		initToHTML = true) {
		const ownedProps = Object.keys(props);
		for (let ownedKey = 0; ownedKey < ownedProps.length; ownedKey++) {
			let accessKey = ownedProps[ownedKey];
			let flag = (typeof props[accessKey] === 'string');
			if (append) { this[accessKey] += (flag ? '\n' + props[accessKey] : ''); }
			else { this[accessKey] = (flag ? props[accessKey] : this[accessKey]); };
		}
		if (initToHTML) this.initToHTML();
	}
}

module.exports = Monolith;

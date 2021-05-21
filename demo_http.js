const http = require("http");
const fs = require('fs').promises;
const { execSync } = require('child_process');

const { parse } = require('node-html-parser');

const host = '0.0.0.0';
const port = 8083;


function parseOutput(input)
{
	console.log('parsing');
	const root = parse(input);
	const page = root.querySelector('article');
	//fs.writeFileSync(__dirname + "/index.html", page.toString() + "</body></html>", err => {
	//	if(err) {
	//		console.log(err);
	//		return;
	//	}
	//});
	//console.log(page.toString());
	
console.log('parsed ' + page.toString());

	return page;
}

const requestListener = function(req, res) {
	fs.readFile(__dirname + "/index.html")
	.then(contents => {
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
	console.log('starting');	
		var index_root = parse(contents);
console.log(		index_root.toString());
		var body = index_root.querySelector('body');

		var resume = execSync('curl https://github.com/anthonymesa/resume/blob/main/README.md', (error, stdout, stderr) => {
				if(error) {
							console.error('exec error: ${error}');
							return;
						}
			console.log('appending child');
							console.log('appended child');
							console.error('stderr: ${stderr}');
				const article = parseOutput(stdout);
			return article;
		});

		body.appendChild(resume);


		res.end(index_root.toString());
	})
	.catch(err => {
		res.writeHead(500);
		res.end(err);
		return;
	});
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log('server is running');
});

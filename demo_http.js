
const http = require("http");
const fs = require('fs').promises;
const { execSync } = require('child_process');

const { parse } = require('node-html-parser');

const host = '0.0.0.0';
const port = 8083;

function getArticle(cb){
    
    console.log("getting article");
    
    var command = 'curl -s https://github.com/anthonymesa/resume/blob/main/README.md';
    
    console.log("running exec");
    
	var stdout = execSync(command);
	
    const root = parse(stdout);
    const page = root.querySelector('article');
		
	cb(page);
}

const requestListener = function(req, res) 
{
	fs.readFile(__dirname + "/index.html")
	.then(contents => {
	    
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		
	    console.log('starting');
	    
		var index_root = parse(contents);
		
        console.log("index root parsed");
        
		var body = index_root.querySelector('#resume');

        console.log("body parsed");

        getArticle((article) => {
	    	body.appendChild(article);
	     	res.end(index_root.toString());
        });
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

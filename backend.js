// node backend for whatthefood

var http = require('http');
http.createServer(
    function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'
			   });
	
	if (req.method == 'POST') {
	    req.on('data', function(chunk) {
		       res.end(chunk);
		   });	    
	} else {
	    res.end('hello from the whatthefood backend');
	}


    }).listen(8125, "127.0.0.1");

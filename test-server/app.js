/* jshint node:true */
'use strict';
//../dist/options.html をindexにして静的サーバを起動させる

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    port = process.argv[2] || 3333;


http.createServer(function(request, response) {

    var Response = {
        '200': function(file/*, filename*/) {
            //var extname = path.extname(filename);
            var header = {
                'Access-Control-Allow-Origin':'*',
                'Pragma': 'no-cache',
                'Cache-Control' : 'no-cache'
            };

            response.writeHead(200, header);
            response.write(file, 'binary');
            response.end();
        },
        '404':function(){
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();

        },
        '500':function(err){
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write(err + '\n');
            response.end();

        }
    };

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), 'dist', uri);
        //filename = path.join('dist/', uri);

    if (path.normalize(decodeURI(uri)) !== decodeURI(uri)) {
        response.statusCode = 403;
        response.end();
        return;
    }
    fs.exists(filename, function(exists){
        console.log(filename+' '+exists);
        if (!exists) { Response['404'](); return ; }
        if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

        fs.readFile(filename, 'binary', function(err, file){
            if (err) {
                Response['500'](err);
                return;
            }
            Response['200'](file, filename);
        });
    });


}).listen(parseInt(port, 10));

console.log('Server running at http://localhost:' + port );

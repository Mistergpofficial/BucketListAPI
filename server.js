const http = require('http');
const app = require('./app');
const port = process.env.PORT || 6000;
const server = http.createServer(app);
server.listen(port);



//server.listen(config.port, () => console.log(`Server started at port: ${config.port}`))
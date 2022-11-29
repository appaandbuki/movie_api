//imports the url module
let url = require('url');

//imports the http module
let http = require('http');

//createServer is an http function so http module needs to be imported (above)

http.createServer ((request, response) => {
    //new variable addr has been assinged the function request.url.
    // request.url allows you to get the URL from the request
    let addr = request.url,
    //the url.parse function is being used on the new addr variable. 
    //the results are sent to the a new variable, q. 
    q= url.parse(addr,true),
    //new variable filePath is set to an empty string. 
    //This will be where we store the path of the file (now it just acts as an empty container)
    filePath = '';

    //EXPLANATION OF IF/ELSE BELOW: this checks whether the pathname of q (the URL) includes the word "documentation".
    //If it does, it pieces together __dirname and "/documentation", adding them as a complete path name to the currently empty filePath variable
    //If it does not, it returns the "index.html" instead, given that it exists (the user is returned to the homepage)

    //remeber q holds the parsed URL. pathname is the part of the URL that comes after the first "/"
    if (q.pathname.includes('documentation')){
        //__dirname is a module specific variable that provides the path to the current directory. This just ensures that the file path is complete and accurate
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    //we have fetched and parsed the URL. Now we need to brng in fs (file system) to grab the appropriate file from server

    let fs = require('fs');

    fs.readFile(filePath, (err,data) => {
        if(err) {
            throw err;
        }
    });

    //all incoming requests will be logged in the "log.txt" file using the appendFile() method of the fs module
    //the appendFile() method takes three arguements (the file name in which you want to append your new info, the new info to be appended, and an error handling function)
    // note... new Date () function grabs current time. You can use \n within a string to create a line break in that string
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date () + '\n\n', (err) => {
        if (err) {
            console.log (err);
        } else {
            console.log ('Added to log.');
        }
    });
  //listens for a response on port 8080
}).listen(8080);

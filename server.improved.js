const { time } = require('console')

const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

var index = 0

var appdata = [
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if(request.url === '/api') {
    getData( request, response);
  }else{
    sendFile( response, filename )
  }
}

const getData = function( request, response ) {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(appdata));
}

const handlePost = function( request, response ) {
  let dataString = ''
  index = index + 1

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )

    var name = JSON.parse( dataString )

    if(name.includes("(Delete)"))
    {
      var data = name.substring(8,name.length)
      var temp = []
      for(let i = 0; i < appdata.length; i++)
      {
          if(appdata[i].Name === data)
          {
          }
          else
          {
            console.log(appdata[0].name)
            temp.push(appdata[i])
          }
      }
      appdata = temp
    }
    else
    {
      var numChars = name.length
      var timestamp = Math.floor(Date.now() / 1000)
      console.log(name)
      console.log(numChars)
      console.log(timestamp)
      appdata.push({ 'index': index, 'Name': name, 'Characters': numChars, 'Timestamp': timestamp })
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )

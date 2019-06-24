const http = require('http')
const port = 3000
const server = http.createServer()

const messages = [
  {'id': 1, 'user': 'Jerry Garcia', 'message': 'Aiko! Aiko!'},
  {'id': 2, 'user': 'Gary Garcia', 'message': 'Hey Now!'},
  {'id': 3, 'user': 'Barry Garcia', 'message': 'OoOo'}
]

getAllMessages = (response) => {
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json')
  response.write(JSON.stringify(messages))
  response.end()
}

addMessage = (newMessage, response) => {
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json')
  response.write(JSON.stringify(newMessage))
  response.end()
}

server.on('request', (request,response) => {
  if(request.method === 'GET') {
    getAllMessages(response)
  } else if (request.method === 'POST') {
    let newMessage
    request.on('data', (data) => {
      newMessage = {
        id: Date.now(),
        ...JSON.parse(data)
      }
    })
    request.on('end', () => {
      addMessage(newMessage, response)
    })
  }
})

server.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`)
})


const express = require('express')
const app = require('express')()
const { graphqlHTTP } = require('express-graphql')
const http = require('http').createServer(app)
const path = require('path')
const port = process.env.PORT || 5000
const api = require('./server/api')
const schema = require('./server/schema')
const cors = require('cors')
app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')))

var root = {
    pretendRecipe: () => {
        return {...api.pretendRecipe()}
    }
};

if (process.env.NODE_ENV === 'production') {  
    app.use(express.static(path.join(__dirname, 'client/build')))  
    app.get('*', (req, res) => { res.sendFile(path.join(__dirname = 'client/build/index.html')) })
}
else {
    app.get('*', (req, res) => { res.sendFile(path.join(__dirname+'/client/public/index.html')) })
}

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
}))

http.listen(port, () => {
    console.log(`Running a GraphQL API server at localhost:${port}/graphql`)
})
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Things needed for GraphQL
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/index.js');
const authModel = require('./models/auth.js'); // For authentication

// Imports for sockets
const socketTicketSetup = require('./sockets/index.js');
const fetchTrainPositions = require('./models/trains.js');

const port = process.env.PORT || 1337;
const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

// For logging, uses morgan when not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.disable('x-powered-by');

// Middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Sockets
const io = require("socket.io")(httpServer, {
    cors: {
        origins: [
            "http://localhost:5173",
            "https://www.student.bth.se/~elmo22/train",
            "https://www.student.bth.se/~poak22/train"
        ],
        methods: ["GET", "POST"]
    }
});

// Sockets for tickets
socketTicketSetup(io);

// GraphQL
const visual = true;

app.use('/graphql', authModel.checkToken); // authentication middleware
app.all('/graphql', graphqlHTTP((req) => ({ // Route
    schema: schema,
    graphiql: visual,
    context: { req } // Needed in mutation for checking if authenticated
})));

// Routes
app.get('/', (req, res) => {
    res.json({
        data: 'This is the API for the course jsramverk, by students poak22 and elmo22'
    });
});

// Start server
httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Used for moving trains
fetchTrainPositions(io);

// For 404-errors when accessing a route that doesn't exist
app.use((req, res, next) => {
    const err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Export httpServer so it can be used for testing
module.exports = httpServer;

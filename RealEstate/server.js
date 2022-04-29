const express = require('express')
const cors = require('cors')
const app = express()

// ********** MIDDLEWARE **********
app.use(cors())

// ********** ROUTE CONSTANTS **********

// ********** SERVER ENTRY **********
const PORT = proccess.enc.PORT || 5000
app.listen(PORT, () => {
    console.log('Server started on port: ', PORT)
})
import express from "express"
import cors from "cors"

const app = express();
app.use( cors() );
app.use( express.json() )
let vlogs = [];

app.get( "/vlogs", ( req, res ) => {
    res.json( {
        vlogs: vlogs,
    } )
} )
app.post( "/write", ( req, res ) => {
    const vlog = req.body.text
    vlogs.push( vlog )
    res.json( {
        success: true,
    } )
} )

app.listen( 3000, () => {
    console.log( "connection established on port 3000" )
} )
import express from "express"
import cors from "cors"

const app = express();
let x = 0;

app.use( express.json() );
app.use( cors() );
const count = ( req, res, next ) => {
    x++;
    next();
}
const health = ( req, res, next ) => {
    const method = req.method;
    const url = req.originalUrl;
    const time = new Date().toISOString()
    console.log( method + "," + url + "," + time )
    next();
}

// app.use( count );
app.get( "/add", health, count, function ( req, res ) {
    const a = parseInt( req.query.a )
    const b = parseInt( req.query.b )

    res.json( {
        ans: a + b,
    } )
} )

app.get( "/sub/:a/:b", health, count, function ( req, res ) {
    const a = parseInt( req.params.a )
    const b = parseInt( req.params.b )

    res.json( {
        ans: a - b,
    } )
} )

app.post( "/mul", health, count, function ( req, res ) {

    const a = parseInt( req.body.a )
    const b = parseInt( req.body.b )

    res.json( {
        ans: a * b,
    } )
} )

app.get( "/devide", health, count, function ( req, res ) {
    const a = parseInt( req.query.a )
    const b = parseInt( req.query.b )

    res.json( {
        ans: a / b,
    } )
} )
app.get( "/count", health, count, ( req, res ) => {
    res.json( {
        count: x,
    } )
} )

app.listen( 3000, () => {
    console.log( "server is connected." )
} )
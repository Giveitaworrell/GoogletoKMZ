const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const { url } = require('inspector')

const app = express()
const port = process.env.PORT || 8000

// paths for Express Config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Hbs engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Phase II site plans',
        name: 'Chris Worrell'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Chris Worrell',
        email: 'giveitaworrell@gmail.com',
        age: 27
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Chris Worrell',
        email: 'giveitaworrell@gmail.com'
    })
})



app.get('/location', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {url, Lat, Long, Location } = {}) => {
        if (error) {
            return res.send({ error })
        } 
            res.send({
                url: url,
                Lat: Lat,
                Long: Long,
                Location,
                address: req.query.address                
            })
        })
    
})
app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Chris Worrell',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Chris Worrell',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log( 'Server is up on port ' + port + '.')
})
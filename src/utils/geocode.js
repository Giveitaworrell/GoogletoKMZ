const request = require ('request')
const geocode = (address, callback) => {
    const MapBoxKey = 'access_token=pk.eyJ1IjoiZ2l2ZWl0YXdvcnJlbGwiLCJhIjoiY2tuMXhzaXc2MTJidjJubG5rYTdyM2NpbCJ9.BSkHzHunVD_CRPMIEzKqHQ'
    const Limit = '&limit=' + 1
    const MapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?' + MapBoxKey + Limit

    request({ url: MapBoxUrl, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        }   else if (body.features.length === 0) {
            callback('Unable to find location, try another search', undefined)
        }   else {
            callback(undefined, {
               url: MapBoxUrl,
               Lat: body.features[0].center[1],
               Long: body.features[0].center[0],
               Location: body.features[0].place_name
            })
        }
    })

}


module.exports = geocode
var Latitude = 39.574175814665494
var Longitude = -76.36929201813889
var map = null
var BelAir = { lat: Latitude, lng: Longitude }


function initMap() {  
  
    map = new google.maps.Map(document.getElementById("map"), {
      center: BelAir,
      zoom: 18,
      mapTypeId: "satellite",
      rotateControl: false,
      tilt: 0,
      streetViewControl: false,
      gestureHandling: "greedy",
    });
};

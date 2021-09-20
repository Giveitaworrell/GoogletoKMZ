console.log("initMap.JS")

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
}

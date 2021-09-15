console.log('Client side javascript is loaded!')
const addressForm = document.querySelector('form')
const search = document.querySelector('input')
var Latitude = 39.574175814665494
var Longitude = -76.36929201813889
var map = null
//test


addressForm.addEventListener('submit', (event) => {
  event.preventDefault()
  var location = search.value
    fetch('/location?address=' + location).then((response) =>  {
    response.json().then((data) => {
        if (data.error) {
            console.log(data.error)
        } else {
            map.setCenter({lat: data.Lat, lng: data.Long})
            map.setTilt(0)
            map.setZoom(18)
            new google.maps.Marker({position: {lat: data.Lat, lng: data.Long}, map: map})
        }
    })
  })
})

var BelAir = { lat: Latitude, lng: Longitude }
var drawingManager = null
var selectedShape;
var Markers = []
var Lines = []
var Polygons = []
function LineType() {
  var lineColor = document.getElementById("lineColor").value
  if (lineColor == "#0000FF") {
    return 'Water Line'    
  } else if (lineColor == "#FFFF00") {
    return 'Electrical Line'
  } else if (lineColor == "#00FF7F") {
    return 'Sewer Line'
  }
};
function download(filename, textInput) {
  var element = document.createElement('a');
  element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(textInput));
  element.setAttribute('download', filename);
  document.body.appendChild(element);
  element.click();
  //document.body.removeChild(element);
};
function clearSelection () {
  if (selectedShape) {
      if (selectedShape.type !== 'marker') {
          selectedShape.setEditable(false);
      }
      
      selectedShape = null;
  }
}
function setSelection (shape) {
  if (shape.type !== 'marker') {
      clearSelection();
      shape.setEditable(true);
  }
  selectedShape = shape;
}
function deleteSelectedShape () {
  if (selectedShape) {
      selectedShape.setMap(null);
      console.log (selectedShape)
      if (selectedShape.type === 'marker') {
        Markers.splice(find(selectedShape), 1);
        console.log ('Marker deleted')
      };
      if (selectedShape.type === 'polyline') {
        Lines =  Lines.filter((line) => {
          return line.line !== selectedShape;
      });
        console.log ('Polyline deleted')
        
      };
      if (selectedShape.type === 'polygon') {
        
        Polygons = Polygons.filter((polyline) => {
          return  polyline !== selectedShape
        });
        console.log ('Polygon deleted')
      };
  }
}
function selectColor () {
  var color = document.getElementById('lineColor').value;
  // Retrieves the current options from the drawing manager and replaces the
  // stroke or fill color as appropriate.
  var polylineOptions = drawingManager.get('polylineOptions');
  polylineOptions.strokeColor = color;
  drawingManager.set('polylineOptions', polylineOptions);
};

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
    var TriangleOffset = new google.maps.Point(0.25,0);

    const marker = new google.maps.Marker({
      position: BelAir,
      map: map,
    });
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
        ],
      },
      markerOptions: {
        icon: ({
          url:"http://maps.google.com/mapfiles/dir_0.png",
          anchor: TriangleOffset,
          origin: TriangleOffset,
        }),
        offset: "100%",
        draggable: true,
      },
      polylineOptions: {
        strokeColor: document.getElementById("lineColor").value,
        editable: true,
        draggable: true
      
      },
      polygonOptions: {
        strokeColor: "red",
        draggable: true
      },
    });

    drawingManager.setMap(map);


    google.maps.event.addDomListener(drawingManager, 'markercomplete', function(marker) {
            Markers.push(marker);         
          });

    google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function(line) {
            Lines.push({line : line, type : LineType(), color: document.getElementById('lineColor').value});
        });
    google.maps.event.addDomListener(drawingManager, 'polygoncomplete', function(polygon) {
            Polygons.push(polygon)
          });

        document.getElementById("test").addEventListener("click", function() {
            kmlstring = "";
            kmlstring += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
            kmlstring += "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n";
            kmlstring += "<Document>\n";
            kmlstring += "<name>Beacon Sampling Plan</name>\n";
            kmlstring += "<description>Use this KML file to help describe your Beacon sampling plan!</description>\n";
            kmlstring += "<Style id=\"#0000FF\">\n";  
            kmlstring += "  <LineStyle>\n";
            kmlstring += "    <color>ffff0000</color>\n";
            kmlstring += "  </LineStyle>\n";
            kmlstring += "</Style>\n";
            kmlstring += "<Style id=\"#FFFF00\">\n";  
            kmlstring += "  <LineStyle>\n";
            kmlstring += "    <color>ff00ffff</color>\n";
            kmlstring += "  </LineStyle>\n";
            kmlstring += "</Style>\n";
            kmlstring += "<Style id=\"#00FF7F\">\n";  
            kmlstring += "  <LineStyle>\n";
            kmlstring += "    <color>ff7fff00</color>\n";
            kmlstring += "  </LineStyle>\n";
            kmlstring += "</Style>\n";
            kmlstring += "<Style id=\"BeaconLocationIcon\">\n";  
            kmlstring += "  <IconStyle>\n";
            kmlstring += "    <Icon>\n";
            kmlstring += "      <href>http://maps.google.com/mapfiles/dir_0.png</href>\n";
            kmlstring += "    </Icon>\n";            
            kmlstring += "  </IconStyle>\n";
            kmlstring += "</Style>\n";      
              for(var i = 0; i < Markers.length; i++) {
                kmlstring += "  <Placemark>\n";
                kmlstring += "    <name>PSG-" + (i+1) + "</name>\n";
                kmlstring += "    <styleUrl>#BeaconLocationIcon</styleUrl>\n";
                kmlstring += "    <Point>\n";
                kmlstring += "      <coordinates>" + Markers[i].getPosition().lng() + ", " + Markers[i].getPosition().lat() + "</coordinates>\n";
                kmlstring += "    </Point>\n";
                kmlstring += "  </Placemark>\n";                
            };
              for( var i = 0; i < Lines.length; i++) {
                path = Lines[i].line.getPath();
                kmlstring += "  <Placemark>\n";
                kmlstring += "    <name>" + Lines[i].type + "</name>\n";
                kmlstring += "    <styleUrl>#" + Lines[i].color + "</styleUrl>\n";
                kmlstring += "    <LineString>\n";
                kmlstring += "      <coordinates>\n";
                  for(var j = 0; j < path.length; j++) {
                    kmlstring +="       " + path.getAt(j).lng() + "," + path.getAt(j).lat() + "\n"; 
                };
                kmlstring += "      </coordinates>\n";
                kmlstring += "    </LineString>\n";
                kmlstring += "  </Placemark>\n";
            };
              for( var i = 0; i < Polygons.length; i++) {
                polygonPath = Polygons[i].getPath();
                kmlstring += "  <Placemark>\n";
                kmlstring += "    <name>Site Boundary</name>\n";
                // kmlstring += "    <styleUrl>#" + Lines[i].color + "</styleUrl>\n";
                kmlstring += "    <Polygon>\n";
                kmlstring += "      <outerBoundaryIs>\n";
                kmlstring += "        <LinearRing>\n";
                kmlstring += "          <coordinates>\n";
                  for(var j = 0; j < polygonPath.length; j++) {
                    kmlstring +="       " + polygonPath.getAt(j).lng() + "," + polygonPath.getAt(j).lat() + "\n"; 
                };
                kmlstring +="       " + polygonPath.getAt(0).lng() + "," + polygonPath.getAt(0).lat() + "\n"; 
                kmlstring += "          </coordinates>\n";
                kmlstring += "        </LinearRing>\n";
                kmlstring += "      </outerBoundaryIs>\n";
                kmlstring += "    </Polygon>\n";
                kmlstring += "  </Placemark>\n"
              };
            kmlstring += "</Document>\n";
            kmlstring += "</kml>\n";
      document.getElementById("action").value = kmlstring;

      document.getElementById("export")
            .addEventListener("click", function () {
                  var text = kmlstring;
                  var filename = "Sample Plan.kml";
                  download(filename, text);
            }, false);
        });
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
          var newShape = e.overlay;
          
          newShape.type = e.type;
          
          if (e.type !== google.maps.drawing.OverlayType.MARKER) {
              // Switch back to non-drawing mode after drawing a shape.
              drawingManager.setDrawingMode(null);

              // Add an event listener that selects the newly-drawn shape when the user
              // mouses down on it.
              google.maps.event.addListener(newShape, 'click', function (e) {
                  if (e.vertex !== undefined) {
                      if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                          var path = newShape.getPaths().getAt(e.path);
                          path.removeAt(e.vertex);
                          if (path.length < 3) {
                              newShape.setMap(null);
                          }
                      }
                      if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
                          var path = newShape.getPath();
                          path.removeAt(e.vertex);
                          if (path.length < 2) {
                              newShape.setMap(null);
                          }
                      }
                  }
                  setSelection(newShape);
              });
              setSelection(newShape);
          }
          else {
              google.maps.event.addListener(newShape, 'click', function (e) {
                  setSelection(newShape);
              });
              setSelection(newShape);
          }
      });

                google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
                google.maps.event.addListener(map, 'click', clearSelection);
                google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
}

google.maps.event.addDomListener(window, 'load', initMap)
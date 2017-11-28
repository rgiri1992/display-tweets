
function initAutocomplete() {

  // Lets render the Map with Kathmandu first
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 27.71, lng: 85.32},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    // Every time Place is changed, lets fetch tweet from Backend
    if (places.length > 0) {
      fetch_tweets($(input).val(), places[0].geometry.location.lat(), places[0].geometry.location.lng(), map);
    }


    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    // Render Auto complete options
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  });


  // This is a function to fetch tweets from backend API
  function fetch_tweets (word, lat, lng, map) {
    $.get({
      url: '/fetch_tweets',
      data: {
        word: word,
        lat: lat,
        lng: lng
      },
      success: function (response) {
        // Set tweet markers
        setMarkers(response, map);
        
        // Re-fetch tweets history
        fetch_search_history();
      }
    });
  }


  // This function sets marker as user's profile pic and Tweet Info window in the map
  function setMarkers(data, map) {
    var shape = {
      coords: [48, 48],
      type: 'poly'
    };
    for (var i = 0; i < data.length; i++) {
      var t = data[i];
      var marker = new google.maps.Marker({
        position: {lat: t.coordinates.coordinates[0], lng: t.coordinates.coordinates[1]},
        map: map,
        icon: {
              url: t.profile_image_url,
              size: new google.maps.Size(48, 48),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(0, 32)
            },
        title: t.username,
        contentString: t.tweet,
        zIndex: 5
      });


      var infowindow = new google.maps.InfoWindow({});

      marker.addListener('click', function() {
             infowindow.setContent(this.contentString);
             infowindow.open(map, this);
       });
    }
  }
}


//  Let's get search history
function fetch_search_history () {
  $.get('/fetch_search_history', function(data) {
    var search_history = data;
    var history_dom = $('#search-history');

    // reset history_dom
    history_dom.html('');

    data.forEach(function (v, i) {
      history_dom.append($('<li class="list-group-item tweet-history-list" data-word="' + v.word + '">' + v.word + '</li>'));
    });
  });

   $(document).on('click', '.tweet-history-list', function () {
    var input_box = $('#pac-input');
    input_box.val($(this).data('word'));
    google.maps.event.trigger(input_box.get(0), 'focus');
    google.maps.event.trigger(input_box.get(0), "keydown", {
       keyCode: 13
    });
  });
}

fetch_search_history();
    //Display a Map
    mapboxgl.accessToken = mapToken;
    
    const map = new mapboxgl.Map({
        container: "map", //container ID
        //choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: listing.geometry.coordinates, //starting position [lng, lat]
        zoom: 9, //starting zoom
    });

    //console.log(coordinates);
    //add(show) Marker on exact listing location from coordinates
    const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)  // Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)) //show popup on markup when click on markup
    .addTo(map);
// Importing JavaScript
//
// You have two choices for including Bootstrap's JS files—the whole thing,
// or just the bits that you need.


// Option 1
//
// Import Bootstrap's bundle (all of Bootstrap's JS + Popper.js dependency)

import "./lib/bootstrap.bundle.min.js";


// Option 2
//
// Import just what we need

// If you're importing tooltips or popovers, be sure to include our Popper.js dependency
// import "../../node_modules/popper.js/dist/popper.min.js";

// import "bootstrap/js/dist/util.js";
// import "bootstrap/js/dist/modal.js";

function geoFindMe(){

  if (!navigator.geolocation){
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "&localityLanguage=en")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
      });
  };

  function error() {
    var latitude  = 46.94809;
    var longitude = 7.44744;
    fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "&localityLanguage=en")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
      });
  };

  navigator.geolocation.getCurrentPosition(success, error);
}
geoFindMe();


document.getElementById("searchInput")
  .addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("searchButton").click();
    }
  });

document.getElementById("searchButton").onclick = function (event) {
  var value = document.getElementById("searchInput").value;
  window.location.href = "search?q=" + value;
}

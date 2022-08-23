// Importing JavaScript
//
// You have two choices for including Bootstrap's JS files—the whole thing,
// or just the bits that you need.


// Option 1
//
// Import Bootstrap's bundle (all of Bootstrap's JS + Popper.js dependency)

import "./lib/bootstrap.bundle.min.js";
import {addFeatureToggle, getFeatureToggles, resetFeatureToggles} from "./util.js";


// Option 2
//
// Import just what we need

// If you're importing tooltips or popovers, be sure to include our Popper.js dependency
// import "../../node_modules/popper.js/dist/popper.min.js";

// import "bootstrap/js/dist/util.js";
// import "bootstrap/js/dist/modal.js";

const params = new URLSearchParams((window.location).search);
const paramToggles = params.get('toggles') ?? undefined;

if (paramToggles) {
  if (paramToggles === 'reset') {
    resetFeatureToggles();
  } else {
    paramToggles.split(',').forEach(toggle => {
      addFeatureToggle(toggle);
    });
  }
}

const activeToggles = Object.keys(getFeatureToggles());

if (activeToggles.length > 0) {
  console.log('Active Feature Toggles: ' + activeToggles.join(', '));
}

document.getElementById("searchInput")
  .addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("searchButton").click();
    }
  });

document.getElementById("searchButton").onclick = function (event) {
  var valueSearchInput = document.getElementById("searchInput").value.trim();
  let valueKantonDropdown = document.getElementById("inputKanton").value.trim();
  window.location.href = "search?q=" + valueSearchInput + "&kanton=" + valueKantonDropdown;
}

import {badiOverviewInformation, getSearchResult, update_list} from "./search.util.js";
import {getFavoriteBadis} from "./util.js";

function getPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

async function getCurrentCity() {
  let city = 'Bern';

  if (!navigator.geolocation) {
    return city;
  }
  // Bern
  let coords = {
    latitude: 46.94809,
    longitude: 7.44744
  }

  try {
    const pos = await getPosition();
    coords = pos.coords;
  } catch (e) {
    console.log(`Error ${e.code}: ${e.message}`);
    // return city;
  }

  const response = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + coords.latitude + "&longitude=" + coords.longitude + "&localityLanguage=de");
  const data = await response.json();

  if (data.city) {
    city = data.city;
  } else if (data.locality) {
    city = data.locality;
  }

  return city;
}

const favoriteBadis = getFavoriteBadis();
if (favoriteBadis.length > 0) {
  update_list(favoriteBadis, '#favoritenListe');
  $('#favoritenInfo').remove();
}

const city = await getCurrentCity();
const searchResult = await getSearchResult(city);
const badiInfos = await badiOverviewInformation(searchResult);
update_list(badiInfos);

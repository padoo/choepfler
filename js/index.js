import {badiOverviewInformation, getSearchResult, update_list} from "./search.util.js";

function getPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

async function getCurrentCity() {
  if (!navigator.geolocation) {
    return 'Bern';
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
    // return 'Bern';
  }

  const response = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + coords.latitude + "&longitude=" + coords.longitude + "&localityLanguage=de");
  const data = await response.json();

  return data.city;
}

const city = await getCurrentCity();
const searchResult = await getSearchResult(city);
const badiInfos = await badiOverviewInformation(searchResult);
update_list(badiInfos);

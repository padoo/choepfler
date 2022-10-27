import {
  badiOverviewInformation,
  badiOverviewInformationForKanton,
  getSearchResult,
  update_list,
} from "./search.util.js";
import {getFavoriteBadis} from "./util.js";
$("#container").toggle()
function getPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

async function getCurrentLocationInfo(city, kanton) {
  if (city && kanton) {
    return {city, kanton};
  }

  city = 'Bern';
  kanton = 'BE';

  if (!navigator.geolocation) {
    return {city, kanton};
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

  kanton = data.principalSubdivisionCode.substring(3);
  return {city, kanton};
}


const favoriteBadis = getFavoriteBadis();
if (favoriteBadis.length > 0) {
  update_list(favoriteBadis, '#favoritenListe');
  $('#favoritenInfo').remove();
}

//add custom location info with url: index.html?city=Spiez&kanton=BE
const params = new URLSearchParams((window.location).search);
const city = params.get('city') ? params.get('city') : undefined;
const kanton = params.get('kanton') ? params.get('kanton') : undefined;


const locationInfo = await getCurrentLocationInfo(city, kanton);
const searchResultCity = await getSearchResult(locationInfo.city);
let badiInfosCity = await badiOverviewInformation(searchResultCity);
const badiInfosKanton = await badiOverviewInformationForKanton(locationInfo.kanton);
$("#container").toggle()
$("#spinnerLoading").toggle()

badiInfosCity.forEach(b1 => {
  const foundIndex = badiInfosKanton.findIndex(b2 => b1.id === b2.id);
  if (foundIndex) {
    badiInfosKanton.splice(foundIndex, 1);
  }
});

update_list(badiInfosCity.concat(badiInfosKanton));


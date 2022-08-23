import {getBadiPicture} from "./search.util.js";
import {addFavoriteBadi, deleteFavoriteBadi, isFavorite} from "./util.js";

function appendBeckenlisteToHtmlTable(data) {
  let badname = data['badname'];
  let badOrt = data['ort'];
  let badPreis = data['preise'].replaceAll(/(\n)+/g, '<br />');
  let badAdresse = data['adresse2'];
  let badPLZ = data['plz'];

  $("#badname").html(badname + ' ' + badOrt);

  let preis = '';
  if (badPreis.length > 0) {
    preis += badPreis;
  } else {
    preis = 'Keine Angaben vorhanden.';
  }

  $("#badpreise").html(preis);

  let adresse = `<p>${badname} <br>`;
  if (badAdresse.length > 0) {
    adresse += `${badAdresse} <br>`;
  }
  adresse += `${badPLZ} ${badOrt}</p>`

  $('#badAdresse').append(adresse);

  const beckenliste = [];
  const becken = data['becken'];
  for (const [key, value] of Object.entries(becken)) {
    const beckendetails = {
      beckenname: value.beckenname,
      temperatur: value.temp,
      dateLastUpdate: new Date(value.date)
    };
    beckenliste.push(beckendetails);
  }

  beckenliste.forEach(function (becken) {
    $('#beckenListe').append(`
    <tr>
      <th scope="row">${becken.beckenname}</th>
      <td>${becken.temperatur} °C </td>
      <td>${becken.dateLastUpdate.toLocaleString()}</td>
    </tr>
    `)
  });
}

const baseUrl = (window.location).search;
const id = parseInt(baseUrl.substring(baseUrl.lastIndexOf('=') + 1));

const response = await fetch('https://www.wiewarm.ch:443/api/v1/bad.json/' + id);
const data = await response.json();
appendBeckenlisteToHtmlTable(data);

const badiInfo = {
  bildUrl: await getBadiPicture(id),
  id: id,
  name: data.badname,
  ort: data.ort
};

let isFav = isFavorite(badiInfo);

if (isFav) {
  $('#favorit').html('<h3><i class="bi-star-fill text-warning"></i></h3>');
}

$('#favorit').click(function (event) {
  event.preventDefault();
  if (isFav) {
    isFav = false;
    deleteFavoriteBadi(badiInfo);
    $('#favorit').html('<h3><i class="bi-star text-warning"></i></h3>');
  } else {
    isFav = true;
    addFavoriteBadi(badiInfo);
    $('#favorit').html('<h3><i class="bi-star-fill text-warning"></i></h3>');
  }
})

async function getWeather(ort1) {
  let ort = ort1.toLowerCase()
  console.log(ort.includes("ö"))
  switch (ort){
    case ort.includes("ö"): ort.replace("ö", "oe"); return ort
    case ort.includes("ä"): ort.replace("ä", "ae"); return ort
    case ort.includes("ü"): ort.replace("ü", "ue"); return ort
  }
  console.log(ort = ort.replace("ö", "oe"))
  try {
    const response = await fetch('https://weatherdbi.herokuapp.com/data/weather/' + ort);
    const data = await response.json();
    return data;

  } catch (e) {
    return Promise.resolve([]);
  }
}

const weatherData = await getWeather(data.ort)

if (weatherData.length === 0) {
  $("#error-text span").text("No Data Found");
  $("#toggleNextDay").toggle()
} else {
  appendDataToElements(weatherData)
  $("#error-text span").text("");
}

function appendDataToElements(weatherData) {
  const translateDays = (replaceValue) => {
    let day = ""
    switch (replaceValue.toLowerCase()){
      case "monday": return day = "Montag"
      case "tuesday": return day = "Dienstag"
      case "wednesday": return day = "Mittwoch"
      case "thursday": return day = "Donnerstag"
      case "friday": return day = "Freitag"
      case "saturday": return day = "Samstag"
      case "sunday": return day = "Sonntag"
    }
  }

  const translateComments = (replacementComment) => {
    let comment = ""
    switch (replacementComment.toLowerCase()){
      case "sunny": return comment = "Sonnig"
      case "scattered": return comment = "Vereinzelte Gewitter"
      case "thunderstorm": return comment = "Gewitter"
      case "showers": return comment = "Regenschauer"
      case "rain": return comment = "Regen"
      case "partly cloudy": return comment = "Teilweise Bewölkt"
      case "mostly sunny": return comment = "Meistens Sonnig"
      case "mostly cloudy": return comment = "Meistens Bewölkt"
      case "cloudy": return comment = "Bewölkt"
      case "scattered thunderstorms": return comment = "Teilweise Gewitter"
      default: return replacementComment;
    }
  }
  let weatherTemperatur = weatherData.currentConditions.temp.c + " °C";
  let weatherComment = translateComments(weatherData.currentConditions.comment);
  let thunderWarning = "";
  if (weatherComment.includes("Thunderstorm") || weatherComment.includes("thunderstorms")) {
    thunderWarning = "⚠️ Achtung Gewitter"
  }

  $("#weather-comment").html(weatherComment)
  $("#weather-temperature").html(weatherTemperatur)
  $("#weather-thunderWarning").html(thunderWarning)
  const weatherDiv = document.getElementById("weather-icon")
  const weatherImage = document.createElement("img")
  weatherImage.setAttribute("src", weatherData.currentConditions.iconURL)
  weatherDiv.appendChild(weatherImage)

  let showButton = false;

  $("#nextDays").toggle()

  weatherData.next_days.forEach(day => {
    if (day.comment.includes("Thunderstorm") || day.comment.includes("thunderstorms")) {
      thunderWarning = "⚠️Achtung Gewitter"
    }

    $('#nextDays').append(`
        <table style="text-align: center; align-content: center; align-items: center; width:10em; border:1px;" >
            <tr><th>${translateDays(day.day)}</th></tr>
            <tr><td>${thunderWarning}</td></tr>
            <td> <img src="${day.iconURL}" alt="Wetter Bild"></img></td>
            <tr><td>${translateComments(day.comment)}</td></tr>
            <tr><td>${day.max_temp.c} °C</td></tr>
        </table>
    `)
    thunderWarning = "";
  });

  document.getElementById("toggleNextDay").onclick = function () {
    showButton = !showButton;
    if (showButton === true) {
      $("#nextDays").toggle()
      $("#weather-today").toggle()
      $("#toggleNextDay span").text("Schliessen");
    } else {
      $("#nextDays").toggle()
      $("#weather-today").toggle()
      $("#toggleNextDay span").text("Wochenvorschau");
    }
  }
}

function loadMap(data) {
  let badPLZ = data['plz'];
  let badOrt = data['ort'];
  let badAdresse = data['adresse2'];

  const badStrasse = badAdresse.split(" ")[0];
  const badStrassennummer = badAdresse.split(" ")[1];
  document.getElementById("map").setAttribute("src", "https://maps.google.ch/maps?q=" + badStrasse + "%20" + badStrassennummer + ",%20" + badPLZ + "%20" + badOrt + "&t=&z=13&ie=UTF8&iwloc=&output=embed")
}

loadMap(data);

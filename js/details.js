import {getBadiPicture} from "./search.util.js";
import {addFavoriteBadi, deleteFavoriteBadi, isFavorite} from "./util.js";
$("#container").toggle()
function appendBeckenlisteToHtmlTable(data) {
  let badname = data['badname'];
  let badOrt = data['ort'];
  let badPreis = data['preise'].replaceAll(/(\n)+/g, '<br />');
  let badAdresse = data['adresse2'];
  let badPLZ = data['plz'];
  let badZeit = data['zeiten'];

  $("#badname").html(badname + ' ' + badOrt);

  let preis = '';
  if (badPreis.length > 0) {
    preis += badPreis;
  } else {
    preis = 'Keine Angaben vorhanden.';
  }

  $("#badpreise").html(preis);

  let zeiten = '';
  if (badZeit.length > 0) {
    zeiten += badZeit;
  } else
    zeiten = 'Keine Angaben vorhanden.'

  $("#badzeiten").html(zeiten);

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

function countdownOpening(data) {
  let openingText = data.zeiten
  let regex = /(\d{1,2}(?:\.|\:)\d{1,2}) ?- ?(\d{1,2}(?:\.|\:)\d{1,2})/.exec(openingText)

  if (regex === null) {
    return;
  }

  const formattedRegexOpen = regex[1].replace(".", ":");
  const formattedSecondRegexClose = regex[2].replace(".", ":");
  const todayDate = new Date()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  let currentDay = todayDate.getDate()


  let x = setInterval(function () {
    let textOpening = "";
    document.getElementById("counter").style.color = "red";

    const countDownDateOpening = new Date(monthNames[todayDate.getMonth()] + " " + currentDay + ", " + todayDate.getFullYear() + " " + formattedRegexOpen + ":00").getTime();
    const countDownDateClosing = new Date(monthNames[todayDate.getMonth()] + " " + currentDay + ", " + todayDate.getFullYear() + " " + formattedSecondRegexClose + ":00").getTime();

    const now = new Date().getTime();

    const distanceToOpen = countDownDateOpening - now;
    const distanceToClose = countDownDateClosing - now;

    const calculate = (calculateDifference) => {
      const hours = Math.floor((calculateDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((calculateDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((calculateDifference % (1000 * 60)) / 1000);
      document.getElementById("counter").innerHTML = `${textOpening} ${hours}h ${minutes}m ${seconds}s (Angaben ohne Gewähr)`;
    }
    if (distanceToOpen < 0 && distanceToClose < 0) {
      currentDay += 1;
      textOpening = "Öffnet in: ";
      calculate(distanceToOpen)
    }
    if (distanceToClose < 0) {
      calculate(distanceToOpen)
    } else {
      textOpening = "Schliesst in: ";
      document.getElementById("counter").style.color = "green";
      calculate(distanceToClose)
    }

    if (distanceToOpen < 0) {
      calculate(distanceToClose)
    } else {
      textOpening = "Öffnet in: ";
      document.getElementById("counter").style.color = "red";
      calculate(distanceToOpen)
    }
  }, 0);
}

countdownOpening(data)
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
  switch (ort) {
    case ort.includes("ö"):
      ort.replace("ö", "oe");
      return ort
    case ort.includes("ä"):
      ort.replace("ä", "ae");
      return ort
    case ort.includes("ü"):
      ort.replace("ü", "ue");
      return ort
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
  $("#error-text span").text("Keine Daten gefunden");
  $("#toggleNextDay").toggle()
} else {
  appendDataToElements(weatherData)
  $("#error-text span").text("");
}

function appendDataToElements(weatherData) {
  const translateDays = (replaceValue) => {
    let day = ""
    switch (replaceValue.toLowerCase()) {
      case "monday":
        return day = "Montag"
      case "tuesday":
        return day = "Dienstag"
      case "wednesday":
        return day = "Mittwoch"
      case "thursday":
        return day = "Donnerstag"
      case "friday":
        return day = "Freitag"
      case "saturday":
        return day = "Samstag"
      case "sunday":
        return day = "Sonntag"
    }
  }

  const translateComments = (replacementComment) => {
    let comment = ""
    switch (replacementComment.toLowerCase()) {
      case "sunny":
        return comment = "Sonnig"
      case "scattered":
        return comment = "Vereinzelte Gewitter"
      case "thunderstorm":
        return comment = "Gewitter"
      case "showers":
        return comment = "Regenschauer"
      case "rain":
        return comment = "Regen"
      case "partly cloudy":
        return comment = "Teilweise Bewölkt"
      case "mostly sunny":
        return comment = "Meistens Sonnig"
      case "mostly cloudy":
        return comment = "Meistens Bewölkt"
      case "cloudy":
        return comment = "Bewölkt"
      case "scattered thunderstorms":
        return comment = "Teilweise Gewitter"
      default:
        return replacementComment;
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

function readTime(badiTime) {
  let badiTimes = badiTime.zeiten.replaceAll(/(\n)+/g, '<br />');
  $("#times").html(badiTimes);
}

readTime(data)

function loadMap(data) {
  let badPLZ = data['plz'];
  let badOrt = data['ort'];
  let badAdresse = data['adresse2'];

  const badStrasse = badAdresse.split(" ")[0];
  const badStrassennummer = badAdresse.split(" ")[1];
  document.getElementById("map").setAttribute("src", "https://maps.google.ch/maps?q=" + badStrasse + "%20" + badStrassennummer + ",%20" + badPLZ + "%20" + badOrt + "&t=&z=13&ie=UTF8&iwloc=&output=embed")
}

loadMap(data);

// Sbb Fahrplan automatische Ausfuellung
let sbbBadAdresse = data['adresse2'];
let sbbBadOrt = data['ort']

const inputTo = document.getElementById("to");

let sbbinputto = sbbBadOrt + ", " + sbbBadAdresse
inputTo.value = sbbinputto;
// Sbb Fahrplan automatische Ausfuellung ende

export async function getAllImages(id) {
  try {
    const response = await fetch('https://www.wiewarm.ch:443/api/v1/image.json/' + id);
    const imagedata = await response.json();
    $("#container").toggle()
    $("#spinnerLoading").toggle()

    for (let i = 0; i < imagedata.length; i++) {
      if (imagedata[i]) {
        const div = document.createElement("div")
        const img = document.createElement("img")
        const arrowLeft = document.getElementById("arrowLeft")
        const arrowRight = document.getElementById("arrowRight")
        const divSlidePics = document.getElementById("slidePics")
        divSlidePics.hidden = false
        if (imagedata.length > 1) {
          arrowLeft.hidden = false
          arrowRight.hidden = false
        }
        if (i === 0) {
          div.setAttribute("class", "carousel-item active")
        } else {
          div.setAttribute("class", "carousel-item")
        }
        img.setAttribute("class", "d-block w-100")
        img.setAttribute("src", "https://www.wiewarm.ch/" + imagedata[i].image)
        div.appendChild(img)
        const pics = document.getElementById("slidePics")
        pics.appendChild(div)
      }

    }

    return imagedata;

  } catch (e) {
    return Promise.resolve([]);
  }
}

let isButtonClick = false;
const mapsButton = document.getElementById("maps-button");
const mapsDiv = document.getElementById("maps-div");

mapsButton.onclick = ( e => {
  isButtonClick = !isButtonClick;
  if (isButtonClick) {
    mapsButton.textContent = "Google Maps schliessen"
    mapsDiv.hidden = false
  } else {
    mapsButton.textContent = "Google Maps anzeigen"
    mapsDiv.hidden = true
  }
})

getAllImages(id)

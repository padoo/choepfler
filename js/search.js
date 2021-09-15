let q = (window.location).search.substring((window.location).search.lastIndexOf('=') + 1);
document.getElementById("searchInput").value = q;
let suchergebnisse = [];

function setupSearchListeners(inputId, searchButtonId) {

  var inputVal = document.getElementById(inputId).value;
  fetch('https://www.wiewarm.ch:443/api/v1/bad.json?search=' + inputVal)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      suchergebnisse = badiOverviewInformation(data);
      update_list(suchergebnisse);
    })
}

function badiOverviewInformation(data) {
  const badiInfos = [];
  data.forEach(function (badi) {
    const badiInfo = {};
    badiInfo.name = badi['badname'];
    badiInfo.ort = badi['ort'];
    badiInfo.bild = "https://www.bern.com/assets/images/1/marzili_03-7ece01a1.jpg";
    badiInfos.push(badiInfo);
  })
  return badiInfos;
}

setupSearchListeners("searchInput", "searchButton");

function update_list(suchergebnisse) {

  $('#badiliste').empty();

  suchergebnisse.forEach(function (suchergebnis) {
    $('#badiliste').append(`
      <a href="details.html" class="hiddenlink">
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="d-flex proposal">
                  <img src="${suchergebnis.bild}" class="proposalimage">
                  <div>
                    <h5>${suchergebnis.name}</h5>
                    <p>${suchergebnis.ort}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    `)
  });
}

update_list(suchergebnisse);


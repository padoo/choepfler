let q = (window.location).search.substring((window.location).search.lastIndexOf('=') + 1);
document.getElementById("searchInput").value = q;
let suchergebnisse = [];

async function setupSearchListeners(inputId, searchButtonId) {
  let inputVal = document.getElementById(inputId).value;
  const response = await fetch('https://www.wiewarm.ch:443/api/v1/bad.json?search=' + inputVal);
  const data = await response.json();
  const badiInfos = await badiOverviewInformation(data);
  update_list(badiInfos);
}

async function badiOverviewInformation(data) {
  return await Promise.all(data.map(async function (badi) {
      const badiInfo = {};
      badiInfo.name = badi['badname'];
      badiInfo.ort = badi['ort'];
      badiInfo.id = badi['badid'];
      badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
      return badiInfo;
    }
  ));
}

async function getBadiPicture(badId) {
  const response = await fetch('https://www.wiewarm.ch:443/api/v1/image.json/' + badId);
  const data = await response.json();
  let bildUrl = "https://www.bern.com/assets/images/1/marzili_03-7ece01a1.jpg";
  if (data.length > 0){
    let imageUrl = data[0].image;
    bildUrl = "https://www.wiewarm.ch/" + imageUrl;
  }
  return bildUrl;
}

setupSearchListeners("searchInput", "searchButton");

function update_list(suchergebnisse) {
  $('#badiliste').empty();
  suchergebnisse.forEach(function (suchergebnis) {
    $('#badiliste').append(`
      <a href="details?id=${suchergebnis.id}" class="hiddenlink">
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="d-flex proposal">
                  <img src="${suchergebnis.bildUrl}" class="proposalimage">
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

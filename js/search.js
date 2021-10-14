import {badiOverviewInformation, getSearchResult, update_list} from "./search.util.js";

let q = (window.location).search.substring((window.location).search.lastIndexOf('=') + 1);
document.getElementById("searchInput").value = decodeURI(q);

const data = await getSearchResult(q);
const badiInfos = await badiOverviewInformation(data);
update_list(badiInfos);

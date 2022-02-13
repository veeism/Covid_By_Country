var confirmedCases = document.querySelector("#cases");
var totalDeaths = document.querySelector("#deaths");
var totalRecovered = document.querySelector("#recovered");
var lastCountryH1 = document.querySelector("#last-country")

var countryFound = false;
var countryIpName;

var firstVisit = true;
var internationalNumberFormat = new Intl.NumberFormat('en-US');

if (localStorage.getItem("lastCountry") === null) {
  lastCountry = "";
  lastCountryH1.innerText = "Last Country Searched: ";
} else {
  lastCountry = localStorage.getItem("lastCountry");
  lastCountryH1.innerText = "Last Country Searched: " + lastCountry;
}

getApi();

let apiKey = '1be9a6884abd4c3ea143b59ca317c6b2';
$.getJSON('https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey, function(data) {
 
  if(data['country'] == 'United States'){
    countryIpName = "United States of America";
  } else{
    countryIpName = data['country'];
  }

});


function getApi(){

    let alert = document.querySelector("#alert");
    countryFound = false;
    var inputField = document.querySelector("#searchBar").value;

    var countryName = document.querySelector("#country");

    country = inputField;
    
    var request = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
      };

      $.ajax(request).done(function (response) {
        
          for(let i = 0; i < response['Countries'].length; i++){
            if(firstVisit){
              if(response['Countries'][i]["Country"] == countryIpName){
                  countryName.innerText = countryIpName;
                  confirmedCases.innerText = "Total confirmed cases since 2020: " + internationalNumberFormat.format(response['Countries'][i]["TotalConfirmed"]);
                  totalDeaths.innerText = "Total confirmed deaths since 2020: " + internationalNumberFormat.format(response['Countries'][i]["TotalDeaths"]);
                  totalRecovered.innerText = "Total confirmed global cases since 2020: " + internationalNumberFormat.format(response['Global']['TotalConfirmed']);
                  alert.innerText = "";
                  countryFound = true;
                }

              } else {

                  if(response['Countries'][i]["Country"] == country){
                
                    lastCountry = response['Countries'][i]["Country"];
                    localStorage.clear();
                    localStorage.setItem("lastCountry", response['Countries'][i]["Country"]);
                    lastCountryH1.innerText = "Last Country Searched: " + lastCountry;                                      
                    countryName.innerText = inputField;
                    confirmedCases.innerText = "Total confirmed cases since 2020: " + internationalNumberFormat.format(response['Countries'][i]["TotalConfirmed"]);
                    totalDeaths.innerText = "Total confirmed deaths since 2020: " + internationalNumberFormat.format(response['Countries'][i]["TotalDeaths"]);
                    totalRecovered.innerText = "Total confirmed global cases since 2020: " + internationalNumberFormat.format(response['Global']['TotalConfirmed']);
                  
                    alert.innerText = "";
                    countryFound = true;

                }

              }

          }

          if(!countryFound){
            alert.innerText = "Country not found in the database";
          }
      });
}


$("#btn").on("click", function(){
    firstVisit = false;
    getApi();
});
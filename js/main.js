// Create scope to hold the variables
{
    var state;
    // Grab form
    let form = document.getElementById('weatherForm');
    console.log(form)

    // Function to handle submit event from form 
    async function handleSubmit(e){
        e.preventDefault();

        // Get location 
        let cityZip = e.target.cityZip.value;
        console.log(cityZip);

        // fetch weather info
        let locationInfo = await getWeather(cityZip);
        console.log(locationInfo);

        // create card for info we want (at minimum - high, low, forcast, humidity)
        let weatherInfoCards = await weatherCards(locationInfo);
    }
    
    async function getWeather(cityZip){
        console.log("Fetching the API");
        // in apiKeys to avoid uploading maintain privacy
        let apiKey = "";
        let apiKey2 = ""; 
        try{
   
            // Fetches the location by name or zip code (better error handling and allows inclusion of zip code)
            console.log('Fetching the location')
            let res2 = await fetch (`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${cityZip}&countryFilter=US&apiKey=${apiKey}`);
            let data2 = await res2.json()
            console.log(data2)

            // Would use this to find info by longitude and latitude - different reference long&lat in apis so searching by name
            // let lat = data2['locations'][0]['referencePosition']['latitude'].toFixed(4)
            // let long = data2['locations'][0]['referencePosition']['longitude'].toFixed(4)
            // console.log (lat, long, "lat and long")
            // let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)

            // Specify city for fetching the weather data
            let city = data2['locations'][0]['address']['city']

            // Assign state to global variable for the Weather Info Card
            state = data2['locations'][0]['address']['state']
            console.log (city, "city")

            console.log("Fetching the weather data")
            let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey2}&units=imperial`)
            let data = await res.json()

            // Adjust background dependent on weather status (Eventually want to make day/night theme)
            if (data['weather'][0]['main'] == 'snow'){ 
                document.body.style.backgroundImage ="url('/static/images/snowy.jpg')"
            }else if (data['clouds']['all'] < 50){
                document.body.style.backgroundImage ="url('/static/images/daytime.jpg')";
            }else{
                document.body.style.backgroundImage ="url('/static/images/Featured-Image-Live-Weather-Wallpapers-Android.jpg')";
            }

            return data
            
        } catch(e){
            console.error(e)
        }
    };

     // create card for weather info
    async function weatherCards(locationInfo){

        // Grab card display
        const cardDiv = document.getElementById("weatherDisplay")
        cardDiv.innerHTML = ""

        // accessing the data 
        let name = locationInfo['name']
        let currentWeather = locationInfo['main']['temp']
        let weatherCondition = locationInfo['weather'][0]['main']
        let feelsLike = locationInfo['main']['feels_like']
        let humidity = locationInfo['main']['humidity']
        let clouds = locationInfo['clouds']['all']
        let tempMax = locationInfo['main']['temp_max']
        let tempMin = locationInfo['main']['temp_min']
        let iconID = locationInfo['weather'][0]['icon']
        let iconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`

        // Card Div
        const card = document.createElement('div')
        card.className = 'card ps-3 pe-3 text-dark bg-light'

        // Card body 
        const cardBody = document.createElement('div')
        cardBody.className = 'card-body'

        // Add icon to top of card 
        const cardImg = document.createElement('img')
        cardImg.className = 'card-img card-img-top'
        cardImg.src = iconUrl

        // Card title
        const cardTitle = document.createElement('h3')
        cardTitle.className = 'card-text'
        cardTitle.innerHTML = `${name} | ${state}`

        // --- Card Text ---
        const cardCurrent = document.createElement('p')
        cardCurrent.className = 'card-text'
        cardCurrent.innerHTML = `Currently: ${currentWeather}\u00B0 F and ${weatherCondition}`

        const cardFeelsLike = document.createElement('p')
        cardFeelsLike.className = 'card-text'
        cardFeelsLike.innerHTML = `Feels like: ${feelsLike}\u00B0 F`

        const cardMax = document.createElement('p')
        cardMax.className = 'card-text'
        cardMax.innerHTML = `High: ${tempMax}\u00B0 F`

        const cardMin = document.createElement('p')
        cardMin.className = 'card-text'
        cardMin.innerHTML = `Low: ${tempMin}\u00B0 F`

        const cardHumidity = document.createElement('p')
        cardHumidity.className = 'card-text'
        cardHumidity.innerHTML = `Humidity: ${humidity}%`

        const cardForecast = document.createElement('p')
        cardForecast.className = 'card-text'
        cardForecast.innerHTML = `Chance of Precipitation: ${clouds}%`

        // Append text to card, card to card body, and assign card to cardDiv in index.html
        card.append(cardImg, cardTitle, cardCurrent, cardFeelsLike, cardMax, cardMin, cardHumidity, cardForecast)
        card.append(cardBody)
        cardDiv.append(card)
    }
    form.addEventListener('submit', handleSubmit);
}
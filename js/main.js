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
        let location = e.target.location.value
        console.log(location)

        // fetch weather info
        let locationInfo = await getWeather(location)
        console.log(locationInfo)

        // create header for cards?

        // create card for info we want (at minimum - high, low, forcast, humidity)
        let weatherInfoCards = await weatherCards(locationInfo)
        console.log("Printing weather cards")

    }

    // function to fetch api 
    // viewing in the terminal 
        // res = fetch('https://api.openweathermap.org/data/2.5/weather?q=london&units=imperial&appid={apiKey}').then(res => res.json()).then(data => console.log(data))
    
    async function getWeather(location){
        console.log("Fetching the API")
        let apiKey = ""; // Avoid uploading API key to github
        let apiKey2 = ""
        try{
   
            console.log('Fetching zip')

            let res2 = await fetch (`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${location}&countryFilter=US&apiKey=${apiKey2}`)
            console.log(res2)

            let data2 = await res2.json()
            console.log(data2)

            // Would use this to find info by longitude and latitude - different reference long&lat in dbs so searching by name
            // let lat = data2['locations'][0]['referencePosition']['latitude'].toFixed(4)
            // let long = data2['locations'][0]['referencePosition']['longitude'].toFixed(4)
            // console.log (lat, long, "lat and long")

            let city = data2['locations'][0]['address']['city']
            state = data2['locations'][0]['address']['state']
            console.log (city, "city")

            // let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
            let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
            let data = await res.json()

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

     // create card for info we want (at minimum - high, low, forcast, humidity)
    async function weatherCards(locationInfo){
        console.log("Making the card") 

        // Grab card display
        const cardDiv = document.getElementById("weatherDisplay")
        cardDiv.innerHTML = ""

        // accessing the data 
        let name = locationInfo['name']
        let country = locationInfo['sys']['country']
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
        cardImg.className = 'card-img-top'
        cardImg.src = iconUrl
        card.append(cardImg)

        // Card title
        const cardTitle = document.createElement('h3')
        cardTitle.className = 'card-text'
        cardTitle.innerHTML = `${name} | ${state}`
        card.append(cardTitle)

        // Card Text
        const cardCurrent = document.createElement('p')
        cardCurrent.className = 'card-text'
        cardCurrent.innerHTML = `Currently: ${currentWeather}\u00B0 F and ${weatherCondition}`
        card.append(cardCurrent)

        // find forecast
        console.log(weatherCondition)

        const cardFeelsLike = document.createElement('p')
        cardFeelsLike.className = 'card-text'
        cardFeelsLike.innerHTML = `Feels like: ${feelsLike}\u00B0 F`
        card.append(cardFeelsLike)

        const cardMax = document.createElement('p')
        cardMax.className = 'card-text'
        cardMax.innerHTML = `High: ${tempMax}\u00B0 F`
        card.append(cardMax)

        const cardMin = document.createElement('p')
        cardMin.className = 'card-text'
        cardMin.innerHTML = `Low: ${tempMin}\u00B0 F`
        card.append(cardMin)

        const cardHumidity = document.createElement('p')
        cardHumidity.className = 'card-text'
        cardHumidity.innerHTML = `Humidity: ${humidity}%`
        card.append(cardHumidity)

        const cardForecast = document.createElement('p')
        cardForecast.className = 'card-text'
        cardForecast.innerHTML = `Chance of Precipitation: ${clouds}%`
        card.append(cardForecast)

        // Add card body to card and add card to cardDiv
        card.append(cardBody)
        cardDiv.append(card)
        
    }



    form.addEventListener('submit', handleSubmit);

}
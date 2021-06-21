const fs = require('fs')



const axios = require ('axios');



class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB()
    }

    get historialCapitalizado(){
        return this.historial.map ( lugar => {
            let palabras = lugar.split(' ')
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) )

            return palabras.join(' ')


        })
    }

    get paramsMapbox (){
         return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
     }

     get paramsOpenWeather (){
         return {
             appid:process.env.OPENWEATHER_KEY,
             units: 'metric',
             lang:'es'

         }

     }

    async ciudad ( lugar = ''){

        try {
            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,//todo lo q va despues del ? en una url son los parametros
                params: this.paramsMapbox
            });
            const resp = await intance.get();
            
            return resp.data.features.map (lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],


            }));

            return
            
        } catch (error) {
            
            return [];//retornar los lugares q coincidan
        }


    }

    async climaLugar ( lat, lon) {
        try {
            
            //instance azios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params:{ ...this.paramsOpenWeather, lat, lon}
            })
            //resp.data
            const resp = await instance.get();
            const {weather, main} = resp.data //desestructura el objeto data, y extrae los objetos wather y main

            return {
                desc: weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            }
            
        
        } catch (error) {
            console.log( error)
        }
    }

    agregarHistorial (lugar = ''){
        //TODO: prevenir duplicados

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en DB
        this.guardarDB();

    }

    guardarDB(){

        const payload  = {
            historial : this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));


    }

    leerDB(){
        //debe exisitir...
        if (!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'});
        const data = JSON.parse( info )

        this.historial = data.historial


      

    }
}




module.exports = Busquedas;
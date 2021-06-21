require('dotenv').config()

const { green } = require('colors');
const { leerInput, inquireMenu, pausa,listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");






const main = async()=>{

    const busquedas = new Busquedas()
    let opt;


    do {
        
        opt = await inquireMenu ();
        
        switch (opt) {
            case 1:
                //MOstrrar mensaje
                const termino = await leerInput ('Ciudad: ')
                
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino)
                
                //seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSelec = lugares.find ( l => l.id === id)
                //guardar en DB
                busquedas.agregarHistorial(lugarSelec.nombre)
                

                //clima
                const clima = await busquedas.climaLugar(lugarSelec.lat,lugarSelec.lng)
                console.log(clima)
                //mostrar resultados
                console.clear()
                console.log ('\nInformacion de la ciudad\n'.green)
                console.log ('Ciudad: ', lugarSelec.nombre.green)
                console.log ('lat: ', lugarSelec.lat)
                console.log ('Lng: ', lugarSelec.lng)
                console.log ('Temperatura: ', clima.temp)
                console.log ('Maxima: ', clima.max)
                console.log ('Minima: ', clima.min)
                console.log ('Como esta el clima: ', clima.desc.red)

                break;
                case 2:
                    busquedas.historialCapitalizado.forEach ( (lugar,i) => {
                        const idx = `${ i + 1}.`.green;
                        console.log(` ${ idx } ${ lugar }`)
                    })

                break;

            default:
                break;
        }

        
        if (opt !== 0 ) await pausa()

    } while (opt !== 0);

}

main()
const express = require ('express');
const app = express();
const fs = require('fs');
const _ = require ('lodash');
const axios = require('axios');
const {v4: uuidv4} = require ('uuid');
const chalk = require('chalk');
const moment = require('moment')


//De lodash vamos a utilizar el método de lodash -> Groupby y partition


//Nota importante de javascript. Los objetos deben estar afuera de un scope!!
//Para que quede accesible desde afuera

let users = [] //-> dejamos disponible un arreglo vacío para poder poblarlo
//en el momento que se corte el servidor y se vuelva a iniciar, se reiniciará el arreglo del objeto

//Ruta a la cual le vamos a hacer una consulta
app.get("/", (req, res)=>{

//Entregar ruta de la API a axios (Es una promesa)
    axios.get('https://randomuser.me/api/').then((response)=>{
        //revisando el json que trae
        //console.log(response.data)

        //Ingresando a result
        const user = response.data.results[0]
        //console.log(user)

        //Destructuración
        const {name, gender} = user;
        //ingresando y mostrando valores de los arreglos/objetos
        //console.log({name, gender})

        
        //Extraemos el first y el last del objeto name
        //a través de otra desestructuración
        const {first, last} = name; 
                
        //creamos un objeto que atrape la id generada desde el paquete uuid
        //es slice le dice que sólo utilce los 6 primeros carácteres
        //30 -> Recoge los últimos 6 del total, que son 36
        const id = uuidv4().slice(0,5);
        
        //Realizamos el timeStamp, para capturar una fecha (Es un método del paquete moment)
        const timeStamp = moment().locale("es").format("MMMM Do YYYY, h:mm:ss a")
        
        //realizamos un push, para pasar los diferentes atributos (id,first, last, gender) al objeto users
        //previamente creado, y dejado vacío para recibir los datos
        users.push({id,first,last,gender,timeStamp})

        //setear el header, para que se lean las sintáxia de HTML
        res.setHeader("Content-Type","text/html")
        res.setHeader("charset","utf-8")
        //ordenamos la lista resultante, con un <ol>
        res.write('<ol>')

        //Realizamos un for each, de los usuarios que tenemos hasta ahora. Vale decir, un for each de nuestro
        //arreglo
        //recorremos los elementos, con la e -> element
        //con chalk mostramos en la consola un background blanco y texto color azul
        
        //1) Mostrar como lista
        /* users.forEach((e)=>{
            res.write(`<li>Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} </li> \n`);
            console.log(chalk.bgWhite.blue(`Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} `))
        })   */

        //2) Mostrar como lista, pero filtrando género

        //A) Creamos el objeto que guarde el fitro a través del método groupby de lodash
        const groupByGender = _.groupBy(users,'gender')

        for (const key in groupByGender) {
            res.write(`<h2>${key}</h2>`)
            //iteramos los valores de los elementos del arreglo
            groupByGender[key].forEach(e => {
                //e => Elemento
                res.write(`<li>Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} </li> \n`);
            console.log(chalk.bgWhite.blue(`Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} `));
            });
        }

        //Send es lo últim que debe ir en el fragmento de código, pues es lo que devolverá este scope
        res.write('</ol>')
        res.send();    

    })

})


//La instancia app de express, está indicando dónde debe escuchar 
app.listen(3000,()=>{
    console.log("El servidor está iniciado en http://localhost:3000/")
})
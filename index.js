const express = require('express');
const app = express();
const fs = require('fs');
const _ = require('lodash');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');
const moment = require('moment')

let users = []

app.get("/", (req, res) => {


    axios.get('https://randomuser.me/api/').then((response) => {
        const user = response.data.results[0]
        const { name, gender } = user;
        const { first, last } = name;

        const id = uuidv4().slice(0, 5);

        const timeStamp = moment().locale("es").format("MMMM Do YYYY, h:mm:ss a")

        users.push({ id, first, last, gender, timeStamp })

        res.setHeader("Content-Type", "text/html")
        res.setHeader("charset", "utf-8")
        res.write('<ol>')

        const groupByGender = _.groupBy(users, 'gender')

        for (const key in groupByGender) {
            res.write(`<h2>${key}</h2>`)
            groupByGender[key].forEach(e => {
                res.write(`<li>Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} </li> \n`);
                console.log(chalk.bgWhite.blue(`Nombre: ${e.first} - Appellido: ${e.last} - ID: ${id} - ${e.gender} -TimeStamp:${timeStamp} `));
            });
        }
        res.write('</ol>')
        res.send();
    })

})

app.listen(3000, () => {
    console.log("El servidor está iniciado en http://localhost:3000/")
})
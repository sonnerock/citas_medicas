//Importar librerias
const express = require("express")
const axios = require("axios")
const { v4: uuid } = require("uuid")
const _ = require("lodash")
const moment = require("moment")
const chalk = require("chalk")

//crear instancia  de express
const app = express()

//creamos un arreglo para agregar los objetos solicitados
const users = []

//escuchar conexiones http en puerto 3000
app.listen(3000, ()=>{
    console.log("app escuchando en puerto 3000")
})

//creamos una ruta
app.get("/crear", (req, res)=>{
    //solicitamos usuarios a la API con axios
    axios.get("https://randomuser.me/api/?results=1")
        .then(({data}) => {
            const userAPI = data.results[0]
            const { gender: gender, name: name } = userAPI
            users.push({ 
                gender: gender, 
                name: name,
                id: uuid().slice(0,6),
                timestamp: moment().format("MMMM Do YYYY, h:mm:ss a")
             });

             //con la dependencia lodash separamos los usuarios por genero
            var result = _.chain(users)
                .groupBy("gender")
                .value();

            // ||[] memoizacion(si el resultado no existe, se le asigna un arreglo vacio)
            let Masculino = result["male"] || []
            let Femenino = result["female"] || []

             //con el metodo forEach se crea un listItem para cada usuario solicitado segun los datos requeridos
            let listaFemenino = ''
            if (Femenino.length >= 1){
                Femenino.forEach(persona =>{
                    listaFemenino += `<li>${persona.gender} - ${persona.name.first} - ${persona.name.last} - ${persona.id} - ${persona.timestamp}</li>`
                })
            }
            let listaMasculino = ''
            if (Masculino.length >= 1){
                Masculino.forEach(persona =>{
                    listaMasculino += `<li>${persona.gender} - ${persona.name.first} - ${persona.name.last} - ${persona.id} - ${persona.timestamp}</li>`
                })
            }


            let respuestaFemenino = `<h2>Mujeres</h2>
            <ol>
            ${listaFemenino}
            </ol>`


            let respuestaMasculino = `<h2>Hombres</h2>
            <ol>
            ${listaMasculino}
            </ol>`

             console.log(chalk.blue(respuestaFemenino + "\n" + respuestaMasculino))
            res.send(respuestaFemenino + respuestaMasculino)

            console.log(users)

        })
    })
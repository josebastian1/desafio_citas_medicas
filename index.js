import express from "express";
import moment from "moment";
import chalk from "chalk";
import axios from "axios";
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';


const app = express();

const _ = lodash;

app.listen(3000, () => {
    console.log(chalk.cyan("Servidor escuchando en http://localhost:3000"));
});

// Array vacío de usuarios

let usuarios = [];

// Fecha de registro con formato solicitado
var fecha = moment().format("MMMM Do YYYY, hh:mm:ss a");

// Consultar a la API para extraer el nombre, apellido y genero

const getData = async () => {
    let url = "https://randomuser.me/api/";

    let result = await axios.get(url)
    let userData = result.data.results[0];

    let name = userData.name.first;
    let lastName = userData.name.last;
    let gender = userData.gender;

    return { name, lastName, gender };
}

//Crear nuevo usuario

app.post("/usuarios", async (req, res) => {

    let { name, lastName, gender } = await getData();

    let nuevoUsuario = {
        nombre: name,
        apellido: lastName,
        sexo: gender,
        id: uuidv4(),
        fecha_registro: fecha
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json({
        usuario: nuevoUsuario,
        msg: "Usuario creado exitosamente",
        code: 201
    })
})


// Consultar lista de usuarios guardados

app.get("/usuarios", (req, res) => {
    // Agrupar usuarios por genero
    const dividirUsuarios = _.groupBy(usuarios, 'sexo');
    const usuariosPorGenero = {
        hombres: dividirUsuarios.male || [],
        mujeres: dividirUsuarios.female || []
    };
    //Contador de usuarios para mayor claridad en consola
    let contadorHombres = 1;
    let contadorMujeres = 1;

    //Imprimir resultados en html

    let html = `
        <h2>Hombres:</h2>
        <ul>
    `;
    usuariosPorGenero.hombres.forEach(hombre => {
        html += `<li>Nombre: ${hombre.nombre} - Apellido: ${hombre.apellido} - ID: ${hombre.id} - Fecha de registro: ${hombre.fecha_registro}</li>`;
    });
    html += `</ul><h2>Mujeres:</h2><ul>`;
    usuariosPorGenero.mujeres.forEach(mujer => {
        html += `<li>Nombre: ${mujer.nombre} - Apellido: ${mujer.apellido} - ID: ${mujer.id} - Fecha de registro: ${mujer.fecha_registro}</li>`;
    });
    html += `</ul>`;

    res.send(html);


    //Imprimir resultados en consola con el formato solicitado

    console.log(chalk.bgWhite.blue("Hombres:"));

    usuariosPorGenero.hombres.forEach(hombre => {
        console.log(chalk.bgWhite.blue(`${contadorHombres}_ Nombre: ${hombre.nombre} - Apellido: ${hombre.apellido} - ID: ${hombre.id} - Fecha de registro: ${hombre.fecha_registro}`));
        contadorHombres++;
    });
    
    console.log(chalk.bgWhite.blue("Mujeres:"));

    usuariosPorGenero.mujeres.forEach(mujer => {
        console.log(chalk.bgWhite.blue(`${contadorMujeres}_ Nombre: ${mujer.nombre} - Apellido: ${mujer.apellido} - ID: ${mujer.id} - Fecha de registro: ${mujer.fecha_registro}`));
        contadorMujeres++;
    });

})
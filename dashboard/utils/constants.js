export const torneos = ['amateur', 'pro', 'bancos', 'femenino']

export const copas = ['2020', '2021', '2022', '2023']

// import dotenv from 'dotenv';
// // import fs from 'fs';
// let port = dotenv.config({ path: '../.env' });
// console.log(process.env.PORT);

// export const PORT = port.parsed.PORT

export const equipos = [{
    nombre: 'BCRA',
    puntaje: 12,
    partidos: {
        ganado: 5,
        perdido: 0,
        empate: 1
    }
}, {
    nombre: 'Santander',
    puntaje: 15,
    partidos: {
        ganado: 6,
        perdido: 0,
        empate: 1
    }
}, {
    nombre: 'Galicia',
    puntaje: 4,
    partidos: {
        ganado: 1,
        perdido: 0,
        empate: 1
    }
}
]

export const dia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
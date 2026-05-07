import { sportovi } from "./SportPodaci";

async function get() {
    return {success: true, data: [...sportovi]}
}

async function getById(id) {
   return {data: sportovi.find(s => s.id === id)}
}

async function dodaj(sport) {

    sport.id = sportovi.length > 0 ? String(parseInt(sportovi[sportovi.length - 1].id) + 1) : '1';
    sportovi.push(sport)

}

async function promjeni(id,sport) {
    const index = nadiIndex(id)
    sportovi[index] = {...sportovi[index], ...sport}
}

function nadiIndex(id){
    return sportovi.findIndex(s => s.id === id)
}

async function obrisi(id){
    const index = nadiIndex(id)
    if(index > -1){
        sportovi.splice(index,1)
    }
    return
}

export default {
    get, dodaj, promjeni, getById, obrisi
}
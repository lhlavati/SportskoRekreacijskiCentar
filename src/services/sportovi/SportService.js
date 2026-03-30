import { sportovi } from "./SportPodaci";

async function get() {
    return {data: [...sportovi]}
}

async function getById(id) {
   return {data: sportovi.find(s => s.id === parseInt(id))} 
}

async function dodaj(sport) {

    sport.id = sportovi.length > 0 ? sport.id = sportovi[sportovi.length - 1].id + 1 : sport.id = 1;
    sportovi.push(sport)

}

async function promjeni(id,sport) {
    const index = nadiIndex(id)
    sportovi[index] = {...sportovi[index], ...sport}
}

function nadiIndex(id){
    return sportovi.findIndex(s => s.id === parseInt(id))
}

async function obrisi(id){
    const index = nadiIndex(id)
    sportovi.splice(index,1)
}

export default {
    get, dodaj, promjeni, getById, obrisi
}
import { termini } from "./TerminPodaci";

async function get() {
    return {success: true, data: [...termini]}
}

async function getById(id) {
   return {data: termini.find(s => s.id === parseInt(id))} 
}

async function dodaj(termin) {

    termin.id = termini.length > 0 ? termini[termini.length - 1].id + 1 : 1;
    termini.push(termin)

}

async function promjeni(id,termin) {
    const index = nadiIndex(id)
    termini[index] = {...termini[index], ...termin}
}

function nadiIndex(id){
    return termini.findIndex(s => s.id === parseInt(id))
}

async function obrisi(id){
    const index = nadiIndex(id)
    if(index > -1){
        termini.splice(index,1)
    }
    return
}

export default {
    get, dodaj, promjeni, getById, obrisi
}
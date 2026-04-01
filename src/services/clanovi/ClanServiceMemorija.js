import { clanovi } from "./ClanPodaci";

async function get() {
    return {success: true, data: [...clanovi]}
}

async function getById(id) {
   return {data: clanovi.find(s => s.id === parseInt(id))} 
}

async function dodaj(clan) {

    clan.id = clanovi.length > 0 ? clanovi[clanovi.length - 1].id + 1 : 1;
    clanovi.push(clan)

}

async function promjeni(id,clan) {
    const index = nadiIndex(id)
    clanovi[index] = {...clanovi[index], ...clan}
}

function nadiIndex(id){
    return clanovi.findIndex(s => s.id === parseInt(id))
}

async function obrisi(id){
    const index = nadiIndex(id)
    if(index > -1){
        clanovi.splice(index,1)
    }
    return
}

export default {
    get, dodaj, promjeni, getById, obrisi
}
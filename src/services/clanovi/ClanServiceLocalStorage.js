import { PrefixStorage } from "../../constants";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.CLANOVI);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.CLANOVI, JSON.stringify(podaci));
}

async function get() {
    const clanovi = dohvatiSveIzStorage();
    return {success: true,  data: [...clanovi] };
}

async function getById(id) {
    const clanovi = dohvatiSveIzStorage();
    const clan = clanovi.find(s => s.id === parseInt(id));
    return {success: true,  data: clan };
}

async function dodaj(clan) {
    const clanovi = dohvatiSveIzStorage();
    
    if (clanovi.length === 0) {
        clan.id = 1;
    } else {
        const maxId = Math.max(...clanovi.map(s => s.id));
        clan.id = maxId + 1;
    }
    
    clanovi.push(clan);
    spremiUStorage(clanovi);
    return { data: clan };
}

async function promjeni(id, clan) {
    const clanovi = dohvatiSveIzStorage();
    const index = clanovi.findIndex(s => s.id === parseInt(id));
    
    if (index !== -1) {
        clanovi[index] = { ...clanovi[index], ...clan};
        spremiUStorage(clanovi);
    }
    return { data: clanovi[index] };
}

async function obrisi(id) {
    let clanovi = dohvatiSveIzStorage();
    clanovi = clanovi.filter(s => s.id !== parseInt(id));
    spremiUStorage(clanovi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    obrisi
};

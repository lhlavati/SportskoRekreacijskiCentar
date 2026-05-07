import { PrefixStorage } from "../../constants";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.TERMINI);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.TERMINI, JSON.stringify(podaci));
}

async function get() {
    const termini = dohvatiSveIzStorage();
    return {success: true,  data: [...termini] };
}

async function getById(id) {
    const termini = dohvatiSveIzStorage();
    const termin = termini.find(s => s.id === id);
    return {success: true,  data: termin };
}

async function dodaj(termin) {
    const termini = dohvatiSveIzStorage();

    if (termini.length === 0) {
        termin.id = '1';
    } else {
        termin.id = String(parseInt(termini[termini.length - 1].id) + 1);
    }
    
    termini.push(termin);
    spremiUStorage(termini);
    return { data: termin };
}

async function promjeni(id, termin) {
    const termini = dohvatiSveIzStorage();
    const index = termini.findIndex(s => s.id === id);
    
    if (index !== -1) {
        termini[index] = { ...termini[index], ...termin};
        spremiUStorage(termini);
    }
    return { data: termini[index] };
}

async function obrisi(id) {
    let termini = dohvatiSveIzStorage();
    termini = termini.filter(s => s.id !== id);
    spremiUStorage(termini);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    obrisi
};

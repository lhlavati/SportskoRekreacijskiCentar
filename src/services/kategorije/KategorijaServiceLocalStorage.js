import { PrefixStorage } from "../../constants";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KATEGORIJE);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(podaci));
}

async function get() {
    const kategorije = dohvatiSveIzStorage();
    return {success: true,  data: [...kategorije] };
}

async function getById(id) {
    const kategorije = dohvatiSveIzStorage();
    const kategorija = kategorije.find(g => g.id === id);
    return {success: true,  data: kategorija };
}

async function dodaj(kategorija) {
    const kategorije = dohvatiSveIzStorage();

    if (kategorije.length === 0) {
        kategorija.id = '1';
    } else {
        kategorija.id = String(parseInt(kategorije[kategorije.length - 1].id) + 1);
    }
    
    kategorije.push(kategorija);
    spremiUStorage(kategorije);
    return { data: kategorija };
}

async function promjeni(id, kategorija) {
    const kategorije = dohvatiSveIzStorage();
    const index = kategorije.findIndex(g => g.id === id);

    if (index !== -1) {
        kategorije[index] = { ...kategorije[index], ...kategorija, id: id };
        spremiUStorage(kategorije);
    }
    return { data: kategorije[index] };
}

async function obrisi(id) {
    let kategorije = dohvatiSveIzStorage();
    kategorije = kategorije.filter(g => g.id !== id);
    spremiUStorage(kategorije);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    obrisi
};
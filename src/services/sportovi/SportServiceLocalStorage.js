const STORAGE_KEY = 'sportovi';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const sportovi = dohvatiSveIzStorage();
    return {success: true,  data: [...sportovi] };
}

async function getById(id) {
    const sportovi = dohvatiSveIzStorage();
    const sport = sportovi.find(s => s.id === parseInt(id));
    return {success: true,  data: sport };
}

async function dodaj(sport) {
    const sportovi = dohvatiSveIzStorage();
    
    if (sportovi.length === 0) {
        sport.id = 1;
    } else {
        const maxId = Math.max(...sportovi.map(s => s.id));
        sport.id = maxId + 1;
    }
    
    sportovi.push(sport);
    spremiUStorage(sportovi);
    return { data: sport };
}

async function promjeni(id, sport) {
    const sportovi = dohvatiSveIzStorage();
    const index = sportovi.findIndex(s => s.id === parseInt(id));
    
    if (index !== -1) {
        sportovi[index] = { ...sportovi[index], ...sport};
        spremiUStorage(sportovi);
    }
    return { data: sportovi[index] };
}

async function obrisi(id) {
    let sportovi = dohvatiSveIzStorage();
    sportovi = sportovi.filter(s => s.id !== parseInt(id));
    spremiUStorage(sportovi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    obrisi
};

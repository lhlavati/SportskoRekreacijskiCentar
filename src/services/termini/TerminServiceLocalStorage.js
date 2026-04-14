const STORAGE_KEY = 'termini';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const termini = dohvatiSveIzStorage();
    return {success: true,  data: [...termini] };
}

async function getById(id) {
    const termini = dohvatiSveIzStorage();
    const termin = termini.find(s => s.id === parseInt(id));
    return {success: true,  data: termin };
}

async function dodaj(termin) {
    const termini = dohvatiSveIzStorage();
    
    if (termini.length === 0) {
        termin.id = 1;
    } else {
        const maxId = Math.max(...termini.map(s => s.id));
        termin.id = maxId + 1;
    }
    
    termini.push(termin);
    spremiUStorage(termini);
    return { data: termin };
}

async function promjeni(id, termin) {
    const termini = dohvatiSveIzStorage();
    const index = termini.findIndex(s => s.id === parseInt(id));
    
    if (index !== -1) {
        termini[index] = { ...termini[index], ...termin};
        spremiUStorage(termini);
    }
    return { data: termini[index] };
}

async function obrisi(id) {
    let termini = dohvatiSveIzStorage();
    termini = termini.filter(s => s.id !== parseInt(id));
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

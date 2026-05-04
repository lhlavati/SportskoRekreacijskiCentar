import bcrypt from 'bcryptjs'
import { PrefixStorage } from '../../constants'
import { operateri as defaultniOperateri } from './OperaterPodaci'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.OPERATERI)
    if (podaci) {
        return JSON.parse(podaci)
    }
    // Inicijalizacija s default podacima pri prvom pokretanju
    localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(defaultniOperateri))
    return [...defaultniOperateri]
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(podaci))
}

async function get() {
    const operateri = dohvatiSveIzStorage()
    const operateriBezcLozinki = operateri.map(op => ({
        sifra: op.sifra,
        email: op.email,
        uloga: op.uloga
    }))
    return { success: true, data: [...operateriBezcLozinki] }
}

async function getBySifra(sifra) {
    const operateri = dohvatiSveIzStorage()
    const operater = operateri.find(o => o.sifra === parseInt(sifra))
    if (!operater) {
        return { success: false, data: null }
    }
    return {
        success: true, data: {
            sifra: operater.sifra,
            email: operater.email,
            uloga: operater.uloga
        }
    }
}

async function dodaj(operater) {
    const operateri = dohvatiSveIzStorage()
    if (operateri.length === 0) {
        operater.sifra = 1
    } else {
        const maxSifra = Math.max(...operateri.map(o => o.sifra))
        operater.sifra = maxSifra + 1
    }
    operater.lozinka = bcrypt.hashSync(operater.lozinka, 10)
    operateri.push(operater)
    spremiUStorage(operateri)
    return { success: true, data: { sifra: operater.sifra, email: operater.email } }
}

async function promjeni(sifra, operater) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.sifra === parseInt(sifra))
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }
    operateri[index] = {
        ...operateri[index],
        email: operater.email,
        uloga: operater.uloga,
        sifra: parseInt(sifra)
    }
    spremiUStorage(operateri)
    return { success: true, data: { sifra: operateri[index].sifra, email: operateri[index].email, uloga: operateri[index].uloga } }
}

async function promjeniLozinku(sifra, novaLozinka) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.sifra === parseInt(sifra))
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(operateri)
    return { success: true, message: "Lozinka uspješno promijenjena" }
}

async function obrisi(sifra) {
    let operateri = dohvatiSveIzStorage()
    const initialLength = operateri.length
    operateri = operateri.filter(o => o.sifra !== parseInt(sifra))
    if (operateri.length === initialLength) {
        return { success: false, message: "Operater nije pronađen" }
    }
    spremiUStorage(operateri)
    return { success: true, message: 'Operater obrisan' }
}

async function prijava(email, lozinka) {
    const operateri = dohvatiSveIzStorage()
    const operater = operateri.find(o => o.email === email)
    if (!operater) {
        return { success: false, message: "Email i lozinka ne odgovaraju" }
    }
    const isMatch = bcrypt.compareSync(lozinka, operater.lozinka)
    if (!isMatch) {
        return { success: false, message: "Email i lozinka ne odgovaraju" }
    }
    return {
        success: true,
        data: {
            sifra: operater.sifra,
            email: operater.email,
            uloga: operater.uloga
        }
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
}

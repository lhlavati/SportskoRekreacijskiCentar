import { operateri } from "./OperaterPodaci"
import bcrypt from 'bcryptjs'

async function get() {
    const operateriBezcLozinki = operateri.map(op => ({
        sifra: op.sifra,
        email: op.email,
        uloga: op.uloga
    }))
    return { success: true, data: [...operateriBezcLozinki] }
}

async function getBySifra(sifra) {
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
    if (operateri.length === 0) {
        operater.sifra = 1
    } else {
        operater.sifra = operateri[operateri.length - 1].sifra + 1
    }
    operater.lozinka = bcrypt.hashSync(operater.lozinka, 10)
    operateri.push(operater)
    return { success: true, data: { sifra: operater.sifra, email: operater.email } }
}

async function promjeni(sifra, operater) {
    const index = nadiIndex(sifra)
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }
    operateri[index] = {
        ...operateri[index],
        email: operater.email,
        uloga: operater.uloga,
        sifra: parseInt(sifra)
    }
    return { success: true, data: { sifra: operateri[index].sifra, email: operateri[index].email, uloga: operateri[index].uloga } }
}

async function promjeniLozinku(sifra, novaLozinka) {
    const index = nadiIndex(sifra)
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    return { success: true, message: "Lozinka uspješno promijenjena" }
}

function nadiIndex(sifra) {
    return operateri.findIndex(o => o.sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    if (index > -1) {
        operateri.splice(index, 1)
        return { success: true, message: "Operater obrisan" }
    }
    return { success: false, message: "Operater nije pronađen" }
}

async function prijava(email, lozinka) {
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

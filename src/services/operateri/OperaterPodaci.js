import bcrypt from 'bcryptjs'

// Lozinka za sve: "Src12345!"
const hashiranaLozinka = bcrypt.hashSync('Src12345!', 10)

export const operateri = [
    {
        sifra: 1,
        email: 'admin@src.hr',
        lozinka: hashiranaLozinka,
        uloga: 'admin'
    },
    {
        sifra: 2,
        email: 'operater@src.hr',
        lozinka: hashiranaLozinka,
        uloga: 'korisnik'
    }
]

export default {
    operateri
}

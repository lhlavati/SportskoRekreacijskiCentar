export const IME_APLIKACIJE='SRC'

export const RouteNames = {
    HOME: '/',
    SPORTOVI: '/sportovi',
    SPORTOVI_NOVI: '/sportovi/novi',
    SPORTOVI_PROMJENA: '/sportovi/:id',

    CLANOVI: '/clanovi',
    CLANOVI_NOVI: '/clanovi/novi',
    CLANOVI_PROMJENA: '/clanovi/:id',

    KATEGORIJE: '/kategorije',
    KATEGORIJE_NOVI: '/kategorije/novi',
    KATEGORIJE_PROMJENA: '/kategorije/:id',

    TERMINI: '/termini',
    TERMINI_NOVI: '/termini/novi',
    TERMINI_PROMJENA: '/termini/:id',

    GENERIRAJ_PODATKE: '/generiraj-podatke',

    OPERATERI: '/operateri',
    OPERATERI_NOVI: '/operateri/novi',
    OPERATERI_PROMJENA: '/operateri/:sifra',
    OPERATERI_PROMJENA_LOZINKE: '/operateri/:sifra/lozinka',

    LOGIN: '/login',
    REGISTRACIJA: '/registracija',

    NADZORNA_PLOCA: '/nadzorna-ploca',
}

// memorija, localStorage, firebase
export const DATA_SOURCE = 'memorija';

export const PrefixStorage = {
    OPERATERI: 'operateri'
}
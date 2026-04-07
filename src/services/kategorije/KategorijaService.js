import KategorijaServiceLocalStorage from "./KategorijaServiceLocalStorage";
import KategorijaServiceMemorija from "./KategorijaServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;

switch (DATA_SOURCE) {
    case 'memorija':
        Servis = KategorijaServiceMemorija;
        break;
    case 'localStorage':
        Servis = KategorijaServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: {} }),
    dodaj: async (kategorija) => { console.error("Servis nije učitan"); },
    promjeni: async (id, kategorija) => { console.error("Servis nije učitan"); },
    obrisi: async (id) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (kategorija) => AktivniServis.dodaj(kategorija),
    promjeni: (id, kategorija) => AktivniServis.promjeni(id, kategorija),
    obrisi: (id) => AktivniServis.obrisi(id)
};
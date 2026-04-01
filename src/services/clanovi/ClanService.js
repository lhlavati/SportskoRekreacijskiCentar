import ClanServiceLocalStorage from "./ClanServiceLocalStorage";
import ClanServiceMemorija from "./ClanServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = ClanServiceMemorija;
        break;
    case 'localStorage':
        Servis = ClanServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: {} }),
    dodaj: async (clan) => { console.error("Servis nije učitan"); },
    promjeni: async (id, clan) => { console.error("Servis nije učitan"); },
    obrisi: async (id) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (clan) => AktivniServis.dodaj(clan),
    promjeni: (id, clan) => AktivniServis.promjeni(id, clan),
    obrisi: (id) => AktivniServis.obrisi(id)
};
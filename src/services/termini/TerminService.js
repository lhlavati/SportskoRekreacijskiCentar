import { DATA_SOURCE } from "../../constants";
import TerminServiceMemorija from "./TerminServiceMemorija";
import TerminServiceLocalStorage from "./TerminServiceLocalStorage";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = TerminServiceMemorija;
        break;
    case 'localStorage':
        Servis = TerminServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: {} }),
    dodaj: async (termin) => { console.error("Servis nije učitan"); },
    promjeni: async (id, termin) => { console.error("Servis nije učitan"); },
    obrisi: async (id) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (termin) => AktivniServis.dodaj(termin),
    promjeni: (id, termin) => AktivniServis.promjeni(id, termin),
    obrisi: (id) => AktivniServis.obrisi(id)
};
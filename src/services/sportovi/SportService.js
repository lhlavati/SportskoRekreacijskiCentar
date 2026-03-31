import SportServiceLocalStorage from "./SportServiceLocalStorage";
import SportServiceMemorija from "./SportServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = SportServiceMemorija;
        break;
    case 'localStorage':
        Servis = SportServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: {} }),
    dodaj: async (sport) => { console.error("Servis nije učitan"); },
    promjeni: async (id, sport) => { console.error("Servis nije učitan"); },
    obrisi: async (id) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (sport) => AktivniServis.dodaj(sport),
    promjeni: (id, sport) => AktivniServis.promjeni(id, sport),
    obrisi: (id) => AktivniServis.obrisi(id)
};
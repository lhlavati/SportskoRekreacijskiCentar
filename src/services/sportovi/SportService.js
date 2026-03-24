import { sportovi } from "./SportPodaci";

async function get() {
    return {data: sportovi}
}

async function dodaj(sport) {

    sport.id = sportovi.length > 0 ? sport.id = sportovi[sportovi.length - 1].id + 1 : sport.id = 1;
    sportovi.push(sport)

}

export default {
    get, dodaj
}
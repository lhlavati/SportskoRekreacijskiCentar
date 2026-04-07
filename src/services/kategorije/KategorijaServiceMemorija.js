import { kategorije } from "./KategorijaPodaci";

async function get(){
    return {success: true, data: [...kategorije]}
}

async function getById(id) {
    return {success: true, data: kategorije.find(g => g.id === parseInt(id))}
}

async function dodaj(kategorija){
    if(kategorije.length===0){
        kategorija.id=1
    }else{
        kategorija.id = kategorije[kategorije.length - 1].id + 1
    }
    
    kategorije.push(kategorija)
}

async function promjeni(id,kategorija) {
    const index = nadiIndex(id)
    kategorije[index] = {...kategorije[index], ...kategorija}
}

function nadiIndex(id){
    return kategorije.findIndex(g=>g.id === parseInt(id))
}

async function obrisi(id) {
    const index = nadiIndex(id);
    if (index > -1) {
        kategorije.splice(index, 1);
    }
    return;
}


export default{
    get,
    dodaj,
    getById,
    promjeni,
    obrisi
}
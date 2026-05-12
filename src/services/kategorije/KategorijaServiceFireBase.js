import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupKategorije = collection(getFirebaseDB(), PrefixStorage.KATEGORIJE);
        const snapshot = await getDocs(skupKategorije);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: "Kategorija nije pronađena" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(kategorija) {
    try {
        const skupKategorije = collection(getFirebaseDB(), PrefixStorage.KATEGORIJE);
        const docRef = await addDoc(skupKategorije, kategorija);
        return { success: true, data: { id: docRef.id, ...kategorija } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeni(id, kategorija) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
        await updateDoc(docRef, kategorija);
        return { success: true, data: { id, ...kategorija } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getById, dodaj, promjeni, obrisi };

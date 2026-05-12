import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupSportovi = collection(getFirebaseDB(), PrefixStorage.SPORTOVI);
        const snapshot = await getDocs(skupSportovi);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.SPORTOVI, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: "Sport nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(sport) {
    try {
        const skupSportovi = collection(getFirebaseDB(), PrefixStorage.SPORTOVI);
        const docRef = await addDoc(skupSportovi, sport);
        return { success: true, data: { id: docRef.id, ...sport } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeni(id, sport) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.SPORTOVI, id);
        await updateDoc(docRef, sport);
        return { success: true, data: { id, ...sport } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.SPORTOVI, id);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getById, dodaj, promjeni, obrisi };

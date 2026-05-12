import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupTermini = collection(getFirebaseDB(), PrefixStorage.TERMINI);
        const snapshot = await getDocs(skupTermini);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TERMINI, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: "Termin nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(termin) {
    try {
        const skupTermini = collection(getFirebaseDB(), PrefixStorage.TERMINI);
        const docRef = await addDoc(skupTermini, termin);
        return { success: true, data: { id: docRef.id, ...termin } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeni(id, termin) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TERMINI, id);
        await updateDoc(docRef, termin);
        return { success: true, data: { id, ...termin } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.TERMINI, id);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getById, dodaj, promjeni, obrisi };

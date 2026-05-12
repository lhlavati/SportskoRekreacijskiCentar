import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

async function get() {
    try {
        const skupClanovi = collection(getFirebaseDB(), PrefixStorage.CLANOVI);
        const snapshot = await getDocs(skupClanovi);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.CLANOVI, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: "Član nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(clan) {
    try {
        const skupClanovi = collection(getFirebaseDB(), PrefixStorage.CLANOVI);
        const docRef = await addDoc(skupClanovi, clan);
        return { success: true, data: { id: docRef.id, ...clan } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeni(id, clan) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.CLANOVI, id);
        await updateDoc(docRef, clan);
        return { success: true, data: { id, ...clan } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.CLANOVI, id);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getById, dodaj, promjeni, obrisi };

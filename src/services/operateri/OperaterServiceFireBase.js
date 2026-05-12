import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import bcrypt from 'bcryptjs';

async function get() {
    try {
        const skupOperateri = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const snapshot = await getDocs(skupOperateri);
        const data = snapshot.docs.map(d => ({
            sifra: d.id,
            email: d.data().email,
            uloga: d.data().uloga
        }));
        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, sifra);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const d = docSnap.data();
            return { success: true, data: { sifra: docSnap.id, email: d.email, uloga: d.uloga } };
        }
        return { success: false, data: null };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function dodaj(operater) {
    try {
        const lozinka = bcrypt.hashSync(operater.lozinka, 10);
        const skupOperateri = collection(getFirebaseDB(), PrefixStorage.OPERATERI);
        const docRef = await addDoc(skupOperateri, { email: operater.email, lozinka, uloga: operater.uloga });
        return { success: true, data: { sifra: docRef.id, email: operater.email, uloga: operater.uloga } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeni(sifra, operater) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, sifra);
        await updateDoc(docRef, { email: operater.email, uloga: operater.uloga });
        return { success: true, data: { sifra, email: operater.email, uloga: operater.uloga } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promjeniLozinku(sifra, novaLozinka) {
    try {
        const lozinka = bcrypt.hashSync(novaLozinka, 10);
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, sifra);
        await updateDoc(docRef, { lozinka });
        return { success: true, message: "Lozinka uspješno promijenjena" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.OPERATERI, sifra);
        await deleteDoc(docRef);
        return { success: true, message: 'Uspješno obrisano' };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function prijava(email, lozinka) {
    try {
        const q = query(collection(getFirebaseDB(), PrefixStorage.OPERATERI), where('email', '==', email));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        const isMatch = bcrypt.compareSync(lozinka, data.lozinka);
        if (!isMatch) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }
        return { success: true, data: { sifra: docSnap.id, email: data.email, uloga: data.uloga } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getBySifra, dodaj, promjeni, promjeniLozinku, obrisi, prijava };

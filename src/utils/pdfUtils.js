import { jsPDF } from 'jspdf';

export async function ucitajFontove(doc) {
    const fetchBase64 = async (url) => {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await r.blob();
        return new Promise(res => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };
    const [reg, bold] = await Promise.all([
        fetchBase64('/fonts/Roboto-Regular.ttf'),
        fetchBase64('/fonts/Roboto-Bold.ttf')
    ]);
    doc.addFileToVFS('Roboto-Regular.ttf', reg);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', bold);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    doc.setFont('Roboto', 'normal');
}

export function dodajFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();
        doc.text(`Stranica ${i} od ${pageCount}`, w / 2, h - 10, { align: 'center' });
        doc.text(`Generirano: ${new Date().toLocaleString('hr-HR')}`, 20, h - 10);
    }
}

export function noviDok() {
    return new jsPDF();
}

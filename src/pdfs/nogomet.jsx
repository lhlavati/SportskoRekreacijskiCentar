import { autoTable } from 'jspdf-autotable';
import { ucitajFontove, dodajFooter, noviDok } from '../utils/pdfUtils';

const BOJA = [34, 139, 34];

export default async function generirajNogometPDF(sport) {
    const doc = noviDok();
    await ucitajFontove(doc);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(...BOJA);
    doc.setFont('Roboto', 'bold');
    doc.text('SPORTSKO REKREACIJSKI CENTAR', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.setFont('Roboto', 'normal');
    doc.text('Pregled sporta', 20, 27);

    // Naslov sporta
    doc.setFontSize(18);
    doc.setFont('Roboto', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(sport.naziv.toUpperCase(), 20, 45);

    doc.setFontSize(10);
    doc.setFont('Roboto', 'normal');
    doc.setTextColor(...BOJA);
    doc.text('Momcadski sport na otvorenom', 20, 53);

    // Razdjela linija
    doc.setDrawColor(...BOJA);
    doc.setLineWidth(0.7);
    doc.line(20, 57, 190, 57);

    let y = 68;

    doc.setFontSize(13);
    doc.setFont('Roboto', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Podaci o sportu:', 20, y);
    y += 10;

    const redovi = [
        ['Kategorija', sport.kategorijaText || '-'],
        ['Kontaktni sport', sport.kontaktni ? 'Da' : 'Ne'],
        ['Maks. broj igraca', String(sport.maxIgraca)],
        ['Prostor', sport.uZatvorenom ? 'Zatvoreno (dvorana)' : 'Otvoreno (teren)'],
        ['Trajanje termina', `${sport.trajanjeMin} min`],
        ['Cijena termina', `${Number(sport.cijenaTermina).toFixed(2)} EUR`],
    ];

    autoTable(doc, {
        startY: y,
        head: [['Polje', 'Vrijednost']],
        body: redovi,
        margin: { left: 20, right: 20 },
        tableWidth: 'auto',
        styles: {
            font: 'Roboto',
            fontStyle: 'normal',
            fontSize: 11,
            overflow: 'linebreak',
        },
        headStyles: {
            font: 'Roboto',
            fontStyle: 'bold',
            fillColor: BOJA,
            textColor: [255, 255, 255],
        },
        alternateRowStyles: {
            fillColor: [240, 255, 240],
        },
        columnStyles: {
            0: { cellWidth: 70, fontStyle: 'bold' },
            1: { cellWidth: 100 },
        },
    });

    dodajFooter(doc);

    const blob = doc.output('blob');
    window.open(URL.createObjectURL(blob), '_blank');
}

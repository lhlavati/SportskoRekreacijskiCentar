const pdfModules = import.meta.glob('../pdfs/*.jsx');

export async function ucitajPdfGenerator(filename) {
    const key = `../pdfs/${filename}`;
    if (!pdfModules[key]) throw new Error(`PDF generator nije pronađen: ${filename}`);
    const module = await pdfModules[key]();
    return module.default;
}

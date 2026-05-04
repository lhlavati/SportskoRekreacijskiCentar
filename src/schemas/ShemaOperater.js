import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const ShemaOperater = z.object({
  email: z.string()
    .trim()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!"),

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!"),

  uloga: z.enum(['admin', 'korisnik'], {
    errorMap: () => ({ message: "Uloga mora biti 'admin' ili 'korisnik'!" })
  })
});

export const ShemaLogin = z.object({
  email: z.string()
    .trim()
    .min(1, "Email je obavezan!")
    .email("Unesite ispravan email format!"),

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!")
});

export const ShemaPromjenaLozinke = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!"),

  potvrdaLozinke: z.string()
    .min(1, "Potvrda lozinke je obavezna!")
}).refine((data) => data.novaLozinka === data.potvrdaLozinke, {
  message: "Lozinke se ne podudaraju!",
  path: ["potvrdaLozinke"]
});

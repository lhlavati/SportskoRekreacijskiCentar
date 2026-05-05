import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ClanService from "../../services/clanovi/ClanService";
import { useEffect, useState } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber, AsYouType } from "libphonenumber-js";
import { useForm, Controller } from "react-hook-form";
import AvatarPicker from "../../components/AvatarPicker";

export default function ClanPromjena() {
  const navigate = useNavigate();
  const params = useParams();
  const [zemlja, setZemlja] = useState('HR');
  const [slika, setSlika] = useState(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    ucitajClan();
  }, []);

  async function ucitajClan() {
    await ClanService.getById(params.id).then((odgovor) => {
      if (!odgovor.success) {
        alert('Nije implementiran servis');
        return;
      }
      const s = odgovor.data;
      reset({
        ime: s.ime,
        prezime: s.prezime,
        email: s.email,
        kontaktBroj: s.kontaktBroj,
      });
      setSlika(s.slika || null);
    });
  }

  async function promjeni(clan) {
    await ClanService.promjeni(params.id, clan).then(() => {
      navigate(RouteNames.CLANOVI);
    });
  }

  function odradiSubmit(data) {
    const asYouType = new AsYouType(zemlja);
    asYouType.input(data.kontaktBroj);
    const formatiraniBroj = asYouType.getNumber().formatInternational();

    promjeni({
      ime: data.ime.trim(),
      prezime: data.prezime.trim(),
      email: data.email.trim(),
      kontaktBroj: formatiraniBroj,
      slika: slika || undefined,
    });
  }

  return (
    <>
      <h3>Promjena člana</h3>
      <Form onSubmit={handleSubmit(odradiSubmit)}>
        <Form.Group controlId="ime" className="mb-3">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            type="text"
            isInvalid={!!errors.ime}
            {...register('ime', {
              required: 'Ime je obavezno!',
              validate: v => v.trim().length >= 3 || 'Ime mora imati najmanje 3 znaka!'
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.ime?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="prezime" className="mb-3">
          <Form.Label>Prezime</Form.Label>
          <Form.Control
            type="text"
            isInvalid={!!errors.prezime}
            {...register('prezime', {
              required: 'Prezime je obavezno!',
              validate: v => v.trim().length >= 3 || 'Prezime mora imati najmanje 3 znaka!'
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.prezime?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            isInvalid={!!errors.email}
            {...register('email', { required: 'Email je obavezan!' })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="kontaktBroj" className="mb-3">
          <Form.Label>Kontakt Broj</Form.Label>
          <br />
          <Controller
            name="kontaktBroj"
            control={control}
            rules={{
              required: 'Kontakt broj je obavezan!',
              validate: v => {
                if (!v) return true;
                return isValidPhoneNumber(v) || 'Uneseni broj telefona nije ispravan ili ne pripada odabranoj državi!'
              }
            }}
            render={({ field }) => (
              <div className={errors.kontaktBroj ? 'phone-input-error' : ''}>
                <PhoneInputWithCountrySelect
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="HR"
                  international
                  countryCallingCodeEditable={false}
                  onCountryChange={setZemlja}
                />
              </div>
            )}
          />
          {errors.kontaktBroj && (
            <div className="text-danger small mt-1">{errors.kontaktBroj.message}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Slika / Avatar</Form.Label>
          <AvatarPicker vrijednost={slika} onChange={setSlika} />
        </Form.Group>

        <hr style={{ marginTop: "20px", border: "0" }} />

        <div className="d-grid gap-2 d-sm-flex justify-content-sm-between mt-3">
          <Link to={RouteNames.CLANOVI} className="btn btn-danger">
            Odustani
          </Link>
          <Button type="submit" variant="success">
            Promijeni člana
          </Button>
        </div>
      </Form>
    </>
  );
}

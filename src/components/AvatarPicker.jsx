import { useRef } from "react";

const PRESET_AVATARI = Array.from({ length: 12 }, (_, i) =>
  `https://i.pravatar.cc/150?img=${i + 1}`
);

export default function AvatarPicker({ vrijednost, onChange }) {
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--g-100)', overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--g-200)',
        }}>
          {vrijednost
            ? <img src={vrijednost} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '1.8rem', color: 'var(--g-400)' }}>?</span>
          }
        </div>
        <div>
          <div className="fw-semibold small mb-1">Slika profila</div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Učitaj vlastitu sliku
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          {vrijednost && (
            <button
              type="button"
              className="btn btn-link btn-sm text-danger ms-2 p-0"
              onClick={() => onChange(null)}
            >
              Ukloni
            </button>
          )}
        </div>
      </div>

      <div className="small text-muted mb-2">Ili odaberi avatar:</div>
      <div className="d-flex flex-wrap gap-2">
        {PRESET_AVATARI.map((url) => (
          <img
            key={url}
            src={url}
            alt="preset avatar"
            onClick={() => onChange(url)}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              cursor: 'pointer', objectFit: 'cover',
              border: vrijednost === url ? '3px solid #6366f1' : '2px solid var(--g-200)',
              transition: 'border 0.15s, transform 0.1s',
              transform: vrijednost === url ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

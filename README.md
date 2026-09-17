# Golden Smile — tandenblekenhoorn.nl

Nieuwe website voor Golden Smile (tanden bleken, centrum Hoorn), gebouwd volgens het
projectplan: Next.js op Vercel, online boekingsflow met tijdelijke sloten, een
beveiligde beheeromgeving voor Paula, en losse SEO-landingspagina's per wijk.

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Hosting:** Vercel
- **Database:** Supabase Postgres (`customers`, `bookings`, `admins`)
- **Auth (admin):** Supabase Auth
- **E-mail:** Resend
- **Betalingen (huidige fase):** handmatig via Tikkie/WhatsApp — geen koppeling nodig.
  Het `status`-veld op boekingen (`nieuw → wacht_op_betaling → bevestigd`) is al zo
  ontworpen dat een koppeling met Mollie/Stripe later toegevoegd kan worden zonder
  dat kalender, mail of database opnieuw gebouwd hoeven te worden.

## Eerste keer opzetten

### 1. Supabase-project

1. Maak een nieuw project aan op [supabase.com](https://supabase.com).
2. Open de SQL-editor en voer `supabase/migrations/0001_init.sql` uit. Dit maakt de
   tabellen `customers`, `bookings`, `admins` aan, inclusief een database-constraint
   die dubbele boekingen op overlappende tijden onmogelijk maakt (dit is het
   mechanisme achter "een tijdslot tijdelijk op slot zetten").
3. Ga naar **Authentication → Users** en maak een gebruiker aan voor Paula
   (e-mailadres + wachtwoord).
4. Voer in de SQL-editor uit (met haar echte user-id en e-mailadres):
   ```sql
   insert into admins (user_id, email)
   values ('<paula-auth-user-id>', 'paula@tandenblekenhoorn.nl');
   ```
5. Kopieer uit **Project settings → API**: de Project URL, de `anon` key en de
   `service_role` key.

### 2. Resend (e-mail)

1. Maak een account op [resend.com](https://resend.com) en verifieer het domein
   `tandenblekenhoorn.nl` (of gebruik voorlopig een Resend-testdomein).
2. Maak een API-key aan.

### 3. Omgevingsvariabelen

Kopieer `.env.example` naar `.env.local` en vul in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM="Golden Smile <boekingen@tandenblekenhoorn.nl>"
EMAIL_ADMIN_TO="paula@tandenblekenhoorn.nl"
NEXT_PUBLIC_SITE_URL="https://tandenblekenhoorn.nl"
```

Zet dezelfde variabelen ook in het Vercel-project (**Settings → Environment
Variables**) voordat je live gaat.

### 4. Lokaal draaien

```bash
npm install
npm run dev
```

De site draait dan op http://localhost:3000. Zonder Supabase-configuratie werken de
publieke pagina's gewoon, maar geeft de boekingskalender een nette foutmelding in
plaats van beschikbare tijden — dat is verwacht.

## Domein & DNS (hoofdstuk 2 van het projectplan)

Het domein blijft geregistreerd bij Versio; alleen de DNS-records wijzigen:

1. Voeg `tandenblekenhoorn.nl` toe als custom domain in het Vercel-project.
2. Vercel toont de benodigde A-/CNAME-records.
3. Voer deze in bij het bestaande DNS-beheer bij Versio (nameservers blijven
   ongewijzigd, dus e-mail via `paula@tandenblekenhoorn.nl` blijft gewoon werken).
4. DNS-propagatie kan enkele uren tot 24–48 uur duren.

## Openingstijden & boekingsregels (hoofdstuk 3 & 4)

Vastgelegd in `src/lib/booking.ts`:

| Behandeling | Werkelijke duur | Buffer | Geblokkeerd in kalender |
| --- | --- | --- | --- |
| Single | ±45 min | 15 min | 1 uur |
| Double | ±60 min | 15 min | 1 uur 15 min |
| Triple | ±75 min | 15 min | 1 uur 30 min |

Online boekbaar: donderdag 09:30–21:00 (hele dag), maandag t/m donderdag 17:00–21:30.
Overige tijden zijn niet online boekbaar — Paula plant deze zelf in via
**Beheer → Handmatige afspraak** (`/admin/nieuw`), zonder de automatische
mail/Tikkie-flow, precies zoals besloten in het projectplan.

Er is bewust géén automatische vervaltijd voor een tijdelijk geblokkeerd slot: Paula
geeft een slot handmatig weer vrij via **Beheer → Boekingen → Slot vrijgeven** als de
Tikkie niet op tijd betaald wordt.

## Nog te doen vóór livegang

- **Teksten**: de FAQ-inhoud (`src/lib/faq.ts`) en homepage-copy zijn concepttitels
  gebaseerd op het projectplan. Vervang deze door de letterlijke bestaande teksten
  van de huidige site (dit was in deze omgeving niet op te halen omdat uitgaand
  verkeer naar tandenblekenhoorn.nl geblokkeerd is).
- **Foto's**: plaats de originele, bestaande foto's in `public/images/` en vervang de
  placeholder-hero in `src/components/Hero.tsx` door een `next/image` met een
  beschrijvende bestandsnaam en alt-tekst (zoekwoorden, t.b.v. SEO).
- **Kleurrichting**: de huidige goud/crème-richting is een eerste voorstel; het
  projectplan noemt dat de definitieve kleurstelling in de ontwerpfase wordt gekozen
  uit een paar voorgelegde richtingen (bijv. ook donker/goud of zachte pastel).
  Pas zo nodig `tailwind.config.ts` aan.
- **GitHub → Vercel koppelen** (hoofdstuk 11): push deze repository naar GitHub,
  koppel 'm aan een Vercel-project, en zet de omgevingsvariabelen hierboven in
  Vercel. Elke push krijgt automatisch een preview-link; een push naar `main` gaat
  automatisch live.

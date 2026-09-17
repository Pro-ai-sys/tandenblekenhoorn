alter table customers
  add column if not exists notes text,
  add column if not exists last_treatment_date date,
  add column if not exists tooth_shade text;
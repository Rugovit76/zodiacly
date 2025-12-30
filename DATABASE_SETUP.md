# Database Setup Guide

PostgreSQL nije detektovan na sistemu. Evo 3 opcije za brz setup:

## 🚀 **OPCIJA 1: Cloud Database (NAJBRŽE - 5 min)**

### Neon (Besplatan tier, preporučeno)
1. Idi na https://neon.tech
2. Klikni "Sign Up" (besplatno)
3. Kreiraj novi projekat: "zodiacly"
4. Kopiraj **Connection String**
5. Zalepi u `.env` fajl kao `DATABASE_URL`

**Prednosti:**
- ✅ Bez instalacije
- ✅ Instant setup
- ✅ Besplatan tier (500MB)
- ✅ Auto backups

### Alternativa: Supabase
1. https://supabase.com
2. New Project → "zodiacly"
3. Kopiraj PostgreSQL connection string
4. Dodaj u `.env`

---

## 🐳 **OPCIJA 2: Docker (Ako imaš Docker)**

```bash
# Start PostgreSQL container
docker run --name zodiacly-postgres \
  -e POSTGRES_PASSWORD=zodiacly123 \
  -e POSTGRES_DB=zodiacly \
  -p 5432:5432 \
  -d postgres:16

# Connection string:
# DATABASE_URL="postgresql://postgres:zodiacly123@localhost:5432/zodiacly"
```

**Prednosti:**
- ✅ Lokalno
- ✅ Brz setup
- ✅ Isolated environment

---

## 💻 **OPCIJA 3: PostgreSQL Instalacija (Windows)**

### Download & Install
1. Preuzmi: https://www.postgresql.org/download/windows/
2. Download **PostgreSQL 16** installer
3. Instaliraj sa default settings
4. **Zapamti password** koji staviš za `postgres` user!

### Kreiranje Database
Nakon instalacije:

```cmd
# Otvori Command Prompt as Administrator
cd "C:\Program Files\PostgreSQL\16\bin"

# Login u PostgreSQL
psql -U postgres

# U PostgreSQL terminalu:
CREATE DATABASE zodiacly;
\q
```

**Connection String:**
```
DATABASE_URL="postgresql://postgres:TVOJ_PASSWORD@localhost:5432/zodiacly"
```

---

## ⚡ **PREPORUKA:**

Za development: **OPCIJA 1 (Neon)** - najbrže, bez instalacije
Za production: **Neon ili Supabase** - scaling, backups included

---

## 📝 **Sledeći koraci nakon izbora:**

1. Kopiraj connection string
2. Stavi ga u `.env` fajl
3. Pokreni:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Koju opciju želiš?** Mogu da nastavim sa setup-om kada izabereš!

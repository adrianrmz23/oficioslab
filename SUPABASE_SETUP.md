# OficiosLab + Supabase compartido con FluentLab

OficiosLab está preparado para usar **el mismo proyecto Supabase y el mismo usuario de FluentLab**, manteniendo sus datos separados mediante tablas y bucket con prefijo `oficioslab_`.

## 1. Ejecutar la migración

En el proyecto Supabase de FluentLab:

1. Abre **SQL Editor**.
2. Crea una nueva consulta.
3. Copia todo el contenido de:
   `supabase/migrations/001_oficioslab_sync.sql`
4. Ejecuta la consulta.

Se crearán:

- `public.oficioslab_user_state`
- `public.oficioslab_evidence`
- `public.oficioslab_assessments`
- bucket privado `oficioslab-evidence`
- políticas RLS para que cada usuario solo pueda leer/escribir sus propios datos.

No modifica las tablas existentes de FluentLab.

## 2. Obtener URL y publishable key

En Supabase abre **Project Settings → API** y copia:

- Project URL
- Publishable key (`sb_publishable_...`) o, si tu proyecto aún usa la llave legacy, la anon key.

## 3. Configuración local

Crea `.env` en la raíz (NO lo subas a GitHub):

```env
OPENAI_API_KEY=tu_clave_openai
OPENAI_MODEL=gpt-5.6-luna

VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Luego:

```bash
npm install
npm run dev
```

## 4. Acceso

En la parte superior de OficiosLab aparece **Sincronizar**.

1. Pulsa el botón.
2. Usa el mismo email de FluentLab.
3. OficiosLab solicitará un **código de 6 dígitos por email** mediante Supabase Auth.
4. Al verificarlo, si todavía no existe progreso en la nube, el progreso local del navegador se migra automáticamente.
5. A partir de ahí los cambios se sincronizan aproximadamente 700 ms después de cada actualización.

## 5. Vercel

En **Vercel → Project → Settings → Environment Variables** agrega:

```text
OPENAI_API_KEY
OPENAI_MODEL
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`VITE_SUPABASE_PUBLISHABLE_KEY` es una llave pública y está diseñada para usarse en el navegador. La seguridad la proporcionan Supabase Auth y RLS.

**Nunca** uses `VITE_OPENAI_API_KEY`.

Después haz un redeploy.

## 6. Qué se sincroniza

- progreso de Electricidad;
- progreso del resto de oficios;
- dominio por habilidad/práctica;
- materiales marcados;
- prácticas completadas;
- evaluaciones realizadas;
- portafolio e información de intentos;
- fotografías de evidencia en Storage privado.

El navegador sigue conservando una copia local. Si Supabase no está disponible, OficiosLab sigue funcionando y las evidencias permanecen en IndexedDB hasta que puedan migrarse.

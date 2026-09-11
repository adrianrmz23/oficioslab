# OficiosLab — Bloque 6 · Plataforma de dominio

Esta versión convierte OficiosLab en una plataforma de entrenamiento utilizable de principio a fin. Ya no se limita a mostrar rutas y marcar lecciones: ahora separa estudio, ejecución, práctica sin guía, diagnóstico, integración y evidencia.

## Qué incorpora esta versión

### 1. Lecciones profundas para todas las profesiones

Todas las competencias de:

- Electricidad
- Panel de yeso
- Albañilería
- Construcción
- Arquitectura práctica
- Plomería
- Acabados
- Energía solar

pueden abrirse como una lección propia. En las rutas no eléctricas cada competencia muestra:

- explicación contextual;
- por qué importa;
- modelo mental;
- ejemplo aplicado;
- método de trabajo;
- errores frecuentes;
- transferencia a práctica;
- comprobación antes de marcarla como estudiada.

Electricidad conserva sus lecciones especializadas, simuladores, cálculos y prácticas visuales.

### 2. Sistema de dominio real

OficiosLab diferencia seis estados:

0. Pendiente
1. Estudiado
2. Práctica guiada
3. Sin guía
4. Diagnóstico
5. Integrado

Las prácticas ya no cuentan simplemente como “hechas”. Puedes registrar si las ejecutaste con guía, sin guía o si ya puedes diagnosticar errores. Los proyectos de etapa pueden registrarse como integración demostrada.

### 3. Evaluaciones sin receta

Cada etapa dispone de una evaluación abierta. La plataforma presenta un caso y pide:

- planeación;
- decisiones justificadas;
- detección de fallas;
- controles de calidad;
- límites de autonomía y seguridad.

Con IA configurada, la evaluación recibe retroalimentación generativa. Sin IA, sigue funcionando con una rúbrica local.

### 4. Maestro IA

Nueva sección `Maestro IA`.

Seleccionas oficio + etapa y escribes una duda. Si existe `OPENAI_API_KEY`, OficiosLab usa la API de OpenAI desde el middleware local de Vite. Si no hay clave, usa un modo local con respuestas guiadas basadas en el currículo.

La clave nunca se expone como variable `VITE_` al navegador.

### 5. Inspector IA con fotografía

Nueva sección `Inspector IA`.

Permite:

- seleccionar oficio y etapa;
- indicar la práctica;
- registrar número de intento;
- registrar materiales;
- explicar qué hiciste;
- anotar errores detectados;
- registrar correcciones;
- subir una fotografía;
- solicitar revisión visual con IA;
- guardar todo como evidencia.

El Inspector distingue expresamente entre lo visible en una foto y lo que no puede verificarse visualmente. No certifica seguridad, cumplimiento normativo ni integridad estructural.

Sin API configurada, la fotografía todavía puede guardarse y el Inspector ofrece una lista de comprobación local.

### 6. Portafolio de prácticas

Nueva sección `Portafolio` respaldada por IndexedDB.

Cada evidencia puede conservar:

- fecha;
- oficio;
- etapa;
- práctica;
- número de intento;
- fotografía;
- materiales;
- notas;
- errores;
- correcciones;
- revisión del Inspector.

Las fotografías no se guardan en `localStorage`; se almacenan en IndexedDB para evitar el límite pequeño de almacenamiento de `localStorage`.

### 7. Centro de dominio ampliado

El Centro de dominio muestra, además del progreso curricular:

- registros de dominio;
- ejecuciones sin guía;
- competencias con diagnóstico;
- integraciones demostradas;
- acceso directo al portafolio.

## Instalación

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente:

```text
http://localhost:5173
```

## Activar Maestro IA e Inspector IA

La IA es opcional. La plataforma funciona sin ella.

1. Copia `.env.example` como `.env`.
2. Coloca tu clave:

```env
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-5.6-luna
```

3. Reinicia:

```bash
npm run dev
```

El middleware `/api/ai` se ejecuta dentro del servidor de desarrollo de Vite y realiza la llamada desde Node, no desde el navegador.

## Seguridad y alcance

OficiosLab es una plataforma de formación. Las rutas pueden enseñar teoría, diseño, diagnóstico, simulación, bancos didácticos y práctica física progresiva, pero terminar contenido no sustituye:

- experiencia real supervisada;
- normativa vigente;
- cálculo profesional cuando aplique;
- permisos/licencias aplicables;
- inspecciones o responsables técnicos;
- procedimientos de seguridad de campo.

Las actividades con red eléctrica, estructura, altura, excavación, gas u otros riesgos relevantes deben transferirse a campo con controles y supervisión apropiados.

## Persistencia

Se conservan las claves anteriores de progreso de OficiosLab. No es necesario borrar `localStorage` al actualizar desde Bloque 5.

Nuevos datos:

- `oficioslab-mastery-map`: niveles de dominio.
- IndexedDB `oficioslab-evidence`: fotografías y portafolio.

## Validación realizada

- Se verificó TypeScript del código de aplicación con declaraciones temporales de dependencias.
- No se detectaron errores internos de tipado/sintaxis en los archivos `src`.
- El entorno de generación no pudo completar `npm install` por acceso al registro, por lo que el build con dependencias reales debe ejecutarse localmente.

## Despliegue opcional en Vercel

También se incluye `api/ai.js` para que `/api/ai` funcione como función serverless al desplegar en Vercel. Configura allí las variables de entorno `OPENAI_API_KEY` y opcionalmente `OPENAI_MODEL`. No coloques la clave en variables que empiecen por `VITE_`.

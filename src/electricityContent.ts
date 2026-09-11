export type SafetyLevel = 'safe' | 'theory' | 'design' | 'supervised'

export type ElectricityTopic = {
  id: string
  order: number
  stage: number
  title: string
  category: string
  summary: string
  concepts: string[]
  example: string
  practice: string
  mistakes: string
  safety: SafetyLevel
  formula?: string
}

export const stageGuides = [
  {
    "number": "01",
    "title": "Fundamentos seguros",
    "level": "Iniciación",
    "summary": "Construye el lenguaje eléctrico: seguridad, magnitudes, relaciones matemáticas, polaridad, topologías y lectura de esquemas. Todo el trabajo físico autónomo de esta etapa se mantiene en baja tensión.",
    "project": "Circuito de baja tensión documentado"
  },
  {
    "number": "02",
    "title": "Medición y herramientas",
    "level": "Básico",
    "summary": "Aprende a medir sin adivinar. El multímetro deja de ser una caja con números y se convierte en una herramienta para confirmar hipótesis, comparar valores y localizar fallas.",
    "project": "Banco de mediciones y diagnóstico"
  },
  {
    "number": "03",
    "title": "Circuitos y corriente alterna",
    "level": "Intermedio",
    "summary": "Da el salto de circuitos DC sencillos a los fenómenos que explican la red eléctrica: magnetismo, frecuencia, valor eficaz, cargas y transformadores. Las prácticas con red se sustituyen por simulación o banco aislado supervisado.",
    "project": "Tablero didáctico de CA aislada"
  },
  {
    "number": "04",
    "title": "Diseño eléctrico residencial",
    "level": "Intermedio",
    "summary": "Aprende a convertir necesidades de una vivienda en un diseño: cargas, circuitos, conductores, protecciones, canalizaciones, puesta a tierra y plano eléctrico. El foco es cálculo, criterio y documentación.",
    "project": "Diseño completo de una vivienda"
  },
  {
    "number": "05",
    "title": "Ejecución de instalaciones",
    "level": "Avanzado",
    "summary": "Estudia cómo se materializa un proyecto: canalización, tendido, cajas, dispositivos, iluminación, contactos y tableros. Las maniobras sobre red real se consideran trabajo supervisado y desenergizado.",
    "project": "Muro eléctrico de entrenamiento"
  },
  {
    "number": "06",
    "title": "Diagnóstico y mantenimiento",
    "level": "Avanzado",
    "summary": "Desarrolla método: asegurar el área, formular hipótesis, medir, comparar, aislar la falla, corregir y documentar. Se trabaja con árboles de decisión y tableros didácticos antes de cualquier instalación real.",
    "project": "Clínica de fallas"
  },
  {
    "number": "07",
    "title": "Trabajo profesional",
    "level": "Profesional",
    "summary": "Integra técnica y oficio: lectura de planos, cuantificación, presupuesto, secuencia de obra, control de calidad, pruebas y entrega al cliente.",
    "project": "Cotización y expediente de instalación"
  },
  {
    "number": "08",
    "title": "Especialización",
    "level": "Especialista",
    "summary": "Explora motores, control, sensores, fotovoltaico, respaldo y automatización. La meta es reconocer arquitecturas, calcular, seleccionar y diagnosticar con criterio, no memorizar marcas.",
    "project": "Proyecto de especialidad"
  },
  {
    "number": "09",
    "title": "Proyecto Maestro · Vivienda completa",
    "level": "Dominio",
    "summary": "Integra levantamiento, cargas, circuitos, conductores, protecciones, canalizaciones, plano, cuantificación, presupuesto, montaje didáctico, pruebas y defensa técnica. Es la etapa que comprueba transferencia de conocimientos, no solo lectura.",
    "project": "Instalación eléctrica residencial completa · caso maestro"
  }
] as const

export const electricityTopics: ElectricityTopic[] = [
  {
    "id": "e1-01",
    "order": 1,
    "stage": 1,
    "title": "Seguridad eléctrica",
    "category": "Seguridad",
    "summary": "La electricidad se trabaja controlando energía, no confiando en la suerte. Antes de tocar un circuito debes reconocer la fuente, el nivel de tensión, las partes expuestas y cómo aislar la energía. En OficiosLab la práctica autónoma comienza con fuentes de baja tensión para desarrollar hábitos antes de acercarte a instalaciones de red.",
    "concepts": [
      "Diferenciar peligro, riesgo y control.",
      "Reconocer fuente, carga, conductores y puntos expuestos.",
      "Aplicar inspección visual y orden del área.",
      "Saber cuándo detenerte y pedir supervisión."
    ],
    "example": "Una batería de 9 V y una toma doméstica pueden parecer “dos fuentes”, pero la energía disponible y las consecuencias de un error son muy distintas. El procedimiento de aprendizaje no debe tratarlas igual.",
    "practice": "Haz una inspección de cinco objetos eléctricos de casa sin abrirlos: identifica placa de datos, tensión nominal, potencia y señales de deterioro.",
    "mistakes": "Trabajar con manos húmedas; asumir que “apagado” significa desenergizado; improvisar herramientas.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e1-02",
    "order": 2,
    "stage": 1,
    "title": "Voltaje, corriente y resistencia",
    "category": "Fundamentos",
    "summary": "Voltaje es diferencia de potencial, corriente es flujo de carga y resistencia es oposición al paso de corriente. Las tres magnitudes se relacionan, pero no significan lo mismo. Aprender a explicarlas con palabras propias evita usar fórmulas sin entender qué está ocurriendo.",
    "concepts": [
      "Voltaje se mide entre dos puntos.",
      "Corriente se mide a través de una trayectoria.",
      "Resistencia depende del material y geometría.",
      "Las unidades son V, A y Ω."
    ],
    "example": "Con 5 V sobre 1 kΩ, la corriente ideal es 5 mA. Si duplicas la resistencia y mantienes el voltaje, la corriente se reduce a la mitad.",
    "practice": "Usa el simulador de la lección inicial y predice qué pasará antes de mover cada control.",
    "mistakes": "Confundir A con Ah; pensar que “más voltaje” siempre significa “más potencia”; olvidar convertir kΩ a Ω.",
    "safety": "safe",
    "formula": "I = V / R"
  },
  {
    "id": "e1-03",
    "order": 3,
    "stage": 1,
    "title": "Ley de Ohm",
    "category": "Cálculo",
    "summary": "La Ley de Ohm relaciona voltaje, corriente y resistencia para componentes aproximadamente resistivos. Es una herramienta de análisis: si conoces dos variables puedes estimar la tercera y comprobar si un resultado tiene sentido.",
    "concepts": [
      "Despejar V, I y R.",
      "Convertir unidades antes de calcular.",
      "Comprobar orden de magnitud.",
      "Reconocer cuándo un componente no es puramente resistivo."
    ],
    "example": "Una resistencia de 330 Ω con 3 V sobre ella conduce aproximadamente 9.1 mA.",
    "practice": "Resuelve diez ejercicios mezclando V, I y R; en cada uno escribe primero qué datos conoces y qué variable buscas.",
    "mistakes": "Meter miliamperios directamente como amperios; no revisar unidades; usar Ley de Ohm para todo sin validar el modelo.",
    "safety": "safe",
    "formula": "V = I × R"
  },
  {
    "id": "e1-04",
    "order": 4,
    "stage": 1,
    "title": "Potencia y energía",
    "category": "Cálculo",
    "summary": "Potencia describe la rapidez con la que se transforma energía; energía acumula esa potencia durante un tiempo. Esta diferencia explica por qué dos aparatos con la misma potencia pueden consumir cantidades distintas si se usan durante tiempos diferentes.",
    "concepts": [
      "Relacionar P, V e I.",
      "Distinguir W de Wh y kWh.",
      "Estimar consumo por tiempo de uso.",
      "Reconocer disipación térmica en resistencias."
    ],
    "example": "Una carga de 100 W usada 3 h consume 300 Wh = 0.3 kWh.",
    "practice": "Calcula el consumo diario de tres aparatos de tu casa usando su placa de datos y horas aproximadas de uso.",
    "mistakes": "Confundir kW con kWh; calcular costo sin considerar tiempo; ignorar margen de potencia en componentes.",
    "safety": "safe",
    "formula": "P = V × I · E = P × t"
  },
  {
    "id": "e1-05",
    "order": 5,
    "stage": 1,
    "title": "Corriente continua, polaridad y fuentes",
    "category": "Fundamentos",
    "summary": "En corriente continua la polaridad define el sentido de referencia y muchos componentes dependen de una conexión correcta. Una fuente especifica tensión nominal y capacidad máxima de corriente; la carga toma la corriente que necesita dentro de las condiciones de operación.",
    "concepts": [
      "Identificar positivo y negativo.",
      "Leer tensión y corriente nominal de una fuente.",
      "Distinguir fuente regulada y batería.",
      "Reconocer componentes polarizados."
    ],
    "example": "Una fuente de 5 V / 2 A puede alimentar una carga de 5 V que consume 300 mA; la fuente no “empuja” 2 A obligatoriamente.",
    "practice": "Reúne tres cargadores y transcribe sus valores de entrada y salida. Explica qué significan.",
    "mistakes": "Invertir polaridad en LEDs o capacitores; usar una fuente con tensión incorrecta; confundir capacidad máxima con consumo obligatorio.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e1-06",
    "order": 6,
    "stage": 1,
    "title": "Circuitos serie y paralelo",
    "category": "Circuitos",
    "summary": "En serie existe una sola trayectoria de corriente; en paralelo existen ramas que comparten nodos. La topología cambia cómo se distribuyen voltajes, corrientes y resistencia equivalente.",
    "concepts": [
      "Sumar resistencias en serie.",
      "Usar recíprocos en paralelo.",
      "Reconocer corriente común en serie.",
      "Reconocer voltaje común en paralelo."
    ],
    "example": "220 Ω + 330 Ω en serie equivalen a 550 Ω. En paralelo equivalen a cerca de 132 Ω.",
    "practice": "Construye dos circuitos de baja tensión con las mismas resistencias, primero en serie y luego en paralelo, y compara mediciones.",
    "mistakes": "Confundir “estar dibujados juntos” con estar en serie; calcular paralelo sumando resistencias; ignorar nodos.",
    "safety": "safe",
    "formula": "Rserie = ΣR · 1/Rpar = Σ(1/R)"
  },
  {
    "id": "e1-07",
    "order": 7,
    "stage": 1,
    "title": "Símbolos eléctricos y lectura de diagramas",
    "category": "Lectura técnica",
    "summary": "Un diagrama representa relaciones eléctricas, no la apariencia física exacta. Los símbolos permiten seguir nodos, ramas, interruptores, protecciones y cargas sin depender de una marca específica.",
    "concepts": [
      "Leer de fuente a retorno.",
      "Identificar nodos y ramas.",
      "Reconocer símbolos básicos.",
      "Separar diagrama funcional de disposición física."
    ],
    "example": "Un interruptor abierto en serie con una lámpara interrumpe la trayectoria aunque todos los demás componentes estén correctos.",
    "practice": "Redibuja un circuito de pila, interruptor, resistencia y LED usando símbolos en lugar de dibujos realistas.",
    "mistakes": "Seguir el dibujo como si fuera un mapa físico; ignorar puntos de unión; confundir cruce con conexión.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e1-08",
    "order": 8,
    "stage": 1,
    "title": "Primer circuito físico",
    "category": "Práctica",
    "summary": "La primera práctica integra polaridad, resistencia limitadora, trayectoria cerrada y verificación visual. El objetivo no es “que prenda” únicamente: debes poder explicar por qué funciona y qué medición esperar.",
    "concepts": [
      "Planear antes de montar.",
      "Revisar polaridad del LED.",
      "Usar resistencia limitadora.",
      "Documentar resultado y cambios."
    ],
    "example": "Con 3 V y un LED de caída aproximada 2 V, una resistencia de 220–330 Ω limita la corriente a unos pocos miliamperios.",
    "practice": "Monta el circuito en protoboard con pilas, LED y resistencia. Después invierte el LED con la fuente desconectada y explica el resultado.",
    "mistakes": "Conectar LED sin resistencia; cambiar conexiones con la fuente energizada; no anotar configuración.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-09",
    "order": 9,
    "stage": 2,
    "title": "Uso seguro del multímetro",
    "category": "Herramientas",
    "summary": "El multímetro puede medir varias magnitudes, pero cada función conecta internamente el instrumento de forma distinta. Elegir puerto, escala y modo correctos es parte de la medición; un error de configuración puede alterar el circuito o dañar el instrumento.",
    "concepts": [
      "Distinguir COM, VΩ y entrada de corriente.",
      "Seleccionar AC/DC según la señal.",
      "Empezar por rango alto cuando aplique.",
      "Inspeccionar puntas y fusibles."
    ],
    "example": "Para medir una batería de 1.5 V se usa V DC, punta negra en COM y roja en VΩ, midiendo entre terminales.",
    "practice": "Practica solo con pilas: mide 1.5 V, 3 V y una fuente USB de 5 V.",
    "mistakes": "Poner la punta roja en A y luego medir voltaje; cambiar de función sin pensar; medir resistencia con el circuito energizado.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-10",
    "order": 10,
    "stage": 2,
    "title": "Medición de voltaje",
    "category": "Medición",
    "summary": "El voltaje se mide entre dos puntos, por lo que el multímetro se conecta en paralelo con aquello que quieres comparar. La referencia importa: mover una punta puede cambiar signo y lectura.",
    "concepts": [
      "Conectar en paralelo.",
      "Elegir DC o AC.",
      "Interpretar polaridad y signo.",
      "Comparar valor medido con nominal."
    ],
    "example": "Una batería que marca 1.58 V en vacío puede bajar al alimentar una carga; esa diferencia aporta información sobre la fuente.",
    "practice": "Mide tres pilas y registra voltaje en vacío; compáralo con su valor nominal.",
    "mistakes": "Intentar “abrir” el circuito para medir V; usar modo de corriente; asumir que una lectura cercana a cero siempre significa batería agotada.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-11",
    "order": 11,
    "stage": 2,
    "title": "Medición de resistencia",
    "category": "Medición",
    "summary": "El ohmímetro aplica una pequeña señal interna para estimar resistencia. Por eso la resistencia se mide con el componente aislado y sin energía externa. En circuito, otros caminos pueden alterar la lectura.",
    "concepts": [
      "Desenergizar antes de medir Ω.",
      "Aislar al menos un terminal cuando sea necesario.",
      "Interpretar tolerancia.",
      "Distinguir OL de 0 Ω."
    ],
    "example": "Una resistencia marcada 1 kΩ ±5 % puede medir, por ejemplo, 982 Ω y seguir siendo correcta.",
    "practice": "Mide cinco resistencias del kit, anota código de colores, valor nominal y valor real.",
    "mistakes": "Medir sobre un circuito energizado; interpretar OL como 0; esperar valor exacto ignorando tolerancia.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-12",
    "order": 12,
    "stage": 2,
    "title": "Continuidad",
    "category": "Medición",
    "summary": "La continuidad comprueba si existe un camino de baja resistencia entre dos puntos. Es útil para cables, pistas, interruptores y fusibles, pero no reemplaza todas las pruebas eléctricas.",
    "concepts": [
      "Usar continuidad con circuito desenergizado.",
      "Reconocer pitido como umbral, no como “cero perfecto”.",
      "Probar puntas antes de diagnosticar.",
      "Seguir un conductor extremo a extremo."
    ],
    "example": "Un interruptor cerrado debería mostrar continuidad; abierto debería mostrar circuito abierto.",
    "practice": "Prueba cables jumper buenos y uno deliberadamente desconectado.",
    "mistakes": "Usar continuidad en red energizada; confiar en el pitido sin ver resistencia; concluir que una carga está “buena” solo porque hay continuidad.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-13",
    "order": 13,
    "stage": 2,
    "title": "Medición de corriente en baja tensión",
    "category": "Medición",
    "summary": "Para medir corriente el instrumento forma parte de la trayectoria, por eso se conecta en serie. Esta es una de las mediciones que más errores de usuario provoca; se practica únicamente en circuitos limitados y de baja tensión.",
    "concepts": [
      "Abrir el circuito de forma controlada.",
      "Mover la punta al puerto adecuado.",
      "Empezar por rango alto.",
      "Volver a VΩ al terminar."
    ],
    "example": "En un LED con resistencia puedes insertar el multímetro en serie y comparar la corriente medida con la estimada por cálculo.",
    "practice": "En tu circuito de pilas y LED, calcula primero la corriente esperada y después mídela en serie.",
    "mistakes": "Poner amperímetro en paralelo; olvidar regresar la punta al puerto VΩ; exceder rango o fusible.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-14",
    "order": 14,
    "stage": 2,
    "title": "Conductores y herramientas",
    "category": "Materiales",
    "summary": "Conductores, aislamiento, terminales y herramientas forman un sistema. La selección depende de corriente, temperatura, entorno, flexibilidad y método de instalación; pelar o prensar mal puede crear puntos calientes o falsos contactos.",
    "concepts": [
      "Distinguir conductor sólido y flexible.",
      "Reconocer aislamiento y temperatura nominal.",
      "Usar pelacables sin morder cobre.",
      "Seleccionar terminales compatibles."
    ],
    "example": "Un hilo parcialmente cortado al pelar puede reducir sección efectiva y fallar mecánicamente aunque el circuito funcione inicialmente.",
    "practice": "Practica cortes y pelado en sobrantes de cable de baja tensión; inspecciona que no queden hilos dañados.",
    "mistakes": "Pelar con cuchillo hacia el cuerpo; torcer conexiones sin conector apropiado; usar herramienta no adecuada.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e2-15",
    "order": 15,
    "stage": 2,
    "title": "Diagnóstico de un circuito",
    "category": "Diagnóstico",
    "summary": "Diagnosticar es comparar comportamiento esperado contra medido. El método más eficiente formula una hipótesis, elige una medición que la confirme o descarte y reduce el área de búsqueda.",
    "concepts": [
      "Empezar por alimentación.",
      "Dividir el circuito por puntos de prueba.",
      "Comparar con un circuito sano.",
      "Registrar cada medición."
    ],
    "example": "Si un LED no enciende, primero confirma tensión de fuente; después continuidad de trayectoria, polaridad y valor de resistencia.",
    "practice": "Pide a alguien que introduzca una falla en un circuito de 5 V y localízala sin mirar directamente la conexión.",
    "mistakes": "Cambiar componentes al azar; medir sin una pregunta concreta; ignorar conexiones mecánicas.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e3-16",
    "order": 16,
    "stage": 3,
    "title": "Magnetismo y electromagnetismo",
    "category": "Fundamentos",
    "summary": "La corriente produce campo magnético y un campo magnético variable puede inducir tensión. Esta relación explica transformadores, motores, generadores, relevadores y gran parte de la infraestructura eléctrica.",
    "concepts": [
      "Campo alrededor de un conductor.",
      "Bobinas concentran flujo magnético.",
      "Inducción requiere cambio de flujo.",
      "Núcleos ferromagnéticos guían flujo."
    ],
    "example": "Una bobina energizada puede atraer una armadura metálica y accionar un relevador sin unión mecánica directa con el circuito de control.",
    "practice": "Construye un electroimán de baja tensión con alambre esmaltado alrededor de un tornillo y una pila por intervalos cortos.",
    "mistakes": "Mantener una bobina improvisada energizada demasiado tiempo; confundir magnetismo permanente con electromagnetismo.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e3-17",
    "order": 17,
    "stage": 3,
    "title": "CA vs CC",
    "category": "Fundamentos",
    "summary": "En CC la polaridad de referencia permanece constante; en CA la tensión y la corriente cambian de valor y sentido periódicamente. Esta diferencia modifica medición, transformación y comportamiento de cargas.",
    "concepts": [
      "Reconocer forma de onda alterna.",
      "Distinguir frecuencia de amplitud.",
      "Entender por qué CA se transforma fácilmente.",
      "Relacionar fuente con tipo de carga."
    ],
    "example": "USB entrega típicamente CC, mientras la red doméstica es CA. Muchos equipos convierten CA a CC internamente.",
    "practice": "Clasifica diez aparatos según reciben CA directamente, CC directamente o convierten CA a CC.",
    "mistakes": "Pensar que AC significa “sin polaridad” en todos los contextos; medir con modo equivocado.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e3-18",
    "order": 18,
    "stage": 3,
    "title": "Frecuencia y forma de onda",
    "category": "Fundamentos",
    "summary": "Frecuencia indica cuántos ciclos completos ocurren por segundo. La forma de onda describe cómo cambia la señal en el tiempo; una onda senoidal, cuadrada o distorsionada puede tener el mismo valor eficaz y comportamiento diferente.",
    "concepts": [
      "Hz = ciclos por segundo.",
      "Periodo es inverso de frecuencia.",
      "Forma de onda importa en electrónica y motores.",
      "La red ideal se aproxima a una senoide."
    ],
    "example": "A 60 Hz un ciclo dura aproximadamente 16.67 ms.",
    "practice": "Usa un simulador u osciloscopio virtual para comparar 50 Hz, 60 Hz y 1 kHz.",
    "mistakes": "Confundir frecuencia con voltaje; asumir que toda CA es sinusoidal perfecta.",
    "safety": "theory",
    "formula": "T = 1 / f"
  },
  {
    "id": "e3-19",
    "order": 19,
    "stage": 3,
    "title": "Valor eficaz (RMS)",
    "category": "Cálculo",
    "summary": "El valor RMS permite comparar el efecto térmico de una señal alterna con una continua equivalente. Para una senoide ideal, el valor pico es aproximadamente √2 veces el RMS.",
    "concepts": [
      "Distinguir pico y RMS.",
      "Usar RMS para potencia en cargas resistivas.",
      "Reconocer limitaciones de multímetros no True-RMS.",
      "No inferir forma de onda solo por RMS."
    ],
    "example": "Una senoide de 120 V RMS tiene un pico cercano a 170 V.",
    "practice": "Calcula el pico aproximado de 12 V, 24 V y 127 V RMS suponiendo senoide ideal.",
    "mistakes": "Tratar RMS como promedio simple; usar relación √2 en señales no senoidales.",
    "safety": "theory",
    "formula": "Vpico ≈ Vrms × 1.414"
  },
  {
    "id": "e3-20",
    "order": 20,
    "stage": 3,
    "title": "Circuito monofásico residencial",
    "category": "Sistemas",
    "summary": "Un sistema monofásico distribuye energía mediante conductores con funciones distintas: conductor activo, neutro cuando aplica y conductor de protección. La configuración exacta depende del sistema de suministro y normativa local.",
    "concepts": [
      "Identificar función, no solo color.",
      "Separar conductor activo, neutro y protección.",
      "Entender retorno de corriente normal.",
      "No usar tierra de protección como conductor de carga."
    ],
    "example": "En una carga fase-neutro, la corriente normal circula por fase y neutro; el conductor de protección no debería llevar corriente de operación en condiciones normales.",
    "practice": "Analiza un diagrama residencial impreso e identifica conductores por función, sin abrir ningún tablero real.",
    "mistakes": "Confiar únicamente en colores; puentear neutro y protección; asumir que neutro siempre es seguro de tocar.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e3-21",
    "order": 21,
    "stage": 3,
    "title": "Cargas resistivas, inductivas y electrónicas",
    "category": "Cargas",
    "summary": "Las cargas no responden igual. Resistencias convierten energía principalmente en calor; motores almacenan energía en campos magnéticos; fuentes electrónicas conmutadas pueden generar corrientes no senoidales.",
    "concepts": [
      "Reconocer tipo de carga.",
      "Relacionar arranque de motores con corriente alta.",
      "Comprender factor de potencia de forma conceptual.",
      "Distinguir potencia nominal y demanda instantánea."
    ],
    "example": "Un calefactor y un motor de igual potencia nominal pueden exigir comportamientos distintos al encender.",
    "practice": "Clasifica focos LED, licuadora, plancha, refrigerador y cargador de laptop por tipo predominante de carga.",
    "mistakes": "Dimensionar solo por watts ignorando arranque; asumir que todas las cargas son puramente resistivas.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e3-22",
    "order": 22,
    "stage": 3,
    "title": "Transformadores",
    "category": "Máquinas",
    "summary": "Un transformador transfiere energía entre bobinados mediante flujo magnético alterno. La relación de vueltas determina aproximadamente la relación de tensiones; aislamiento y potencia nominal limitan su uso.",
    "concepts": [
      "Relación de vueltas y tensión.",
      "Aislamiento galvánico cuando corresponde.",
      "Potencia aparente nominal.",
      "Pérdidas y regulación."
    ],
    "example": "Un transformador 10:1 puede convertir aproximadamente 120 V a 12 V en condiciones ideales.",
    "practice": "Simula un transformador con diferentes relaciones de vueltas y observa tensión secundaria.",
    "mistakes": "Conectar transformadores fuera de su tensión nominal; asumir que cualquier transformador aísla de forma segura; ignorar potencia.",
    "safety": "supervised",
    "formula": "V1/V2 ≈ N1/N2"
  },
  {
    "id": "e3-23",
    "order": 23,
    "stage": 3,
    "title": "Análisis básico de circuitos CA",
    "category": "Cálculo",
    "summary": "En CA aparecen resistencia, inductancia y capacitancia; juntas forman impedancia. A nivel inicial interesa reconocer que corriente y voltaje pueden no estar en fase y que la oposición depende de frecuencia.",
    "concepts": [
      "Impedancia generaliza resistencia.",
      "Reactancia depende de frecuencia.",
      "Ángulo de fase afecta potencia.",
      "Mediciones deben usar instrumentos adecuados."
    ],
    "example": "Un motor puede consumir corriente significativa aunque parte de esa corriente intercambie energía con el campo magnético y no se convierta directamente en trabajo útil.",
    "practice": "Resuelve ejercicios conceptuales de qué cambia cuando aumenta frecuencia en una carga inductiva o capacitiva ideal.",
    "mistakes": "Usar solo R en cualquier circuito AC; confundir potencia aparente con potencia real.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e4-24",
    "order": 24,
    "stage": 4,
    "title": "Levantamiento de cargas",
    "category": "Diseño",
    "summary": "Diseñar comienza inventariando qué cargas existirán, dónde se ubican y cómo se usan. El levantamiento evita dimensionar por intuición y permite separar cargas generales, dedicadas y de operación simultánea.",
    "concepts": [
      "Registrar potencia o corriente nominal.",
      "Ubicar físicamente cada carga.",
      "Identificar cargas de alta demanda.",
      "Documentar simultaneidad esperada."
    ],
    "example": "Una cocina con refrigerador, microondas y contactos generales requiere pensar en demanda y circuitos, no solo sumar focos.",
    "practice": "Haz un levantamiento de una habitación sin intervenir instalaciones: lista aparatos, potencia y ubicación.",
    "mistakes": "Olvidar cargas futuras; usar solo consumo promedio; no distinguir carga fija de portátil.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-25",
    "order": 25,
    "stage": 4,
    "title": "Circuitos derivados",
    "category": "Diseño",
    "summary": "Los circuitos derivados dividen una instalación en ramas protegidas y manejables. La separación mejora seguridad, mantenimiento y continuidad de servicio; su número y uso dependen de carga y requisitos normativos.",
    "concepts": [
      "Agrupar cargas con criterio.",
      "Reconocer circuitos dedicados.",
      "Evitar concentrar demanda innecesariamente.",
      "Documentar identificación."
    ],
    "example": "Un equipo de alta potencia puede justificar circuito dedicado para no compartir capacidad con contactos generales.",
    "practice": "Sobre un plano ficticio, propón cómo dividir iluminación, contactos generales y cargas especiales sin ejecutar cableado.",
    "mistakes": "Meter toda la vivienda en pocos circuitos; no dejar identificación; ignorar requisitos específicos.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-26",
    "order": 26,
    "stage": 4,
    "title": "Conductores y capacidad de corriente",
    "category": "Diseño",
    "summary": "La sección del conductor se elige por capacidad térmica, método de instalación, material, temperatura, agrupamiento y condiciones de protección. No existe un único “calibre para todo”.",
    "concepts": [
      "Relacionar corriente con sección.",
      "Considerar aislamiento y temperatura.",
      "Entender factores de corrección.",
      "Coordinar conductor y protección."
    ],
    "example": "Dos conductores del mismo calibre pueden tener distinta capacidad admisible si cambian aislamiento, temperatura ambiente o número de conductores agrupados.",
    "practice": "Usa una tabla de referencia normativa en un ejercicio ficticio y explica qué variables necesitas antes de seleccionar conductor.",
    "mistakes": "Elegir por costumbre; mezclar tablas de contextos distintos; ignorar terminales y temperatura.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-27",
    "order": 27,
    "stage": 4,
    "title": "Caída de tensión",
    "category": "Cálculo",
    "summary": "Todo conductor tiene resistencia, por lo que la tensión disminuye a lo largo de una línea cuando circula corriente. La caída excesiva afecta arranque, iluminación y eficiencia, especialmente en recorridos largos.",
    "concepts": [
      "Relacionar longitud, corriente y sección.",
      "Distinguir ida y retorno.",
      "Calcular porcentaje de caída.",
      "Separar límite de diseño de criterio normativo."
    ],
    "example": "Una carga de 12 V alimentada por cable largo y delgado puede recibir solo 10.8 V bajo carga aunque la fuente mida 12 V en vacío.",
    "practice": "Calcula caída en un circuito didáctico de 12 V con distintos largos y secciones usando la calculadora de OficiosLab.",
    "mistakes": "Medir solo en vacío; olvidar longitud total del circuito; confundir pérdida de voltaje con consumo.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-28",
    "order": 28,
    "stage": 4,
    "title": "Protección contra sobrecorriente",
    "category": "Protecciones",
    "summary": "Fusibles e interruptores automáticos protegen conductores y equipos frente a corrientes excesivas. La coordinación correcta busca que la protección actúe antes de que el conductor alcance condiciones peligrosas.",
    "concepts": [
      "Distinguir sobrecarga y cortocircuito.",
      "Coordinar protección con conductor.",
      "Reconocer curvas y capacidades conceptualmente.",
      "No usar protección como interruptor improvisado salvo diseño previsto."
    ],
    "example": "Un interruptor de mayor corriente no “mejora” una instalación si el conductor aguas abajo no está dimensionado para esa corriente.",
    "practice": "Analiza casos ficticios de conductor + carga + protección y detecta incompatibilidades conceptuales.",
    "mistakes": "Sobredimensionar breaker para evitar disparos; puentear fusibles; asumir que protege contra toda clase de choque eléctrico.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-29",
    "order": 29,
    "stage": 4,
    "title": "Puesta a tierra y protección",
    "category": "Protecciones",
    "summary": "La puesta a tierra y los conductores de protección crean rutas y referencias diseñadas para reducir tensiones peligrosas y facilitar actuación de protecciones. No reemplazan el aislamiento ni las prácticas de trabajo seguro.",
    "concepts": [
      "Distinguir tierra funcional y de protección.",
      "Comprender equipotencialidad.",
      "Reconocer unión de partes metálicas.",
      "No usar tuberías improvisadas como solución."
    ],
    "example": "Una carcasa metálica conectada al conductor de protección ofrece una ruta de falla prevista; una carcasa flotante puede quedar energizada si ocurre una falla interna.",
    "practice": "Estudia diagramas de falla a carcasa y explica qué ruta esperas que siga la corriente de falla.",
    "mistakes": "Confundir tierra con neutro; retirar conductor de protección; asumir que “tierra” vuelve segura cualquier instalación.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-30",
    "order": 30,
    "stage": 4,
    "title": "Canalizaciones y cajas",
    "category": "Diseño",
    "summary": "Canalizaciones protegen conductores y organizan recorridos. Cajas proporcionan volumen para conexiones y dispositivos, acceso para mantenimiento y protección mecánica. El diseño considera ocupación, radios de curvatura y ambiente.",
    "concepts": [
      "Seleccionar tipo según ambiente.",
      "Planear trayectorias accesibles.",
      "Evitar sobreocupación.",
      "Considerar cajas de paso y registros."
    ],
    "example": "Un recorrido con demasiadas curvas dificulta el tendido aunque eléctricamente parezca correcto en el plano.",
    "practice": "Dibuja una ruta de canalización para una habitación ficticia minimizando cruces y curvas.",
    "mistakes": "Usar cajas subdimensionadas; ocultar empalmes inaccesibles; llenar canalización al límite sin cálculo.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-31",
    "order": 31,
    "stage": 4,
    "title": "Plano eléctrico residencial",
    "category": "Lectura técnica",
    "summary": "El plano eléctrico integra ubicación de luminarias, contactos, interruptores, tableros, circuitos y notas. Debe ser legible para otra persona y mantener coherencia con cuadro de cargas y especificaciones.",
    "concepts": [
      "Usar simbología consistente.",
      "Etiquetar circuitos y tableros.",
      "Vincular plano con cuadro de cargas.",
      "Agregar notas y leyenda."
    ],
    "example": "Un contacto marcado C-3 en planta debe corresponder al circuito C-3 del cuadro de cargas y su protección prevista.",
    "practice": "Crea el plano eléctrico de una recámara ficticia con leyenda, circuitos y notas.",
    "mistakes": "Dibujar sin leyenda; omitir circuitos; cambiar simbología a mitad del plano.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e5-32",
    "order": 32,
    "stage": 5,
    "title": "Canalización y preparación de obra",
    "category": "Ejecución",
    "summary": "La ejecución comienza con trazado, verificación de interferencias y preparación de soportes antes de introducir conductores. Una canalización bien instalada protege y facilita mantenimiento.",
    "concepts": [
      "Revisar plano y ruta real.",
      "Mantener radios y soportes adecuados.",
      "Proteger bordes y entradas.",
      "Dejar acceso a registros."
    ],
    "example": "Un cambio pequeño en obra puede obligar a reubicar una caja; documentarlo evita que el plano final quede desactualizado.",
    "practice": "En un panel de madera de práctica, traza y monta canalización sin conductores de red.",
    "mistakes": "Perforar sin revisar instalaciones ocultas; forzar curvas; dejar bordes cortantes.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-33",
    "order": 33,
    "stage": 5,
    "title": "Tendido de conductores",
    "category": "Ejecución",
    "summary": "El tendido debe evitar daño mecánico, tensión excesiva y confusión de conductores. La identificación y el orden durante el jalado reducen errores posteriores.",
    "concepts": [
      "Preparar guía y recorrido.",
      "Identificar extremos.",
      "Evitar dañar aislamiento.",
      "No exceder esfuerzo de tracción."
    ],
    "example": "Etiquetar ambos extremos antes del jalado evita perder horas identificando qué conductor llega a cada caja.",
    "practice": "Practica tendido en tubo corto desenergizado de entrenamiento con conductores de baja tensión.",
    "mistakes": "Jalar por aislamiento dañado; mezclar conductores sin etiqueta; improvisar lubricantes incompatibles.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-34",
    "order": 34,
    "stage": 5,
    "title": "Empalmes y conectores",
    "category": "Ejecución",
    "summary": "Una unión eléctrica debe tener baja resistencia, resistencia mecánica y aislamiento compatible con el entorno. El método correcto depende del conductor y conector; “torcer y encintar” no es una solución universal.",
    "concepts": [
      "Usar conectores listados para el conductor.",
      "Respetar longitud de pelado.",
      "Verificar sujeción mecánica.",
      "Alojar empalmes en caja accesible."
    ],
    "example": "Un falso contacto puede funcionar al principio y calentarse bajo carga por resistencia de contacto elevada.",
    "practice": "Practica conectores en cable de baja tensión y realiza prueba de tracción ligera e inspección visual.",
    "mistakes": "Dejar cobre expuesto; mezclar calibres incompatibles; reutilizar conectores dañados.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-35",
    "order": 35,
    "stage": 5,
    "title": "Cajas y dispositivos",
    "category": "Ejecución",
    "summary": "Cajas soportan dispositivos y contienen conexiones. La instalación debe evitar tensión mecánica sobre terminales, respetar espacio interno y permitir desmontaje futuro.",
    "concepts": [
      "Preparar conductores con longitud útil.",
      "Acomodar sin aplastar aislamiento.",
      "Fijar dispositivo alineado.",
      "Mantener tapa y acceso."
    ],
    "example": "Un conductor demasiado corto obliga a tensión sobre el terminal y dificulta mantenimiento; demasiado largo mal acomodado también puede dañar conexiones.",
    "practice": "Monta una caja didáctica sin red con un interruptor de baja tensión y practica orden interno.",
    "mistakes": "Apretar tornillos sobre aislamiento; dejar cobre suelto; forzar dispositivos dentro de la caja.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-36",
    "order": 36,
    "stage": 5,
    "title": "Interruptores y control de iluminación",
    "category": "Ejecución",
    "summary": "Un interruptor controla la trayectoria hacia una carga. En sistemas más complejos aparecen conmutadores y controles electrónicos; lo importante es entender qué conductor se interrumpe y cómo se representa en el diagrama.",
    "concepts": [
      "Leer diagrama antes de conectar.",
      "Distinguir entrada, salida y viajeros conceptualmente.",
      "Controlar el conductor activo según diseño.",
      "Etiquetar conductores."
    ],
    "example": "Un interruptor simple abre o cierra una sola trayectoria; dos puntos de control requieren una topología diferente, no dos interruptores simples en serie.",
    "practice": "Simula circuitos de control de iluminación y verifica estados antes de cualquier práctica supervisada.",
    "mistakes": "Interrumpir conductor equivocado; copiar colores sin verificar función; trabajar energizado.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-37",
    "order": 37,
    "stage": 5,
    "title": "Iluminación",
    "category": "Ejecución",
    "summary": "Un sistema de iluminación combina carga, control, ubicación, potencia y calidad de luz. El electricista debe interpretar ficha técnica, potencia, tensión y método de montaje además del circuito.",
    "concepts": [
      "Leer potencia y tensión de luminaria.",
      "Considerar temperatura y ambiente.",
      "Planear control y mantenimiento.",
      "Reconocer drivers LED."
    ],
    "example": "Una luminaria LED de 12 W no se selecciona solo por watts: flujo luminoso, temperatura de color y driver también importan.",
    "practice": "Compara fichas de tres luminarias y explica cuál sería adecuada para distintos espacios.",
    "mistakes": "Elegir solo por watts; cubrir luminarias que necesitan disipación; ignorar compatibilidad de atenuadores.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-38",
    "order": 38,
    "stage": 5,
    "title": "Contactos y receptáculos",
    "category": "Ejecución",
    "summary": "Los receptáculos proporcionan puntos de conexión y deben seleccionarse según tensión, corriente, ambiente y protección requerida. Su polaridad y conductor de protección deben mantenerse coherentes.",
    "concepts": [
      "Identificar terminales por función.",
      "Reconocer contactos especiales.",
      "Considerar ambiente húmedo.",
      "Probar polaridad y protección al entregar."
    ],
    "example": "Un receptáculo puede verse correcto externamente y tener conexiones incorrectas; por eso las pruebas finales importan.",
    "practice": "Estudia un receptáculo didáctico desenergizado e identifica terminales y marcajes del fabricante.",
    "mistakes": "Conectar por posición sin leer marcaje; omitir tierra; usar dispositivo dañado.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e5-39",
    "order": 39,
    "stage": 5,
    "title": "Centro de carga y tableros",
    "category": "Ejecución",
    "summary": "El tablero concentra distribución y protección. Su estudio incluye identificación de barras, interruptores, capacidad, directorio y separación funcional de conductores según el sistema. La intervención real exige competencia y procedimiento de trabajo seguro.",
    "concepts": [
      "Leer placa y capacidad del tablero.",
      "Entender función de barras y breakers.",
      "Mantener directorio actualizado.",
      "Reconocer riesgo de partes energizadas incluso con interruptor principal abierto."
    ],
    "example": "Un directorio “recámara / cocina / baño” permite aislar circuitos rápidamente; etiquetas ambiguas dificultan mantenimiento y emergencias.",
    "practice": "Trabaja sobre fotografías y diagramas de tableros para identificar componentes sin abrir uno energizado.",
    "mistakes": "Abrir tablero por curiosidad; asumir que todo queda sin energía al bajar principal; mezclar conductores de función distinta.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e6-40",
    "order": 40,
    "stage": 6,
    "title": "Desenergización y control de energía",
    "category": "Seguridad",
    "summary": "Antes de intervenir, la energía debe identificarse, aislarse, bloquearse cuando corresponda y verificarse. “Apagar” un equipo no equivale a establecer una condición segura de trabajo.",
    "concepts": [
      "Identificar todas las fuentes.",
      "Aislar y señalizar.",
      "Evitar reenergización inesperada.",
      "Verificar antes de tocar."
    ],
    "example": "Un circuito puede recibir energía desde más de una fuente, por ejemplo red y respaldo; aislar solo una no garantiza seguridad.",
    "practice": "Simula un procedimiento de aislamiento en papel: enumera fuente, punto de seccionamiento, bloqueo, verificación y restitución.",
    "mistakes": "Confiar en etiquetas antiguas; omitir fuentes de respaldo; trabajar solo con “interruptor apagado”.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e6-41",
    "order": 41,
    "stage": 6,
    "title": "Verificación de ausencia de tensión",
    "category": "Seguridad",
    "summary": "La ausencia de tensión debe comprobarse con un instrumento apropiado y un método que confirme que el instrumento funciona antes y después de la prueba. Es un paso de seguridad, no una medición casual.",
    "concepts": [
      "Seleccionar instrumento adecuado.",
      "Probarlo en una fuente conocida.",
      "Medir puntos relevantes.",
      "Volver a comprobar el instrumento."
    ],
    "example": "Si el probador está averiado, una lectura de cero puede ser engañosa; la verificación antes/después reduce ese riesgo.",
    "practice": "Practica el concepto con una fuente de 12 V: comprueba el medidor, mide, desconecta y vuelve a comprobar.",
    "mistakes": "Dar por segura una lectura cero sin validar instrumento; medir solo un conductor; usar equipo no apto.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e6-42",
    "order": 42,
    "stage": 6,
    "title": "Circuito abierto",
    "category": "Diagnóstico",
    "summary": "Un circuito abierto interrumpe la trayectoria, por lo que puede existir voltaje en parte del circuito pero no corriente útil hacia la carga. Se localiza siguiendo continuidad o voltajes por secciones con método.",
    "concepts": [
      "Reconocer síntomas.",
      "Dividir circuito por puntos.",
      "Comparar lados de una apertura.",
      "Distinguir apertura de carga defectuosa."
    ],
    "example": "Un cable roto antes de una lámpara puede dejar tensión aguas arriba y 0 V sobre la lámpara dependiendo de referencias de medición.",
    "practice": "Introduce una apertura en un circuito de baja tensión y localízala usando continuidad con la fuente desconectada.",
    "mistakes": "Cambiar la carga sin medir; interpretar cualquier 0 V como falta de alimentación.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e6-43",
    "order": 43,
    "stage": 6,
    "title": "Cortocircuito y falla a tierra",
    "category": "Diagnóstico",
    "summary": "Un cortocircuito crea una trayectoria de impedancia muy baja entre puntos con diferencia de potencial. Una falla a tierra involucra partes conectadas al sistema de protección. Ambas pueden producir corrientes elevadas y actuación de protecciones.",
    "concepts": [
      "Distinguir corto y sobrecarga.",
      "Comprender ruta de falla.",
      "Relacionar con protección.",
      "No rearmar repetidamente sin investigar."
    ],
    "example": "Si una protección dispara inmediatamente al energizar, una hipótesis es corto; rearmarla una y otra vez aumenta el riesgo sin resolver la causa.",
    "practice": "Usa un simulador con limitación de corriente para observar cómo baja la resistencia y aumenta la corriente teórica.",
    "mistakes": "Puenteo de protección; buscar cortos en vivo; confundir neutro con tierra.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e6-44",
    "order": 44,
    "stage": 6,
    "title": "Caída de tensión anormal",
    "category": "Diagnóstico",
    "summary": "Una conexión floja o conductor dañado puede comportarse como resistencia adicional. Bajo carga aparece caída de tensión y calentamiento, aunque en vacío todo parezca normal.",
    "concepts": [
      "Medir bajo carga cuando sea seguro.",
      "Comparar puntos consecutivos.",
      "Buscar conexiones de alta resistencia.",
      "Relacionar caída con calentamiento."
    ],
    "example": "Un conector oxidado puede mostrar casi 0 V de caída sin carga y varios volts cuando circula corriente.",
    "practice": "Simula una resistencia extra de contacto en un circuito de 12 V y compara tensiones con distintas cargas.",
    "mistakes": "Diagnosticar solo en vacío; apretar sin inspeccionar daño; ignorar calentamiento.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e6-45",
    "order": 45,
    "stage": 6,
    "title": "Localización sistemática de fallas",
    "category": "Diagnóstico",
    "summary": "El diagnóstico profesional reduce incertidumbre paso a paso. Comienza con síntoma, historial y seguridad; después divide el sistema, mide y actualiza hipótesis.",
    "concepts": [
      "Definir síntoma exacto.",
      "Empezar por lo común y verificable.",
      "Dividir por mitades cuando conviene.",
      "Confirmar reparación con prueba final."
    ],
    "example": "Si media instalación funciona y media no, el límite entre ambas zonas puede orientar mejor que revisar cada carga individualmente.",
    "practice": "Resuelve tres casos de “síntoma → hipótesis → medición → conclusión” en el entrenador de diagnóstico.",
    "mistakes": "Cambiar piezas por ensayo; no documentar; detenerse cuando “parece funcionar” sin prueba final.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e6-46",
    "order": 46,
    "stage": 6,
    "title": "Mantenimiento preventivo",
    "category": "Mantenimiento",
    "summary": "El mantenimiento preventivo busca detectar deterioro antes de una falla: conexiones, calentamiento, suciedad, corrosión, aislamiento, identificación y operación de protecciones. Su alcance depende del equipo y fabricante.",
    "concepts": [
      "Inspección visual programada.",
      "Registro histórico.",
      "Torque solo según especificación y procedimiento.",
      "Pruebas funcionales apropiadas."
    ],
    "example": "Una tendencia de temperatura creciente en una conexión puede revelar deterioro aunque aún no exista una falla abierta.",
    "practice": "Crea una checklist preventiva para un tablero ficticio usando solo inspección documental y visual externa.",
    "mistakes": "Apretar indiscriminadamente; intervenir sin desenergizar; no conservar historial.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e7-47",
    "order": 47,
    "stage": 7,
    "title": "Lectura de planos y especificaciones",
    "category": "Profesional",
    "summary": "Un electricista profesional conecta planos, cuadro de cargas, detalles, notas y especificaciones. Cuando existe conflicto, no se improvisa: se documenta y se solicita aclaración.",
    "concepts": [
      "Cruzar planta y cuadro de cargas.",
      "Leer detalles y notas.",
      "Detectar inconsistencias.",
      "Controlar revisiones de planos."
    ],
    "example": "Si el plano muestra un circuito C-4 pero el cuadro no lo incluye, es una inconsistencia que debe resolverse antes de ejecutar.",
    "practice": "Revisa un plano ficticio y encuentra cinco inconsistencias preparadas.",
    "mistakes": "Construir con una versión antigua; ignorar notas; asumir sin consultar.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-48",
    "order": 48,
    "stage": 7,
    "title": "Cuantificación",
    "category": "Profesional",
    "summary": "Cuantificar convierte el diseño en cantidades: metros de conductor, canalización, cajas, dispositivos, protecciones y accesorios. Debe considerar recorrido real y desperdicio razonable.",
    "concepts": [
      "Medir por circuito.",
      "Separar materiales por tipo.",
      "Agregar accesorios y soportes.",
      "Registrar supuestos."
    ],
    "example": "Un plano con 20 m lineales de muro no implica automáticamente 20 m de conductor; cada circuito tiene ida, retorno y trayectorias propias.",
    "practice": "Cuantifica una habitación ficticia desde plano y compara con otra persona.",
    "mistakes": "Contar solo elementos visibles; olvidar cajas, conectores y soportes; no considerar recorridos verticales.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-49",
    "order": 49,
    "stage": 7,
    "title": "Lista de materiales",
    "category": "Profesional",
    "summary": "La lista de materiales transforma cantidades en partidas comprables con especificación suficiente para evitar sustituciones inadecuadas. Debe distinguir unidad, cantidad, descripción y características críticas.",
    "concepts": [
      "Usar nombres técnicos claros.",
      "Incluir unidad y cantidad.",
      "Definir calibre/tipo/clase cuando aplique.",
      "Separar consumibles de equipo."
    ],
    "example": "“Cable 100 m” es ambiguo; “conductor cobre, tipo X, sección Y, color Z, 100 m” reduce errores de compra.",
    "practice": "Convierte una cuantificación simple en una BOM ordenada.",
    "mistakes": "Usar marcas como única especificación; mezclar unidades; no contemplar desperdicio.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-50",
    "order": 50,
    "stage": 7,
    "title": "Presupuesto",
    "category": "Profesional",
    "summary": "Presupuestar integra materiales, mano de obra, herramientas, indirectos, desperdicio, traslados y contingencias. Un presupuesto profesional explica alcance y exclusiones, no solo entrega una cifra.",
    "concepts": [
      "Separar costo directo e indirecto.",
      "Definir alcance.",
      "Estimar horas de trabajo.",
      "Registrar vigencia y supuestos."
    ],
    "example": "Dos presupuestos con el mismo material pueden diferir por complejidad de obra, acceso y tiempos de instalación.",
    "practice": "Arma un presupuesto ficticio de una habitación y calcula costo por material + horas + margen.",
    "mistakes": "Cotizar sin alcance; olvidar consumibles; absorber cambios no documentados.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-51",
    "order": 51,
    "stage": 7,
    "title": "Plan de trabajo",
    "category": "Profesional",
    "summary": "Un plan ordena dependencias: trazado, canalización, tendido, montaje, identificación, pruebas y cierre. Coordinarse con otros oficios evita retrabajo.",
    "concepts": [
      "Definir secuencia.",
      "Identificar dependencias.",
      "Planear recursos y tiempos.",
      "Incluir puntos de inspección."
    ],
    "example": "Instalar dispositivos antes de acabados puede exponerlos a daño; el orden de obra importa tanto como la conexión.",
    "practice": "Crea un cronograma simple para una instalación ficticia de dos días.",
    "mistakes": "Trabajar sin secuencia; no coordinar perforaciones; no reservar tiempo para pruebas.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-52",
    "order": 52,
    "stage": 7,
    "title": "Control de calidad",
    "category": "Profesional",
    "summary": "Calidad significa comprobar contra plano, especificación y criterios de aceptación. Incluye inspección visual, identificación, fijación, continuidad, polaridad y pruebas aplicables realizadas de manera segura.",
    "concepts": [
      "Usar checklist reproducible.",
      "Diferenciar inspección y prueba.",
      "Registrar no conformidades.",
      "Corregir y volver a verificar."
    ],
    "example": "Una conexión puede funcionar y aun así ser no conforme si carece de identificación, protección mecánica o sujeción adecuada.",
    "practice": "Diseña una checklist de entrega para un tablero didáctico de baja tensión.",
    "mistakes": "Reducir calidad a “enciende/no enciende”; corregir sin registrar; saltarse inspección final.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e7-53",
    "order": 53,
    "stage": 7,
    "title": "Pruebas, puesta en marcha y entrega",
    "category": "Profesional",
    "summary": "La puesta en marcha confirma que el sistema cumple su intención antes de entregarse. Debe seguir una secuencia documentada, con resultados, etiquetas, planos finales y explicación al usuario.",
    "concepts": [
      "Revisar antes de energizar.",
      "Energizar por etapas cuando aplique.",
      "Registrar mediciones.",
      "Entregar documentación y directorio."
    ],
    "example": "Un circuito aprobado visualmente puede revelar una polaridad incorrecta durante pruebas; por eso la puesta en marcha es una fase propia.",
    "practice": "Simula una entrega: prepara checklist, valores esperados y reporte final de un panel de 12 V.",
    "mistakes": "Energizar todo de golpe sin revisión; no conservar resultados; no actualizar plano as-built.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e8-54",
    "order": 54,
    "stage": 8,
    "title": "Motores eléctricos",
    "category": "Especialización",
    "summary": "Los motores convierten energía eléctrica en movimiento mediante campos magnéticos. Para trabajar con ellos necesitas distinguir tipo de motor, tensión, corriente nominal, corriente de arranque y método de control.",
    "concepts": [
      "Leer placa de motor.",
      "Distinguir AC y DC.",
      "Comprender arranque y sobrecarga.",
      "Relacionar carga mecánica con corriente."
    ],
    "example": "Un motor puede demandar varias veces su corriente nominal durante el arranque, por lo que protección y conductores no se evalúan igual que una carga resistiva simple.",
    "practice": "Analiza placas de motores en fotografías y extrae tensión, corriente, potencia, velocidad y servicio.",
    "mistakes": "Seleccionar por watts únicamente; ignorar arranque; invertir conexiones sin diagrama.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e8-55",
    "order": 55,
    "stage": 8,
    "title": "Relevadores y contactores",
    "category": "Control",
    "summary": "Relevadores y contactores permiten controlar cargas mediante una señal separada. Una bobina acciona contactos; la diferencia principal suele estar en capacidad, construcción y aplicación.",
    "concepts": [
      "Distinguir bobina y contactos.",
      "Leer NO/NC.",
      "Separar circuito de control y potencia.",
      "Revisar tensión de bobina."
    ],
    "example": "Un pulsador de baja corriente puede energizar la bobina de un contactor que conmuta una carga mayor.",
    "practice": "Monta un relevador de 5/12 V en protoboard y controla una lámpara LED de baja tensión.",
    "mistakes": "Aplicar tensión incorrecta a bobina; confundir terminales; ignorar diodo de rueda libre en DC cuando corresponda.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e8-56",
    "order": 56,
    "stage": 8,
    "title": "Circuitos de control",
    "category": "Control",
    "summary": "Los circuitos de control expresan lógica mediante contactos, bobinas, temporizadores y sensores. Entender enclavamientos y estados permite leer automatismos incluso antes de programar un PLC.",
    "concepts": [
      "Leer diagramas ladder básicos.",
      "Reconocer auto-mantenimiento.",
      "Distinguir paro NC y arranque NO conceptualmente.",
      "Separar lógica de potencia."
    ],
    "example": "Un circuito de arranque-paro puede mantener una bobina energizada mediante un contacto auxiliar hasta que se abra el circuito de paro.",
    "practice": "Simula un circuito ladder de arranque-paro en software, sin conectar potencia real.",
    "mistakes": "Copiar circuitos sin entender estado seguro; omitir paro; mezclar tensiones de control.",
    "safety": "theory",
    "formula": ""
  },
  {
    "id": "e8-57",
    "order": 57,
    "stage": 8,
    "title": "Sensores y actuadores",
    "category": "Automatización",
    "summary": "Un sistema automático mide una condición con sensores, toma una decisión y actúa sobre una salida. Los sensores se clasifican por variable, salida y alimentación; los actuadores por la energía que controlan.",
    "concepts": [
      "Distinguir digital y analógico.",
      "Leer rango y tipo de salida.",
      "Entender PNP/NPN a nivel conceptual.",
      "Aislar señal de potencia cuando corresponda."
    ],
    "example": "Un sensor de luz puede activar un relevador cuando la iluminancia baja de cierto umbral.",
    "practice": "Con Arduino o simulador, lee un LDR y activa un LED según umbral.",
    "mistakes": "Conectar sensor directamente a carga excesiva; ignorar alimentación y referencia común.",
    "safety": "safe",
    "formula": ""
  },
  {
    "id": "e8-58",
    "order": 58,
    "stage": 8,
    "title": "Sistemas fotovoltaicos",
    "category": "Solar",
    "summary": "Un sistema fotovoltaico convierte irradiancia en energía DC y combina módulos, protecciones, cableado, inversor y estructura. La tensión DC de strings puede ser peligrosa aun con la red desconectada, por lo que la práctica real requiere capacitación específica.",
    "concepts": [
      "Identificar módulo, string e inversor.",
      "Leer Voc, Isc, Vmp e Imp.",
      "Comprender serie/paralelo de módulos.",
      "Reconocer riesgos DC y desconexión."
    ],
    "example": "Dos módulos iguales en serie aproximadamente duplican tensión de operación manteniendo corriente de string; en paralelo ocurre lo contrario conceptualmente.",
    "practice": "Usa fichas técnicas de módulos para calcular tensiones/corrientes teóricas de arreglos, sin montar strings reales.",
    "mistakes": "Trabajar con strings energizados al sol sin procedimiento; mezclar módulos incompatibles; ignorar tensión máxima del inversor.",
    "safety": "supervised",
    "formula": ""
  },
  {
    "id": "e8-59",
    "order": 59,
    "stage": 8,
    "title": "Dimensionamiento solar básico",
    "category": "Solar",
    "summary": "Dimensionar comienza por energía diaria, recurso solar, pérdidas y límites del equipo. El resultado no es solo “número de paneles”: también implica tensión de string, corriente, inversor, conductores y protecciones.",
    "concepts": [
      "Estimar kWh/día.",
      "Aplicar horas solares pico como aproximación.",
      "Incluir factor de pérdidas.",
      "Verificar límites eléctricos del inversor."
    ],
    "example": "Si una vivienda usa 6 kWh/día y se asumen 5 h solares pico, la potencia ideal mínima sería 1.2 kW antes de considerar pérdidas y márgenes.",
    "practice": "Calcula tres escenarios con consumos distintos y compara potencia FV estimada.",
    "mistakes": "Dividir consumo por potencia de un panel sin considerar tiempo; ignorar orientación, sombras y límites de tensión.",
    "safety": "design",
    "formula": "Pfv ≈ Energía diaria / HSP / eficiencia"
  },
  {
    "id": "e8-60",
    "order": 60,
    "stage": 8,
    "title": "Respaldo, UPS y baterías",
    "category": "Respaldo",
    "summary": "Los sistemas de respaldo aportan energía cuando la fuente principal falla. Su diseño depende de potencia instantánea, energía requerida, autonomía, química de batería y estrategia de transferencia.",
    "concepts": [
      "Distinguir W de Wh.",
      "Calcular autonomía aproximada.",
      "Considerar profundidad de descarga y eficiencia.",
      "Separar cargas críticas."
    ],
    "example": "Una carga de 300 W durante 2 h necesita al menos 600 Wh útiles, más margen por pérdidas y límites de batería.",
    "practice": "Define cargas críticas de una vivienda ficticia y estima energía necesaria para 4 h.",
    "mistakes": "Dimensionar solo por capacidad Ah sin tensión; conectar baterías sin protección; mezclar químicas o estados.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e8-61",
    "order": 61,
    "stage": 8,
    "title": "Automatización residencial",
    "category": "Automatización",
    "summary": "La automatización residencial integra sensores, actuadores, comunicaciones y lógica. Un buen diseño mantiene control manual, seguridad y operación básica aun cuando falle la red de datos o la nube.",
    "concepts": [
      "Separar automatización de protección eléctrica.",
      "Diseñar estados seguros.",
      "Prever control manual.",
      "Documentar dependencias de red."
    ],
    "example": "Una luz inteligente no debería impedir que una persona pueda controlar iluminación esencial si se cae Internet.",
    "practice": "Diseña la arquitectura de una habitación: sensores, actuadores, controlador, alimentación y fallback manual.",
    "mistakes": "Depender totalmente de nube; mezclar baja tensión con red sin separación; automatizar una función de seguridad sin redundancia.",
    "safety": "design",
    "formula": ""
  },
  {
    "id": "e4-62", "order": 62, "stage": 4, "title": "Demanda, simultaneidad y reserva", "category": "Diseño",
    "summary": "Una vivienda rara vez utiliza todas sus cargas a potencia máxima al mismo tiempo. El diseño profesional distingue carga conectada, demanda probable y reserva futura, aplicando únicamente los factores permitidos por la norma y el caso de diseño.",
    "concepts": ["Distinguir carga conectada y demanda", "Documentar factores aplicados", "Separar cargas continuas y no continuas", "Prever crecimiento sin sobredimensionar a ciegas"],
    "example": "Sumar placas de todos los aparatos produce carga conectada; la demanda de diseño puede ser distinta si la metodología normativa permite factores específicos.",
    "practice": "Resuelve tres viviendas ficticias y construye una tabla carga conectada → criterio aplicado → demanda de diseño, citando siempre el supuesto usado.",
    "mistakes": "Inventar factores de demanda; aplicar un porcentaje global sin fundamento; olvidar cargas especiales o futuras.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-63", "order": 63, "stage": 4, "title": "Aislamiento, temperatura y ampacidad", "category": "Conductores",
    "summary": "El calibre no se decide solo por corriente nominal. Material, aislamiento, temperatura, método de instalación, agrupamiento y terminales condicionan la capacidad de conducción y el límite utilizable.",
    "concepts": ["Leer tipo de aislamiento", "Relacionar temperatura y ampacidad", "Reconocer límites de terminales", "Separar cálculo de caída de tensión de ampacidad"],
    "example": "Dos conductores del mismo calibre pueden tener límites distintos si cambian aislamiento, ambiente o canalización.",
    "practice": "Con tablas de ejercicio proporcionadas por la plataforma, selecciona conductor para seis casos y explica cuál condición gobernó cada selección.",
    "mistakes": "Elegir por costumbre; usar la temperatura máxima del cable ignorando terminales; confundir ampacidad con protección automática.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-64", "order": 64, "stage": 4, "title": "Factores de corrección y agrupamiento", "category": "Conductores",
    "summary": "Cuando varios conductores cargados comparten canalización o aumenta la temperatura ambiente, la capacidad térmica disponible puede disminuir. El diseño debe identificar cuándo corresponde corregir.",
    "concepts": ["Contar conductores portadores de corriente según el caso", "Aplicar factores de ejercicio", "Revisar temperatura ambiente", "Iterar calibre después de corrección"],
    "example": "Un conductor que parecía suficiente en condiciones base puede dejar de serlo después de aplicar correcciones de temperatura y agrupamiento.",
    "practice": "Completa una hoja de cálculo de ocho escenarios variando temperatura, cantidad de conductores y corriente de diseño.",
    "mistakes": "Aplicar factores dos veces; contar conductores incorrectamente; corregir sin volver a comprobar protección y terminales.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-65", "order": 65, "stage": 4, "title": "Ocupación de canalizaciones", "category": "Canalización",
    "summary": "Una canalización debe permitir instalación, disipación y mantenimiento. El diseño profesional calcula ocupación y radios de curvatura en lugar de llenar tubo hasta que 'quepa'.",
    "concepts": ["Área interna útil", "Área ocupada por conductores", "Porcentaje permitido según escenario", "Compatibilidad y radio de curvatura"],
    "example": "Añadir un conductor puede obligar a cambiar el diámetro de tubo aunque eléctricamente el circuito no cambie.",
    "practice": "Usa una tabla didáctica de diámetros y áreas para dimensionar canalización de diez conjuntos de conductores.",
    "mistakes": "Contar solo diámetro exterior visualmente; ignorar curvas y facilidad de tendido; mezclar sistemas incompatibles.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-66", "order": 66, "stage": 4, "title": "Cajas, volumen y espacio de trabajo", "category": "Diseño",
    "summary": "Las cajas alojan conductores, dispositivos y empalmes; su selección debe dejar volumen y acceso suficientes. El orden mecánico reduce daño de aislamiento y facilita mantenimiento.",
    "concepts": ["Contar conductores y accesorios", "Evitar sobrellenado", "Mantener accesibilidad", "Prever profundidad del dispositivo"],
    "example": "Una caja físicamente capaz de cerrar puede seguir siendo una mala elección si comprime conductores y dificulta inspección.",
    "practice": "Diseña seis cajas de ejercicio con diferentes dispositivos y determina cuál necesita mayor volumen usando reglas suministradas.",
    "mistakes": "Elegir caja solo por precio; dejar conexiones inaccesibles; forzar dispositivos contra empalmes.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-67", "order": 67, "stage": 4, "title": "Protección diferencial y zonas de mayor riesgo", "category": "Protecciones",
    "summary": "La protección contra sobrecorriente y la protección diferencial cumplen funciones distintas. En zonas con mayor probabilidad de contacto o humedad, el diseño debe reconocer requisitos de protección adicional aplicables.",
    "concepts": ["Diferenciar sobrecorriente y fuga", "Reconocer zonas húmedas", "Entender prueba periódica", "Coordinar dispositivo y circuito"],
    "example": "Un interruptor termomagnético puede no detectar una fuga pequeña a través de una persona; un dispositivo diferencial está diseñado para otro tipo de anomalía.",
    "practice": "Analiza un plano de vivienda y marca puntos donde revisarías requisitos especiales de protección antes de cerrar el diseño.",
    "mistakes": "Creer que tierra física sustituye diferencial; asumir que cualquier breaker protege contra todo; omitir instrucciones de prueba.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-68", "order": 68, "stage": 4, "title": "Sobretensiones y protección transitoria", "category": "Protecciones",
    "summary": "Sobretensiones transitorias pueden originarse por maniobras o fenómenos atmosféricos. Los supresores limitan picos dentro de una estrategia de puesta a tierra y coordinación, no reemplazan otras protecciones.",
    "concepts": ["Distinguir sobretensión transitoria", "Ubicar SPD conceptualmente", "Relacionar con puesta a tierra", "Leer parámetros básicos de un SPD"],
    "example": "Instalar un SPD sin una conexión de protección adecuada puede reducir su eficacia aunque el dispositivo sea correcto.",
    "practice": "Compara fichas técnicas de tres SPD ficticios y elige uno para tres escenarios justificando tensión, arquitectura y ubicación.",
    "mistakes": "Vender un SPD como protección absoluta; confundirlo con regulador; ignorar longitud de conexiones.", "safety": "design", "formula": ""
  },
  {
    "id": "e4-69", "order": 69, "stage": 4, "title": "Cocina, baño, exterior y cargas especiales", "category": "Residencial",
    "summary": "Los espacios y equipos especiales concentran requisitos de circuitos, protección y ubicación. El diseño debe estudiarlos como casos propios y no copiar el circuito genérico de una recámara.",
    "concepts": ["Identificar cargas de cocina", "Revisar zonas húmedas", "Distinguir interior/exterior", "Separar equipos fijos y cargas dedicadas cuando corresponda"],
    "example": "Un calentador, una bomba o un equipo de climatización puede exigir circuito y medio de desconexión distintos a un contacto de uso general.",
    "practice": "Recibe cuatro planos de habitaciones y produce una lista de preguntas normativas/técnicas que debes resolver antes de dimensionar cada una.",
    "mistakes": "Aplicar un mismo criterio a toda la casa; olvidar placa del equipo; ignorar ambiente húmedo o exterior.", "safety": "design", "formula": ""
  },
  {
    "id": "e5-70", "order": 70, "stage": 5, "title": "Curvado y preparación de tubería", "category": "Ejecución",
    "summary": "Una canalización bien ejecutada mantiene recorrido, radio, alineación y continuidad mecánica. Las curvas deben planearse para permitir tendido sin dañar conductores.",
    "concepts": ["Medir antes de doblar", "Controlar radio", "Evitar estrangulamientos", "Planear cantidad de curvas"],
    "example": "Una curva visualmente aceptable puede dificultar el jalado si reduce sección o acumula cambios de dirección.",
    "practice": "En tubo de práctica no energizado, fabrica tramos con desplazamiento y 90° siguiendo medidas de ejercicio; compara resultado contra plantilla.",
    "mistakes": "Doblar sin referencia; deformar tubo; acumular curvas sin puntos de acceso.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e5-71", "order": 71, "stage": 5, "title": "Soportes, sujeción y protección mecánica", "category": "Ejecución",
    "summary": "Canalizaciones y cajas deben quedar soportadas y protegidas contra golpes, bordes y movimiento. La calidad mecánica es parte de la seguridad eléctrica.",
    "concepts": ["Soportar recorridos", "Proteger entradas", "Evitar tensión mecánica", "Mantener accesibilidad"],
    "example": "Un cable correctamente dimensionado puede fallar prematuramente si roza un borde metálico sin protección.",
    "practice": "Monta un recorrido de 1.5 m en panel de entrenamiento y realiza una inspección mecánica con checklist.",
    "mistakes": "Usar el conductor como soporte; dejar cajas flojas; permitir bordes cortantes.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e5-72", "order": 72, "stage": 5, "title": "Identificación y administración de conductores", "category": "Ejecución",
    "summary": "Etiquetar origen, destino y función evita errores durante conexión, mantenimiento y diagnóstico. El orden de un tablero o caja debe permitir seguir el circuito.",
    "concepts": ["Etiquetar ambos extremos", "Separar circuitos", "Mantener código de identificación", "Registrar cambios"],
    "example": "Dos conductores del mismo color en una caja compleja pueden ser técnicamente distinguibles con medición, pero una instalación profesional no debería depender de adivinar.",
    "practice": "Cablea un panel didáctico con cuatro circuitos de baja tensión, etiqueta ambos extremos y pide a otra persona rastrear cada recorrido.",
    "mistakes": "Etiquetas ambiguas; marcadores que se borran; no actualizar plano después de cambios.", "safety": "safe", "formula": ""
  },
  {
    "id": "e5-73", "order": 73, "stage": 5, "title": "Empalmes, conectores y preparación del conductor", "category": "Ejecución",
    "summary": "La conexión eléctrica también es una unión mecánica. Pelado, longitud, conector compatible y asentamiento determinan resistencia de contacto y confiabilidad.",
    "concepts": ["Pelar sin dañar", "Usar conector aprobado para conductor", "Respetar longitud", "Realizar prueba mecánica cuando corresponda"],
    "example": "Un conductor parcialmente cortado puede funcionar al principio y luego calentarse o romperse por menor sección efectiva.",
    "practice": "Prepara 12 terminaciones en retazos desenergizados, inspecciona con lupa y clasifica defectos antes de aceptar cada una.",
    "mistakes": "Morder hebras; dejar cobre expuesto; reutilizar conectores inadecuados; improvisar empalmes.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e5-74", "order": 74, "stage": 5, "title": "Torque y calidad de terminales", "category": "Ejecución",
    "summary": "Muchos equipos especifican torque de terminal. Una conexión demasiado floja aumenta resistencia; una excesiva puede dañar tornillo, conductor o equipo.",
    "concepts": ["Buscar torque del fabricante", "Usar herramienta adecuada", "Registrar verificación", "No reapretar por intuición"],
    "example": "Una terminal que 'se siente firme' no es una medición de torque.",
    "practice": "En una bornera didáctica y con valores ficticios, practica ajuste con herramienta dinamométrica si dispones de ella; si no, realiza simulación de procedimiento.",
    "mistakes": "Ajustar sin especificación; usar herramienta incorrecta; dañar conductor por sobreapriete.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e5-75", "order": 75, "stage": 5, "title": "Terminación de interruptores y contactos", "category": "Ejecución",
    "summary": "La terminación de dispositivos exige identificar terminales, longitud de conductor, orientación, caja y conductor de protección según el sistema.",
    "concepts": ["Leer diagrama del dispositivo", "Preparar longitud adecuada", "Evitar cobre expuesto", "Acomodar sin pellizcar"],
    "example": "Un dispositivo puede quedar físicamente instalado y aun así tener polaridad o terminal incorrectos.",
    "practice": "Usa dispositivos de entrenamiento desenergizados o de baja tensión para practicar preparación, montaje y checklist visual.",
    "mistakes": "Copiar posición de tornillos de otra marca; dejar conductor flojo; doblar excesivamente detrás del dispositivo.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e5-76", "order": 76, "stage": 5, "title": "Organización y rotulado de tablero", "category": "Tableros",
    "summary": "Un tablero profesional permite identificar circuitos, protecciones, barras y reservas sin convertir el interior en un laberinto. El rotulado debe coincidir con plano y cuadro de cargas.",
    "concepts": ["Etiquetar circuitos", "Mantener orden de conductores", "Separar funciones de barras", "Conservar documentación"],
    "example": "'Contactos' es una etiqueta pobre si la vivienda tiene varios circuitos; el usuario necesita saber qué zona controla cada protección.",
    "practice": "Organiza un tablero ficticio en papel o maqueta, genera directorio de circuitos y valida que otra persona identifique cada área.",
    "mistakes": "Etiquetas vagas; panel sin fecha; cambios no documentados; confundir neutro y protección.", "safety": "design", "formula": ""
  },
  {
    "id": "e5-77", "order": 77, "stage": 5, "title": "Inspección de ejecución antes de energizar", "category": "Calidad",
    "summary": "Antes de poner en servicio se realiza una inspección sistemática: correspondencia con plano, conexiones, aislamiento, continuidad prevista, aprietes, rotulado y ausencia de daños visibles.",
    "concepts": ["Inspección visual", "Comparar contra plano", "Verificar continuidad/aislamiento según procedimiento", "Cerrar pendientes antes de energizar"],
    "example": "Encontrar un conductor sin etiqueta durante la inspección es barato; encontrarlo después de cerrar muros y energizar es costoso y riesgoso.",
    "practice": "Usa un panel didáctico preparado con 12 defectos deliberados y completa una inspección sin energizar hasta encontrarlos.",
    "mistakes": "Energizar para 'ver si funciona'; revisar solo conexiones visibles; no documentar defectos.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e6-78", "order": 78, "stage": 6, "title": "Diagnóstico de caída de tensión", "category": "Diagnóstico",
    "summary": "Una caída excesiva puede indicar conductor largo, calibre insuficiente, conexión resistiva o carga anormal. Diagnosticar implica medir bajo condiciones controladas y localizar dónde aparece la pérdida.",
    "concepts": ["Comparar fuente y carga", "Medir bajo carga", "Dividir recorrido por secciones", "Relacionar caída con resistencia"],
    "example": "Si la fuente mantiene tensión pero la carga recibe mucho menos, el problema está entre ambos puntos o en la corriente demandada.",
    "practice": "Crea una falla segura en banco de 5–12 V usando resistencia conocida y localiza la caída midiendo por segmentos.",
    "mistakes": "Medir solo sin carga; culpar a la fuente sin comparar; provocar conexiones flojas reales para simular.", "safety": "safe", "formula": ""
  },
  {
    "id": "e6-79", "order": 79, "stage": 6, "title": "Neutro abierto y referencias anormales", "category": "Diagnóstico",
    "summary": "Un conductor de retorno abierto o de alta resistencia puede producir síntomas confusos. El estudio debe separar teoría y simulación de cualquier intervención en una instalación real energizada.",
    "concepts": ["Comprender función del neutro", "Reconocer síntomas posibles", "Usar diagrama para seguir retorno", "No trabajar energizado para investigar"],
    "example": "Una carga puede no operar aunque exista tensión medida respecto a otro punto si el recorrido de retorno está interrumpido.",
    "practice": "Simula circuitos con retorno abierto y compara tensiones nodales con el circuito sano; documenta por qué algunas lecturas engañan.",
    "mistakes": "Puente improvisado de neutro; usar protección como retorno; medir sin referencia clara.", "safety": "theory", "formula": ""
  },
  {
    "id": "e6-80", "order": 80, "stage": 6, "title": "Fallas intermitentes", "category": "Diagnóstico",
    "summary": "Las fallas que aparecen y desaparecen exigen registrar condiciones: temperatura, movimiento, carga, tiempo y ambiente. Cambiar piezas al azar destruye evidencia.",
    "concepts": ["Capturar condiciones de falla", "Reproducir de forma segura", "Instrumentar antes de intervenir", "Separar correlación de causa"],
    "example": "Una carga que falla solo al calentarse sugiere una familia de causas distinta a una que falla al mover un cable.",
    "practice": "Resuelve cuatro casos narrativos creando una tabla condición → síntoma → prueba → resultado esperado.",
    "mistakes": "Mover conexiones antes de medir; declarar resuelto tras una sola prueba; ignorar temperatura/carga.", "safety": "design", "formula": ""
  },
  {
    "id": "e6-81", "order": 81, "stage": 6, "title": "Pruebas de aislamiento: propósito y límites", "category": "Pruebas",
    "summary": "Las pruebas de aislamiento aplican tensiones de prueba específicas y requieren equipos/procedimientos adecuados. Debes entender qué detectan antes de considerar realizarlas en campo.",
    "concepts": ["Distinguir continuidad de aislamiento", "Comprender equipo de prueba", "Aislar electrónica sensible", "Interpretar tendencia y criterio del procedimiento"],
    "example": "Un multímetro en ohmios no equivale a una prueba de aislamiento con instrumento dedicado.",
    "practice": "Analiza reportes ficticios de megóhmetro y decide qué lecturas requieren investigación, sin realizar la prueba sobre una instalación real.",
    "mistakes": "Meggear equipos electrónicos conectados; probar circuitos energizados; interpretar un número aislado sin contexto.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e6-82", "order": 82, "stage": 6, "title": "Temperatura y señales de calentamiento", "category": "Diagnóstico",
    "summary": "Decoloración, olor, deformación o temperatura anormal pueden apuntar a sobrecarga o alta resistencia. La termografía ayuda a comparar, pero no reemplaza análisis eléctrico.",
    "concepts": ["Buscar patrones térmicos", "Comparar cargas similares", "Relacionar corriente y resistencia", "Tratar calentamiento como síntoma"],
    "example": "Una conexión puede calentarse con corriente normal si su resistencia de contacto es elevada.",
    "practice": "Clasifica imágenes térmicas de entrenamiento y propone las mediciones eléctricas que confirmarían cada hipótesis.",
    "mistakes": "Concluir por color de imagen; tocar un punto sospechoso; ignorar nivel de carga durante inspección.", "safety": "theory", "formula": ""
  },
  {
    "id": "e6-83", "order": 83, "stage": 6, "title": "Disparos repetitivos y coordinación de síntomas", "category": "Diagnóstico",
    "summary": "Una protección que dispara está comunicando una condición. Restablecer repetidamente sin encontrar causa puede agravar el riesgo.",
    "concepts": ["Registrar cuándo dispara", "Relacionar con cargas conectadas", "Separar sobrecarga de falla", "Verificar selección del dispositivo"],
    "example": "Si el disparo aparece al conectar una carga específica, la estrategia de diagnóstico cambia respecto a un disparo aleatorio sin carga aparente.",
    "practice": "Resuelve seis escenarios de disparo en simulador de decisiones; elige qué desconectar, medir y documentar primero.",
    "mistakes": "Instalar protección mayor para que no dispare; rearmar muchas veces; ignorar historial.", "safety": "design", "formula": ""
  },
  {
    "id": "e6-84", "order": 84, "stage": 6, "title": "Plan de mantenimiento preventivo", "category": "Mantenimiento",
    "summary": "Mantenimiento profesional combina inspección, limpieza adecuada, reaprietes solo cuando están prescritos, pruebas, registro de anomalías y prioridades según criticidad.",
    "concepts": ["Definir periodicidad", "Usar checklist", "Registrar tendencia", "Priorizar por riesgo"],
    "example": "Una lista genérica anual vale menos que un plan que identifica equipos, ambiente, historial y criterios de aceptación.",
    "practice": "Diseña un plan de mantenimiento para una vivienda ficticia con tablero, bomba, aire acondicionado y sistema solar pequeño.",
    "mistakes": "Intervenir sin desenergizar; reapretar todo indiscriminadamente; no conservar resultados previos.", "safety": "design", "formula": ""
  },
  {
    "id": "e7-85", "order": 85, "stage": 7, "title": "Alcance, exclusiones y responsabilidad", "category": "Profesional",
    "summary": "Un trabajo profesional define qué se hará, qué no, condiciones existentes, supuestos y responsabilidades. Un alcance ambiguo crea problemas técnicos y comerciales.",
    "concepts": ["Definir entregables", "Registrar exclusiones", "Documentar preexistencias", "Escalar decisiones fuera de competencia"],
    "example": "'Instalación eléctrica completa' es insuficiente sin definir áreas, cargas, acabados, demoliciones y pruebas incluidas.",
    "practice": "Redacta alcance de dos páginas para una remodelación ficticia y pide a otra persona encontrar ambigüedades.",
    "mistakes": "Prometer corrección de defectos ocultos sin inspección; no registrar cambios; asumir diseño de otra disciplina.", "safety": "design", "formula": ""
  },
  {
    "id": "e7-86", "order": 86, "stage": 7, "title": "Secuencia de obra y coordinación con otros oficios", "category": "Profesional",
    "summary": "Canalizaciones, cajas, acabados y equipos dependen de albañilería, panel de yeso, plomería y arquitectura. Coordinar reduce perforaciones y retrabajos.",
    "concepts": ["Identificar predecesoras", "Coordinar pasos de muro", "Reservar espacios", "Definir inspecciones antes de cerrar"],
    "example": "Cerrar un muro antes de inspeccionar canalizaciones convierte una corrección sencilla en demolición.",
    "practice": "Construye un cronograma de una remodelación con dependencias entre electricidad, plomería y panel de yeso.",
    "mistakes": "Trabajar por disponibilidad en vez de secuencia; no coordinar cajas; cerrar sin pruebas.", "safety": "design", "formula": ""
  },
  {
    "id": "e7-87", "order": 87, "stage": 7, "title": "Checklist de calidad por hitos", "category": "Calidad",
    "summary": "La calidad se controla en puntos donde aún es barato corregir: después de trazo, canalización, tendido, terminaciones, tablero y antes de energización.",
    "concepts": ["Definir hold points", "Usar criterios observables", "Firmar/cerrar pendientes", "Conservar evidencia"],
    "example": "Una foto de tuberías antes de cerrar puede facilitar futuras reparaciones y comprobar ubicación.",
    "practice": "Crea cinco checklists de 10 puntos para una instalación residencial ficticia y úsalos para auditar imágenes de práctica.",
    "mistakes": "Checklist demasiado genérico; aceptar 'se ve bien'; no registrar responsable/fecha.", "safety": "design", "formula": ""
  },
  {
    "id": "e7-88", "order": 88, "stage": 7, "title": "Planos as-built y control de cambios", "category": "Documentación",
    "summary": "La instalación final puede diferir del diseño por condiciones de obra. Los cambios aceptados deben reflejarse en planos y directorios finales.",
    "concepts": ["Marcar cambios en campo", "Actualizar rutas y circuitos", "Versionar documentos", "Distinguir aprobado de propuesto"],
    "example": "Mover una caja sin actualizar el plano crea información falsa para mantenimiento futuro.",
    "practice": "Recibe un plano y una lista de diez cambios de obra; produce una versión as-built con registro de revisiones.",
    "mistakes": "Guardar cambios solo en mensajes; sobreescribir sin versión; entregar planos originales como finales.", "safety": "design", "formula": ""
  },
  {
    "id": "e7-89", "order": 89, "stage": 7, "title": "Entrega al usuario y operación segura", "category": "Profesional",
    "summary": "La entrega incluye explicar tablero, circuitos, protecciones, pruebas, operación normal y cuándo llamar a un profesional. Una instalación sin información es más difícil de mantener.",
    "concepts": ["Explicar directorio de tablero", "Entregar pruebas y planos", "Indicar mantenimiento", "Definir límites del usuario"],
    "example": "El usuario debe poder identificar qué interruptor aisla una zona sin abrir el tablero ni adivinar.",
    "practice": "Simula una entrega de 10 minutos usando tu expediente y responde preguntas de un cliente ficticio.",
    "mistakes": "Usar jerga sin explicar; omitir pendientes; no entregar documentación.", "safety": "design", "formula": ""
  },
  {
    "id": "e8-90", "order": 90, "stage": 8, "title": "Fundamentos trifásicos", "category": "Especialización",
    "summary": "Los sistemas trifásicos distribuyen potencia mediante tres fases desplazadas. Para vivienda suelen ser una extensión profesional, pero entenderlos prepara para motores, comercios y cargas mayores.",
    "concepts": ["Fases desplazadas", "Línea y fase conceptuales", "Secuencia de fases", "Balance de cargas"],
    "example": "Un motor trifásico puede invertir sentido al intercambiar dos fases, pero esa maniobra real pertenece a práctica supervisada.",
    "practice": "Usa un simulador para visualizar tres senoidales separadas 120° y resolver ejercicios de secuencia/balance.",
    "mistakes": "Aplicar fórmulas monofásicas sin revisar; intervenir fases reales sin procedimiento; ignorar secuencia.", "safety": "theory", "formula": ""
  },
  {
    "id": "e8-91", "order": 91, "stage": 8, "title": "Variadores de frecuencia: arquitectura", "category": "Control",
    "summary": "Un VFD rectifica, procesa y sintetiza una salida variable para controlar motores compatibles. Debes comprender parámetros y límites antes de pensar en cableado real.",
    "concepts": ["Entrada/rectificación conceptual", "Bus DC", "Salida PWM conceptual", "Rampas y frecuencia"],
    "example": "Reducir frecuencia puede reducir velocidad de un motor, pero torque, enfriamiento y carga deben considerarse.",
    "practice": "Configura un VFD virtual o simulador de parámetros con motor ficticio y documenta rampa, frecuencia mínima/máxima y protección.",
    "mistakes": "Conectar/desconectar motor en salida durante operación; parametrizar por ensayo; ignorar placa del motor.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e8-92", "order": 92, "stage": 8, "title": "Factor de potencia y potencia reactiva", "category": "Potencia",
    "summary": "En cargas AC no puramente resistivas, corriente y tensión pueden desfasarse. El factor de potencia ayuda a entender por qué corriente aparente y potencia útil no siempre coinciden.",
    "concepts": ["Potencia activa", "Reactiva", "Aparente", "Factor de potencia"],
    "example": "Dos cargas con la misma potencia activa pueden demandar corrientes distintas si tienen diferente factor de potencia.",
    "practice": "Resuelve seis casos de triángulo de potencia y analiza qué cambia al mejorar factor de potencia en un caso ficticio.",
    "mistakes": "Aplicar P=VI sin considerar PF en AC; confundir eficiencia con PF; corregir sin estudiar la carga.", "safety": "design", "formula": "P ≈ V × I × FP (caso monofásico simplificado)"
  },
  {
    "id": "e8-93", "order": 93, "stage": 8, "title": "Selectividad y coordinación de protecciones", "category": "Protecciones",
    "summary": "En sistemas con varias protecciones se busca que una falla afecte la menor parte posible y que cada conductor/equipo quede protegido dentro de sus límites. Esto requiere curvas y datos reales.",
    "concepts": ["Protección aguas arriba/abajo", "Selectividad conceptual", "Curvas tiempo-corriente", "Capacidad interruptiva"],
    "example": "Si una falla en un ramal abre siempre la protección principal, el sistema pierde más servicio del necesario y puede indicar mala coordinación.",
    "practice": "Compara curvas ficticias de tres dispositivos y decide qué combinación ofrece mejor selectividad para un caso de aprendizaje.",
    "mistakes": "Coordinar solo por amperaje impreso; ignorar corriente de falla disponible; asumir selectividad total sin curvas.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-94", "order": 94, "stage": 9, "title": "Brief y levantamiento de vivienda", "category": "Proyecto maestro",
    "summary": "El proyecto maestro inicia con una vivienda ficticia completa: arquitectura, necesidades del usuario, equipos, restricciones y condición existente. Tu primera tarea es convertir información incompleta en preguntas y datos verificables.",
    "concepts": ["Revisar plano arquitectónico", "Inventariar cargas", "Registrar restricciones", "Emitir preguntas antes de diseñar"],
    "example": "No puedes dimensionar circuito de un equipo especial si el caso no aporta placa; debes marcarlo como dato faltante, no inventarlo.",
    "practice": "Completa el levantamiento del caso maestro y genera una lista de datos confirmados, supuestos y RFIs.",
    "mistakes": "Diseñar sobre suposiciones ocultas; olvidar equipos futuros; no diferenciar existente de nuevo.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-95", "order": 95, "stage": 9, "title": "Cuadro de cargas y arquitectura de circuitos", "category": "Proyecto maestro",
    "summary": "Agrupa iluminación, contactos y equipos en circuitos coherentes, documentando carga, demanda, protección, conductor y observaciones de cada circuito.",
    "concepts": ["Agrupar por función", "Identificar cargas dedicadas", "Documentar demanda", "Mantener trazabilidad al plano"],
    "example": "Cada símbolo del plano debe poder llevarte a un circuito del cuadro y viceversa.",
    "practice": "Construye el cuadro completo del caso maestro y justifica oralmente cinco agrupaciones elegidas al azar.",
    "mistakes": "Circuitos sin identificación; carga sin origen; agrupar solo para minimizar cantidad de breakers.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-96", "order": 96, "stage": 9, "title": "Conductores, protecciones y canalizaciones", "category": "Proyecto maestro",
    "summary": "Dimensiona cada circuito verificando ampacidad, correcciones, caída de tensión, protección y canalización con los datos del caso y criterios normativos suministrados.",
    "concepts": ["Dimensionar conductor", "Seleccionar protección", "Comprobar caída", "Dimensionar canalización"],
    "example": "La selección final debe satisfacer todas las comprobaciones, no solo la corriente de carga.",
    "practice": "Entrega una hoja de cálculo con una fila por circuito y columnas de cada verificación; cualquier fila sin evidencia se considera incompleta.",
    "mistakes": "Saltar directamente a calibre típico; no registrar correcciones; dimensionar tubo después de obra.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-97", "order": 97, "stage": 9, "title": "Plano eléctrico y detalles", "category": "Proyecto maestro",
    "summary": "Produce plano coordinado con símbolos, circuitos, canalizaciones conceptuales, notas, tablero y detalles necesarios para que otra persona pueda entender la intención sin preguntarte cada conexión.",
    "concepts": ["Simbología consistente", "Etiquetado de circuitos", "Referencias a detalles", "Coordinación con arquitectura"],
    "example": "Un plano bonito que no identifica circuitos ni tablero no es suficiente para ejecución.",
    "practice": "Genera planta eléctrica, diagrama unifilar simplificado y directorio de tablero del caso maestro.",
    "mistakes": "Cruces ambiguos; símbolos sin leyenda; cambios no actualizados entre plano y cuadro.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-98", "order": 98, "stage": 9, "title": "Cuantificación, compras y presupuesto", "category": "Proyecto maestro",
    "summary": "Convierte el proyecto en materiales medibles, desperdicio razonado, mano de obra y exclusiones. Debes poder rastrear cada cantidad a un plano o supuesto.",
    "concepts": ["Generadores de cantidades", "Unidades", "Desperdicio", "Precios y alcance"],
    "example": "Una cantidad de conductor sin ruta, longitud o factor de desperdicio documentado no es auditable.",
    "practice": "Crea BOM y presupuesto del caso maestro con precios de ejercicio; marca por separado material, mano de obra, indirectos y contingencia.",
    "mistakes": "Redondeos ocultos; mezclar costo y precio; olvidar cajas, conectores y consumibles.", "safety": "design", "formula": ""
  },
  {
    "id": "e9-99", "order": 99, "stage": 9, "title": "Montaje didáctico representativo", "category": "Proyecto maestro",
    "summary": "Construye un muro/tablero de entrenamiento que represente al menos tres circuitos del proyecto usando baja tensión o componentes desenergizados: iluminación, contacto didáctico y carga especial simulada.",
    "concepts": ["Seguir plano", "Etiquetar", "Inspeccionar antes de energizar", "Mantener separación entre maqueta y red"],
    "example": "El objetivo es demostrar técnica de ruta, cajas, conductores, dispositivos y documentación sin convertir la práctica en trabajo energizado doméstico.",
    "practice": "Monta el tablero, toma fotos por etapa y pide a otra persona comparar contra plano/checklist.",
    "mistakes": "Usar red para hacerlo 'más real'; energizar antes de inspección; cambiar el plano después para que coincida con errores.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e9-100", "order": 100, "stage": 9, "title": "Plan de pruebas y puesta en servicio simulada", "category": "Proyecto maestro",
    "summary": "Antes de poner en servicio defines qué inspeccionar, qué medir, valores esperados, criterios de aceptación y secuencia segura. La puesta en servicio real de una vivienda pertenece a experiencia supervisada.",
    "concepts": ["Prueba visual", "Continuidad/mediciones apropiadas", "Valores esperados", "Registro de resultados"],
    "example": "Una medición sin valor esperado solo produce un número; una prueba profesional compara resultado contra criterio.",
    "practice": "Escribe y ejecuta sobre el banco didáctico un protocolo de al menos 15 verificaciones con resultado esperado/real.",
    "mistakes": "Probar sin secuencia; aceptar 'funciona' como criterio; no registrar instrumento/fecha.", "safety": "supervised", "formula": ""
  },
  {
    "id": "e9-101", "order": 101, "stage": 9, "title": "Defensa técnica y expediente final", "category": "Proyecto maestro",
    "summary": "La última competencia es demostrar que puedes explicar y defender el proyecto: por qué elegiste cada circuito, protección, conductor, ruta y prueba, y reconocer qué partes requieren supervisión o validación profesional.",
    "concepts": ["Explicar decisiones", "Responder revisión", "Corregir observaciones", "Entregar as-built y expediente"],
    "example": "Dominar no significa recordar una tabla: significa justificar la decisión y saber qué dato cambiaría tu respuesta.",
    "practice": "Completa una revisión de 30 preguntas, corrige el expediente y entrega versión final con planos, cálculos, BOM, presupuesto, pruebas y límites de responsabilidad.",
    "mistakes": "Defender errores por orgullo; ocultar supuestos; confundir completar la plataforma con experiencia de campo.", "safety": "design", "formula": ""
  }

]

export const expertSheets = [
  {
    "title": "Prefijos y unidades",
    "items": [
      "mA = 0.001 A",
      "kΩ = 1000 Ω",
      "MΩ = 1,000,000 Ω",
      "kW = 1000 W",
      "kWh = energía, no potencia"
    ]
  },
  {
    "title": "Triángulo de potencia básica",
    "items": [
      "P = V × I para DC/resistivo",
      "P = I²R",
      "P = V²/R",
      "E = P × t",
      "Revisa unidades antes de sustituir"
    ]
  },
  {
    "title": "Multímetro: regla de oro",
    "items": [
      "Voltaje: paralelo",
      "Corriente: serie",
      "Resistencia/continuidad: sin energía",
      "COM siempre como referencia",
      "Devuelve la punta roja a VΩ al terminar"
    ]
  },
  {
    "title": "Árbol de diagnóstico",
    "items": [
      "¿Hay alimentación?",
      "¿Llega al punto correcto?",
      "¿Existe trayectoria?",
      "¿La carga recibe tensión correcta?",
      "¿La medición cambia bajo carga?"
    ]
  },
  {
    "title": "Documentación profesional",
    "items": [
      "Plano vigente",
      "Cuadro de cargas",
      "Lista de materiales",
      "Resultados de pruebas",
      "Cambios as-built"
    ]
  },
  {
    "title": "Capas de seguridad",
    "items": [
      "Eliminar/desenergizar",
      "Aislar y bloquear",
      "Verificar ausencia",
      "Barreras/distancias",
      "EPP y herramienta apropiada"
    ]
  },
  {
    "title": "Protecciones: no son lo mismo",
    "items": [
      "Sobrecorriente: protege conductores/equipo",
      "Protección diferencial: detecta desequilibrio/fuga",
      "Supresor: limita sobretensiones transitorias",
      "Puesta a tierra: ruta/referencia de protección",
      "Cada función resuelve un riesgo distinto"
    ]
  },
  {
    "title": "Lectura de placa",
    "items": [
      "Tensión nominal",
      "Corriente/potencia",
      "Frecuencia",
      "Clase/servicio",
      "Certificaciones y ambiente"
    ]
  },
  {
    "title": "Motores: qué mirar",
    "items": [
      "Tensión y fases",
      "Corriente nominal",
      "Potencia",
      "RPM",
      "Factor de servicio / régimen"
    ]
  },
  {
    "title": "Fotovoltaico: cuatro valores",
    "items": [
      "Voc: tensión circuito abierto",
      "Isc: corriente de cortocircuito",
      "Vmp: tensión a máxima potencia",
      "Imp: corriente a máxima potencia",
      "Verifica temperatura y límites de equipo"
    ]
  }
] as const

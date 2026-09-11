import type { TradeRoute, TradeStage } from './tradeRoutes'

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5

export const masteryLabels = ['Pendiente', 'Estudiado', 'Práctica guiada', 'Sin guía', 'Diagnóstico', 'Integrado'] as const

const examples: Record<string, string[]> = {
  drywall: [
    'Imagina un muro de práctica de 1.20 m. Antes de cortar, compruebas eje, caras, diagonales y dónde caerán las juntas.',
    'Si una junta queda sobre un borde sin soporte, el problema no se corrige con más compuesto: primero se corrige el soporte.',
    'Una placa bien colocada reduce el trabajo de acabado; una estructura fuera de plomo multiplica defectos visibles.'
  ],
  masonry: [
    'En un muro corto de entrenamiento, primero trazas, tensas hilo, verificas nivel y solo después colocas la siguiente pieza.',
    'Si una hilada empieza a desviarse, corregir temprano evita compensaciones cada vez mayores en las siguientes hiladas.',
    'La mezcla no se juzga solo por “verse bien”: consistencia, adherencia, tiempo abierto y curado cambian el resultado.'
  ],
  construction: [
    'Antes de ejecutar una cimentación real, el ejercicio didáctico separa lectura de planos, secuencia, acero, cimbra, concreto y control de calidad.',
    'Una dimensión correcta en plano no garantiza una obra correcta si el replanteo, nivel o referencia inicial están mal.',
    'El control de calidad registra qué debía ocurrir, qué ocurrió y qué evidencia confirma el resultado.'
  ],
  architecture: [
    'Un plano útil debe permitir que otra persona entienda qué construir, dónde, con qué medida y cómo se relaciona con otros planos.',
    'Si una planta, un corte y una fachada se contradicen, el problema no es gráfico: es de coordinación del proyecto.',
    'Cuantificar significa convertir geometría y especificaciones en cantidades trazables, no adivinar materiales.'
  ],
  plumbing: [
    'En un banco de práctica, una fuga pequeña se diagnostica por recorrido, unión, presión y evidencia, no apretando todo indiscriminadamente.',
    'Una pendiente insuficiente o excesiva puede afectar el comportamiento de un drenaje; primero se mide y después se corrige.',
    'Una válvula se instala pensando también en accesibilidad futura, sentido de flujo y mantenimiento.'
  ],
  finishes: [
    'La pintura final depende más de la preparación que de la última mano: polvo, humedad, absorción y defectos se atienden antes.',
    'Cuando un acabado se desprende, primero se investiga causa y compatibilidad; repintar encima puede esconder el problema temporalmente.',
    'Una muestra pequeña permite validar color, textura, adherencia y técnica antes de trabajar una superficie grande.'
  ],
  solar: [
    'Un sistema fotovoltaico se diseña desde sitio, cargas, orientación, sombra, módulos, inversor, protecciones y puesta en marcha como conjunto.',
    'Dos strings con condiciones distintas pueden comportarse diferente aunque usen módulos idénticos.',
    'Antes de conectar hardware real, puedes validar polaridad, tensión esperada, diagrama, etiquetas y secuencia de puesta en marcha.'
  ]
}


const technicalCore: Record<string, string[]> = {
  drywall: [
    'La estructura, la placa y el acabado trabajan como un sistema: modulación, apoyo de bordes y posición de juntas condicionan el resultado final.',
    'Plomo, nivel, escuadra y diagonales son controles distintos. Un elemento puede estar nivelado y aun así quedar fuera de escuadra.',
    'El papel superficial del panel participa en su integridad; romperlo alrededor del tornillo reduce la calidad de la fijación.',
    'Las juntas se ensanchan progresivamente para perder visualmente la transición. Más compuesto no compensa una junta mal soportada.',
    'Humedad, fuego y acústica dependen de sistemas completos especificados, no de elegir una placa “especial” de forma aislada.'
  ],
  masonry: [
    'Trazo, nivel, plomo, alineación y módulo se controlan desde la primera hilada; los errores acumulativos crecen con la altura.',
    'Agua, proporción, granulometría, mezclado, tiempo abierto y curado cambian el comportamiento de morteros y concretos.',
    'Una junta uniforme no es solo estética: ayuda a mantener geometría y distribución regular del apoyo.',
    'Las grietas se clasifican por patrón, ubicación, movimiento y causa probable antes de elegir una reparación.',
    'Elementos estructurales reales requieren proyecto y responsabilidad técnica; una maqueta sirve para aprender secuencia, no para dimensionar una vivienda.'
  ],
  construction: [
    'La obra se controla mediante referencias: ejes, bancos de nivel, cotas, tolerancias y registros. Sin referencias no existe una comprobación repetible.',
    'Cimentación, acero, cimbra y concreto forman una cadena: un error previo puede quedar oculto después del colado.',
    'El concreto fresco se controla antes, durante y después de colocar: consistencia, colocación, compactación, acabado y curado son etapas distintas.',
    'La secuencia constructiva debe considerar accesos, interferencias, tiempos de espera, seguridad y trabajos posteriores.',
    'Cambios en elementos estructurales no se improvisan en campo; se escalan a cálculo y revisión responsable.'
  ],
  architecture: [
    'Una planta define relaciones horizontales; un corte explica alturas y encuentros; una fachada comunica composición exterior. Deben ser coherentes entre sí.',
    'La escala no sustituye las cotas: una medida de obra debe provenir de dimensiones explícitas y coordinadas.',
    'Ejes, niveles, claves, llamadas y referencias crean trazabilidad entre planos y detalles.',
    'Cuantificar exige definir unidad, criterio de medición, desperdicio y fuente geométrica de cada cantidad.',
    'Un detalle constructivo útil resuelve materiales, encuentros, espesores, fijaciones y secuencia, no solo dibuja una sección bonita.'
  ],
  plumbing: [
    'Presión, caudal, diámetro, longitud y pérdidas se relacionan; una baja presión aparente puede tener causas distintas a la fuente.',
    'En drenaje por gravedad importan pendiente, ventilación, sello hidráulico y continuidad del recorrido.',
    'Cada unión debe corresponder al material y método correcto; compatibilidad química y mecánica importa tanto como que “no gotee hoy”.',
    'Las pruebas se hacen antes de ocultar instalaciones para que una falla siga siendo accesible y trazable.',
    'Diagnóstico eficiente divide el sistema por zonas y mide antes de reemplazar componentes.'
  ],
  finishes: [
    'La adherencia depende de la preparación del sustrato: limpieza, estabilidad, humedad, porosidad y compatibilidad se revisan antes del acabado.',
    'Espesor, tiempo entre capas, temperatura y ventilación afectan secado y desempeño.',
    'La luz rasante ayuda a revelar ondas, bordes y defectos que desaparecen bajo iluminación frontal.',
    'Un acabado que falla repetidamente suele señalar un problema de sustrato o humedad, no simplemente falta de otra capa.',
    'Muestras y áreas de prueba reducen riesgo antes de comprometer una superficie grande.'
  ],
  solar: [
    'Tensión, corriente y potencia del arreglo deben permanecer dentro de la ventana y límites del inversor en las condiciones de diseño.',
    'Sombra, orientación, temperatura y desajustes entre módulos cambian la producción real del sistema.',
    'Strings, protecciones, seccionamiento, puesta a tierra y etiquetado deben leerse como una arquitectura completa.',
    'La polaridad y tensión esperada se verifican antes de conectar equipos; una suposición incorrecta puede dañar componentes.',
    'El commissioning compara diseño contra instalación mediante inspección, mediciones, configuración y documentación.'
  ]
}

const mistakePools: Record<string, string[]> = {
  drywall: ['medir una sola vez', 'usar compuesto para ocultar un error de estructura', 'hundir demasiado tornillos', 'no controlar polvo y bordes'],
  masonry: ['compensar errores de nivel con mezcla', 'no verificar plomo durante la ejecución', 'usar una mezcla sin controlar consistencia', 'reparar una grieta sin investigar causa'],
  construction: ['ejecutar sin referencias de control', 'modificar elementos estructurales sin cálculo', 'no registrar tolerancias', 'confundir secuencia constructiva con improvisación'],
  architecture: ['dibujar sin coordinar vistas', 'acotar de forma redundante o contradictoria', 'cuantificar sin supuestos', 'usar símbolos sin leyenda'],
  plumbing: ['apretar uniones sin diagnóstico', 'mezclar materiales incompatibles', 'ocultar conexiones sin prueba', 'ignorar accesibilidad para mantenimiento'],
  finishes: ['aplicar sobre superficie contaminada', 'no respetar secados', 'intentar corregir todo con una capa gruesa', 'no hacer muestra previa'],
  solar: ['diseñar sin revisar sombra', 'ignorar límites eléctricos del inversor', 'confundir polaridad', 'considerar el sistema energéticamente seguro solo porque está apagado']
}

export function buildTradeLesson(route: TradeRoute, stage: TradeStage, skill: string, index: number) {
  const routeExamples = examples[route.id] || []
  const mistakes = mistakePools[route.id] || ['trabajar sin criterio de éxito', 'no medir antes y después', 'ocultar el defecto en vez de corregir la causa']
  const example = routeExamples[index % Math.max(1, routeExamples.length)] || `Aplica ${skill.toLowerCase()} en un módulo didáctico pequeño y registra el resultado.`
  const relatedPractice = stage.practices[index % Math.max(1, stage.practices.length)]
  return {
    title: skill,
    intro: `${skill} forma parte de la etapa “${stage.title}”. No basta con reconocer el término: debes entender qué problema resuelve, qué variables cambian el resultado, cómo comprobarlo y cuándo detenerte por seguridad o falta de información.`,
    why: `Esta competencia importa porque ${stage.summary.charAt(0).toLowerCase()}${stage.summary.slice(1)} En trabajo real, una decisión aparentemente pequeña puede afectar calidad, costo, mantenimiento y seguridad del sistema completo.`,
    principles: [
      stage.principles[index % stage.principles.length],
      'Define antes de ejecutar qué resultado sería aceptable y cómo lo vas a medir.',
      'Separa observación, hipótesis y corrección: no cambies cosas al azar.',
      'Documenta medidas, materiales y decisiones para poder repetir o corregir el trabajo.'
    ],
    example,
    technical: Array.from({ length: 3 }, (_, offset) => { const pool = technicalCore[route.id] || []; return pool[(index + offset) % Math.max(1, pool.length)] || stage.principles[offset % stage.principles.length] }),
    method: [
      `Identifica exactamente qué significa “${skill}” dentro de este oficio y qué variables lo condicionan.`,
      'Prepara una referencia: croquis, medidas, ficha del material, criterio de calidad o diagrama según corresponda.',
      'Haz una ejecución pequeña o simulada antes de escalar.',
      'Mide o inspecciona el resultado contra un criterio objetivo.',
      'Corrige la causa del defecto y repite hasta obtener un resultado consistente.'
    ],
    mistakes: [mistakes[index % mistakes.length], mistakes[(index + 1) % mistakes.length], mistakes[(index + 2) % mistakes.length]],
    transfer: relatedPractice ? `Transfiere esta competencia a la práctica “${relatedPractice.title}”. Objetivo: ${relatedPractice.objective}` : `Diseña una práctica pequeña donde puedas demostrar ${skill.toLowerCase()} sin depender de una explicación paso a paso.`,
    checks: [
      `¿Puedes explicar ${skill.toLowerCase()} con tus propias palabras sin leer?`,
      '¿Puedes nombrar al menos dos errores frecuentes y cómo detectarlos?',
      '¿Puedes decir qué evidencia usarías para comprobar que el resultado quedó bien?'
    ]
  }
}

export function buildStageAssessment(route: TradeRoute, stage: TradeStage) {
  const core = stage.skills.slice(0, 4)
  return {
    title: `Evaluación práctica · ${stage.title}`,
    scenario: `Recibes un trabajo ficticio relacionado con ${route.name.toLowerCase()}. Debes resolverlo usando las competencias de esta etapa sin seguir una receta. Tu objetivo es justificar decisiones, definir controles y detectar qué información falta antes de actuar.`,
    prompts: [
      `Explica cómo planearías el trabajo antes de empezar. Debes usar al menos tres ideas de: ${core.join(', ')}.`,
      `Describe dos errores que podrían aparecer en esta etapa, cómo los detectarías y cómo decidirías la corrección.`,
      `Define cinco comprobaciones objetivas para aceptar o rechazar el resultado del proyecto “${stage.project}”.`,
      `Indica qué parte harías de forma autónoma y en qué punto pedirías supervisión o información adicional.`
    ],
    rubric: [
      'Planeación antes de ejecución',
      'Uso de medidas/evidencia en lugar de intuición',
      'Diagnóstico de causa, no solo corrección superficial',
      'Criterios de calidad verificables',
      'Reconocimiento explícito de límites de seguridad y responsabilidad'
    ]
  }
}

export function localTutorAnswer(question: string, route?: TradeRoute, stage?: TradeStage) {
  const q = question.toLowerCase()
  const context = route && stage ? `${route.name} · ${stage.title}` : 'OficiosLab'
  if (q.includes('segur') || q.includes('pelig') || q.includes('riesgo')) {
    return `En ${context}, separa primero la práctica didáctica del trabajo de campo. Desenergiza o elimina la fuente de riesgo cuando corresponda, usa controles adecuados y no conviertas un ejemplo de entrenamiento en autorización para intervenir una instalación real. ${route?.safetyNote || ''}`
  }
  if (q.includes('práct') || q.includes('practic')) {
    const practice = stage?.practices[0]
    return practice ? `Empieza con “${practice.title}”. Antes de ejecutar define el criterio de éxito, documenta medidas iniciales, realiza una primera vuelta guiada y repite otra sin mirar pasos. Evidencia esperada: ${practice.deliverable}.` : 'Elige una práctica de la etapa actual, ejecútala primero con guía y repítela sin guía. Registra foto, medidas, errores y correcciones.'
  }
  if (q.includes('error') || q.includes('falla') || q.includes('diagn')) {
    return `Usa este ciclo: síntoma → hipótesis → prueba que pueda confirmar o descartar → corrección → nueva comprobación. Evita cambiar varias cosas a la vez porque pierdes trazabilidad de la causa.`
  }
  const focus = stage?.skills.slice(0, 3).join(', ')
  return `Para ${context}, aborda tu duda desde tres preguntas: qué principio está involucrado, qué evidencia puedes medir y qué error típico debes descartar. ${focus ? `Las competencias más cercanas de esta etapa son: ${focus}.` : ''} Si me das el resultado que obtuviste, compáralo contra el resultado esperado antes de corregir.`
}

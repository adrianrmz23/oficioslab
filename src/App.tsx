import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { electricityTopics, expertSheets, stageGuides } from './electricityContent'
import type { ElectricityTopic, SafetyLevel } from './electricityContent'
import { getTradeRoute, tradeRoutes } from './tradeRoutes'
import type { TradeRoute, TradeStage } from './tradeRoutes'
import { buildStageAssessment, buildTradeLesson, localTutorAnswer, masteryLabels } from './advancedLearning'
import type { MasteryLevel } from './advancedLearning'
import { deleteEvidence, listEvidence, saveEvidence } from './evidenceStore'
import type { EvidenceEntry } from './evidenceStore'
import { getCurrentUser, loadCloudState, mergeProgress, readLocalProgress, saveAssessmentAttempt, saveCloudState, sendEmailOtp, signOutCloud, subscribeToAuth, supabaseConfigured, verifyEmailOtp } from './cloudSync'
import type { CloudSyncState, OficiosLabState } from './cloudSync'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Battery,
  BookOpen,
  Box,
  BrickWall,
  Calculator,
  Camera,
  Cloud,
  CloudOff,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Construction,
  Flame,
  Gauge,
  Hammer,
  HardHat,
  Home,
  Lightbulb,
  LogOut,
  Mail,
  LockKeyhole,
  Menu,
  PanelTop,
  PlugZap,
  Ruler,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Send,
  Sun,
  Trash2,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

const routes = [
  { id: 'electricity', name: 'Electricidad', subtitle: '101 competencias · vivienda, diagnóstico y especialización', icon: Zap, status: 'Ruta maestra', tone: 'amber' },
  { id: 'drywall', name: 'Panel de yeso', subtitle: 'Muros, plafones, juntas y acabados', icon: PanelTop, status: 'Ruta abierta', tone: 'slate' },
  { id: 'masonry', name: 'Albañilería', subtitle: 'Mezclas, muros, niveles y reparación', icon: BrickWall, status: 'Ruta abierta', tone: 'clay' },
  { id: 'construction', name: 'Construcción', subtitle: 'Obra, cimentación, concreto y control', icon: Construction, status: 'Ruta abierta', tone: 'stone' },
  { id: 'architecture', name: 'Arquitectura práctica', subtitle: 'Planos, detalles, cuantificación y coordinación', icon: Ruler, status: 'Ruta abierta', tone: 'blueprint' },
  { id: 'plumbing', name: 'Plomería', subtitle: 'Agua, drenaje, montaje y diagnóstico', icon: Wrench, status: 'Ruta abierta', tone: 'water' },
  { id: 'finishes', name: 'Acabados', subtitle: 'Pintura, pisos, impermeabilización y reparación', icon: Hammer, status: 'Ruta abierta', tone: 'plaster' },
  { id: 'solar', name: 'Energía solar', subtitle: 'FV residencial, diseño, montaje y commissioning', icon: Sun, status: 'Ruta abierta', tone: 'solar' },
]


const skills = [
  { id: 1, title: 'Seguridad eléctrica y circuito seguro', type: 'theory', status: 'done' },
  { id: 2, title: 'Voltaje, corriente y resistencia', type: 'theory', status: 'active' },
  { id: 3, title: 'Ley de Ohm y cálculo eléctrico', type: 'calc', status: 'locked' },
  { id: 4, title: 'Potencia, energía y consumo', type: 'calc', status: 'locked' },
  { id: 5, title: 'Corriente continua, polaridad y fuentes', type: 'theory', status: 'locked' },
  { id: 6, title: 'Circuitos serie y paralelo', type: 'theory', status: 'locked' },
  { id: 7, title: 'Símbolos y lectura de diagramas', type: 'tool', status: 'locked' },
  { id: 8, title: 'Primer circuito físico', type: 'practice', status: 'locked' },
]

const electricityPracticeLabels = ['3 prácticas', '5 prácticas', '4 laboratorios', '6 proyectos', '8 prácticas', '7 casos', '5 casos', '7 laboratorios', '10 entregables']

const electricityRoadmap = stageGuides.map((stage, index) => ({
  number: stage.number,
  title: stage.title,
  level: stage.level,
  status: index === 0 ? 'active' : 'available',
  skills: electricityTopics.filter(topic => topic.stage === index + 1).map(topic => topic.title),
  practice: electricityPracticeLabels[index] || 'práctica intensiva',
  project: stage.project,
}))


const totalElectricSkills = electricityTopics.length


type StagePractice = {
  id: string
  stage: number
  title: string
  subtitle: string
  safety: SafetyLevel
  objective: string
  materials: string[]
  steps: string[]
  evidence: string[]
  note: string
}

const stagePractices: StagePractice[] = [
  {
    id: 's2-p1', stage: 2, title: 'Conoce tu multímetro', subtitle: 'Puertos, selector y lectura antes de medir', safety: 'safe',
    objective: 'Identificar COM, VΩ, entradas de corriente y rangos sin conectar todavía el instrumento a una instalación de red.',
    materials: ['Multímetro digital', 'Manual o foto de la carátula', 'Una resistencia de 220–1 kΩ', '2 pilas AA o AAA'],
    steps: ['Localiza COM y conecta ahí la punta negra.', 'Localiza la entrada VΩ y conecta ahí la punta roja.', 'Recorre con el selector los modos V DC, V AC, Ω y continuidad sin medir nada.', 'Busca el símbolo o entrada dedicada a corriente y explica por qué no debe usarse por costumbre.', 'Toma una foto o nota de tu modelo y escribe qué entradas tiene.'],
    evidence: ['Puedes explicar para qué sirve cada puerto.', 'Sabes cuándo la punta roja NO debe estar en la entrada de corriente.', 'Reconoces los símbolos principales del selector.'],
    note: 'No conectes el multímetro a una toma doméstica en esta práctica.'
  },
  {
    id: 's2-p2', stage: 2, title: 'Mide una batería', subtitle: 'Primera medición de voltaje DC', safety: 'safe',
    objective: 'Medir diferencia de potencial entre los terminales de una pila y relacionar signo, polaridad y valor nominal.',
    materials: ['Multímetro digital', '2 pilas AA o AAA'],
    steps: ['Selecciona voltaje DC en un rango apropiado.', 'Coloca la punta negra en el terminal negativo y la roja en el positivo.', 'Anota el valor mostrado.', 'Invierte las puntas y observa qué cambia en el signo.', 'Compara dos pilas y explica cuál parece tener mayor tensión en reposo.'],
    evidence: ['Obtienes una lectura estable.', 'Entiendes por qué invertir puntas cambia el signo.', 'Distingues tensión nominal de lectura real.'],
    note: 'Usa únicamente pilas o fuentes de baja tensión en esta práctica.'
  },
  {
    id: 's2-p3', stage: 2, title: 'Mide resistencias', subtitle: 'Ohmímetro con el componente desenergizado', safety: 'safe',
    objective: 'Comparar el valor nominal de una resistencia con la medición real y practicar selección de rango.',
    materials: ['Multímetro digital', '3 resistencias de valores distintos', 'Tabla o app de código de colores'],
    steps: ['Asegúrate de que las resistencias estén completamente desconectadas.', 'Selecciona Ω o autorango.', 'Mide la primera resistencia tocando una punta en cada terminal.', 'Repite con las otras dos y registra valor nominal y medido.', 'Calcula el porcentaje aproximado de diferencia en al menos una resistencia.'],
    evidence: ['Mides resistencia sin energizar el componente.', 'Relacionas tolerancia con pequeñas diferencias de lectura.', 'Puedes cambiar de Ω a kΩ mentalmente.'],
    note: 'Nunca uses el modo resistencia sobre un circuito energizado.'
  },
  {
    id: 's2-p4', stage: 2, title: 'Mapea una protoboard', subtitle: 'Continuidad para descubrir conexiones internas', safety: 'safe',
    objective: 'Usar continuidad para comprobar qué perforaciones de una protoboard están unidas internamente.',
    materials: ['Multímetro con continuidad', 'Protoboard sin alimentación', '2 cables jumper'],
    steps: ['Desconecta cualquier fuente de la protoboard.', 'Selecciona continuidad y junta las puntas para reconocer el aviso sonoro.', 'Comprueba dos agujeros A–E de la misma columna.', 'Comprueba un agujero E contra F de la misma columna.', 'Comprueba varios puntos del riel + y determina si está partido en el centro.'],
    evidence: ['Puedes dibujar el patrón de conexión interno de tu protoboard.', 'Identificas la ranura central.', 'Sabes si tus rieles laterales están partidos.'],
    note: 'Esta práctica prepara los diagramas físicos que usarás después.'
  },
  {
    id: 's2-p5', stage: 2, title: 'Diagnostica el LED', subtitle: 'Mide antes de cambiar piezas', safety: 'safe',
    objective: 'Localizar una falla simple en el circuito LED de la Etapa 1 usando inspección, voltaje y continuidad.',
    materials: ['Circuito LED de la Etapa 1', 'Multímetro', 'Pilas', 'Jumper adicional'],
    steps: ['Con la fuente desconectada, inspecciona polaridad y columnas.', 'Comprueba continuidad de los jumpers y del interruptor.', 'Energiza solo con pilas y mide el voltaje de la fuente.', 'Mide voltaje antes y después del interruptor para seguir la trayectoria.', 'Corrige una sola causa a la vez y vuelve a probar.'],
    evidence: ['Formulas una hipótesis antes de mover cables.', 'Usas mediciones para reducir posibilidades.', 'Puedes explicar qué medición confirmó la falla.'],
    note: 'No provoques cortocircuitos intencionales para “ver qué pasa”.'
  },
  {
    id: 's3-p1', stage: 3, title: 'DC frente a AC', subtitle: 'Compara formas de onda en simulación', safety: 'theory',
    objective: 'Visualizar por qué una señal DC mantiene polaridad y una AC cambia periódicamente.',
    materials: ['Simulador de circuitos u osciloscopio virtual', 'Cuaderno de notas'],
    steps: ['Crea una fuente DC de 5 V en el simulador.', 'Observa su gráfica tensión-tiempo y describe su forma.', 'Cambia a una fuente senoidal de baja amplitud.', 'Modifica la frecuencia y observa qué cambia horizontalmente.', 'Compara valor pico, periodo y sentido de la señal.'],
    evidence: ['Distingues gráficamente DC y AC.', 'Relacionas frecuencia con periodo.', 'No confundes amplitud con frecuencia.'],
    note: 'No necesitas trabajar con la red eléctrica para aprender este fenómeno.'
  },
  {
    id: 's3-p2', stage: 3, title: 'Inducción con imán y bobina', subtitle: 'Genera una señal pequeña sin red eléctrica', safety: 'safe',
    objective: 'Observar que un campo magnético cambiante puede inducir una pequeña tensión.',
    materials: ['Imán pequeño', 'Bobina de alambre esmaltado o inductor', 'Multímetro en mV', 'Cables de prueba'],
    steps: ['Conecta la bobina al multímetro en un rango de milivoltios.', 'Mantén el imán quieto cerca de la bobina y observa.', 'Mueve el imán rápidamente hacia la bobina.', 'Aléjalo y observa el cambio de signo o dirección.', 'Repite a distintas velocidades y compara magnitudes.'],
    evidence: ['Observas que el movimiento produce una señal.', 'Relacionas mayor cambio de flujo con mayor lectura.', 'Puedes explicar por qué un imán quieto produce poco o ningún cambio.'],
    note: 'La señal generada es pequeña; no conectes esta práctica a una toma ni a un transformador de red abierto.'
  },
  {
    id: 's3-p3', stage: 3, title: 'Transformador virtual', subtitle: 'Relación de vueltas, voltaje y corriente', safety: 'theory',
    objective: 'Experimentar con relaciones de transformación sin manipular tensión de red.',
    materials: ['Simulador con transformador ideal', 'Calculadora'],
    steps: ['Configura un primario y secundario con relación 2:1.', 'Introduce una señal AC de baja amplitud en el primario.', 'Registra el voltaje secundario.', 'Cambia la relación a 1:2 y predice el resultado antes de simular.', 'Compara potencia ideal de entrada y salida.'],
    evidence: ['Usas correctamente la relación de vueltas.', 'Predices si el voltaje sube o baja.', 'Entiendes que el modelo ideal no representa pérdidas reales.'],
    note: 'Toda la práctica se realiza en simulación.'
  },
  {
    id: 's3-p4', stage: 3, title: 'Tablero CA didáctico', subtitle: 'Proyecto de análisis con fuente aislada o simulada', safety: 'supervised',
    objective: 'Interpretar un circuito AC sencillo con protección, interruptor y carga sin intervenir una instalación doméstica.',
    materials: ['Simulador o tablero didáctico certificado de baja tensión AC', 'Diagrama impreso', 'Multímetro solo bajo supervisión si hay hardware'],
    steps: ['Identifica fuente, protección, interruptor, carga y retorno en el diagrama.', 'Marca qué puntos deberían compartir el mismo potencial de referencia.', 'Predice qué mediciones esperarías con interruptor abierto y cerrado.', 'Comprueba las predicciones en simulación o en un tablero aislado preparado por un instructor.', 'Documenta cualquier diferencia entre predicción y medición.'],
    evidence: ['Sigues el recorrido completo del circuito.', 'Distingues apertura de circuito de falla a tierra.', 'Documentas mediciones esperadas y reales.'],
    note: 'No construyas ni abras una fuente conectada a 127 V. Hardware AC solo en banco aislado y con supervisión competente.'
  },
  {
    id: 's4-p1', stage: 4, title: 'Levantamiento de cargas', subtitle: 'Convierte una vivienda en una lista de necesidades', safety: 'design',
    objective: 'Crear un inventario eléctrico de una vivienda ficticia antes de dibujar circuitos.',
    materials: ['Plano simple de vivienda', 'Hoja de cálculo o cuaderno', 'Fichas de cargas ficticias proporcionadas por la plataforma'],
    steps: ['Divide el plano por espacios.', 'Lista iluminación, contactos y cargas especiales por espacio.', 'Asigna una potencia de ejercicio a cada carga según la ficha del caso.', 'Suma por zonas y por tipo de carga.', 'Identifica cargas que conviene separar por función.'],
    evidence: ['Tu tabla tiene ubicación, carga, potencia y observaciones.', 'Puedes explicar por qué agrupaste o separaste cada carga.', 'Detectas cargas dominantes.'],
    note: 'Es un ejercicio de diseño; los valores del caso no sustituyen un proyecto eléctrico real.'
  },
  {
    id: 's4-p2', stage: 4, title: 'Cuadro de circuitos', subtitle: 'Agrupa cargas y documenta circuitos derivados', safety: 'design',
    objective: 'Transformar el levantamiento de cargas en un cuadro ordenado de circuitos.',
    materials: ['Resultado de la práctica anterior', 'Plantilla de cuadro de circuitos'],
    steps: ['Crea un identificador para cada circuito.', 'Asigna cargas a cada circuito de ejercicio.', 'Calcula corriente de diseño con los datos del caso.', 'Añade columnas para conductor, protección y observaciones como propuesta académica.', 'Revisa que ninguna carga haya quedado sin circuito.'],
    evidence: ['El cuadro es trazable al plano.', 'Los cálculos tienen unidades.', 'Puedes justificar cada agrupación.'],
    note: 'La selección real debe validarse contra la normativa vigente, condiciones de instalación y responsable técnico.'
  },
  {
    id: 's4-p3', stage: 4, title: 'Caída de tensión', subtitle: 'Compara alternativas de diseño', safety: 'design',
    objective: 'Calcular cómo longitud, corriente y sección afectan la caída de tensión en un escenario académico.',
    materials: ['Calculadora', 'Datos de tres escenarios proporcionados por la lección', 'Hoja de resultados'],
    steps: ['Calcula la caída con el modelo indicado en la lección.', 'Repite duplicando la longitud.', 'Repite aumentando la sección del conductor del caso.', 'Expresa la caída en volts y porcentaje.', 'Elige la alternativa del ejercicio y explica tu criterio.'],
    evidence: ['Ves el efecto de longitud y sección.', 'No mezclas unidades.', 'Justificas la decisión con números.'],
    note: 'Ejercicio de cálculo; no indica qué conductor instalar en una obra real sin validación normativa.'
  },
  {
    id: 's4-p4', stage: 4, title: 'Plano eléctrico de vivienda', subtitle: 'Proyecto final de diseño', safety: 'design',
    objective: 'Entregar un plano de ejercicio con luminarias, contactos, apagadores, circuitos y cuadro de cargas.',
    materials: ['Plano base', 'Símbolos eléctricos', 'Cuadro de circuitos', 'Herramienta de dibujo o papel'],
    steps: ['Coloca los dispositivos sobre el plano.', 'Etiqueta cada elemento con su circuito.', 'Dibuja rutas conceptuales de canalización sin convertirlas en instrucciones de obra.', 'Añade leyenda de símbolos y cuadro de circuitos.', 'Haz una revisión cruzada entre plano, lista de cargas y cuadro.'],
    evidence: ['Todos los dispositivos tienen circuito.', 'La simbología es consistente.', 'Existe correspondencia entre plano y cuadro.'],
    note: 'Proyecto académico. Una instalación real requiere levantamiento de sitio, normativa aplicable y responsabilidad profesional.'
  },
  {
    id: 's5-p1', stage: 5, title: 'Canalización en tablero de práctica', subtitle: 'Traza recorridos sin energía', safety: 'supervised',
    objective: 'Practicar trazado, fijación y radios de canalización sobre un panel didáctico completamente desenergizado.',
    materials: ['Panel de madera de práctica', 'Canaleta o tubo didáctico', 'Cajas plásticas', 'Herramientas manuales adecuadas', 'EPP básico para trabajo mecánico'],
    steps: ['Dibuja el recorrido en el panel antes de cortar.', 'Presenta cajas y canalización sin fijar.', 'Comprueba alineación, acceso y radios.', 'Fija los elementos al panel.', 'Inspecciona bordes, sujeciones y entradas.'],
    evidence: ['El recorrido es limpio y accesible.', 'Las cajas quedan firmes y alineadas.', 'No hay bordes que puedan dañar conductores.'],
    note: 'Panel de entrenamiento sin conexión a red. No intervengas muros con instalaciones ocultas sin verificar el sitio.'
  },
  {
    id: 's5-p2', stage: 5, title: 'Tendido de conductores', subtitle: 'Guía, orden y reserva en canalización desenergizada', safety: 'supervised',
    objective: 'Practicar el paso de conductores en una maqueta sin conectar ninguna fuente.',
    materials: ['Panel didáctico anterior', 'Conductores de práctica', 'Guía pasacables', 'Etiquetas'],
    steps: ['Etiqueta origen y destino antes del tendido.', 'Pasa la guía por la canalización vacía.', 'Une los conductores de práctica a la guía de forma compacta.', 'Tira sin forzar ni dañar aislamiento.', 'Deja reserva razonable de práctica y vuelve a etiquetar.'],
    evidence: ['Los conductores llegan al destino correcto.', 'El aislamiento queda intacto.', 'Origen y destino están identificados.'],
    note: 'Se practica únicamente sobre una maqueta desenergizada.'
  },
  {
    id: 's5-p3', stage: 5, title: 'Pelado y terminales', subtitle: 'Técnica mecánica sobre retazos', safety: 'supervised',
    objective: 'Aprender a retirar aislamiento y preparar terminales sin dañar el conductor.',
    materials: ['Retazos de conductor de práctica', 'Pelacables', 'Terminales de práctica', 'Pinza de crimpado si corresponde'],
    steps: ['Selecciona la ranura correcta del pelacables.', 'Retira una longitud corta de aislamiento.', 'Inspecciona que no hayas cortado hebras o marcado el conductor.', 'Coloca el terminal de práctica según su diseño.', 'Tira suavemente para comprobar sujeción mecánica.'],
    evidence: ['El cobre no queda mellado.', 'El terminal no se desprende con una prueba suave.', 'La longitud pelada es consistente.'],
    note: 'Todo conductor debe estar aislado de cualquier fuente durante esta práctica.'
  },
  {
    id: 's5-p4', stage: 5, title: 'Cajas y dispositivos', subtitle: 'Montaje mecánico y orden', safety: 'supervised',
    objective: 'Montar interruptores y contactos de entrenamiento en cajas sin energizarlos.',
    materials: ['Cajas del panel didáctico', 'Dispositivos de práctica sin conexión a red', 'Tornillería y destornilladores'],
    steps: ['Comprueba que la caja esté firme.', 'Presenta el dispositivo y revisa orientación.', 'Organiza los conductores de práctica sin pellizcarlos.', 'Atornilla el dispositivo sin deformarlo.', 'Coloca tapa y verifica alineación.'],
    evidence: ['Dispositivo firme y alineado.', 'Conductores no quedan prensados.', 'La tapa asienta correctamente.'],
    note: 'Montaje mecánico desenergizado. La conexión a red no forma parte de esta práctica autónoma.'
  },
  {
    id: 's5-p5', stage: 5, title: 'Interruptor y lámpara a 12 V', subtitle: 'Replica una función residencial con baja tensión', safety: 'safe',
    objective: 'Entender funcionalmente el control de una carga usando una fuente limitada de 12 V DC o menos.',
    materials: ['Fuente DC limitada ≤12 V', 'Lámpara o LED adecuado a la fuente', 'Interruptor de baja tensión', 'Protoboard o panel didáctico', 'Conductores'],
    steps: ['Con la fuente desconectada, identifica entrada, interruptor, carga y retorno.', 'Monta el interruptor en serie con la carga.', 'Revisa polaridad si la carga es LED.', 'Energiza la fuente de baja tensión.', 'Acciona el interruptor y verifica que solo controla la trayectoria prevista.'],
    evidence: ['La carga responde al interruptor.', 'Puedes explicar qué conductor se interrumpe en el circuito didáctico.', 'El montaje sigue siendo baja tensión.'],
    note: 'No adaptes este montaje a 127 V.'
  },
  {
    id: 's5-p6', stage: 5, title: 'Muro eléctrico de entrenamiento', subtitle: 'Integra canalización, cajas y circuito didáctico', safety: 'supervised',
    objective: 'Integrar las prácticas anteriores en una maqueta funcional de baja tensión y documentada.',
    materials: ['Panel de entrenamiento', 'Canalización y cajas', 'Fuente limitada ≤12 V', 'Lámpara/LED e interruptor de baja tensión', 'Etiquetas'],
    steps: ['Revisa plano y lista de materiales.', 'Monta canalización y cajas con la fuente ausente.', 'Tienda y etiqueta conductores de práctica.', 'Conecta únicamente el circuito didáctico de baja tensión.', 'Inspecciona, energiza y prueba bajo el procedimiento definido.'],
    evidence: ['El montaje coincide con el plano.', 'Hay etiquetas en ambos extremos.', 'La prueba se realiza solo después de inspección.'],
    note: 'Este proyecto NO es una instalación residencial energizada; es una maqueta de entrenamiento.'
  },
  {
    id: 's6-p1', stage: 6, title: 'Falla de circuito abierto', subtitle: 'Encuentra dónde se perdió la trayectoria', safety: 'safe',
    objective: 'Diagnosticar una apertura intencional en un circuito LED de baja tensión.',
    materials: ['Circuito LED ≤5 V', 'Multímetro', 'Un jumper removible'],
    steps: ['Retira un jumper con la fuente desconectada y no anotes cuál en tu hoja de diagnóstico.', 'Energiza y observa el síntoma.', 'Formula dos hipótesis posibles.', 'Mide voltaje por secciones para localizar dónde deja de aparecer la trayectoria esperada.', 'Desenergiza, corrige y vuelve a probar.'],
    evidence: ['Encuentras la apertura por medición.', 'No cambias varias cosas a la vez.', 'Registras síntoma, causa y corrección.'],
    note: 'Solo baja tensión. No reproduzcas fallas deliberadas en una instalación real.'
  },
  {
    id: 's6-p2', stage: 6, title: 'Polaridad incorrecta', subtitle: 'Distingue orientación de circuito abierto', safety: 'safe',
    objective: 'Reconocer una carga polarizada conectada al revés y diferenciarla de una apertura.',
    materials: ['Circuito LED ≤5 V', 'Multímetro'],
    steps: ['Con la fuente desconectada, invierte el LED.', 'Energiza y registra el síntoma.', 'Mide la tensión disponible en los puntos del LED.', 'Compara el resultado con el caso de circuito abierto.', 'Desenergiza, corrige polaridad y confirma funcionamiento.'],
    evidence: ['Identificas que existe tensión aunque el LED no conduzca.', 'Distingues fallo de polaridad de falta de alimentación.', 'Corriges con la fuente desconectada.'],
    note: 'No hagas esta prueba con componentes cuyo daño por polaridad pueda ser peligroso.'
  },
  {
    id: 's6-p3', stage: 6, title: 'Conexión de alta resistencia', subtitle: 'Simula una mala unión de forma controlada', safety: 'safe',
    objective: 'Observar cómo una resistencia adicional puede provocar caída de tensión y comportamiento anormal.',
    materials: ['Simulador o circuito LED ≤5 V', 'Resistencia adicional de valor conocido', 'Multímetro'],
    steps: ['Registra primero el comportamiento normal.', 'Desenergiza e inserta una resistencia adicional en serie para simular la mala conexión.', 'Energiza y observa el cambio de brillo o lectura.', 'Mide tensión antes y después de la resistencia añadida.', 'Retira la resistencia con la fuente desconectada y confirma recuperación.'],
    evidence: ['Relacionas caída de tensión anormal con resistencia no deseada.', 'Usas mediciones antes/después.', 'No confundes el síntoma con falta total de alimentación.'],
    note: 'No simules conexiones flojas reales que puedan calentarse; usa una resistencia conocida.'
  },
  {
    id: 's6-p4', stage: 6, title: 'Árbol de diagnóstico', subtitle: 'Decide qué medir primero', safety: 'theory',
    objective: 'Construir un árbol de decisión para una carga que no funciona.',
    materials: ['Hoja o herramienta de diagramas', 'Tres casos de falla de la plataforma'],
    steps: ['Define el síntoma observable.', 'Formula la primera pregunta que divide el problema en dos grupos grandes.', 'Asocia una medición concreta a esa pregunta.', 'Continúa hasta llegar a causas específicas.', 'Prueba tu árbol con los tres casos y corrige ramas inútiles.'],
    evidence: ['Cada rama conduce a una acción medible.', 'Evitas cambiar piezas sin evidencia.', 'El árbol reduce el espacio de búsqueda.'],
    note: 'Método aplicable a muchos sistemas; en red real siempre se antepone el procedimiento de seguridad.'
  },
  {
    id: 's6-p5', stage: 6, title: 'Clínica de fallas', subtitle: 'Caso final de diagnóstico documentado', safety: 'safe',
    objective: 'Resolver una combinación de fallas sobre un banco didáctico de baja tensión y documentar el proceso.',
    materials: ['Banco didáctico ≤12 V', 'Multímetro', 'Hoja de diagnóstico'],
    steps: ['Recibe el banco con una falla preparada por otra persona o usa una configuración aleatoria segura.', 'Registra síntoma sin tocar nada.', 'Aplica inspección y luego mediciones según tu árbol.', 'Corrige una causa con la fuente desconectada.', 'Entrega reporte con hipótesis, mediciones, causa raíz y verificación.'],
    evidence: ['Existe una secuencia de diagnóstico reproducible.', 'La causa raíz está respaldada por datos.', 'La verificación final confirma la reparación.'],
    note: 'Banco didáctico únicamente; no introduzcas cortocircuitos deliberados.'
  },
  {
    id: 's7-p1', stage: 7, title: 'Cuantificación desde plano', subtitle: 'Del dibujo a una lista de materiales', safety: 'design',
    objective: 'Extraer cantidades de un plano de ejercicio de manera trazable.',
    materials: ['Plano eléctrico de ejercicio', 'Hoja de cálculo', 'Catálogo ficticio de materiales'],
    steps: ['Cuenta dispositivos por tipo.', 'Mide o estima recorridos con la escala del plano.', 'Agrupa materiales por sistema.', 'Añade porcentaje de desperdicio como hipótesis explícita del caso.', 'Cruza cada cantidad contra una referencia del plano.'],
    evidence: ['Cada renglón tiene unidad y origen.', 'El conteo puede auditarse.', 'Separaste cantidad base de desperdicio.'],
    note: 'Caso académico; cantidades reales requieren levantamiento de obra.'
  },
  {
    id: 's7-p2', stage: 7, title: 'Presupuesto profesional', subtitle: 'Material, mano de obra y supuestos', safety: 'design',
    objective: 'Construir una cotización transparente a partir de cantidades y precios de ejercicio.',
    materials: ['Cuantificación anterior', 'Lista de precios ficticia', 'Plantilla de presupuesto'],
    steps: ['Asigna precio unitario a cada material.', 'Añade mano de obra por concepto o jornada según el caso.', 'Separa indirectos y contingencia.', 'Documenta qué no está incluido.', 'Calcula subtotal, impuestos del ejercicio y total.'],
    evidence: ['El presupuesto puede recalcularse.', 'Los supuestos están visibles.', 'No mezclas costo con precio de venta sin explicarlo.'],
    note: 'Usa precios ficticios o actuales que tú proporciones; la plataforma no fija tarifas profesionales.'
  },
  {
    id: 's7-p3', stage: 7, title: 'Expediente de entrega', subtitle: 'Pruebas, cambios y cierre del trabajo', safety: 'design',
    objective: 'Preparar un expediente de cierre para un proyecto de ejercicio.',
    materials: ['Plano final', 'Cuadro de circuitos', 'Checklist de inspección', 'Registro de cambios'],
    steps: ['Compila plano y versión final.', 'Añade lista de circuitos y materiales instalados en el caso.', 'Registra pruebas previstas y resultados simulados o del banco didáctico.', 'Incluye cambios respecto al diseño inicial.', 'Prepara una hoja de entrega con pendientes y recomendaciones.'],
    evidence: ['El expediente cuenta la historia del proyecto.', 'Las pruebas tienen resultado y fecha.', 'Los cambios están documentados.'],
    note: 'La documentación profesional real debe ajustarse al contrato, normativa y responsabilidad aplicables.'
  },
  {
    id: 's8-p1', stage: 8, title: 'Motor DC de baja tensión', subtitle: 'Sentido de giro y control básico', safety: 'safe',
    objective: 'Relacionar polaridad con sentido de giro en un motor pequeño.',
    materials: ['Motor DC de 3–6 V', 'Portapilas adecuado', 'Interruptor', 'Cables'],
    steps: ['Con la fuente desconectada, conecta motor e interruptor en serie.', 'Energiza y registra el sentido de giro.', 'Desenergiza e invierte los terminales del motor.', 'Vuelve a energizar y compara.', 'Explica qué cambió eléctricamente.'],
    evidence: ['Controlas encendido con el interruptor.', 'Relacionas polaridad con sentido de giro.', 'Desconectas antes de modificar.'],
    note: 'Usa motores pequeños y fuente adecuada; evita bloquear el eje durante mucho tiempo.'
  },
  {
    id: 's8-p2', stage: 8, title: 'Relé controlando un LED', subtitle: 'Separa control y carga sin usar red', safety: 'safe',
    objective: 'Entender contactos COM/NO/NC usando un módulo de relé de baja tensión y una carga LED.',
    materials: ['Módulo de relé de 5 V apto para prácticas', 'Fuente 5 V', 'LED con resistencia o módulo LED', 'Jumpers'],
    steps: ['Identifica bobina/control y contactos COM, NO y NC del módulo.', 'Con la fuente desconectada, conecta únicamente una carga LED de baja tensión a COM y NO.', 'Alimenta el módulo con 5 V según su ficha.', 'Activa y desactiva el control y observa el LED.', 'Repite conceptualmente con NC y explica la diferencia.'],
    evidence: ['Distingues circuito de control y circuito de carga.', 'Entiendes NO y NC.', 'No utilizas tensión de red.'],
    note: 'Aunque el relé pueda especificar tensiones mayores, esta práctica se limita a 5 V.'
  },
  {
    id: 's8-p3', stage: 8, title: 'Mini panel solar', subtitle: 'Mide cómo cambia la salida con la luz', safety: 'safe',
    objective: 'Medir tensión en circuito abierto de un panel solar pequeño bajo diferentes condiciones de iluminación.',
    materials: ['Mini panel solar de baja tensión', 'Multímetro', 'Fuente de luz o luz natural indirecta'],
    steps: ['Configura el multímetro en voltaje DC.', 'Mide la tensión del panel con iluminación estable.', 'Cubre parcialmente el panel y registra el cambio.', 'Cambia el ángulo respecto a la luz y vuelve a medir.', 'Haz una tabla condición → voltaje.'],
    evidence: ['Observas dependencia con iluminación y orientación.', 'Mantienes polaridad de medición.', 'Diferencias medición en vacío de comportamiento bajo carga.'],
    note: 'No conectes baterías para cargarlas en esta práctica.'
  },
  {
    id: 's8-p4', stage: 8, title: 'Automatización de 5 V', subtitle: 'Sensor → lógica → actuador', safety: 'safe',
    objective: 'Construir o simular una cadena simple de automatización usando únicamente baja tensión.',
    materials: ['Simulador o microcontrolador de 5 V/3.3 V', 'Sensor compatible', 'LED o buzzer pequeño', 'Protoboard y jumpers'],
    steps: ['Define una condición medible del sensor.', 'Conecta o simula la lectura del sensor.', 'Programa o configura un umbral sencillo.', 'Activa LED/buzzer cuando se cumpla la condición.', 'Prueba tres valores y registra entrada y salida.'],
    evidence: ['Distingues sensor, lógica y actuador.', 'El umbral produce un comportamiento repetible.', 'Puedes explicar el flujo completo del sistema.'],
    note: 'Mantén todo el proyecto en baja tensión; automatizar una carga de red es otra categoría de trabajo.'
  },  {
    id: 's4-p5', stage: 4, title: 'Casos especiales de vivienda', subtitle: 'Cocina, baño, exterior y equipos fijos', safety: 'design',
    objective: 'Aprender a detectar cuándo un espacio o equipo exige preguntas y criterios adicionales antes de dimensionar.',
    materials: ['Plano de vivienda de ejercicio', 'Fichas de cargas', 'Checklist normativo didáctico'],
    steps: ['Marca cocina, baños, exterior y equipos fijos.', 'Para cada zona escribe qué riesgos o condiciones especiales existen.', 'Identifica qué datos faltan antes de seleccionar circuito.', 'Propón separación de circuitos y protección a nivel conceptual.', 'Contrasta tu propuesta contra el checklist del caso.'],
    evidence: ['No tratas toda la vivienda como un circuito genérico.', 'Distingues sobrecorriente de protección diferencial.', 'Dejas explícitos los datos faltantes.'],
    note: 'Diseño de ejercicio. Verifica siempre la normativa y requisitos locales vigentes antes de un proyecto real.'
  },
  {
    id: 's4-p6', stage: 4, title: 'Hoja de dimensionamiento completa', subtitle: 'Conductor + caída + protección + canalización', safety: 'design',
    objective: 'Resolver una selección sin saltar directamente a un calibre por costumbre.',
    materials: ['Hoja de cálculo', 'Tablas didácticas incluidas en el caso', 'Calculadora'],
    steps: ['Calcula corriente de diseño del caso.', 'Selecciona conductor base con la tabla del ejercicio.', 'Aplica correcciones indicadas.', 'Comprueba caída de tensión.', 'Selecciona protección y dimensiona canalización con la información suministrada.'],
    evidence: ['Cada decisión tiene una fuente o cálculo.', 'Puedes explicar qué condición gobierna.', 'La hoja permite cambiar datos y recalcular.'],
    note: 'Las tablas didácticas sirven para entrenar el proceso; un proyecto real debe consultar la norma y productos aplicables.'
  },
  {
    id: 's5-p7', stage: 5, title: 'Canalización con curvas', subtitle: 'Medir, doblar y verificar en tablero', safety: 'supervised',
    objective: 'Ejecutar un recorrido mecánico ordenado sin conductores energizados.',
    materials: ['Tubo de práctica', 'Doblador compatible', 'Cinta', 'Panel de entrenamiento', 'EPP apropiado'],
    steps: ['Dibuja el recorrido con cotas.', 'Marca el tubo antes de doblar.', 'Realiza una curva de 90° y un desplazamiento sencillo.', 'Monta el recorrido en panel.', 'Pasa una guía y confirma que no hay estrangulamientos.'],
    evidence: ['El recorrido coincide con medidas.', 'Las curvas permiten paso de guía.', 'No hay bordes o aplastamientos visibles.'],
    note: 'Práctica mecánica desenergizada y con herramienta adecuada.'
  },
  {
    id: 's5-p8', stage: 5, title: 'Banco de terminaciones', subtitle: 'Pelado, conectores, torque y montaje', safety: 'supervised',
    objective: 'Practicar calidad repetible de terminaciones antes de trabajar en una instalación real.',
    materials: ['Retazos de conductor', 'Conectores de práctica', 'Bornera o dispositivos desenergizados', 'Pelacables', 'Herramienta de torque si está disponible'],
    steps: ['Prepara 12 conductores con longitud consistente.', 'Inspecciona que no existan muescas.', 'Realiza las terminaciones según el dispositivo.', 'Aplica torque indicado en el ejercicio cuando corresponda.', 'Haz prueba visual y mecánica y descarta las defectuosas.'],
    evidence: ['Cobre expuesto controlado.', 'Conductor sin daños.', 'Terminación estable y documentada.'],
    note: 'Solo material de práctica sin energía.'
  },
  {
    id: 's6-p6', stage: 6, title: 'Falla intermitente', subtitle: 'Captura condiciones antes de mover nada', safety: 'safe',
    objective: 'Entrenar diagnóstico de fallas que aparecen solo bajo determinadas condiciones.',
    materials: ['Banco ≤12 V', 'Interruptor o conector que permita una falla segura preparada', 'Multímetro', 'Hoja de eventos'],
    steps: ['Registra el síntoma y condición exacta.', 'No toques el circuito durante la primera observación.', 'Formula tres causas posibles.', 'Elige una medición que diferencie dos hipótesis.', 'Repite hasta encontrar la causa y documenta cómo la reprodujiste.'],
    evidence: ['Capturas condición y tiempo.', 'Tus mediciones discriminan hipótesis.', 'Puedes reproducir y eliminar la falla.'],
    note: 'No simules una conexión floja que pueda calentarse; usa un elemento preparado de baja tensión.'
  },
  {
    id: 's6-p7', stage: 6, title: 'Clínica de caída de tensión', subtitle: 'Localiza dónde se pierde voltaje', safety: 'safe',
    objective: 'Dividir un circuito en segmentos para encontrar una resistencia anormal simulada.',
    materials: ['Circuito ≤12 V', 'Resistencias conocidas', 'Multímetro', 'Puntos de prueba'],
    steps: ['Mide fuente sin carga y con carga.', 'Registra tensión en la carga.', 'Mide caída en cada segmento.', 'Suma las caídas y compara con la fuente.', 'Localiza el segmento anormal y corrige con la fuente desconectada.'],
    evidence: ['Distingues caída normal y anormal.', 'Compruebas con mediciones segmentadas.', 'La reparación restaura el valor esperado.'],
    note: 'La resistencia de falla se simula con un componente conocido; no con una conexión defectuosa real.'
  },
  {
    id: 's7-p4', stage: 7, title: 'Alcance y propuesta técnica', subtitle: 'Define exactamente qué vas a entregar', safety: 'design',
    objective: 'Redactar un alcance profesional que separe inclusiones, exclusiones, supuestos y datos faltantes.',
    materials: ['Caso ficticio de remodelación', 'Plantilla de alcance'],
    steps: ['Resume necesidad del cliente.', 'Lista trabajos incluidos por área.', 'Lista exclusiones y trabajos de terceros.', 'Registra supuestos y condiciones existentes.', 'Añade entregables, pruebas y criterios de aceptación.'],
    evidence: ['Otra persona entiende qué sí/no incluye.', 'Los supuestos están visibles.', 'Las responsabilidades fuera de tu competencia se identifican.'],
    note: 'Ejercicio profesional; contratos reales pueden requerir asesoría legal y requisitos locales.'
  },
  {
    id: 's7-p5', stage: 7, title: 'Control de calidad + as-built', subtitle: 'Cierra la obra con evidencia', safety: 'design',
    objective: 'Practicar inspección por hitos y actualización final de documentos.',
    materials: ['Plano de ejercicio', 'Lista de cambios', 'Plantillas de inspección'],
    steps: ['Crea checklists para canalización, tendido, terminaciones y pre-energización.', 'Audita un caso fotográfico.', 'Registra pendientes.', 'Aplica una lista de cambios al plano.', 'Entrega directorio de circuitos y versión final.'],
    evidence: ['Los cambios son trazables.', 'Cada pendiente tiene estado.', 'Plano y cuadro final coinciden.'],
    note: 'La documentación no sustituye inspecciones o verificaciones exigidas legalmente.'
  },
  {
    id: 's8-p5', stage: 8, title: 'Trifásico en simulación', subtitle: '120° sin tocar una instalación real', safety: 'theory',
    objective: 'Visualizar fases, secuencia y balance mediante simulación.',
    materials: ['Simulador de señales o circuitos', 'Calculadora'],
    steps: ['Grafica tres senoidales separadas 120°.', 'Identifica secuencia ABC.', 'Invierte dos fases virtualmente.', 'Distribuye tres cargas iguales y luego una desigual.', 'Compara corrientes y registra observaciones.'],
    evidence: ['Reconoces desfase y secuencia.', 'Comprendes balance conceptual.', 'No aplicas fórmulas monofásicas sin revisar.'],
    note: 'Simulación únicamente.'
  },
  {
    id: 's8-p6', stage: 8, title: 'Triángulo de potencia', subtitle: 'W, var, VA y factor de potencia', safety: 'design',
    objective: 'Relacionar potencia activa, reactiva, aparente y corriente en casos de ejercicio.',
    materials: ['Calculadora', 'Hoja de ejercicios'],
    steps: ['Resuelve un caso resistivo.', 'Resuelve tres casos con FP distinto.', 'Compara corriente para la misma potencia activa.', 'Dibuja triángulo de potencia.', 'Explica qué cambia y qué no al mejorar FP.'],
    evidence: ['No confundes eficiencia con FP.', 'Usas unidades correctas.', 'Puedes explicar el efecto sobre corriente.'],
    note: 'Cálculo y análisis.'
  },
  {
    id: 's8-p7', stage: 8, title: 'VFD virtual', subtitle: 'Parámetros y motor sin potencia real', safety: 'theory',
    objective: 'Aprender el flujo de configuración de un variador sin conectarlo a la red.',
    materials: ['Simulador o ficha de VFD', 'Placa ficticia de motor'],
    steps: ['Lee datos de placa del motor.', 'Configura tensión/corriente nominales en el caso.', 'Define rampas y límites de frecuencia.', 'Simula arranque y cambio de consigna.', 'Diagnostica dos alarmas ficticias.'],
    evidence: ['Los parámetros se basan en placa.', 'Comprendes rampa y frecuencia.', 'Distingues control de potencia de control lógico.'],
    note: 'El cableado real de VFD/motor requiere experiencia y procedimientos específicos.'
  },
  {
    id: 's9-p1', stage: 9, title: 'Caso maestro · levantamiento', subtitle: 'No diseñes hasta saber qué falta', safety: 'design',
    objective: 'Preparar la base técnica del proyecto residencial completo.',
    materials: ['Plano arquitectónico ficticio', 'Brief de usuario', 'Fichas de equipo', 'Plantilla RFI'],
    steps: ['Revisa cada espacio.', 'Lista cargas y necesidades.', 'Separa dato confirmado de supuesto.', 'Genera preguntas para datos faltantes.', 'Congela una versión de entrada del proyecto.'],
    evidence: ['Inventario de cargas trazable.', 'Supuestos explícitos.', 'Lista de RFIs resueltos o pendientes.'],
    note: 'Proyecto de diseño y entrenamiento.'
  },
  {
    id: 's9-p2', stage: 9, title: 'Caso maestro · cuadro de cargas', subtitle: 'Cada símbolo termina en un circuito', safety: 'design',
    objective: 'Crear arquitectura completa de circuitos de la vivienda ficticia.',
    materials: ['Levantamiento aprobado', 'Hoja de cálculo'],
    steps: ['Asigna identificadores a circuitos.', 'Agrupa cargas con justificación.', 'Calcula valores del ejercicio.', 'Marca cargas dedicadas.', 'Verifica que todo elemento del plano esté asignado.'],
    evidence: ['100% de cargas trazadas.', 'Criterios de agrupación escritos.', 'Cuadro listo para dimensionamiento.'],
    note: 'Los factores normativos deben provenir del material de referencia vigente.'
  },
  {
    id: 's9-p3', stage: 9, title: 'Caso maestro · dimensionamiento', subtitle: 'Verifica, no adivines', safety: 'design',
    objective: 'Seleccionar conductores, protecciones y canalizaciones mediante una hoja auditable.',
    materials: ['Cuadro de cargas', 'Tablas normativas/didácticas', 'Calculadora u hoja de cálculo'],
    steps: ['Dimensiona conductor por circuito.', 'Aplica correcciones requeridas.', 'Comprueba caída de tensión.', 'Selecciona protección.', 'Dimensiona canalización y registra criterio gobernante.'],
    evidence: ['Una fila por circuito con verificaciones.', 'Sin selecciones “por costumbre”.', 'Errores de unidad detectados por control cruzado.'],
    note: 'Antes de usarlo en obra real, contrasta con normativa vigente y responsable competente.'
  },
  {
    id: 's9-p4', stage: 9, title: 'Caso maestro · planos', subtitle: 'Planta + unifilar + directorio', safety: 'design',
    objective: 'Producir documentación consistente entre plano, cuadro y tablero.',
    materials: ['Plano base', 'Leyenda de símbolos', 'Plantilla unifilar'],
    steps: ['Coloca dispositivos y circuitos.', 'Añade etiquetas y referencias.', 'Dibuja unifilar simplificado.', 'Crea directorio de tablero.', 'Haz revisión cruzada plano ↔ cuadro ↔ unifilar.'],
    evidence: ['No hay dispositivos huérfanos.', 'Nomenclatura consistente.', 'Otra persona puede seguir circuitos.'],
    note: 'Diseño de ejercicio.'
  },
  {
    id: 's9-p5', stage: 9, title: 'Caso maestro · materiales y presupuesto', subtitle: 'Convierte diseño en una obra cuantificable', safety: 'design',
    objective: 'Preparar BOM, generadores y presupuesto transparente.',
    materials: ['Planos del caso', 'Catálogo de materiales ficticio', 'Hoja de cálculo'],
    steps: ['Cuantifica dispositivos.', 'Mide recorridos con escala.', 'Añade cajas, conectores, accesorios y consumibles.', 'Separa desperdicio como hipótesis.', 'Calcula material, mano de obra ficticia e indirectos.'],
    evidence: ['Cada cantidad tiene origen.', 'El precio puede actualizarse sin rehacer cantidades.', 'Exclusiones visibles.'],
    note: 'Los precios son de práctica salvo que el usuario cargue precios actuales.'
  },
  {
    id: 's9-p6', stage: 9, title: 'Caso maestro · muro de entrenamiento', subtitle: 'Tres circuitos representativos en baja tensión', safety: 'supervised',
    objective: 'Transferir plano a montaje físico seguro sin usar red doméstica.',
    materials: ['Panel de práctica', 'Canalización/cajas', 'Conductores de práctica', 'Fuente ≤12 V', 'Dispositivos didácticos'],
    steps: ['Selecciona tres circuitos representativos.', 'Marca el panel según plano.', 'Monta cajas/canalización desenergizadas.', 'Tienda y etiqueta conductores.', 'Conecta únicamente cargas de baja tensión y revisa antes de energizar.'],
    evidence: ['Montaje coincide con plano.', 'Etiquetas en ambos extremos.', 'Checklist de inspección completo.'],
    note: 'No adaptes el panel a 127 V para “hacerlo real”. La transferencia a red pertenece a campo supervisado.'
  },
  {
    id: 's9-p7', stage: 9, title: 'Caso maestro · plan de pruebas', subtitle: 'Cada número necesita un valor esperado', safety: 'supervised',
    objective: 'Crear y ejecutar un protocolo de comprobación sobre el banco didáctico.',
    materials: ['Banco de práctica', 'Multímetro', 'Checklist de pruebas'],
    steps: ['Define inspecciones visuales.', 'Escribe valor/estado esperado para cada prueba.', 'Ejecuta sobre banco de baja tensión.', 'Registra resultado real y desviaciones.', 'Corrige y repite hasta cerrar pendientes.'],
    evidence: ['Al menos 15 verificaciones.', 'Esperado vs real documentado.', 'No existe “funciona” como única evidencia.'],
    note: 'Las pruebas de una instalación real pueden exigir instrumentos y procedimientos adicionales.'
  },
  {
    id: 's9-p8', stage: 9, title: 'Caso maestro · clínica de fallas', subtitle: 'Diagnostica sin cambiar piezas al azar', safety: 'safe',
    objective: 'Resolver cinco fallas seguras insertadas en el banco didáctico.',
    materials: ['Banco ≤12 V', 'Multímetro', 'Tarjetas de falla'],
    steps: ['Registra síntoma.', 'Formula hipótesis.', 'Elige medición discriminante.', 'Localiza causa.', 'Corrige con fuente desconectada y documenta evidencia.'],
    evidence: ['Cinco fallas resueltas por método.', 'Hipótesis y mediciones registradas.', 'Causa raíz distinta de síntoma.'],
    note: 'Fallas preparadas con métodos seguros; no generes cortos ni calentamientos deliberados.'
  },
  {
    id: 's9-p9', stage: 9, title: 'Caso maestro · inspección profesional', subtitle: '50 puntos antes de cerrar', safety: 'design',
    objective: 'Auditar el proyecto completo como si no fuera tuyo.',
    materials: ['Expediente maestro', 'Checklist de 50 puntos'],
    steps: ['Revisa trazabilidad de cargas.', 'Revisa cálculos y unidades.', 'Revisa planos y etiquetas.', 'Revisa evidencia del banco.', 'Clasifica hallazgos en crítico, mayor y menor y corrige.'],
    evidence: ['Todos los hallazgos tienen resolución.', 'Versiones actualizadas.', 'No quedan contradicciones entre documentos.'],
    note: 'Autorrevisión no sustituye una inspección oficial o revisión de un profesional responsable cuando aplique.'
  },
  {
    id: 's9-p10', stage: 9, title: 'Defensa técnica final', subtitle: 'Demuestra que sabes por qué, no solo cómo', safety: 'design',
    objective: 'Defender decisiones y reconocer límites frente a una revisión crítica.',
    materials: ['Expediente final', 'Banco de 30 preguntas', 'Hoja de correcciones'],
    steps: ['Responde sin mirar notas primero.', 'Señala la evidencia para cada respuesta.', 'Marca preguntas que no puedes justificar.', 'Corrige proyecto o documentación.', 'Entrega versión final y plan de experiencia de campo supervisada.'],
    evidence: ['Respuestas justificadas.', 'Correcciones trazables.', 'Límites de autonomía reconocidos.'],
    note: 'Completar esta defensa demuestra dominio académico/didáctico, no reemplaza experiencia real supervisada.'
  },
]

const materials = [
  { id: 'battery', label: 'Portapilas + 2 pilas AA', detail: 'Fuente segura de baja tensión' },
  { id: 'led', label: '1 LED de 5 mm', detail: 'Cualquier color' },
  { id: 'resistor', label: '1 resistencia de 220–330 Ω', detail: '¼ W es suficiente' },
  { id: 'switch', label: '1 mini interruptor', detail: 'Opcional: pulsador' },
  { id: 'breadboard', label: '1 mini protoboard', detail: 'Reutilizable para muchos módulos' },
  { id: 'jumpers', label: 'Cables jumper', detail: 'Macho-macho' },
]

type View = 'home' | 'electricity' | 'stage' | 'stage-practice' | 'lesson' | 'ohm' | 'power' | 'polarity' | 'series' | 'diagrams' | 'drill' | 'practice' | 'library' | 'topic' | 'trade-route' | 'trade-stage' | 'trade-lesson' | 'assessment' | 'mastery' | 'portfolio' | 'inspector' | 'tutor'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [selectedTopicId, setSelectedTopicId] = useState(electricityTopics[0].id)
  const [selectedStage, setSelectedStage] = useState(1)
  const [selectedStagePracticeId, setSelectedStagePracticeId] = useState(stagePractices[0].id)
  const [selectedTradeId, setSelectedTradeId] = useState('drywall')
  const [selectedTradeStage, setSelectedTradeStage] = useState(1)
  const [selectedTradeSkillIndex, setSelectedTradeSkillIndex] = useState(0)
  const [assessmentRouteId, setAssessmentRouteId] = useState('electricity')
  const [assessmentStage, setAssessmentStage] = useState(1)
  const [masteryMap, setMasteryMap] = useState<Record<string, MasteryLevel>>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-mastery-map') || '{}') } catch { return {} }
  })
  const [stagePracticeDone, setStagePracticeDone] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-stage-practice-done') || '[]') } catch { return [] }
  })
  const [tradeSkillDone, setTradeSkillDone] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-trade-skill-done') || '[]') } catch { return [] }
  })
  const [tradePracticeDone, setTradePracticeDone] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-trade-practice-done') || '[]') } catch { return [] }
  })
  const [libraryDone, setLibraryDone] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-electricity-library-done') || '[]') } catch { return [] }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [checked, setChecked] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('oficioslab-materials') || '[]') } catch { return [] }
  })
  const [lessonDone, setLessonDone] = useState(() => localStorage.getItem('oficioslab-lesson-1') === 'done')
  const [ohmDone, setOhmDone] = useState(() => localStorage.getItem('oficioslab-ohm') === 'done')
  const [powerDone, setPowerDone] = useState(() => localStorage.getItem('oficioslab-power') === 'done')
  const [polarityDone, setPolarityDone] = useState(() => localStorage.getItem('oficioslab-polarity') === 'done')
  const [seriesDone, setSeriesDone] = useState(() => localStorage.getItem('oficioslab-series') === 'done')
  const [diagramsDone, setDiagramsDone] = useState(() => localStorage.getItem('oficioslab-diagrams') === 'done')
  const [practiceDone, setPracticeDone] = useState(() => localStorage.getItem('oficioslab-practice-1') === 'done')
  const [cloudUser, setCloudUser] = useState<User | null>(null)
  const [cloudStatus, setCloudStatus] = useState<CloudSyncState>(supabaseConfigured ? 'signed-out' : 'local')
  const [cloudModalOpen, setCloudModalOpen] = useState(false)
  const cloudHydratedRef = useRef(false)

  const applyCloudState = (state: OficiosLabState) => {
    setLibraryDone(Array.isArray(state.libraryDone) ? state.libraryDone : [])
    setMasteryMap((state.masteryMap || {}) as Record<string, MasteryLevel>)
    setStagePracticeDone(Array.isArray(state.stagePracticeDone) ? state.stagePracticeDone : [])
    setTradeSkillDone(Array.isArray(state.tradeSkillDone) ? state.tradeSkillDone : [])
    setTradePracticeDone(Array.isArray(state.tradePracticeDone) ? state.tradePracticeDone : [])
    setChecked(Array.isArray(state.checked) ? state.checked : [])
    setLessonDone(Boolean(state.lessonDone))
    setOhmDone(Boolean(state.ohmDone))
    setPowerDone(Boolean(state.powerDone))
    setPolarityDone(Boolean(state.polarityDone))
    setSeriesDone(Boolean(state.seriesDone))
    setDiagramsDone(Boolean(state.diagramsDone))
    setPracticeDone(Boolean(state.practiceDone))
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      setCloudStatus('local')
      return
    }
    let cancelled = false
    const hydrate = async (user: User | null) => {
      if (cancelled) return
      setCloudUser(user)
      if (!user) {
        cloudHydratedRef.current = false
        setCloudStatus('signed-out')
        return
      }
      cloudHydratedRef.current = false
      setCloudStatus('syncing')
      try {
        const local = readLocalProgress()
        const remote = await loadCloudState(user.id)
        if (remote?.state) {
          // El progreso es monotónico: unimos completados y conservamos el mayor nivel de dominio.
          // Así, una sesión offline en otro dispositivo no se pierde al volver a conectarse.
          const merged = mergeProgress(local, remote.state)
          applyCloudState(merged)
          await saveCloudState(user.id, merged)
        } else {
          await saveCloudState(user.id, local)
        }
        cloudHydratedRef.current = true
        setCloudStatus('synced')
      } catch (error) {
        console.error('No se pudo hidratar OficiosLab desde Supabase', error)
        setCloudStatus('error')
      }
    }
    getCurrentUser().then(hydrate)
    const unsubscribe = subscribeToAuth(hydrate)
    return () => { cancelled = true; unsubscribe() }
  }, [])


  useEffect(() => {
    localStorage.setItem('oficioslab-electricity-library-done', JSON.stringify(libraryDone))
  }, [libraryDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-mastery-map', JSON.stringify(masteryMap))
  }, [masteryMap])

  useEffect(() => {
    localStorage.setItem('oficioslab-stage-practice-done', JSON.stringify(stagePracticeDone))
  }, [stagePracticeDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-trade-skill-done', JSON.stringify(tradeSkillDone))
  }, [tradeSkillDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-trade-practice-done', JSON.stringify(tradePracticeDone))
  }, [tradePracticeDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-materials', JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    localStorage.setItem('oficioslab-lesson-1', lessonDone ? 'done' : 'pending')
  }, [lessonDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-ohm', ohmDone ? 'done' : 'pending')
  }, [ohmDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-power', powerDone ? 'done' : 'pending')
  }, [powerDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-polarity', polarityDone ? 'done' : 'pending')
  }, [polarityDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-series', seriesDone ? 'done' : 'pending')
  }, [seriesDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-diagrams', diagramsDone ? 'done' : 'pending')
  }, [diagramsDone])

  useEffect(() => {
    localStorage.setItem('oficioslab-practice-1', practiceDone ? 'done' : 'pending')
  }, [practiceDone])

  const cloudSnapshot = useMemo<OficiosLabState>(() => ({
    version: 1,
    libraryDone,
    masteryMap,
    stagePracticeDone,
    tradeSkillDone,
    tradePracticeDone,
    checked,
    lessonDone,
    ohmDone,
    powerDone,
    polarityDone,
    seriesDone,
    diagramsDone,
    practiceDone,
  }), [libraryDone, masteryMap, stagePracticeDone, tradeSkillDone, tradePracticeDone, checked, lessonDone, ohmDone, powerDone, polarityDone, seriesDone, diagramsDone, practiceDone])

  useEffect(() => {
    if (!cloudUser || !cloudHydratedRef.current) return
    const timer = window.setTimeout(async () => {
      setCloudStatus('syncing')
      try {
        await saveCloudState(cloudUser.id, cloudSnapshot)
        setCloudStatus('synced')
      } catch (error) {
        console.error('No se pudo sincronizar OficiosLab', error)
        setCloudStatus('error')
      }
    }, 700)
    return () => window.clearTimeout(timer)
  }, [cloudUser, cloudSnapshot])

  const syncNow = async () => {
    if (!cloudUser) return
    setCloudStatus('syncing')
    try {
      await saveCloudState(cloudUser.id, cloudSnapshot)
      setCloudStatus('synced')
    } catch (error) {
      console.error('No se pudo sincronizar OficiosLab', error)
      setCloudStatus('error')
    }
  }

  const stageOneCompleted = 1 + Number(lessonDone) + Number(ohmDone) + Number(powerDone) + Number(polarityDone) + Number(seriesDone) + Number(diagramsDone) + Number(practiceDone)
  const completedSkills = stageOneCompleted + libraryDone.filter(id => { const topic = electricityTopics.find(item => item.id === id); return topic && topic.stage > 1 }).length
  const progress = Math.max(2, Math.round((completedSkills / totalElectricSkills) * 100))

  return (
    <div className="app-shell">
      <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setView={setView} cloudUser={cloudUser} cloudStatus={cloudStatus} onCloudClick={() => setCloudModalOpen(true)} />
      {cloudModalOpen && <CloudSyncModal user={cloudUser} status={cloudStatus} onClose={() => setCloudModalOpen(false)} onSync={syncNow} />}
      <div className="layout">
        <Sidebar view={view} setView={setView} progress={progress} open={menuOpen} close={() => setMenuOpen(false)} completedSkills={completedSkills} />
        <main className="main-content">
          {view === 'home' && <HomeView setView={setView} progress={progress} openTrade={(id) => { if (id === 'electricity') { setView('electricity') } else { setSelectedTradeId(id); setView('trade-route') }; window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
          {view === 'electricity' && <ElectricityView setView={setView} setSelectedStage={setSelectedStage} progress={progress} lessonDone={lessonDone} ohmDone={ohmDone} powerDone={powerDone} polarityDone={polarityDone} seriesDone={seriesDone} diagramsDone={diagramsDone} practiceDone={practiceDone} libraryDone={libraryDone} openAssessment={() => { setAssessmentRouteId('electricity'); setAssessmentStage(1); setView('assessment'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'stage' && <ElectricityStageView setView={setView} stageNumber={selectedStage} setSelectedStage={setSelectedStage} setSelectedTopicId={setSelectedTopicId} setSelectedStagePracticeId={setSelectedStagePracticeId} done={libraryDone} practiceDone={stagePracticeDone} openAssessment={() => { setAssessmentRouteId('electricity'); setAssessmentStage(selectedStage); setView('assessment'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'stage-practice' && <StagePracticeView setView={setView} practiceId={selectedStagePracticeId} setSelectedStage={setSelectedStage} done={stagePracticeDone} setDone={setStagePracticeDone} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'lesson' && <LessonView setView={setView} lessonDone={lessonDone} setLessonDone={setLessonDone} />}
          {view === 'ohm' && <OhmLawView setView={setView} done={ohmDone} setDone={setOhmDone} />}
          {view === 'power' && <PowerEnergyView setView={setView} done={powerDone} setDone={setPowerDone} />}
          {view === 'polarity' && <PolarityView setView={setView} done={polarityDone} setDone={setPolarityDone} />}
          {view === 'series' && <SeriesParallelView setView={setView} done={seriesDone} setDone={setSeriesDone} />}
          {view === 'diagrams' && <DiagramView setView={setView} done={diagramsDone} setDone={setDiagramsDone} />}
          {view === 'drill' && <CalculationDrillView setView={setView} />}
          {view === 'practice' && <PracticeView setView={setView} checked={checked} setChecked={setChecked} done={practiceDone} setDone={setPracticeDone} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'library' && <ElectricityLibraryView setView={setView} setSelectedStage={setSelectedStage} setSelectedTopicId={setSelectedTopicId} done={libraryDone} />}
          {view === 'topic' && <ElectricityTopicView setView={setView} setSelectedStage={setSelectedStage} topicId={selectedTopicId} setSelectedTopicId={setSelectedTopicId} done={libraryDone} setDone={setLibraryDone} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'trade-route' && <TradeRouteView routeId={selectedTradeId} setView={setView} setStage={setSelectedTradeStage} skillDone={tradeSkillDone} practiceDone={tradePracticeDone} />}
          {view === 'trade-stage' && <TradeStageView routeId={selectedTradeId} stageNumber={selectedTradeStage} setStage={setSelectedTradeStage} setView={setView} skillDone={tradeSkillDone} setSkillDone={setTradeSkillDone} practiceDone={tradePracticeDone} setPracticeDone={setTradePracticeDone} masteryMap={masteryMap} setMasteryMap={setMasteryMap} openSkill={(index) => { setSelectedTradeSkillIndex(index); setView('trade-lesson'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} openAssessment={() => { setAssessmentRouteId(selectedTradeId); setAssessmentStage(selectedTradeStage); setView('assessment'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} openInspector={() => setView('inspector')} />}
          {view === 'trade-lesson' && <TradeLessonView routeId={selectedTradeId} stageNumber={selectedTradeStage} skillIndex={selectedTradeSkillIndex} setView={setView} skillDone={tradeSkillDone} setSkillDone={setTradeSkillDone} masteryMap={masteryMap} setMasteryMap={setMasteryMap} />}
          {view === 'assessment' && <AssessmentView routeId={assessmentRouteId} stageNumber={assessmentStage} setView={setView} />}
          {view === 'mastery' && <MasteryView setView={setView} setSelectedTradeId={setSelectedTradeId} electricitySkillDone={completedSkills} electricityPracticeDone={stagePracticeDone.length + Number(practiceDone)} tradeSkillDone={tradeSkillDone} tradePracticeDone={tradePracticeDone} masteryMap={masteryMap} />}
          {view === 'portfolio' && <PortfolioView setView={setView} />}
          {view === 'inspector' && <InspectorView setView={setView} />}
          {view === 'tutor' && <TutorView setView={setView} />}
        </main>
      </div>
    </div>
  )
}

function Topbar({ menuOpen, setMenuOpen, setView, cloudUser, cloudStatus, onCloudClick }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void; setView: (v: View) => void; cloudUser: User | null; cloudStatus: CloudSyncState; onCloudClick: () => void }) {
  const cloudLabel = !supabaseConfigured
    ? 'Solo local'
    : cloudStatus === 'syncing'
      ? 'Sincronizando'
      : cloudUser
        ? cloudStatus === 'error' ? 'Revisar sync' : 'Sincronizado'
        : 'Sincronizar'
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <button className="brand" onClick={() => setView('home')}>
        <span className="brand-mark"><HardHat size={20} strokeWidth={2.4} /></span>
        <span><strong>Oficios</strong>Lab</span>
      </button>
      <div className="topbar-center">
        <span className="workshop-dot" /> Taller de aprendizaje activo
      </div>
      <button className={`cloud-status ${cloudStatus}`} onClick={onCloudClick} title="Sincronización entre dispositivos">
        {cloudUser ? <Cloud size={17}/> : <CloudOff size={17}/>}<span>{cloudLabel}</span>
      </button>
      <div className="profile-chip">
        <span className="profile-avatar">AR</span>
        <span className="profile-copy"><strong>Aprendiz</strong><small>{cloudUser?.email ? 'Cuenta conectada' : 'Nivel 1'}</small></span>
      </div>
    </header>
  )
}

function CloudSyncModal({ user, status, onClose, onSync }: { user: User | null; status: CloudSyncState; onClose: () => void; onSync: () => Promise<void> }) {
  const [email, setEmail] = useState(user?.email || '')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const requestCode = async () => {
    if (!email.trim()) return
    setBusy(true); setError(''); setMessage('')
    try {
      await sendEmailOtp(email.trim())
      setSent(true)
      setMessage('Código enviado. Revisa el mismo correo que usas en FluentLab.')
    } catch (err: any) {
      setError(err?.message || 'No se pudo enviar el código.')
    } finally { setBusy(false) }
  }

  const verify = async () => {
    if (code.trim().length !== 6) return
    setBusy(true); setError(''); setMessage('')
    try {
      await verifyEmailOtp(email.trim(), code.trim())
      setMessage('Cuenta conectada. Tu progreso local se sincronizará automáticamente.')
    } catch (err: any) {
      setError(err?.message || 'El código no pudo verificarse.')
    } finally { setBusy(false) }
  }

  const logout = async () => {
    setBusy(true); setError('')
    try { await signOutCloud(); onClose() }
    catch (err: any) { setError(err?.message || 'No se pudo cerrar sesión.') }
    finally { setBusy(false) }
  }

  return <div className="cloud-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="cloud-modal" role="dialog" aria-modal="true" aria-label="Sincronización de OficiosLab" onMouseDown={e => e.stopPropagation()}>
      <button className="cloud-modal-close" onClick={onClose} aria-label="Cerrar"><X size={18}/></button>
      <div className="cloud-modal-icon">{user ? <Cloud size={28}/> : <CloudOff size={28}/>}</div>
      <span className="eyebrow">PROGRESO ENTRE DISPOSITIVOS</span>
      <h2>{user ? 'Tu progreso está conectado.' : 'Conecta tu cuenta de FluentLab.'}</h2>
      {!supabaseConfigured ? <>
        <p>Faltan las variables de Supabase. Añade <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> a tu <code>.env</code> local y a Vercel.</p>
        <div className="cloud-local-note"><CloudOff size={18}/><span>Mientras tanto, OficiosLab seguirá guardando todo localmente.</span></div>
      </> : user ? <>
        <p>Sesión: <strong>{user.email || 'usuario autenticado'}</strong>. Los avances se guardan localmente y se reflejan en Supabase; las fotografías se conservan en un bucket privado.</p>
        <div className={`sync-state-card ${status}`}><span className="sync-dot"/><div><strong>{status === 'syncing' ? 'Sincronizando…' : status === 'error' ? 'Hubo un problema de sincronización' : 'Sincronización activa'}</strong><small>{status === 'error' ? 'Tu copia local sigue intacta. Puedes reintentar.' : 'Los cambios se envían automáticamente después de guardarlos.'}</small></div></div>
        <div className="cloud-modal-actions"><button className="primary-btn" disabled={busy || status === 'syncing'} onClick={onSync}><RefreshCw size={17}/> Sincronizar ahora</button><button className="secondary-btn" disabled={busy} onClick={logout}><LogOut size={17}/> Cerrar sesión</button></div>
      </> : <>
        <p>Usa el mismo correo de tu cuenta de FluentLab. OficiosLab reutiliza ese usuario y mantiene sus tablas totalmente separadas.</p>
        <label className="cloud-field"><span>Correo</span><div><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu-correo@ejemplo.com" autoComplete="email"/></div></label>
        {sent && <label className="cloud-field"><span>Código de 6 dígitos</span><input className="otp-input" inputMode="numeric" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" autoFocus/></label>}
        {message && <div className="cloud-message success">{message}</div>}
        {error && <div className="cloud-message error">{error}</div>}
        <div className="cloud-modal-actions">{sent ? <><button className="primary-btn" disabled={busy || code.length !== 6} onClick={verify}>{busy ? 'Verificando…' : 'Verificar y sincronizar'}</button><button className="secondary-btn" disabled={busy} onClick={requestCode}>Reenviar código</button></> : <button className="primary-btn" disabled={busy || !email.trim()} onClick={requestCode}>{busy ? 'Enviando…' : 'Enviar código'}</button>}</div>
        <small className="cloud-security-note">La clave pública de Supabase puede estar en el navegador; el acceso real está protegido por Auth + RLS. Tu clave de OpenAI nunca debe usar prefijo VITE_.</small>
      </>}
    </section>
  </div>
}

function Sidebar({ view, setView, progress, open, close, completedSkills }: { view: View; setView: (v: View) => void; progress: number; open: boolean; close: () => void; completedSkills: number }) {
  const go = (v: View) => { setView(v); close() }
  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={close} aria-label="Cerrar menú" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-group">
          <p className="sidebar-label">TALLER</p>
          <button className={view === 'home' || view === 'trade-route' || view === 'trade-stage' ? 'side-link active' : 'side-link'} onClick={() => go('home')}><Home size={18}/>Rutas</button>
          <button className={view === 'electricity' || view === 'stage' || view === 'stage-practice' || view === 'topic' || view === 'lesson' || view === 'ohm' || view === 'power' || view === 'polarity' || view === 'series' || view === 'diagrams' || view === 'practice' ? 'side-link active' : 'side-link'} onClick={() => go('electricity')}><Zap size={18}/>Mi ruta</button>
          <button className={view === 'library' ? 'side-link active secondary-active' : 'side-link'} onClick={() => go('library')}><BookOpen size={18}/>Biblioteca eléctrica <span className="mini-badge">{totalElectricSkills}</span></button>
          <button className={view === 'drill' ? 'side-link active' : 'side-link'} onClick={() => go('drill')}><ClipboardCheck size={18}/>Entrenador <span className="mini-badge">8</span></button>
          <button className={view === 'mastery' ? 'side-link active' : 'side-link'} onClick={() => go('mastery')}><BadgeCheck size={18}/>Centro de dominio</button>
          <button className="side-link muted"><Box size={18}/>Mi inventario</button>
        </div>
        <div className="sidebar-group">
          <p className="sidebar-label">HERRAMIENTAS</p>
          <button className={view === 'tutor' ? 'side-link active' : 'side-link'} onClick={() => go('tutor')}><Sparkles size={18}/>Maestro IA</button>
          <button className={view === 'inspector' ? 'side-link active' : 'side-link'} onClick={() => go('inspector')}><Camera size={18}/>Inspector IA</button>
          <button className={view === 'portfolio' ? 'side-link active' : 'side-link'} onClick={() => go('portfolio')}><ClipboardCheck size={18}/>Portafolio</button>
        </div>
        <div className="sidebar-progress">
          <div className="sidebar-progress-head"><span>Ruta Electricidad</span><strong>{progress}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <small>{completedSkills} de {totalElectricSkills} habilidades de la ruta</small>
        </div>
        <div className="safety-mini">
          <ShieldCheck size={18}/>
          <p><strong>Modo seguro</strong><br/><span>Prácticas iniciales ≤ 12 V</span></p>
        </div>
      </aside>
    </>
  )
}

function HomeView({ setView, progress, openTrade }: { setView: (v: View) => void; progress: number; openTrade: (id: string) => void }) {
  return (
    <div className="page-wrap">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><Construction size={16}/> ESCUELA PRÁCTICA DE OFICIOS</span>
          <h1>Aprende con las manos.<br/><em>Domina haciendo.</em></h1>
          <p>No vienes a ver horas de videos. Vienes a entender, practicar, comprobar y convertir cada habilidad en algo que realmente sabes hacer.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setView('electricity')}>Continuar Electricidad <ArrowRight size={18}/></button>
            <button className="ghost-btn" onClick={() => setView('lesson')}>Ver primera lección</button>
          </div>
          <div className="hero-proof">
            <span><CheckCircle2 size={16}/> Teoría esencial</span>
            <span><CheckCircle2 size={16}/> Prácticas físicas</span>
            <span><CheckCircle2 size={16}/> Proyectos reales</span>
          </div>
        </div>
        <div className="workbench-card">
          <div className="bench-topline"><span>PROYECTO ACTIVO</span><span className="live-pill">EN CURSO</span></div>
          <div className="bench-illustration">
            <div className="blueprint-lines" />
            <div className="meter"><Gauge size={48}/><span>0.00</span><small>V DC</small></div>
            <div className="wire wire-a"/><div className="wire wire-b"/>
            <div className="mini-led"><Lightbulb size={28}/></div>
          </div>
          <div className="bench-content">
            <div><span className="tiny-label">RUTA 01</span><h3>Electricidad desde cero</h3></div>
            <span className="percent-big">{progress}%</span>
          </div>
          <div className="progress-track large"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <p>Próxima habilidad: <strong>Voltaje, corriente y resistencia</strong></p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">RUTAS PROFESIONALES</span><h2>Elige qué quieres aprender</h2></div>
          <p>Una sola plataforma. Diferentes oficios. El progreso se mide por habilidades demostradas.</p>
        </div>
        <div className="route-grid">
          {routes.map((route) => {
            const Icon = route.icon
            const routeData = route.id === 'electricity' ? null : getTradeRoute(route.id)
            const metrics = routeData ? `${routeData.stages.reduce((sum, stage) => sum + stage.skills.length, 0)} competencias · ${routeData.stages.reduce((sum, stage) => sum + stage.practices.length, 0)} prácticas` : `${totalElectricSkills} competencias · ${stagePractices.length + 1} prácticas`
            return (
              <button className={`route-card tone-${route.tone} available`} key={route.name} onClick={() => openTrade(route.id)}>
                <div className="route-card-top"><span className="route-icon"><Icon size={25}/></span><span className="open-pill">ABIERTA</span></div>
                <h3>{route.name}</h3><p>{route.subtitle}</p>
                <small className="route-metrics">{metrics}</small>
                <div className="route-card-foot"><span>{route.status}</span><ChevronRight size={18}/></div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="platform-depth-strip">
        <div><span className="eyebrow">NUEVO ESTÁNDAR DE PROFUNDIDAD</span><h2>La plataforma ya no está pensada como colección de minicursos.</h2><p>Entre Electricidad y las otras siete rutas ya hay más de quinientas competencias, más de doscientas prácticas guiadas y proyectos de integración por etapa. La regla es la misma para todos los oficios: teoría → ejecución → diagnóstico → proyecto.</p></div>
        <div className="platform-depth-metrics"><span><strong>515</strong><small>competencias</small></span><span><strong>230+</strong><small>prácticas</small></span><span><strong>60</strong><small>proyectos</small></span><button onClick={() => setView('mastery')}>Ver centro de dominio <ArrowRight size={16}/></button></div>
      </section>

      <section className="mastery-strip">
        <div><span className="eyebrow light">MÉTODO OFICIOSLAB</span><h2>Aprendido no significa dominado.</h2></div>
        <div className="mastery-steps">
          <div><span>01</span><strong>Entiende</strong><small>Conceptos sin relleno</small></div>
          <ArrowRight size={20}/>
          <div><span>02</span><strong>Simula</strong><small>Prueba sin riesgo</small></div>
          <ArrowRight size={20}/>
          <div><span>03</span><strong>Construye</strong><small>Hazlo físicamente</small></div>
          <ArrowRight size={20}/>
          <div><span>04</span><strong>Comprueba</strong><small>Demuestra la habilidad</small></div>
        </div>
      </section>
    </div>
  )
}

function ElectricityView({ setView, setSelectedStage, progress, lessonDone, ohmDone, powerDone, polarityDone, seriesDone, diagramsDone, practiceDone, libraryDone, openAssessment, masteryMap, setMasteryMap }: { setView: (v: View) => void; setSelectedStage: (n: number) => void; progress: number; lessonDone: boolean; ohmDone: boolean; powerDone: boolean; polarityDone: boolean; seriesDone: boolean; diagramsDone: boolean; practiceDone: boolean; libraryDone: string[]; openAssessment: () => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const stageSkills = skills.map((skill) => {
    if (skill.id === 1) return { ...skill, status: 'done' }
    if (skill.id === 2) return { ...skill, status: lessonDone ? 'done' : 'active' }
    if (skill.id === 3) return { ...skill, status: ohmDone ? 'done' : lessonDone ? 'active' : 'locked' }
    if (skill.id === 4) return { ...skill, status: powerDone ? 'done' : ohmDone ? 'active' : 'locked' }
    if (skill.id === 5) return { ...skill, status: polarityDone ? 'done' : powerDone ? 'active' : 'locked' }
    if (skill.id === 6) return { ...skill, status: seriesDone ? 'done' : polarityDone ? 'active' : 'locked' }
    if (skill.id === 7) return { ...skill, status: diagramsDone ? 'done' : seriesDone ? 'active' : 'locked' }
    if (skill.id === 8) return { ...skill, status: practiceDone ? 'done' : (seriesDone || diagramsDone) ? 'active' : 'locked' }
    return skill
  })

  const openSkill = (id: number) => {
    if (id === 2) setView('lesson')
    if (id === 3 && (lessonDone || ohmDone)) setView('ohm')
    if (id === 4 && (ohmDone || powerDone)) setView('power')
    if (id === 5 && (powerDone || polarityDone)) setView('polarity')
    if (id === 6 && (polarityDone || seriesDone)) setView('series')
    if (id === 7 && (seriesDone || diagramsDone)) setView('diagrams')
    if (id === 8 && (seriesDone || diagramsDone || practiceDone)) setView('practice')
  }

  const nextView: View = !lessonDone ? 'lesson' : !ohmDone ? 'ohm' : !powerDone ? 'power' : !polarityDone ? 'polarity' : !seriesDone ? 'series' : !diagramsDone ? 'diagrams' : 'practice'
  const nextLabel = !lessonDone ? 'Voltaje, corriente y resistencia' : !ohmDone ? 'Ley de Ohm' : !powerDone ? 'Potencia y energía' : !polarityDone ? 'CC, fuentes y polaridad' : !seriesDone ? 'Serie y paralelo' : !diagramsDone ? 'Lectura de diagramas' : practiceDone ? 'Repasar práctica final' : 'Práctica final de etapa'
  const stageOneProjectKey = 'electricity-stage-1-project'
  const stageOneIntegrated = (masteryMap[stageOneProjectKey] || 0) >= 5

  return (
    <div className="page-wrap compact route-page-refined">
      <button className="back-link" onClick={() => setView('home')}><ArrowLeft size={17}/> Todas las rutas</button>
      <nav className="stage-switcher route-stage-switcher" aria-label="Cambiar etapa">
        {stageGuides.map(item => {
          const n = Number(item.number)
          return <button key={item.number} className={n === 1 ? 'active' : ''} onClick={() => { if (n === 1) { window.scrollTo({ top: 0, behavior: 'smooth' }) } else { setSelectedStage(n); setView('stage'); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}><span>{item.number}</span><small>{item.title}</small></button>
        })}
      </nav>
      <section className="route-hero refined-route-hero">
        <div className="route-hero-icon"><Zap size={32}/></div>
        <div className="route-hero-copy"><span className="eyebrow">RUTA PROFESIONAL 01</span><h1>Electricidad</h1><p>Fundamentos, medición, diseño, instalación, diagnóstico y trabajo profesional.</p></div>
        <div className="route-stats"><div><strong>{progress}%</strong><span>Progreso</span></div><div><strong>{totalElectricSkills}</strong><span>Habilidades</span></div><div><strong>9</strong><span>Etapas</span></div></div>
      </section>

      <section className="block-three-banner">
        <div className="block-three-kicker"><span className="block-three-number">06</span><div><span className="eyebrow light">BLOQUE 6 · PLATAFORMA DE DOMINIO</span><h2>Estudia, practica, demuestra, documenta y corrige.</h2></div></div>
        <p>OficiosLab ya conecta lecciones profundas, niveles de dominio, evaluaciones sin receta, prácticas repetibles, Inspector IA, Maestro IA y un portafolio real de evidencias.</p>
        <div className="block-three-actions"><button className="primary-btn amber-btn" onClick={() => setView(nextView)}>{nextLabel} <ArrowRight size={17}/></button><button className="quiet-btn" onClick={() => setView('library')}>Ver las 101 competencias</button><button className="quiet-btn" onClick={() => setView('drill')}>Repasar cálculos</button></div>
      </section>

      <div className="route-summary-strip">
        <div><HardHat size={20}/><span><strong>Objetivo</strong> Competencia progresiva, no memorizar pasos.</span></div>
        <span className="summary-chip">101 competencias</span><span className="summary-chip">50+ prácticas</span><span className="summary-chip">9 proyectos de etapa</span>
      </div>

      <div className="electricity-layout refined-electricity-layout">
        <section className="skill-panel refined-skill-panel">
          <div className="panel-heading"><div><span className="eyebrow">ETAPA 1 · FUNDAMENTOS</span><h2>Entender antes de conectar</h2></div><span className="difficulty-pill">INICIACIÓN</span></div>
          <p className="panel-intro">Ocho habilidades encadenadas. Las primeras cuatro explican y calculan; el Bloque 3 añade comportamiento de circuitos, lectura técnica y la práctica de cierre.</p>
          <div className="skill-list">
            {stageSkills.map((skill, index) => (
              <div className={`skill-row ${skill.status}`} key={skill.id}>
                <div className="skill-rail"><span className="skill-node">{skill.status === 'done' ? <Check size={16}/> : skill.status === 'locked' ? <LockKeyhole size={14}/> : index + 1}</span>{index < stageSkills.length - 1 && <span className="skill-line"/>}</div>
                <div className="skill-card-inner refined-skill-card">
                  <div><span className="skill-kind">{kindLabel(skill.type)}</span><h3>{skill.title}</h3></div>
                  {skill.status === 'active' ? <button className="small-primary" onClick={() => openSkill(skill.id)}>Abrir <ChevronRight size={17}/></button> : skill.status === 'done' && skill.id >= 2 ? <button className="review-btn" onClick={() => openSkill(skill.id)}><CheckCircle2 size={16}/> Repasar</button> : skill.status === 'done' ? <span className="done-label"><CheckCircle2 size={16}/> Lista</span> : <span className="locked-label">Bloqueada</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="route-aside refined-route-aside">
          <div className="aside-card safety-card compact-aside"><ShieldCheck size={23}/><div><span className="eyebrow">PROTOCOLO</span><h3>Baja tensión primero</h3><p>Pilas y fuentes ≤ 12 V durante esta etapa. La red doméstica queda fuera de estas prácticas iniciales.</p></div></div>
          <div className="aside-card compact-aside"><span className="eyebrow">BLOQUE 3</span><h3>Tres ideas nuevas</h3><div className="micro-list"><span><strong>01</strong> Polaridad y fuentes DC</span><span><strong>02</strong> Serie vs. paralelo</span><span><strong>03</strong> Diagramas y símbolos</span></div></div>
          <div className="aside-card standards-card compact-aside"><span className="eyebrow">META</span><h3>Explicar el recorrido</h3><p>Debes poder mirar un esquema sencillo, describir por dónde circula la corriente y detectar una conexión incoherente antes de montar.</p></div>
        </aside>
      </div>

      <section className="stage-exam-strip stage-one-exam"><div><span className="eyebrow">CIERRE DE ETAPA 1</span><h3>¿Puedes resolver sin seguir la receta?</h3><p>Haz la evaluación abierta y, cuando puedas construir y explicar el circuito sin mirar pasos, registra la integración.</p></div><div className="stage-one-actions"><button onClick={openAssessment}>Evaluación <ArrowRight size={17}/></button><button className={stageOneIntegrated ? 'integrated' : ''} onClick={() => setMasteryMap({ ...masteryMap, [stageOneProjectKey]: stageOneIntegrated ? 0 : 5 })}>{stageOneIntegrated ? 'Integración registrada ✓' : 'Registrar integración'}</button></div></section>

      <section className="full-roadmap-section refined-roadmap-section">
        <div className="section-heading roadmap-heading"><div><span className="eyebrow">MAPA COMPLETO</span><h2>Las nueve etapas ya están abiertas.</h2></div><p>Las 9 etapas ya tienen material de estudio y práctica. La Etapa 9 es un Proyecto Maestro residencial que obliga a integrar diseño, presupuesto, montaje didáctico, pruebas y defensa técnica.</p></div>
        <div className="roadmap-grid compact-roadmap-grid">
          {electricityRoadmap.map((stage, index) => (
            <article className={`roadmap-card compact-roadmap-card ${index === 0 ? 'active' : 'available'}`} key={stage.number}>
              <div className="roadmap-card-head"><span className="roadmap-number">{stage.number}</span><span className="roadmap-level">{stage.level}</span>{index > 0 && <BookOpen size={15}/>}</div>
              <h3>{stage.title}</h3>
              <p className="roadmap-count">{stage.skills.length} habilidades · {stage.practice}{index > 0 && <><br/><strong>{electricityTopics.filter(t => t.stage === index + 1 && libraryDone.includes(t.id)).length}/{electricityTopics.filter(t => t.stage === index + 1).length} estudiadas</strong></>}</p>
              <div className="roadmap-skill-preview">{stage.skills.slice(0, 4).map(item => <span key={item}><Circle size={7}/>{item}</span>)}{stage.skills.length > 4 && <span className="more-skills">+{stage.skills.length - 4} más</span>}</div>
              <div className="roadmap-project"><Hammer size={15}/><span><small>PROYECTO</small><strong>{stage.project}</strong></span></div>
              <button className="small-primary roadmap-open" onClick={() => { if (index === 0) { setView(nextView) } else { setSelectedStage(index + 1); setView('stage'); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}>{index === 0 ? 'Seguir estudiando' : 'Entrar a la etapa'} <ChevronRight size={17}/></button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}


function ElectricityStageView({ setView, stageNumber, setSelectedStage, setSelectedTopicId, setSelectedStagePracticeId, done, practiceDone, openAssessment, masteryMap, setMasteryMap }: { setView: (v: View) => void; stageNumber: number; setSelectedStage: (n: number) => void; setSelectedTopicId: (id: string) => void; setSelectedStagePracticeId: (id: string) => void; done: string[]; practiceDone: string[]; openAssessment: () => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const safeStage = Math.max(2, Math.min(9, stageNumber))
  const guide = stageGuides[safeStage - 1]
  const roadmap = electricityRoadmap[safeStage - 1]
  const topics = electricityTopics.filter(topic => topic.stage === safeStage)
  const practices = stagePractices.filter(practice => practice.stage === safeStage)
  const completed = topics.filter(topic => done.includes(topic.id)).length
  const completedPractices = practices.filter(practice => practiceDone.includes(practice.id)).length
  const percent = topics.length ? Math.round((completed / topics.length) * 100) : 0
  const nextTopic = topics.find(topic => !done.includes(topic.id)) || topics[0]
  const projectKey = `electricity-stage-${safeStage}-project`
  const projectIntegrated = (masteryMap[projectKey] || 0) >= 5

  const openTopic = (topic: ElectricityTopic) => {
    setSelectedStage(topic.stage)
    setSelectedTopicId(topic.id)
    setView('topic')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openPractice = (practice: StagePractice) => {
    setSelectedStage(practice.stage)
    setSelectedStagePracticeId(practice.id)
    setView('stage-practice')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openStage = (n: number) => {
    setSelectedStage(n)
    setView(n === 1 ? 'electricity' : 'stage')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const supervisedCount = topics.filter(topic => topic.safety === 'supervised').length
  const safeCount = topics.filter(topic => topic.safety === 'safe').length

  return (
    <div className="page-wrap compact stage-route-page">
      <button className="back-link" onClick={() => setView('electricity')}><ArrowLeft size={17}/> Mapa de Electricidad</button>

      <nav className="stage-switcher" aria-label="Cambiar etapa">
        {stageGuides.map(item => {
          const n = Number(item.number)
          return <button key={item.number} className={n === safeStage ? 'active' : ''} onClick={() => openStage(n)}><span>{item.number}</span><small>{item.title}</small></button>
        })}
      </nav>

      <section className="stage-route-hero">
        <div className="stage-route-number">{guide.number}</div>
        <div className="stage-route-copy">
          <span className="eyebrow">ETAPA {guide.number} · {guide.level.toUpperCase()}</span>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <div className="stage-route-meta"><span><BookOpen size={16}/>{topics.length} habilidades</span><span><Hammer size={16}/>{practices.length} prácticas de etapa</span><span><ShieldCheck size={16}/>{supervisedCount ? `${supervisedCount} temas supervisados` : `${safeCount} prácticas seguras`}</span></div>
        </div>
        <div className="stage-route-progress">
          <strong>{percent}%</strong><span>{completed} de {topics.length} estudiadas · {completedPractices}/{practices.length} prácticas</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }}/></div>
          {nextTopic && <button className="primary-btn" onClick={() => openTopic(nextTopic)}>{completed === topics.length ? 'Repasar etapa' : 'Continuar etapa'} <ArrowRight size={17}/></button>}
        </div>
      </section>

      <div className="stage-learning-layout">
        <section className="stage-skill-panel">
          <div className="panel-heading"><div><span className="eyebrow">RUTA DE HABILIDADES</span><h2>Avanza tema por tema</h2></div><span className="difficulty-pill">{guide.level.toUpperCase()}</span></div>
          <p className="panel-intro">Esta etapa funciona como una ruta propia. Puedes abrir cualquier habilidad, pero el orden está pensado para que cada tema prepare el siguiente.</p>
          <div className="stage-topic-list">
            {topics.map((topic, index) => {
              const isDone = done.includes(topic.id)
              const isNext = !isDone && topic.id === nextTopic?.id
              return (
                <div className={`stage-topic-row ${isDone ? 'done' : isNext ? 'next' : 'available'}`} key={topic.id}>
                  <div className="stage-topic-rail"><span>{isDone ? <Check size={16}/> : String(index + 1).padStart(2, '0')}</span>{index < topics.length - 1 && <i/>}</div>
                  <button className="stage-topic-card" onClick={() => openTopic(topic)}>
                    <div><span className="skill-kind">{topic.category.toUpperCase()}</span><h3>{topic.title}</h3><p>{topic.summary}</p></div>
                    <div className="stage-topic-action"><span className={`safety-tag ${topic.safety}`}>{safetyLabel(topic.safety)}</span>{isDone ? <span className="review-btn"><CheckCircle2 size={15}/> Repasar</span> : <span className="small-primary">Abrir <ChevronRight size={16}/></span>}</div>
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="stage-route-aside">
          <div className="aside-card stage-project-card"><span className="eyebrow">PROYECTO DE ETAPA</span><Hammer size={28}/><h3>{guide.project}</h3><p>El proyecto integra varias habilidades de esta etapa. En las prácticas con riesgo eléctrico, la plataforma sustituye intervención energizada por simulación, banco didáctico o supervisión competente.</p></div>
          <div className="aside-card"><span className="eyebrow">CÓMO USAR ESTA ETAPA</span><h3>Estudia → practica → comprueba</h3><div className="micro-list"><span><strong>01</strong> Lee la teoría y el ejemplo.</span><span><strong>02</strong> Haz las prácticas de abajo.</span><span><strong>03</strong> Marca el tema solo si puedes explicarlo.</span></div></div>
          <div className="aside-card standards-card"><span className="eyebrow">NAVEGACIÓN</span><h3>No necesitas volver a la biblioteca</h3><p>Usa los números superiores para cambiar directamente entre las nueve etapas. La Biblioteca queda como buscador y manual de consulta.</p></div>
        </aside>
      </div>

      <section className="stage-practices-block">
        <div className="stage-practices-heading">
          <div><span className="eyebrow">PRÁCTICAS DE LA ETAPA {guide.number}</span><h2>Ahora llévalo a la práctica</h2><p>No son solo sugerencias dentro de la teoría: cada tarjeta abre una práctica completa con materiales, pasos, evidencia y límites de seguridad.</p></div>
          <div className="practice-counter"><strong>{completedPractices}/{practices.length}</strong><span>completadas</span></div>
        </div>
        <div className="stage-practice-grid">
          {practices.map((practice, index) => {
            const isDone = practiceDone.includes(practice.id)
            return <button className={`stage-practice-card ${isDone ? 'done' : ''}`} key={practice.id} onClick={() => openPractice(practice)}>
              <div className="stage-practice-card-top"><span className="practice-index">{String(index + 1).padStart(2, '0')}</span><span className={`safety-tag ${practice.safety}`}>{safetyLabel(practice.safety)}</span></div>
              <h3>{practice.title}</h3><p>{practice.subtitle}</p>
              <div className="practice-card-foot"><span>{isDone ? <><CheckCircle2 size={15}/> Completada</> : <><Hammer size={15}/> Abrir práctica</>}</span><ChevronRight size={17}/></div>
            </button>
          })}
        </div>
        <div className={`stage-capstone-strip ${projectIntegrated ? 'integrated' : ''}`}><div><span className="eyebrow">PROYECTO DE CIERRE</span><h3>{guide.project}</h3><p>Cuando termines las prácticas, usa el proyecto como evidencia de integración de la etapa.</p><button className="capstone-light-btn" onClick={() => setMasteryMap({ ...masteryMap, [projectKey]: projectIntegrated ? 0 : 5 })}>{projectIntegrated ? <><CheckCircle2 size={16}/> Integración registrada</> : <><BadgeCheck size={16}/> Registrar integración</>}</button></div><Hammer size={34}/></div>
        <div className="stage-exam-strip"><div><span className="eyebrow">EVALUACIÓN SIN RECETA</span><h3>Resuelve un caso de la etapa sin que te demos los pasos.</h3><p>La evaluación mide planeación, cálculo, diagnóstico, evidencia y límites de seguridad.</p></div><button onClick={openAssessment}>Iniciar evaluación <ArrowRight size={17}/></button></div>
      </section>

      <div className="stage-bottom-nav">
        <button onClick={() => openStage(safeStage - 1)}><ArrowLeft size={17}/><span><small>ETAPA ANTERIOR</small>{stageGuides[safeStage - 2]?.title}</span></button>
        {safeStage < 9 ? <button onClick={() => openStage(safeStage + 1)}><span><small>SIGUIENTE ETAPA</small>{stageGuides[safeStage]?.title}</span><ArrowRight size={17}/></button> : <button onClick={() => setView('library')}><span><small>CONSULTA</small>Biblioteca completa</span><BookOpen size={17}/></button>}
      </div>
    </div>
  )
}

function StagePracticeView({ setView, practiceId, setSelectedStage, done, setDone, masteryMap, setMasteryMap }: { setView: (v: View) => void; practiceId: string; setSelectedStage: (n: number) => void; done: string[]; setDone: (v: string[]) => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const practice = stagePractices.find(item => item.id === practiceId) || stagePractices[0]
  const [checkedSteps, setCheckedSteps] = useState<number[]>([])
  const finished = done.includes(practice.id)
  const allSteps = checkedSteps.length === practice.steps.length
  const guide = stageGuides[practice.stage - 1]
  const safety = safetyCopy(practice.safety)
  const masteryKey = `electricity-practice-${practice.id}`
  const practiceLevel = masteryMap[masteryKey] || (finished ? 2 : 0)

  useEffect(() => { setCheckedSteps([]) }, [practiceId])

  const back = () => {
    setSelectedStage(practice.stage)
    setView('stage')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleStep = (index: number) => setCheckedSteps(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])
  const toggleDone = () => {
    const next = !finished
    setDone(next ? [...done, practice.id] : done.filter(id => id !== practice.id))
    setMasteryMap({ ...masteryMap, [masteryKey]: next ? Math.max(2, practiceLevel) as MasteryLevel : 0 })
  }

  return <div className="page-wrap compact stage-practice-page">
    <button className="back-link" onClick={back}><ArrowLeft size={17}/> Etapa {guide.number} · {guide.title}</button>
    <section className="stage-practice-hero">
      <div><span className="eyebrow">PRÁCTICA · ETAPA {guide.number}</span><h1>{practice.title}</h1><p>{practice.subtitle}</p></div>
      <div className={`practice-safety-box ${practice.safety}`}><ShieldCheck size={22}/><div><small>{safety.title}</small><strong>{safetyLabel(practice.safety)}</strong></div></div>
    </section>

    <div className="stage-practice-detail-grid">
      <article className="stage-practice-detail-main">
        <section className="practice-objective"><span className="eyebrow">OBJETIVO</span><h2>Qué vas a demostrar</h2><p>{practice.objective}</p></section>
        <section className={`practice-rule ${practice.safety}`}><ShieldCheck size={24}/><div><strong>{safety.title}</strong><p>{safety.text}</p><small>{practice.note}</small></div></section>
        <section className="practice-step-section"><span className="eyebrow">PROCEDIMIENTO</span><h2>Hazlo paso a paso</h2><p>Marca cada paso conforme lo completes. Si un paso no coincide con tu material, detente y revisa antes de improvisar.</p>
          <div className="practice-step-list">{practice.steps.map((step, index) => <button key={index} className={checkedSteps.includes(index) ? 'checked' : ''} onClick={() => toggleStep(index)}><span>{checkedSteps.includes(index) ? <Check size={17}/> : String(index + 1).padStart(2, '0')}</span><p>{step}</p></button>)}</div>
        </section>
        <section className="practice-evidence"><span className="eyebrow">COMPROBACIÓN</span><h2>¿Qué debe quedar claro?</h2><div>{practice.evidence.map(item => <p key={item}><CheckCircle2 size={17}/>{item}</p>)}</div></section>
        <div className="practice-completion-bar"><div><strong>{allSteps ? 'Procedimiento revisado' : `${checkedSteps.length}/${practice.steps.length} pasos marcados`}</strong><span>{finished ? 'Esta práctica ya cuenta como completada.' : 'Completa el procedimiento y registra tu avance.'}</span></div><button className={`complete-btn ${finished ? 'completed' : ''}`} disabled={!allSteps && !finished} onClick={toggleDone}>{finished ? <><CheckCircle2 size={18}/> Completada</> : <><Check size={18}/> Registrar práctica</>}</button></div>
        <section className="electric-practice-mastery"><span className="eyebrow">NIVEL DE TRANSFERENCIA</span><h3>No te quedes en “la hice una vez”</h3><div>{[2,3,4].map(level => <button key={level} className={practiceLevel >= level ? 'active' : ''} onClick={() => setMasteryMap({ ...masteryMap, [masteryKey]: level as MasteryLevel })}>{masteryLabels[level]}</button>)}</div><button className="evidence-btn" onClick={() => setView('inspector')}><Camera size={17}/> Guardar evidencia / revisar foto</button></section>
      </article>

      <aside className="stage-practice-detail-aside">
        <div className="aside-card"><span className="eyebrow">MATERIALES</span><h3>Qué necesitas</h3><ul className="practice-materials">{practice.materials.map(item => <li key={item}><Box size={15}/>{item}</li>)}</ul></div>
        <div className="aside-card"><span className="eyebrow">RUTA</span><h3>{guide.title}</h3><p>Esta práctica complementa las lecciones de la etapa. Puedes volver a estudiar cualquier habilidad si algo todavía no tiene sentido.</p><button className="text-btn" onClick={back}>Volver a la etapa <ArrowRight size={16}/></button></div>
        <div className="aside-card danger-outline"><span className="eyebrow">LÍMITE</span><h3>No improvises tensión de red</h3><p>Si la práctica menciona simulación, baja tensión, banco aislado o supervisión, conserva exactamente ese límite. No sustituyas la fuente por una toma doméstica.</p></div>
      </aside>
    </div>
  </div>
}

function LessonView({ setView, lessonDone, setLessonDone }: { setView: (v: View) => void; lessonDone: boolean; setLessonDone: (v: boolean) => void }) {
  const [voltage, setVoltage] = useState(5)
  const [resistance, setResistance] = useState(330)
  const [switchOn, setSwitchOn] = useState(false)
  const [quiz, setQuiz] = useState<Record<number, number>>({})
  const ledDrop = 2
  const currentNumber = voltage > ledDrop ? ((voltage - ledDrop) / resistance) * 1000 : 0
  const current = currentNumber.toFixed(1)
  const resistorPower = (((currentNumber / 1000) ** 2) * resistance).toFixed(3)
  const quizItems = [
    { q: 'Si el interruptor está abierto, ¿qué ocurre con la corriente del circuito?', options: ['Aumenta', 'Se hace cero', 'Se convierte en voltaje'], correct: 1, why: 'Sin un camino cerrado no hay circulación continua de carga.' },
    { q: 'Con el mismo voltaje, si duplicas la resistencia, la corriente…', options: ['Aumenta al doble', 'No cambia', 'Disminuye aproximadamente a la mitad'], correct: 2, why: 'Por I = V/R, aumentar R reduce la corriente cuando V permanece igual.' },
    { q: '¿Puede existir voltaje aunque no esté circulando corriente?', options: ['Sí', 'No', 'Solo en un LED'], correct: 0, why: 'Una fuente puede mantener diferencia de potencial aun con el circuito abierto.' },
  ]
  const answered = Object.keys(quiz).length
  const score = quizItems.reduce((sum, item, i) => sum + (quiz[i] === item.correct ? 1 : 0), 0)

  return (
    <div className="lesson-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('electricity')}><ArrowLeft size={16}/> Ruta Electricidad</button><span>Etapa 1 · Lección 2 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '25%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><BookOpen size={15}/> FUNDAMENTOS</span>
          <h1>Voltaje, corriente y resistencia</h1>
          <p className="lesson-lead">Estas tres magnitudes aparecen una y otra vez en electricidad. La meta no es memorizar V, I y R: es poder mirar un circuito y explicar qué está empujando, qué está circulando y qué está limitando ese flujo.</p>

          <div className="lesson-objectives">
            <span className="eyebrow">AL TERMINAR PODRÁS</span>
            <div><p><CheckCircle2 size={16}/>Diferenciar voltaje, corriente y resistencia.</p><p><CheckCircle2 size={16}/>Reconocer sus unidades: V, A/mA y Ω/kΩ.</p><p><CheckCircle2 size={16}/>Predecir qué cambia al modificar V o R.</p><p><CheckCircle2 size={16}/>Resolver ejemplos sencillos con Ley de Ohm.</p></div>
          </div>

          <section className="lesson-section">
            <span className="section-kicker">ANTES DE LAS FÓRMULAS</span>
            <h2>¿Qué necesita un circuito para funcionar?</h2>
            <p>Un circuito eléctrico útil necesita, como mínimo, <strong>una fuente</strong>, <strong>un camino conductor</strong>, <strong>una carga</strong> y <strong>un recorrido cerrado</strong>. La fuente establece una diferencia de potencial; cuando cierras el camino, esa diferencia puede producir corriente a través de la carga.</p>
            <div className="four-parts-grid">
              <div><Battery size={22}/><strong>Fuente</strong><span>Pila, batería o fuente DC.</span></div>
              <div><PlugZap size={22}/><strong>Conductores</strong><span>Crean el camino eléctrico.</span></div>
              <div><Lightbulb size={22}/><strong>Carga</strong><span>Convierte energía en luz, calor o movimiento.</span></div>
              <div><Circle size={22}/><strong>Camino cerrado</strong><span>Permite que exista corriente sostenida.</span></div>
            </div>
            <div className="key-point"><BadgeCheck size={21}/><div><strong>Idea que evita muchos errores</strong><p>El voltaje puede existir sin corriente. Una pila desconectada todavía tiene voltaje entre sus terminales; como el circuito está abierto, la corriente es prácticamente cero.</p></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">LAS TRES MAGNITUDES</span>
            <h2>Ahora sí: V, I y R</h2>
            <Concept icon={<Battery/>} number="01" title="Voltaje (V)" analogy="Diferencia de potencial" text="El voltaje describe cuánta diferencia de potencial existe entre dos puntos. Es una condición entre puntos, por eso siempre se mide comparando un punto con otro. Una pila AA aporta alrededor de 1.5 V; un puerto USB típico usa 5 V como referencia de alimentación." />
            <Concept icon={<Activity/>} number="02" title="Corriente (I)" analogy="Flujo de carga" text="La corriente indica cuánta carga atraviesa una sección del circuito por unidad de tiempo. Se expresa en amperes (A). En electrónica pequeña es muy común trabajar en miliamperes: 10 mA = 0.010 A. La corriente no 'se queda' dentro de un componente: circula por el camino cerrado." />
            <Concept icon={<Gauge/>} number="03" title="Resistencia (R)" analogy="Oposición eléctrica" text="La resistencia relaciona el voltaje aplicado con la corriente que resulta. Se expresa en ohms (Ω). Valores grandes, como 1 kΩ = 1000 Ω, limitan más corriente que valores pequeños si el voltaje permanece igual." />

            <div className="unit-table">
              <div className="unit-head"><span>Magnitud</span><span>Símbolo</span><span>Unidad</span><span>Ejemplo</span></div>
              <div><strong>Voltaje</strong><span>V</span><span>volt (V)</span><span>5 V USB</span></div>
              <div><strong>Corriente</strong><span>I</span><span>ampere (A)</span><span>15 mA</span></div>
              <div><strong>Resistencia</strong><span>R</span><span>ohm (Ω)</span><span>330 Ω</span></div>
            </div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">EJEMPLOS DEL MUNDO REAL</span>
            <h2>Cómo reconocerlos fuera de una fórmula</h2>
            <div className="real-example-grid">
              <div className="real-example"><Battery size={22}/><span className="tiny-label">PILA AA</span><h3>1.5 V</h3><p>La etiqueta te habla de la diferencia de potencial de la fuente, no de una corriente fija que siempre vaya a entregar.</p></div>
              <div className="real-example"><PlugZap size={22}/><span className="tiny-label">CARGADOR USB</span><h3>5 V</h3><p>Una fuente regula un voltaje. El circuito conectado determina cuánta corriente demanda dentro de los límites de la fuente.</p></div>
              <div className="real-example"><Lightbulb size={22}/><span className="tiny-label">LED + RESISTENCIA</span><h3>Corriente limitada</h3><p>La resistencia se elige para que la corriente quede en un rango adecuado para el LED.</p></div>
            </div>
            <div className="context-note"><ShieldCheck size={19}/><p>En instalaciones de vivienda aparecen tensiones de red mucho mayores que las usadas aquí. En esta etapa solo las mencionaremos como contexto; todas las prácticas físicas permanecen en baja tensión.</p></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">RELACIÓN ENTRE ELLAS</span>
            <h2>Ley de Ohm: una relación, no un truco</h2>
            <div className="rule-card"><div className="rule-mark">V</div><div><span className="eyebrow">IDEA CLAVE</span><h3>V = I × R</h3><p>También puedes despejar <strong>I = V ÷ R</strong> y <strong>R = V ÷ I</strong>. Si el voltaje se mantiene y aumentas la resistencia, la corriente disminuye. Si la resistencia se mantiene y aumentas el voltaje, la corriente aumenta.</p></div></div>

            <div className="worked-grid">
              <WorkedExample number="01" title="Resistencia de 1 kΩ con 5 V" steps={['Convierte 1 kΩ a 1000 Ω.', 'Usa I = V ÷ R.', 'I = 5 ÷ 1000 = 0.005 A.', '0.005 A = 5 mA.']} result="Resultado: 5 mA" />
              <WorkedExample number="02" title="LED con fuente de 5 V" steps={['Supón una caída aproximada del LED de 2 V.', 'La resistencia recibe 5 V − 2 V = 3 V.', 'Con 330 Ω: I = 3 ÷ 330.', 'I ≈ 0.0091 A = 9.1 mA.']} result="Resultado aproximado: 9.1 mA" />
            </div>
            <p className="lesson-footnote">En componentes reales los valores no siempre son ideales. La caída de tensión de un LED, tolerancias y temperatura cambian el resultado. Por eso calculamos primero y después medimos.</p>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">PREFIJOS QUE VERÁS TODO EL TIEMPO</span>
            <h2>mA, kΩ y por qué importan</h2>
            <div className="prefix-grid"><div><strong>mili (m)</strong><span>÷ 1000</span><p>1000 mA = 1 A</p></div><div><strong>kilo (k)</strong><span>× 1000</span><p>1 kΩ = 1000 Ω</p></div><div><strong>mega (M)</strong><span>× 1 000 000</span><p>1 MΩ = 1 000 000 Ω</p></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">ERRORES COMUNES</span>
            <h2>Tres ideas que quiero que evites desde ahora</h2>
            <div className="myth-grid">
              <div><strong>“La fuente empuja siempre la misma corriente.”</strong><p>No. Una fuente establece condiciones de voltaje; la carga y el circuito influyen en la corriente resultante.</p></div>
              <div><strong>“Si hay voltaje, necesariamente hay corriente.”</strong><p>No. Con un circuito abierto puede existir voltaje y no existir una corriente sostenida.</p></div>
              <div><strong>“Más resistencia significa más corriente.”</strong><p>Con el mismo voltaje ocurre lo contrario: una resistencia mayor produce menos corriente.</p></div>
            </div>
          </section>

          <section className="lesson-section quiz-section">
            <span className="section-kicker">COMPRUEBA QUE LO ENTENDISTE</span>
            <h2>Mini evaluación</h2>
            <p>No cuenta por memoria: después de responder te explicamos el porqué.</p>
            {quizItems.map((item, qi) => (
              <div className="quiz-card" key={item.q}>
                <strong>{qi + 1}. {item.q}</strong>
                <div className="quiz-options">{item.options.map((option, oi) => <button key={option} className={quiz[qi] === oi ? 'selected' : ''} onClick={() => setQuiz({...quiz, [qi]: oi})}>{option}</button>)}</div>
                {quiz[qi] !== undefined && <div className={`quiz-feedback ${quiz[qi] === item.correct ? 'correct' : 'wrong'}`}>{quiz[qi] === item.correct ? 'Correcto. ' : 'Todavía no. '}{item.why}</div>}
              </div>
            ))}
            {answered === quizItems.length && <div className="quiz-score"><BadgeCheck size={22}/><span><strong>{score}/3 correctas</strong><small>{score === 3 ? 'Ya puedes pasar al laboratorio y la práctica.' : 'Revisa las explicaciones y vuelve a intentarlo cuando quieras.'}</small></span></div>}
          </section>

          <div className="lesson-actions"><button className={`complete-btn ${lessonDone ? 'completed' : ''}`} onClick={() => setLessonDone(!lessonDone)}>{lessonDone ? <><CheckCircle2 size={20}/> Lección completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" onClick={() => { setLessonDone(true); setView('ohm') }}>Siguiente: Ley de Ohm <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab">
          <div className="lab-panel-head"><div><span className="eyebrow">MINI LABORATORIO</span><h3>Experimenta, no memorices</h3></div><Calculator size={22}/></div>
          <div className="circuit-board">
            <div className={`battery-graphic ${switchOn ? 'active' : ''}`}><span>+</span><Battery size={38}/><span>−</span></div>
            <div className="circuit-path top"/><div className="circuit-path bottom"/>
            <button className={`switch ${switchOn ? 'on' : ''}`} onClick={() => setSwitchOn(!switchOn)}><span/><small>{switchOn ? 'ON' : 'OFF'}</small></button>
            <div className={`led-graphic ${switchOn && currentNumber > 0 ? 'lit' : ''}`}><Lightbulb size={34}/></div>
            <div className="resistor-graphic">{resistance} Ω</div>
          </div>
          <p className="lab-hint">Este modelo incluye una caída aproximada de 2 V en el LED para que el cálculo se parezca más al circuito que armarás físicamente.</p>
          <label className="range-label"><span>Fuente</span><strong>{voltage} V</strong></label>
          <input type="range" min="2" max="12" value={voltage} onChange={(e: any) => setVoltage(Number(e.target.value))}/>
          <label className="range-label"><span>Resistencia</span><strong>{resistance} Ω</strong></label>
          <input type="range" min="100" max="1000" step="10" value={resistance} onChange={(e: any) => setResistance(Number(e.target.value))}/>
          <div className="result-box"><span>Corriente estimada</span><strong>{switchOn ? current : '0.0'} <small>mA</small></strong><p>I ≈ (Vfuente − 2 V) ÷ R</p></div>
          <div className="lab-metrics"><div><span>Caída LED</span><strong>≈ 2.0 V</strong></div><div><span>Potencia R</span><strong>{switchOn ? resistorPower : '0.000'} W</strong></div></div>
          <div className={`lab-warning ${currentNumber > 20 && switchOn ? 'danger' : ''}`}><Flame size={18}/><span>{currentNumber > 20 && switchOn ? 'Este ajuste supera 20 mA en el modelo. Reduce el voltaje o aumenta la resistencia antes de trasladar la idea a una práctica.' : 'Prueba esto: duplica la resistencia y observa qué sucede con la corriente.'}</span></div>
          <div className="lab-challenges"><span className="eyebrow">RETOS RÁPIDOS</span><p>1. Busca un ajuste cercano a 10 mA.</p><p>2. Mantén el voltaje y duplica R.</p><p>3. Mantén R y aumenta el voltaje.</p></div>
        </aside>
      </div>
    </div>
  )
}

function OhmLawView({ setView, done, setDone }: { setView: (v: View) => void; done: boolean; setDone: (v: boolean) => void }) {
  const [mode, setMode] = useState<'current' | 'resistance' | 'voltage'>('current')
  const [a, setA] = useState(5)
  const [b, setB] = useState(1000)
  const [source, setSource] = useState(5)
  const [ledDrop, setLedDrop] = useState(2)
  const [targetMa, setTargetMa] = useState(10)
  const [quiz, setQuiz] = useState<Record<number, number>>({})

  const result = useMemo(() => {
    if (mode === 'current') return b > 0 ? (a / b) * 1000 : 0
    if (mode === 'resistance') return b > 0 ? a / (b / 1000) : 0
    return a * (b / 1000)
  }, [mode, a, b])

  const exactResistor = targetMa > 0 && source > ledDrop ? (source - ledDrop) / (targetMa / 1000) : 0
  const suggestedResistor = nearestPreferredResistor(exactResistor)
  const actualMa = suggestedResistor > 0 ? ((Math.max(0, source - ledDrop) / suggestedResistor) * 1000) : 0
  const resistorPower = suggestedResistor > 0 ? ((actualMa / 1000) ** 2) * suggestedResistor : 0

  const quizItems = [
    { q: 'Tienes 12 V sobre una resistencia de 1.2 kΩ. ¿Qué corriente circula?', options: ['1 mA', '10 mA', '100 mA'], correct: 1, why: '1.2 kΩ = 1200 Ω. I = 12 ÷ 1200 = 0.01 A = 10 mA.' },
    { q: 'Quieres 15 mA con 6 V sobre una resistencia. ¿Qué valor necesitas aproximadamente?', options: ['40 Ω', '400 Ω', '4 kΩ'], correct: 1, why: 'R = V ÷ I = 6 ÷ 0.015 = 400 Ω.' },
    { q: 'Si duplicas el voltaje y mantienes la resistencia, la corriente ideal...', options: ['Se reduce a la mitad', 'Se duplica', 'No cambia'], correct: 1, why: 'Con R constante, I = V/R. Si V se duplica, I también.' },
    { q: '¿Cuál conversión es correcta?', options: ['2.2 kΩ = 220 Ω', '2.2 kΩ = 2200 Ω', '2.2 kΩ = 22 000 Ω'], correct: 1, why: 'kilo significa ×1000.' },
  ]
  const answered = Object.keys(quiz).length
  const score = quizItems.reduce((sum, item, i) => sum + (quiz[i] === item.correct ? 1 : 0), 0)

  return (
    <div className="lesson-shell block2-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('electricity')}><ArrowLeft size={18}/> Ruta Electricidad</button><span>Etapa 1 · Lección 3 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '37.5%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><Calculator size={18}/> BLOQUE 2 · CÁLCULO</span>
          <h1>Ley de Ohm sin memorizar a ciegas</h1>
          <p className="lesson-lead">La Ley de Ohm es una herramienta para razonar. Si conoces dos magnitudes eléctricas, puedes calcular la tercera y, más importante, detectar si un resultado tiene sentido antes de tocar un circuito.</p>

          <div className="lesson-objectives">
            <span className="eyebrow">AL TERMINAR PODRÁS</span>
            <div><p><CheckCircle2 size={18}/>Despejar V, I o R sin depender de un triángulo memorizado.</p><p><CheckCircle2 size={18}/>Convertir mA, A, Ω y kΩ antes de calcular.</p><p><CheckCircle2 size={18}/>Dimensionar una resistencia para un LED de baja tensión.</p><p><CheckCircle2 size={18}/>Revisar si un resultado es razonable.</p></div>
          </div>

          <section className="lesson-section">
            <span className="section-kicker">LA RELACIÓN CENTRAL</span>
            <h2>Una ecuación, tres preguntas</h2>
            <div className="formula-hero">
              <div><span>Voltaje</span><strong>V = I × R</strong><p>Úsala cuando conoces corriente y resistencia.</p></div>
              <div><span>Corriente</span><strong>I = V ÷ R</strong><p>Úsala cuando conoces voltaje y resistencia.</p></div>
              <div><span>Resistencia</span><strong>R = V ÷ I</strong><p>Úsala cuando conoces voltaje y corriente.</p></div>
            </div>
            <div className="key-point"><BadgeCheck size={22}/><div><strong>Regla de oro</strong><p>Antes de sustituir números, escribe las unidades. Si tu corriente está en mA, conviértela a A cuando la fórmula requiere amperes. Si tu resistencia está en kΩ, conviértela a Ω o trabaja de forma consistente.</p></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">PROCEDIMIENTO DE TALLER</span>
            <h2>Cómo resolver cualquier ejercicio básico</h2>
            <div className="procedure-grid">
              <div><span>01</span><strong>Identifica</strong><p>¿Qué sabes y qué necesitas encontrar?</p></div>
              <div><span>02</span><strong>Convierte</strong><p>Pasa mA a A y kΩ a Ω si hace falta.</p></div>
              <div><span>03</span><strong>Elige fórmula</strong><p>Selecciona la forma de la Ley de Ohm adecuada.</p></div>
              <div><span>04</span><strong>Comprueba</strong><p>Pregunta si el orden de magnitud tiene sentido.</p></div>
            </div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">EJEMPLOS RESUELTOS</span>
            <h2>Del papel al circuito</h2>
            <div className="worked-grid">
              <WorkedExample number="01" title="12 V y 1.2 kΩ" steps={['Convierte 1.2 kΩ = 1200 Ω.', 'Usa I = V ÷ R.', 'I = 12 ÷ 1200 = 0.01 A.', '0.01 A = 10 mA.']} result="Resultado: 10 mA" />
              <WorkedExample number="02" title="Encuentra R con 9 V y 15 mA" steps={['Convierte 15 mA = 0.015 A.', 'Usa R = V ÷ I.', 'R = 9 ÷ 0.015.', 'R = 600 Ω.']} result="Resultado: 600 Ω" />
              <WorkedExample number="03" title="Encuentra V con 2.2 kΩ y 3 mA" steps={['2.2 kΩ = 2200 Ω.', '3 mA = 0.003 A.', 'Usa V = I × R.', 'V = 0.003 × 2200 = 6.6 V.']} result="Resultado: 6.6 V" />
              <WorkedExample number="04" title="LED con fuente de 5 V" steps={['Supón 2 V de caída en el LED.', 'La resistencia recibe 3 V.', 'Para 10 mA: R = 3 ÷ 0.010.', 'R = 300 Ω; un valor comercial cercano puede ser 330 Ω.']} result="Con 330 Ω ≈ 9.1 mA" />
            </div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">ESTIMACIÓN MENTAL</span>
            <h2>Aprende a detectar resultados absurdos</h2>
            <div className="myth-grid">
              <div><strong>5 V / 1000 Ω no puede dar 5 A.</strong><p>Mil ohms es una resistencia relativamente grande para electrónica básica. El resultado correcto es 0.005 A, es decir 5 mA.</p></div>
              <div><strong>Si R aumenta y V no cambia, I debe bajar.</strong><p>Si tu calculadora muestra lo contrario, probablemente invertiste una operación o una unidad.</p></div>
              <div><strong>Los prefijos importan tanto como la fórmula.</strong><p>Confundir 10 mA con 10 A cambia el resultado por un factor de mil.</p></div>
            </div>
          </section>

          <section className="lesson-section quiz-section">
            <span className="section-kicker">COMPRUEBA TU RAZONAMIENTO</span>
            <h2>Mini evaluación</h2>
            {quizItems.map((item, qi) => (
              <div className="quiz-card" key={item.q}>
                <strong>{qi + 1}. {item.q}</strong>
                <div className="quiz-options">{item.options.map((option, oi) => <button key={option} className={quiz[qi] === oi ? 'selected' : ''} onClick={() => setQuiz({...quiz, [qi]: oi})}>{option}</button>)}</div>
                {quiz[qi] !== undefined && <div className={`quiz-feedback ${quiz[qi] === item.correct ? 'correct' : 'wrong'}`}>{quiz[qi] === item.correct ? 'Correcto. ' : 'Revisa el planteamiento. '}{item.why}</div>}
              </div>
            ))}
            {answered === quizItems.length && <div className="quiz-score"><BadgeCheck size={24}/><span><strong>{score}/4 correctas</strong><small>{score >= 3 ? 'Buen dominio. Practica ahora con valores nuevos.' : 'Vuelve a los ejemplos y prueba de nuevo.'}</small></span></div>}
          </section>

          <div className="lesson-actions"><button className={`complete-btn ${done ? 'completed' : ''}`} onClick={() => setDone(!done)}>{done ? <><CheckCircle2 size={20}/> Ley de Ohm completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" onClick={() => { setDone(true); setView('power') }}>Siguiente: potencia y energía <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab block2-lab">
          <div className="lab-panel-head"><div><span className="eyebrow">CALCULADORA DIDÁCTICA</span><h3>Despeja la magnitud</h3></div><Calculator size={24}/></div>
          <div className="calc-mode-tabs">
            <button className={mode === 'current' ? 'active' : ''} onClick={() => { setMode('current'); setA(5); setB(1000) }}>I</button>
            <button className={mode === 'resistance' ? 'active' : ''} onClick={() => { setMode('resistance'); setA(5); setB(10) }}>R</button>
            <button className={mode === 'voltage' ? 'active' : ''} onClick={() => { setMode('voltage'); setA(1000); setB(5) }}>V</button>
          </div>
          {mode === 'current' && <>
            <NumberField label="Voltaje" value={a} setValue={setA} unit="V" />
            <NumberField label="Resistencia" value={b} setValue={setB} unit="Ω" />
            <div className="result-box"><span>Corriente</span><strong>{result.toFixed(2)} <small>mA</small></strong><p>I = V ÷ R</p></div>
          </>}
          {mode === 'resistance' && <>
            <NumberField label="Voltaje" value={a} setValue={setA} unit="V" />
            <NumberField label="Corriente" value={b} setValue={setB} unit="mA" />
            <div className="result-box"><span>Resistencia</span><strong>{result.toFixed(0)} <small>Ω</small></strong><p>R = V ÷ I</p></div>
          </>}
          {mode === 'voltage' && <>
            <NumberField label="Resistencia" value={a} setValue={setA} unit="Ω" />
            <NumberField label="Corriente" value={b} setValue={setB} unit="mA" />
            <div className="result-box"><span>Voltaje</span><strong>{result.toFixed(2)} <small>V</small></strong><p>V = I × R</p></div>
          </>}

          <div className="lab-divider" />
          <span className="eyebrow">DISEÑADOR DE LED · BAJA TENSIÓN</span>
          <NumberField label="Fuente" value={source} setValue={setSource} unit="V" />
          <NumberField label="Caída estimada LED" value={ledDrop} setValue={setLedDrop} unit="V" step={0.1} />
          <NumberField label="Corriente objetivo" value={targetMa} setValue={setTargetMa} unit="mA" />
          <div className="design-result">
            <span>R teórica</span><strong>{exactResistor.toFixed(0)} Ω</strong>
            <span>Valor preferente cercano</span><strong>{suggestedResistor || 0} Ω</strong>
            <span>Corriente aproximada</span><strong>{actualMa.toFixed(1)} mA</strong>
            <span>Potencia en R</span><strong>{resistorPower.toFixed(3)} W</strong>
          </div>
          <div className="lab-warning"><ShieldCheck size={20}/><span>Este diseñador es didáctico para circuitos DC de baja tensión. No lo uses para dimensionar instalaciones conectadas a la red.</span></div>
          <button className="primary-btn full-btn" onClick={() => setView('drill')}>Abrir entrenador de cálculos <ArrowRight size={18}/></button>
        </aside>
      </div>
    </div>
  )
}

function PowerEnergyView({ setView, done, setDone }: { setView: (v: View) => void; done: boolean; setDone: (v: boolean) => void }) {
  const [watts, setWatts] = useState(10)
  const [hours, setHours] = useState(5)
  const [days, setDays] = useState(30)
  const [tariff, setTariff] = useState(1.5)
  const [voltage, setVoltage] = useState(5)
  const [currentMa, setCurrentMa] = useState(500)
  const [quiz, setQuiz] = useState<Record<number, number>>({})

  const powerW = voltage * (currentMa / 1000)
  const monthlyKwh = (watts * hours * days) / 1000
  const monthlyCost = monthlyKwh * tariff
  const quizItems = [
    { q: 'Una carga consume 2 A a 12 V. ¿Cuál es su potencia?', options: ['6 W', '14 W', '24 W'], correct: 2, why: 'P = V × I = 12 × 2 = 24 W.' },
    { q: 'Una lámpara de 10 W funciona 5 horas. ¿Qué energía usa?', options: ['2 Wh', '50 Wh', '500 Wh'], correct: 1, why: 'E = P × t = 10 W × 5 h = 50 Wh.' },
    { q: '¿Qué diferencia principal hay entre W y kWh?', options: ['Ninguna', 'W es potencia; kWh es energía acumulada', 'kWh es voltaje'], correct: 1, why: 'Los watts expresan ritmo de uso de energía; los kWh expresan energía acumulada en el tiempo.' },
    { q: '500 mA a 5 V equivalen aproximadamente a...', options: ['0.1 W', '2.5 W', '2500 W'], correct: 1, why: '500 mA = 0.5 A. P = 5 × 0.5 = 2.5 W.' },
  ]
  const answered = Object.keys(quiz).length
  const score = quizItems.reduce((sum, item, i) => sum + (quiz[i] === item.correct ? 1 : 0), 0)

  return (
    <div className="lesson-shell block2-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('ohm')}><ArrowLeft size={18}/> Ley de Ohm</button><span>Etapa 1 · Lección 4 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '50%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><Gauge size={18}/> BLOQUE 2 · POTENCIA Y ENERGÍA</span>
          <h1>Potencia, energía y consumo</h1>
          <p className="lesson-lead">Voltaje y corriente describen lo que ocurre eléctricamente. La potencia indica qué tan rápido se transfiere energía y la energía te dice cuánto se acumuló durante un periodo. Esta diferencia aparece en cargadores, focos, motores, baterías y recibos de electricidad.</p>

          <div className="lesson-objectives">
            <span className="eyebrow">AL TERMINAR PODRÁS</span>
            <div><p><CheckCircle2 size={18}/>Calcular potencia con P = V × I.</p><p><CheckCircle2 size={18}/>Relacionar watts, watts-hora y kilowatts-hora.</p><p><CheckCircle2 size={18}/>Estimar consumo mensual a partir de potencia y tiempo.</p><p><CheckCircle2 size={18}/>Distinguir potencia instantánea de energía acumulada.</p></div>
          </div>

          <section className="lesson-section">
            <span className="section-kicker">PRIMERO LA IDEA</span>
            <h2>Potencia no es lo mismo que energía</h2>
            <div className="power-compare">
              <div><Zap size={28}/><span className="eyebrow">POTENCIA</span><h3>Watt (W)</h3><p>Es la rapidez con la que un dispositivo transforma o transfiere energía. Una carga de 100 W usa energía más rápido que una de 10 W.</p></div>
              <div><Battery size={28}/><span className="eyebrow">ENERGÍA</span><h3>Wh o kWh</h3><p>Es la cantidad acumulada durante un tiempo. Una carga pequeña encendida muchas horas puede acumular más consumo que una potente usada por pocos minutos.</p></div>
            </div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">FÓRMULAS CLAVE</span>
            <h2>Las relaciones que usarás</h2>
            <div className="formula-hero power-formulas">
              <div><span>Potencia</span><strong>P = V × I</strong><p>V en volts, I en amperes, P en watts.</p></div>
              <div><span>Energía</span><strong>E = P × t</strong><p>Si P está en W y t en horas, obtienes Wh.</p></div>
              <div><span>Conversión</span><strong>1000 Wh = 1 kWh</strong><p>Divide Wh entre 1000 para pasar a kWh.</p></div>
            </div>
            <div className="context-note"><Calculator size={20}/><p>También existen P = I²R y P = V²/R. Las veremos como herramientas derivadas cuando necesites estudiar disipación en resistencias y cargas.</p></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">EJEMPLOS REALES</span>
            <h2>Del cargador al consumo mensual</h2>
            <div className="worked-grid">
              <WorkedExample number="01" title="Carga de 12 V y 2 A" steps={['Usa P = V × I.', 'P = 12 × 2.', 'P = 24 W.']} result="Potencia: 24 W" />
              <WorkedExample number="02" title="Lámpara de 10 W durante 5 h" steps={['Usa E = P × t.', 'E = 10 × 5.', 'E = 50 Wh.', '50 Wh = 0.05 kWh.']} result="Energía: 0.05 kWh" />
              <WorkedExample number="03" title="Carga de 5 V y 500 mA" steps={['Convierte 500 mA = 0.5 A.', 'P = 5 × 0.5.', 'P = 2.5 W.']} result="Potencia: 2.5 W" />
              <WorkedExample number="04" title="Dispositivo de 60 W, 3 h/día" steps={['60 × 3 = 180 Wh por día.', '180 × 30 = 5400 Wh.', '5400 Wh = 5.4 kWh al mes.']} result="Consumo mensual: 5.4 kWh" />
            </div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">LECTURA PROFESIONAL</span>
            <h2>Qué te dice una placa eléctrica</h2>
            <p>Las etiquetas de fuentes, cargadores y equipos suelen mostrar una combinación de voltaje, corriente y potencia. Aprender a leerlas te permite verificar compatibilidad, estimar consumo y detectar cálculos incoherentes.</p>
            <div className="nameplate-card">
              <div><span>INPUT</span><strong>100–240 V~</strong></div>
              <div><span>OUTPUT</span><strong>5 V ⎓ 2 A</strong></div>
              <div><span>POTENCIA TEÓRICA DE SALIDA</span><strong>≈ 10 W</strong></div>
            </div>
            <p className="lesson-footnote">El ejemplo es didáctico. En equipos reales existen eficiencia, pérdidas y condiciones específicas indicadas por el fabricante.</p>
          </section>

          <section className="lesson-section quiz-section">
            <span className="section-kicker">COMPRUEBA TU DOMINIO</span>
            <h2>Mini evaluación</h2>
            {quizItems.map((item, qi) => (
              <div className="quiz-card" key={item.q}>
                <strong>{qi + 1}. {item.q}</strong>
                <div className="quiz-options">{item.options.map((option, oi) => <button key={option} className={quiz[qi] === oi ? 'selected' : ''} onClick={() => setQuiz({...quiz, [qi]: oi})}>{option}</button>)}</div>
                {quiz[qi] !== undefined && <div className={`quiz-feedback ${quiz[qi] === item.correct ? 'correct' : 'wrong'}`}>{quiz[qi] === item.correct ? 'Correcto. ' : 'Todavía no. '}{item.why}</div>}
              </div>
            ))}
            {answered === quizItems.length && <div className="quiz-score"><BadgeCheck size={24}/><span><strong>{score}/4 correctas</strong><small>{score >= 3 ? 'Ya puedes pasar al entrenador de cálculos.' : 'Repasa las conversiones y vuelve a intentarlo.'}</small></span></div>}
          </section>

          <div className="lesson-actions"><button className={`complete-btn ${done ? 'completed' : ''}`} onClick={() => setDone(!done)}>{done ? <><CheckCircle2 size={20}/> Lección completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" onClick={() => { setDone(true); setView('drill') }}>Practicar cálculos <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab block2-lab">
          <div className="lab-panel-head"><div><span className="eyebrow">LAB DE CONSUMO</span><h3>Potencia instantánea</h3></div><Gauge size={24}/></div>
          <NumberField label="Voltaje" value={voltage} setValue={setVoltage} unit="V" />
          <NumberField label="Corriente" value={currentMa} setValue={setCurrentMa} unit="mA" />
          <div className="result-box"><span>Potencia</span><strong>{powerW.toFixed(2)} <small>W</small></strong><p>P = V × I</p></div>

          <div className="lab-divider" />
          <span className="eyebrow">ESTIMADOR DE ENERGÍA</span>
          <NumberField label="Potencia del equipo" value={watts} setValue={setWatts} unit="W" />
          <NumberField label="Horas por día" value={hours} setValue={setHours} unit="h" step={0.5} />
          <NumberField label="Días al mes" value={days} setValue={setDays} unit="días" />
          <NumberField label="Costo que quieras simular" value={tariff} setValue={setTariff} unit="$/kWh" step={0.1} />
          <div className="energy-summary">
            <div><span>Consumo mensual</span><strong>{monthlyKwh.toFixed(2)} kWh</strong></div>
            <div><span>Costo estimado</span><strong>${monthlyCost.toFixed(2)}</strong></div>
          </div>
          <div className="lab-warning"><BadgeCheck size={20}/><span>El costo es solo una simulación matemática. Introduce tú mismo la tarifa que quieras analizar; la plataforma no asume una tarifa eléctrica vigente.</span></div>
        </aside>
      </div>
    </div>
  )
}

function PolarityView({ setView, done, setDone }: { setView: (v: View) => void; done: boolean; setDone: (v: boolean) => void }) {
  const [reverse, setReverse] = useState(false)
  const [sourceV, setSourceV] = useState(3)
  const [quiz, setQuiz] = useState<Record<number, number>>({})
  const quizItems = [
    { q: 'En una fuente DC, ¿qué dato indica la diferencia de potencial disponible?', options: ['Voltaje', 'Color del cable', 'Tamaño físico'], correct: 0, why: 'El voltaje de salida es la diferencia de potencial que la fuente puede establecer.' },
    { q: 'Una fuente de 5 V capaz de entregar hasta 2 A alimenta una carga que necesita 0.3 A. ¿La fuente “obliga” a circular 2 A?', options: ['Sí', 'No, la carga demanda la corriente que necesita dentro de los límites', 'Solo si el cable es rojo'], correct: 1, why: 'La corriente nominal de la fuente expresa capacidad máxima, no una corriente que siempre fuerce a la carga.' },
    { q: '¿Qué debes verificar antes de conectar un componente polarizado?', options: ['Solo su color', 'Polaridad, voltaje y límites del componente', 'Que esté caliente'], correct: 1, why: 'Polaridad y especificaciones importan porque algunos componentes pueden dañarse si se conectan al revés o fuera de rango.' },
  ]
  const answered = Object.keys(quiz).length
  const score = quizItems.reduce((sum, item, i) => sum + (quiz[i] === item.correct ? 1 : 0), 0)
  return (
    <div className="lesson-shell block3-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('power')}><ArrowLeft size={18}/> Potencia y energía</button><span>Etapa 1 · Lección 5 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '62.5%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><Battery size={18}/> BLOQUE 3 · CORRIENTE CONTINUA</span>
          <h1>Fuentes DC, polaridad y conexiones correctas</h1>
          <p className="lesson-lead">Hasta ahora has calculado magnitudes. Ahora empiezas a leer físicamente una fuente: qué terminal es positivo, cuál es negativo, qué significa su voltaje nominal y por qué una conexión correcta no depende de “un cable rojo”, sino de identificar el circuito.</p>

          <div className="lesson-objectives"><span className="eyebrow">AL TERMINAR PODRÁS</span><div><p><CheckCircle2 size={18}/>Distinguir corriente continua de alterna a nivel conceptual.</p><p><CheckCircle2 size={18}/>Interpretar voltaje y corriente nominal de una fuente DC.</p><p><CheckCircle2 size={18}/>Reconocer componentes polarizados.</p><p><CheckCircle2 size={18}/>Detectar una inversión de polaridad antes de energizar.</p></div></div>

          <section className="lesson-section">
            <span className="section-kicker">IDEA CENTRAL</span><h2>En DC, la referencia de polaridad importa</h2>
            <p>En una fuente de corriente continua, los terminales mantienen una polaridad definida: uno se toma como referencia positiva y el otro como negativa. Esa orientación permite describir el sentido convencional de corriente y es especialmente importante para LEDs, diodos, capacitores electrolíticos y muchos circuitos electrónicos.</p>
            <div className="dc-source-grid"><div><Battery size={28}/><strong>Pila o batería</strong><p>Entrega una tensión DC definida por su química y configuración.</p></div><div><PlugZap size={28}/><strong>Fuente USB</strong><p>Una salida USB convencional puede proporcionar una tensión regulada; debes respetar el tipo de puerto y especificación del dispositivo.</p></div><div><Gauge size={28}/><strong>Fuente de banco</strong><p>Permite ajustar voltaje y limitar corriente para pruebas controladas.</p></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">LEE LA ETIQUETA</span><h2>Voltaje nominal y capacidad de corriente no significan lo mismo</h2>
            <div className="nameplate-card compact-nameplate"><div><span>OUTPUT</span><strong>5 V DC</strong></div><div><span>MAX CURRENT</span><strong>2 A</strong></div><div><span>LECTURA</span><strong>5 V · hasta 2 A</strong></div></div>
            <p>Una fuente rotulada “5 V, 2 A” intenta mantener aproximadamente 5 V dentro de su rango de trabajo y puede entregar hasta cierta corriente. La carga no recibe automáticamente 2 A: su impedancia y funcionamiento determinan cuánta corriente demanda, siempre que la fuente pueda suministrarla.</p>
            <div className="context-note"><ShieldCheck size={20}/><p>En este bloque no conectamos fuentes desconocidas ni improvisadas. Para prácticas físicas usamos pilas o fuentes DC de baja tensión conocidas y verificadas.</p></div>
          </section>

          <section className="lesson-section"><span className="section-kicker">EJEMPLOS</span><h2>Cómo pensar antes de conectar</h2><div className="worked-grid"><WorkedExample number="01" title="LED con polaridad" steps={['Identifica ánodo y cátodo según el componente o su documentación.', 'Coloca una resistencia limitadora en serie.', 'Verifica que la fuente y el LED estén dentro del rango didáctico.', 'Energiza solo después de revisar.']} result="La orientación del LED sí importa"/><WorkedExample number="02" title="Motor DC pequeño" steps={['Conecta una fuente compatible.', 'Al invertir la polaridad, el sentido de giro suele invertirse.', 'No asumas que todos los dispositivos toleran inversión de polaridad.']} result="Polaridad puede cambiar comportamiento"/></div></section>

          <section className="lesson-section quiz-section"><span className="section-kicker">COMPRUEBA TU DOMINIO</span><h2>Mini evaluación</h2>{quizItems.map((item, qi) => <div className="quiz-card" key={item.q}><strong>{qi + 1}. {item.q}</strong><div className="quiz-options">{item.options.map((option, oi) => <button key={option} className={quiz[qi] === oi ? 'selected' : ''} onClick={() => setQuiz({...quiz, [qi]: oi})}>{option}</button>)}</div>{quiz[qi] !== undefined && <div className={`quiz-feedback ${quiz[qi] === item.correct ? 'correct' : 'wrong'}`}>{quiz[qi] === item.correct ? 'Correcto. ' : 'Revisa la idea. '}{item.why}</div>}</div>)}{answered === quizItems.length && <div className="quiz-score"><BadgeCheck size={24}/><span><strong>{score}/3 correctas</strong><small>{score === 3 ? 'Listo para comparar serie y paralelo.' : 'Repasa la lectura de fuentes y polaridad.'}</small></span></div>}</section>

          <div className="lesson-actions"><button className={`complete-btn ${done ? 'completed' : ''}`} onClick={() => setDone(!done)}>{done ? <><CheckCircle2 size={20}/> Lección completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" onClick={() => { setDone(true); setView('series') }}>Continuar a serie y paralelo <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab block3-lab">
          <div className="lab-panel-head"><div><span className="eyebrow">SIMULADOR DE POLARIDAD</span><h3>Gira la conexión</h3></div><Battery size={24}/></div>
          <div className={`polarity-demo ${reverse ? 'reverse' : ''}`}><div className="source-terminal positive">+</div><div className="demo-wire"/><div className="demo-led"><Lightbulb size={34}/></div><div className="demo-wire"/><div className="source-terminal negative">−</div></div>
          <div className="polarity-state"><span>Orientación</span><strong>{reverse ? 'Invertida' : 'Directa'}</strong></div>
          <button className="polarity-toggle" onClick={() => setReverse(!reverse)}>Invertir polaridad</button>
          <p className="lab-copy">En esta simulación, la orientación directa representa el LED polarizado correctamente. La posición invertida te ayuda a visualizar por qué debes revisar terminales antes de energizar.</p>
          <NumberField label="Fuente simulada" value={sourceV} setValue={setSourceV} unit="V DC" step={0.5}/>
          <div className={`lab-warning ${sourceV > 12 ? 'danger' : ''}`}><ShieldCheck size={20}/><span>{sourceV <= 12 ? 'Seguimos en el rango didáctico de baja tensión de esta etapa.' : 'Para esta etapa vuelve a 12 V o menos. No estamos practicando con tensiones mayores.'}</span></div>
        </aside>
      </div>
    </div>
  )
}

function SeriesParallelView({ setView, done, setDone }: { setView: (v: View) => void; done: boolean; setDone: (v: boolean) => void }) {
  const [mode, setMode] = useState<'series' | 'parallel'>('series')
  const [voltage, setVoltage] = useState(6)
  const [r1, setR1] = useState(220)
  const [r2, setR2] = useState(330)
  const safeR1 = Math.max(r1, 0.001)
  const safeR2 = Math.max(r2, 0.001)
  const seriesR = safeR1 + safeR2
  const seriesI = voltage / seriesR
  const parallelR = 1 / ((1 / safeR1) + (1 / safeR2))
  const parallelI1 = voltage / safeR1
  const parallelI2 = voltage / safeR2
  const parallelTotal = parallelI1 + parallelI2
  const [quiz, setQuiz] = useState<Record<number, number>>({})
  const quizItems = [
    { q: 'En un circuito en serie ideal, ¿qué magnitud es la misma a través de todos los elementos?', options: ['Corriente', 'Voltaje de cada elemento', 'Resistencia individual'], correct: 0, why: 'En una única trayectoria, la misma corriente atraviesa cada elemento.' },
    { q: 'En ramas en paralelo conectadas a la misma fuente, ¿qué magnitud comparten las ramas?', options: ['El mismo voltaje', 'La misma resistencia', 'La misma potencia siempre'], correct: 0, why: 'Las ramas comparten los mismos dos nodos, por lo que tienen el mismo voltaje entre extremos.' },
    { q: 'Dos resistencias positivas en paralelo producen una resistencia equivalente...', options: ['Mayor que ambas', 'Igual a la mayor', 'Menor que la más pequeña'], correct: 2, why: 'Agregar caminos en paralelo reduce la resistencia equivalente vista por la fuente.' },
  ]
  const answered = Object.keys(quiz).length
  const score = quizItems.reduce((sum, item, i) => sum + (quiz[i] === item.correct ? 1 : 0), 0)
  return (
    <div className="lesson-shell block3-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('polarity')}><ArrowLeft size={18}/> Fuentes y polaridad</button><span>Etapa 1 · Lección 6 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '75%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><Activity size={18}/> BLOQUE 3 · TOPOLOGÍA</span><h1>Serie y paralelo: dos formas de repartir el circuito</h1>
          <p className="lesson-lead">La forma en que conectas componentes cambia por completo cómo se distribuyen corriente y voltaje. Aprender a reconocer serie y paralelo es indispensable antes de interpretar instalaciones más complejas.</p>
          <div className="lesson-objectives"><span className="eyebrow">AL TERMINAR PODRÁS</span><div><p><CheckCircle2 size={18}/>Reconocer una única trayectoria en serie.</p><p><CheckCircle2 size={18}/>Reconocer ramas conectadas a los mismos nodos.</p><p><CheckCircle2 size={18}/>Calcular resistencia equivalente básica.</p><p><CheckCircle2 size={18}/>Predecir cómo se reparte voltaje y corriente.</p></div></div>

          <section className="lesson-section"><span className="section-kicker">SERIE</span><h2>Una sola ruta para la corriente</h2><p>En una conexión en serie, los componentes forman una sola trayectoria. La corriente es la misma a través de ellos. En resistencias, la resistencia equivalente se suma: <strong>Rₜ = R₁ + R₂ + ...</strong>. El voltaje de la fuente se distribuye entre los elementos.</p><div className="topology-card"><div className="topology-line"><span className="source-box">6 V</span><span className="component-box">R1</span><span className="component-box">R2</span><span className="return-line">↩</span></div><p>Una ruta · misma corriente · caídas de voltaje repartidas.</p></div></section>

          <section className="lesson-section"><span className="section-kicker">PARALELO</span><h2>Varias rutas entre los mismos nodos</h2><p>En paralelo, las ramas están conectadas entre los mismos dos nodos. Cada rama tiene el mismo voltaje de la fuente. La corriente total es la suma de las corrientes de cada rama. Para dos resistencias: <strong>1/Rₜ = 1/R₁ + 1/R₂</strong>.</p><div className="topology-card parallel-card"><span className="source-box">6 V</span><div className="branch-stack"><span className="component-box">R1</span><span className="component-box">R2</span></div><span className="return-line">↩</span></div></section>

          <section className="lesson-section"><span className="section-kicker">EJEMPLOS RESUELTOS</span><h2>Compara con los mismos valores</h2><div className="worked-grid"><WorkedExample number="01" title="220 Ω + 330 Ω en serie" steps={['Rₜ = 220 + 330 = 550 Ω.', 'Con 6 V: I = 6 / 550.', 'I ≈ 0.0109 A = 10.9 mA.', 'La misma corriente atraviesa ambas resistencias.']} result="Rₜ = 550 Ω · I ≈ 10.9 mA"/><WorkedExample number="02" title="220 Ω // 330 Ω en paralelo" steps={['1/Rₜ = 1/220 + 1/330.', 'Rₜ ≈ 132 Ω.', 'Cada rama recibe 6 V.', 'I₁ ≈ 27.3 mA e I₂ ≈ 18.2 mA.']} result="Rₜ ≈ 132 Ω · I total ≈ 45.5 mA"/></div></section>

          <section className="lesson-section quiz-section"><span className="section-kicker">COMPRUEBA TU DOMINIO</span><h2>Mini evaluación</h2>{quizItems.map((item, qi) => <div className="quiz-card" key={item.q}><strong>{qi + 1}. {item.q}</strong><div className="quiz-options">{item.options.map((option, oi) => <button key={option} className={quiz[qi] === oi ? 'selected' : ''} onClick={() => setQuiz({...quiz, [qi]: oi})}>{option}</button>)}</div>{quiz[qi] !== undefined && <div className={`quiz-feedback ${quiz[qi] === item.correct ? 'correct' : 'wrong'}`}>{quiz[qi] === item.correct ? 'Correcto. ' : 'Revisa el recorrido. '}{item.why}</div>}</div>)}{answered === quizItems.length && <div className="quiz-score"><BadgeCheck size={24}/><span><strong>{score}/3 correctas</strong><small>{score === 3 ? 'Ya puedes empezar a leer diagramas.' : 'Vuelve a comparar una ruta contra varias ramas.'}</small></span></div>}</section>

          <div className="lesson-actions"><button className={`complete-btn ${done ? 'completed' : ''}`} onClick={() => setDone(!done)}>{done ? <><CheckCircle2 size={20}/> Lección completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" onClick={() => { setDone(true); setView('diagrams') }}>Leer diagramas <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab block3-lab">
          <div className="lab-panel-head"><div><span className="eyebrow">LAB SERIE / PARALELO</span><h3>Usa los mismos componentes</h3></div><Activity size={24}/></div>
          <div className="calc-mode-tabs"><button className={mode === 'series' ? 'active' : ''} onClick={() => setMode('series')}>Serie</button><button className={mode === 'parallel' ? 'active' : ''} onClick={() => setMode('parallel')}>Paralelo</button></div>
          <NumberField label="Fuente" value={voltage} setValue={setVoltage} unit="V" step={0.5}/><NumberField label="R1" value={r1} setValue={setR1} unit="Ω"/><NumberField label="R2" value={r2} setValue={setR2} unit="Ω"/>
          {mode === 'series' ? <div className="topology-results"><div><span>R equivalente</span><strong>{seriesR.toFixed(0)} Ω</strong></div><div><span>Corriente total</span><strong>{(seriesI*1000).toFixed(1)} mA</strong></div><div><span>V en R1</span><strong>{(seriesI*safeR1).toFixed(2)} V</strong></div><div><span>V en R2</span><strong>{(seriesI*safeR2).toFixed(2)} V</strong></div></div> : <div className="topology-results"><div><span>R equivalente</span><strong>{parallelR.toFixed(1)} Ω</strong></div><div><span>I total</span><strong>{(parallelTotal*1000).toFixed(1)} mA</strong></div><div><span>I rama R1</span><strong>{(parallelI1*1000).toFixed(1)} mA</strong></div><div><span>I rama R2</span><strong>{(parallelI2*1000).toFixed(1)} mA</strong></div></div>}
          <div className="lab-warning"><Calculator size={20}/><span>Cambia entre serie y paralelo sin modificar valores. Observa cómo la conexión altera la resistencia equivalente y la corriente total.</span></div>
        </aside>
      </div>
    </div>
  )
}

function DiagramView({ setView, done, setDone }: { setView: (v: View) => void; done: boolean; setDone: (v: boolean) => void }) {
  const [answer, setAnswer] = useState<string>('')
  const [symbolAnswer, setSymbolAnswer] = useState<string>('')
  const correct = answer === 'open'
  const symbolCorrect = symbolAnswer === 'resistor'
  return (
    <div className="lesson-shell block3-shell">
      <div className="lesson-top"><button className="back-link" onClick={() => setView('series')}><ArrowLeft size={18}/> Serie y paralelo</button><span>Etapa 1 · Lección 7 de 8</span></div>
      <div className="lesson-progress"><span style={{ width: '87.5%' }} /></div>
      <div className="lesson-grid">
        <article className="lesson-content rich-lesson">
          <span className="eyebrow"><BookOpen size={18}/> BLOQUE 3 · LECTURA TÉCNICA</span><h1>De cables reales a símbolos eléctricos</h1>
          <p className="lesson-lead">Un diagrama no intenta dibujar físicamente cada cable. Su objetivo es comunicar relaciones eléctricas. Aprender a leerlo te permite razonar antes de tocar herramientas y después será la base para planos residenciales, control y diagnóstico.</p>
          <div className="lesson-objectives"><span className="eyebrow">AL TERMINAR PODRÁS</span><div><p><CheckCircle2 size={18}/>Reconocer símbolos básicos de fuente, interruptor, resistencia y lámpara.</p><p><CheckCircle2 size={18}/>Seguir una trayectoria cerrada en un esquema.</p><p><CheckCircle2 size={18}/>Distinguir conexión eléctrica de proximidad visual.</p><p><CheckCircle2 size={18}/>Detectar un circuito abierto sencillo.</p></div></div>

          <section className="lesson-section"><span className="section-kicker">VOCABULARIO GRÁFICO</span><h2>Cuatro símbolos que ya puedes interpretar</h2><div className="symbol-grid"><div><span className="symbol battery-symbol">＋ −</span><strong>Fuente DC</strong><p>Establece diferencia de potencial.</p></div><div><span className="symbol switch-symbol">— / —</span><strong>Interruptor</strong><p>Abre o cierra el recorrido.</p></div><div><span className="symbol resistor-symbol">—▭—</span><strong>Resistencia</strong><p>Limita corriente o produce una caída de tensión.</p></div><div><span className="symbol lamp-symbol">◯×</span><strong>Lámpara / carga</strong><p>Representa un elemento que utiliza energía eléctrica.</p></div></div></section>

          <section className="lesson-section"><span className="section-kicker">MÉTODO DE LECTURA</span><h2>No “mires el dibujo”: sigue nodos y trayectorias</h2><div className="procedure-grid diagram-procedure"><div><span>1</span><strong>Encuentra la fuente</strong><p>Identifica los dos terminales que alimentan el circuito.</p></div><div><span>2</span><strong>Sigue el conductor</strong><p>Recorre cada conexión sin saltarte aperturas.</p></div><div><span>3</span><strong>Identifica cargas</strong><p>Reconoce qué componentes reciben corriente.</p></div><div><span>4</span><strong>Busca retorno</strong><p>Comprueba si existe un camino completo hacia el otro terminal.</p></div></div></section>

          <section className="lesson-section"><span className="section-kicker">EJERCICIO VISUAL</span><h2>¿Por qué no enciende la lámpara?</h2><div className="diagram-board"><div className="diagram-node source"><Battery size={28}/><span>3 V</span></div><div className="diagram-wire horizontal"/><div className="diagram-node sw"><span className="open-switch-line">／</span><small>ABIERTO</small></div><div className="diagram-wire horizontal"/><div className="diagram-node load"><Lightbulb size={30}/><span>Lámpara</span></div><div className="diagram-return">──────────── retorno ────────────</div></div><div className="diagram-answer-grid"><button className={answer === 'lowv' ? 'selected' : ''} onClick={() => setAnswer('lowv')}>Porque 3 V siempre es insuficiente</button><button className={answer === 'open' ? 'selected' : ''} onClick={() => setAnswer('open')}>Porque el interruptor abre el recorrido</button><button className={answer === 'parallel' ? 'selected' : ''} onClick={() => setAnswer('parallel')}>Porque está en paralelo</button></div>{answer && <div className={`quiz-feedback ${correct ? 'correct' : 'wrong'}`}>{correct ? 'Correcto. El circuito está abierto: no existe un camino cerrado para una corriente sostenida.' : 'No todavía. Sigue el conductor desde la fuente y localiza dónde se interrumpe físicamente la trayectoria.'}</div>}</section>

          <section className="lesson-section"><span className="section-kicker">RECONOCIMIENTO</span><h2>Identifica el símbolo</h2><div className="symbol-question"><div className="big-symbol">—▭—</div><div className="diagram-answer-grid"><button className={symbolAnswer === 'switch' ? 'selected' : ''} onClick={() => setSymbolAnswer('switch')}>Interruptor</button><button className={symbolAnswer === 'resistor' ? 'selected' : ''} onClick={() => setSymbolAnswer('resistor')}>Resistencia</button><button className={symbolAnswer === 'lamp' ? 'selected' : ''} onClick={() => setSymbolAnswer('lamp')}>Lámpara</button></div>{symbolAnswer && <div className={`quiz-feedback ${symbolCorrect ? 'correct' : 'wrong'}`}>{symbolCorrect ? 'Correcto. En esta plataforma usaremos esta representación simplificada para resistencia.' : 'Revisa la tabla de símbolos de arriba.'}</div>}</div></section>

          <div className="lesson-actions"><button className={`complete-btn ${done ? 'completed' : ''}`} onClick={() => setDone(!done)}>{done ? <><CheckCircle2 size={20}/> Lección completada</> : <><Check size={20}/> Marcar como entendida</>}</button><button className="primary-btn" disabled={!correct || !symbolCorrect} onClick={() => { setDone(true); setView('practice') }}>Ir a la práctica de etapa <ArrowRight size={20}/></button></div>
        </article>

        <aside className="lab-panel rich-lab block3-lab diagram-reference-panel"><div className="lab-panel-head"><div><span className="eyebrow">REGLA DE ORO</span><h3>Conexión ≠ cercanía</h3></div><BookOpen size={24}/></div><p className="lab-copy">Dos símbolos pueden estar muy cerca en el papel y no estar conectados. Lo que importa es la línea conductora y los nodos que comparten.</p><div className="node-demo"><div><strong>A</strong><span>●────●</span><small>Mismo conductor: sí están conectados.</small></div><div><strong>B</strong><span>───　───</span><small>Existe una separación: circuito abierto.</small></div><div><strong>C</strong><span>──●──<br/>　│</span><small>El nodo representa una unión eléctrica.</small></div></div><div className="lab-warning"><ShieldCheck size={20}/><span>Leer el diagrama antes de montar reduce errores. En circuitos reales, además se debe verificar el estado desenergizado antes de intervenir.</span></div></aside>
      </div>
    </div>
  )
}

function CalculationDrillView({ setView }: { setView: (v: View) => void }) {
  const problems = useMemo(() => [
    { id: 1, type: 'ohm', title: 'Corriente', prompt: '5 V sobre 1 kΩ. ¿Cuántos mA circulan?', answer: 5, unit: 'mA', hint: 'I = V/R. Convierte 1 kΩ a 1000 Ω.' },
    { id: 2, type: 'ohm', title: 'Resistencia', prompt: '6 V y una corriente deseada de 15 mA. ¿Cuántos Ω necesitas?', answer: 400, unit: 'Ω', hint: 'R = V/I. 15 mA = 0.015 A.' },
    { id: 3, type: 'ohm', title: 'Voltaje', prompt: '2.2 kΩ con 3 mA. ¿Cuántos volts hay?', answer: 6.6, unit: 'V', hint: 'V = I×R. 2.2 kΩ = 2200 Ω.' },
    { id: 4, type: 'ohm', title: 'LED', prompt: 'Fuente 9 V, LED ≈ 2 V, objetivo 10 mA. ¿R teórica en Ω?', answer: 700, unit: 'Ω', hint: 'La resistencia ve 7 V. R = 7/0.01.' },
    { id: 5, type: 'power', title: 'Potencia', prompt: '12 V y 2 A. ¿Cuántos watts?', answer: 24, unit: 'W', hint: 'P = V×I.' },
    { id: 6, type: 'power', title: 'Potencia', prompt: '5 V y 500 mA. ¿Cuántos watts?', answer: 2.5, unit: 'W', hint: '500 mA = 0.5 A.' },
    { id: 7, type: 'energy', title: 'Energía', prompt: 'Un equipo de 20 W funciona 4 h. ¿Cuántos Wh?', answer: 80, unit: 'Wh', hint: 'E = P×t.' },
    { id: 8, type: 'energy', title: 'Consumo', prompt: 'Una carga de 100 W funciona 3 h/día por 30 días. ¿Cuántos kWh?', answer: 9, unit: 'kWh', hint: '100×3×30 = 9000 Wh = 9 kWh.' },
  ], [])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const correctCount = problems.reduce((sum, p) => {
    const value = Number(answers[p.id])
    const ok = Number.isFinite(value) && Math.abs(value - p.answer) <= Math.max(0.01, Math.abs(p.answer) * 0.01)
    return sum + (checked[p.id] && ok ? 1 : 0)
  }, 0)

  const checkOne = (id: number) => setChecked({ ...checked, [id]: true })
  const reset = () => { setAnswers({}); setChecked({}) }

  return (
    <div className="page-wrap compact drill-page">
      <button className="back-link" onClick={() => setView('electricity')}><ArrowLeft size={18}/> Ruta Electricidad</button>
      <section className="drill-hero">
        <div><span className="eyebrow"><ClipboardCheck size={18}/> BLOQUE 2 · ENTRENADOR</span><h1>Entrenador de cálculos</h1><p>Ocho problemas cortos para convertir la teoría en reflejo. Escribe únicamente el valor numérico; la unidad ya está indicada.</p></div>
        <div className="drill-score"><span>DOMINIO ACTUAL</span><strong>{correctCount}/{problems.length}</strong><p>{correctCount === problems.length ? 'Excelente. Los ocho cálculos son correctos.' : 'Comprueba cada ejercicio y usa la pista solo si la necesitas.'}</p></div>
      </section>

      <div className="drill-grid">
        {problems.map((problem, index) => {
          const value = Number(answers[problem.id])
          const validNumber = answers[problem.id] !== undefined && answers[problem.id] !== '' && Number.isFinite(value)
          const correct = validNumber && Math.abs(value - problem.answer) <= Math.max(0.01, Math.abs(problem.answer) * 0.01)
          return (
            <article className={`drill-card ${checked[problem.id] ? (correct ? 'correct' : 'wrong') : ''}`} key={problem.id}>
              <div className="drill-card-top"><span className="drill-number">{String(index + 1).padStart(2, '0')}</span><span className="drill-type">{problem.type.toUpperCase()}</span></div>
              <h3>{problem.title}</h3>
              <p>{problem.prompt}</p>
              <div className="answer-row"><input type="number" step="any" value={answers[problem.id] ?? ''} onChange={(e: any) => { setAnswers({...answers, [problem.id]: e.target.value}); setChecked({...checked, [problem.id]: false}) }} placeholder="Tu respuesta"/><span>{problem.unit}</span><button onClick={() => checkOne(problem.id)}>Comprobar</button></div>
              {checked[problem.id] && <div className={`drill-feedback ${correct ? 'correct' : 'wrong'}`}>{correct ? <><CheckCircle2 size={20}/> Correcto.</> : <><Wrench size={20}/> Revisa: {problem.hint}</>}</div>}
              <details><summary>Ver pista</summary><p>{problem.hint}</p></details>
            </article>
          )
        })}
      </div>

      <div className="drill-footer">
        <div><span className="eyebrow">OBJETIVO</span><h2>8/8 sin depender de las pistas</h2><p>Cuando puedas resolverlos con seguridad, Ley de Ohm y potencia dejan de ser fórmulas aisladas y empiezan a convertirse en herramientas.</p></div>
        <div className="drill-footer-actions"><button className="ghost-btn" onClick={reset}>Reiniciar ejercicios</button><button className="primary-btn" onClick={() => setView('polarity')}>Continuar con circuitos <ArrowRight size={20}/></button></div>
      </div>
    </div>
  )
}

function NumberField({ label, value, setValue, unit, step = 1 }: { label: string; value: number; setValue: (value: number) => void; unit: string; step?: number }) {
  return <label className="number-field"><span>{label}</span><div><input type="number" step={step} min="0" value={value} onChange={(e: any) => setValue(Math.max(0, Number(e.target.value)))} /><strong>{unit}</strong></div></label>
}

function nearestPreferredResistor(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0
  const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82]
  const candidates: number[] = []
  for (let decade = 1; decade <= 100000; decade *= 10) {
    e12.forEach(base => candidates.push(base * decade / 10))
  }
  return candidates.reduce((best, candidate) => Math.abs(candidate - value) <= Math.abs(best - value) ? candidate : best, candidates[0])
}

function WorkedExample({ number, title, steps, result }: { number: string; title: string; steps: string[]; result: string }) {
  return <div className="worked-example"><span className="worked-number">EJEMPLO {number}</span><h3>{title}</h3><ol>{steps.map(step => <li key={step}>{step}</li>)}</ol><strong className="worked-result">{result}</strong></div>
}

function Concept({ icon, number, title, analogy, text }: { icon: ReactNode; number: string; title: string; analogy: string; text: string }) {
  return <div className="concept-row"><div className="concept-number">{number}</div><div className="concept-icon">{icon}</div><div><div className="concept-title"><h3>{title}</h3><span>{analogy}</span></div><p>{text}</p></div></div>
}

function PracticeView({ setView, checked, setChecked, done, setDone, masteryMap, setMasteryMap }: { setView: (v: View) => void; checked: string[]; setChecked: (v: string[]) => void; done: boolean; setDone: (v: boolean) => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const masteryKey = 'electricity-practice-stage1'
  const practiceLevel = masteryMap[masteryKey] || (done ? 2 : 0)
  const [step, setStep] = useState(1)
  const [assemblyStep, setAssemblyStep] = useState(1)
  const [switchOn, setSwitchOn] = useState(false)
  const allReady = materials.every(m => checked.includes(m.id))
  const toggle = (id: string) => setChecked(checked.includes(id) ? checked.filter(x => x !== id) : [...checked, id])
  return (
    <div className="page-wrap compact">
      <button className="back-link" onClick={() => setView('diagrams')}><ArrowLeft size={16}/> Volver a diagramas</button>
      <section className="practice-head">
        <div><span className="eyebrow"><Hammer size={15}/> PRÁCTICA 01 · BAJA TENSIÓN</span><h1>Construye tu primer circuito</h1><p>Enciende un LED usando pilas, una resistencia y un interruptor. Ahora el montaje se muestra también sobre una protoboard realista, agujero por agujero.</p></div>
        <div className="practice-badge"><ShieldCheck size={22}/><div><strong>Práctica segura</strong><span>Fuente recomendada: 3 V</span></div></div>
      </section>

      <div className="practice-layout">
        <section className="practice-main">
          <div className="practice-tabs"><button className={step === 1 ? 'active' : ''} onClick={() => setStep(1)}>1 · Preparar</button><button className={step === 2 ? 'active' : ''} onClick={() => setStep(2)}>2 · Conectar</button><button className={step === 3 ? 'active' : ''} onClick={() => setStep(3)}>3 · Comprobar</button></div>
          {step === 1 && <div className="practice-stage"><span className="eyebrow">PASO 1</span><h2>Reúne el material</h2><p className="stage-intro">Marca lo que ya tienes. Este inventario se guarda en tu navegador para futuras prácticas.</p><div className="material-list">{materials.map(m => <button key={m.id} className={`material-item ${checked.includes(m.id) ? 'checked' : ''}`} onClick={() => toggle(m.id)}><span className="check-box">{checked.includes(m.id) && <Check size={15}/>}</span><span><strong>{m.label}</strong><small>{m.detail}</small></span></button>)}</div><div className={`ready-banner ${allReady ? 'ready' : ''}`}>{allReady ? <CheckCircle2 size={20}/> : <Box size={20}/>}<span>{allReady ? '¡Material completo! Ya puedes pasar al armado.' : `Te faltan ${materials.length - checked.length} elementos para tener el kit completo.`}</span></div><button className="primary-btn stage-next" disabled={!allReady} onClick={() => setStep(2)}>Comenzar armado <ArrowRight size={18}/></button></div>}
          {step === 2 && <div className="practice-stage"><span className="eyebrow">PASO 2</span><h2>Arma el circuito sobre la protoboard</h2><div className="safety-callout"><ShieldCheck size={22}/><div><strong>Regla de taller</strong><p>Haz todo el montaje con las pilas fuera del portapilas o con la fuente desconectada. Energiza únicamente después de revisar cada conexión.</p></div></div><BreadboardGuide step={assemblyStep} setStep={setAssemblyStep}/><div className="schematic-bridge"><div><span className="eyebrow">DEL ESQUEMA AL MONTAJE</span><h3>El circuito eléctrico sigue siendo el mismo</h3></div><div className="wiring-diagram compact-wiring"><div className="wd-component battery"><Battery size={28}/><span>2×AA</span></div><ArrowRight/><div className="wd-component"><PlugZap size={25}/><span>Interruptor</span></div><ArrowRight/><div className="wd-component"><Activity size={25}/><span>220–330 Ω</span></div><ArrowRight/><div className="wd-component"><Lightbulb size={25}/><span>LED</span></div><ArrowRight/><div className="wd-component return"><span>Retorno</span></div></div></div><button className="primary-btn stage-next" onClick={() => setStep(3)}>Ya revisé las 6 conexiones <ArrowRight size={18}/></button></div>}
          {step === 3 && <div className="practice-stage"><span className="eyebrow">PASO 3</span><h2>Comprueba el resultado</h2><p className="stage-intro">Ahora sí coloca las pilas y usa el interruptor. Pulsa abajo lo que observas en tu montaje.</p><div className={`physical-test ${switchOn ? 'on' : ''}`}><div className="test-bulb"><Lightbulb size={54}/></div><button onClick={() => setSwitchOn(!switchOn)}><span/>{switchOn ? 'Apagar simulación' : 'Encender simulación'}</button></div><div className="diagnostic-grid"><button className={`diagnostic-card success ${done ? 'selected' : ''}`} onClick={() => setDone(true)}><CheckCircle2 size={22}/><strong>{done ? 'Práctica completada' : 'Mi LED encendió'}</strong><span>{done ? 'Habilidad 8 registrada' : 'Registrar resultado esperado'}</span></button><button className="diagnostic-card"><Wrench size={22}/><strong>No encendió</strong><span>Revisa polaridad, columnas y continuidad del riel.</span></button></div><div className="completion-card"><BadgeCheck size={28}/><div><strong>Evidencia de dominio</strong><p>Cuando el LED encienda, intenta explicar en voz alta el recorrido: riel positivo → interruptor → resistencia → ánodo → cátodo → riel negativo.</p></div></div></div>}
        </section>
        <aside className="practice-aside"><div className="aside-card"><span className="eyebrow">OBJETIVO</span><h3>Qué debes aprender</h3><ul className="check-list"><li><Check size={15}/>Entender qué agujeros están conectados internamente</li><li><Check size={15}/>Cruzar la ranura central con el LED</li><li><Check size={15}/>Respetar ánodo y cátodo</li><li><Check size={15}/>Trabajar sin energizar durante el armado</li></ul></div><div className="aside-card danger-outline"><span className="eyebrow">IMPORTANTE</span><h3>Las protoboards cambian</h3><p>Algunas tienen rieles de alimentación partidos en la mitad o una distribución distinta. Sigue las marcas +/– impresas y, cuando tengas multímetro, confirma continuidad antes de asumir que todo el riel está unido.</p></div><div className="aside-card"><span className="eyebrow">NO HAGAS ESTO</span><h3>No uses un contacto doméstico</h3><p>Esta práctica está diseñada exclusivamente para pilas o una fuente DC de baja tensión. No adaptes el ejercicio para conectarlo a 127 V.</p></div></aside>
      </div>
      <section className="electric-practice-mastery"><span className="eyebrow">NIVEL DE TRANSFERENCIA</span><h3>Repite hasta poder hacerlo sin receta.</h3><div>{[2,3,4].map(level => <button key={level} className={practiceLevel >= level ? 'active' : ''} onClick={() => { setMasteryMap({ ...masteryMap, [masteryKey]: level as MasteryLevel }); if (level >= 2) setDone(true) }}>{masteryLabels[level]}</button>)}</div><button className="evidence-btn" onClick={() => setView('inspector')}><Camera size={17}/> Guardar evidencia / revisar foto</button></section>
    </div>
  )
}

function BreadboardGuide({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const cols = Array.from({ length: 30 }, (_, i) => i + 1)
  const rows = ['A','B','C','D','E','F','G','H','I','J']
  const rowY: Record<string, number> = { A: 150, B: 174, C: 198, D: 222, E: 246, F: 314, G: 338, H: 362, I: 386, J: 410 }
  const xFor = (col: number) => 90 + (col - 1) * 23
  const steps = [
    { n: 1, title: 'Alimenta los rieles', text: 'Portapilas: rojo al riel + y negro al riel –.' },
    { n: 2, title: 'Puentea el positivo', text: 'Jumper rojo: riel + → E5.' },
    { n: 3, title: 'Coloca el interruptor', text: 'Terminales del interruptor: A5 → A8.' },
    { n: 4, title: 'Coloca la resistencia', text: 'Resistencia de 220–330 Ω: C8 → C12.' },
    { n: 5, title: 'Coloca el LED', text: 'Ánodo (pata larga) en E12; cátodo en F12.' },
    { n: 6, title: 'Cierra el retorno', text: 'Jumper negro: J12 → riel –.' },
  ]
  const opacity = (n: number) => step >= n ? 1 : .12
  return (
    <div className="breadboard-guide">
      <div className="breadboard-head"><div><span className="eyebrow">GUÍA VISUAL · PROTOBOARD</span><h3>Montaje exacto por filas y columnas</h3><p>Este ejemplo usa una protoboard estándar con grupos A–E y F–J. Los cinco agujeros de una misma columna están conectados entre sí dentro de cada mitad; la ranura central separa ambas mitades.</p></div><span className="breadboard-step-badge">Paso {step} de 6</span></div>
      <div className="breadboard-canvas-wrap">
        <svg className="breadboard-svg" viewBox="0 0 980 500" role="img" aria-label="Diagrama de una protoboard con portapilas, interruptor, resistencia y LED">
          <rect x="48" y="28" width="742" height="442" rx="22" className="bb-body"/>
          <rect x="62" y="48" width="714" height="72" rx="12" className="bb-rail-area"/>
          <line x1="80" y1="68" x2="758" y2="68" className="bb-rail plus"/>
          <line x1="80" y1="102" x2="758" y2="102" className="bb-rail minus"/>
          <text x="64" y="74" className="bb-plus-label">+</text><text x="64" y="108" className="bb-minus-label">−</text>
          {cols.map(col => <g key={`rail-${col}`}><circle cx={xFor(col)} cy="68" r="4" className="bb-hole rail-hole"/><circle cx={xFor(col)} cy="102" r="4" className="bb-hole rail-hole"/></g>)}
          <rect x="62" y="130" width="714" height="302" rx="12" className="bb-main-area"/>
          <rect x="62" y="270" width="714" height="20" rx="6" className="bb-gutter"/>
          {cols.map(col => <text key={`num-${col}`} x={xFor(col)} y="139" textAnchor="middle" className={`bb-col-label ${[5,8,12].includes(col) ? 'important' : ''}`}>{col % 5 === 0 || [5,8,12].includes(col) ? col : ''}</text>)}
          {rows.map(row => <text key={`row-${row}`} x="70" y={rowY[row] + 4} textAnchor="middle" className="bb-row-label">{row}</text>)}
          {rows.map(row => cols.map(col => <circle key={`${row}${col}`} cx={xFor(col)} cy={rowY[row]} r="4.2" className={`bb-hole ${[5,8,12].includes(col) ? 'focus-hole' : ''}`}/>))}

          <g opacity={opacity(1)}>
            <rect x="825" y="154" width="118" height="144" rx="18" className="bb-battery"/>
            <text x="884" y="205" textAnchor="middle" className="bb-battery-title">2 × AA</text>
            <text x="850" y="245" className="bb-battery-plus">+</text><text x="912" y="245" className="bb-battery-minus">−</text>
            <path d={`M 850 238 C 820 130, 770 68, ${xFor(2)} 68`} className="bb-wire red"/>
            <path d={`M 912 238 C 835 350, 790 102, ${xFor(2)} 102`} className="bb-wire black"/>
          </g>
          <g opacity={opacity(2)}><path d={`M ${xFor(5)} 68 C ${xFor(5)-28} 95, ${xFor(5)-28} 220, ${xFor(5)} ${rowY.E}`} className="bb-wire red jumper"/><circle cx={xFor(5)} cy={rowY.E} r="8" className="bb-node red-node"/></g>
          <g opacity={opacity(3)}><circle cx={xFor(5)} cy={rowY.A} r="8" className="bb-component-pin"/><circle cx={xFor(8)} cy={rowY.A} r="8" className="bb-component-pin"/><line x1={xFor(5)+7} y1={rowY.A-2} x2={xFor(8)-8} y2={rowY.A-18} className="bb-switch-blade"/><text x={(xFor(5)+xFor(8))/2} y={rowY.A-30} textAnchor="middle" className="bb-component-label">INTERRUPTOR</text></g>
          <g opacity={opacity(4)}><line x1={xFor(8)} y1={rowY.C} x2={xFor(8)+20} y2={rowY.C} className="bb-lead"/><rect x={xFor(8)+20} y={rowY.C-9} width={xFor(12)-xFor(8)-40} height="18" rx="6" className="bb-resistor"/><line x1={xFor(12)-20} y1={rowY.C} x2={xFor(12)} y2={rowY.C} className="bb-lead"/><text x={(xFor(8)+xFor(12))/2} y={rowY.C-17} textAnchor="middle" className="bb-component-label">220–330 Ω</text></g>
          <g opacity={opacity(5)}><line x1={xFor(12)} y1={rowY.E} x2={xFor(12)} y2="274" className="bb-lead"/><circle cx={xFor(12)} cy="280" r="18" className="bb-led"/><line x1={xFor(12)} y1="298" x2={xFor(12)} y2={rowY.F} className="bb-lead"/><text x={xFor(12)+30} y="278" className="bb-led-label">LED</text><text x={xFor(12)+30} y="296" className="bb-led-polarity">E12 ánodo ↑ · F12 cátodo ↓</text></g>
          <g opacity={opacity(6)}><path d={`M ${xFor(12)} ${rowY.J} C ${xFor(18)} 458, ${xFor(19)} 190, ${xFor(18)} 102`} className="bb-wire black jumper"/><circle cx={xFor(12)} cy={rowY.J} r="8" className="bb-node black-node"/></g>
        </svg>
      </div>
      <div className="breadboard-legend"><span><i className="legend-hole"/>A–E de una misma columna = un nodo</span><span><i className="legend-hole"/>F–J = otro nodo separado</span><span><i className="legend-gutter"/>La ranura central no conecta E con F</span></div>
      <div className="assembly-steps">{steps.map(item => <button key={item.n} className={step === item.n ? 'active' : step > item.n ? 'done' : ''} onClick={() => setStep(item.n)}><span>{step > item.n ? <Check size={15}/> : item.n}</span><div><strong>{item.title}</strong><small>{item.text}</small></div></button>)}</div>
      <div className="breadboard-note"><ShieldCheck size={20}/><p><strong>Antes de energizar:</strong> comprueba que E12 y F12 estén en lados opuestos de la ranura, que el LED no esté invertido y que ningún jumper una directamente los rieles + y –.</p></div>
    </div>
  )
}

function kindLabel(type: string) {
  return type === 'theory' ? 'CONCEPTO' : type === 'calc' ? 'CÁLCULO' : type === 'tool' ? 'HERRAMIENTA' : 'PRÁCTICA'
}

function ElectricityLibraryView({ setView, setSelectedStage, setSelectedTopicId, done }: { setView: (v: View) => void; setSelectedStage: (n: number) => void; setSelectedTopicId: (id: string) => void; done: string[] }) {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState(0)
  const filtered = electricityTopics.filter(topic => {
    const matchesStage = stage === 0 || topic.stage === stage
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || `${topic.title} ${topic.category} ${topic.summary} ${topic.concepts.join(' ')}`.toLowerCase().includes(q)
    return matchesStage && matchesQuery
  })

  const openTopic = (topic: ElectricityTopic) => {
    setSelectedStage(topic.stage)
    setSelectedTopicId(topic.id)
    setView('topic')
  }

  return (
    <div className="page-wrap compact electricity-library-page">
      <button className="back-link" onClick={() => setView('electricity')}><ArrowLeft size={17}/> Ruta Electricidad</button>

      <section className="library-hero">
        <div className="library-hero-copy">
          <span className="eyebrow"><BookOpen size={17}/> BLOQUE 5 · BIBLIOTECA MAESTRA</span>
          <h1>Electricidad: material completo</h1>
          <p>Las 9 etapas y 101 competencias ya están cargadas. Puedes avanzar en orden, practicar por etapa y cerrar con el Proyecto Maestro residencial.</p>
          <div className="library-hero-stats">
            <div><strong>101</strong><span>competencias</span></div>
            <div><strong>9</strong><span>etapas</span></div>
            <div><strong>{done.length}</strong><span>estudiadas</span></div>
            <div><strong>10</strong><span>fichas expertas</span></div>
          </div>
        </div>
        <div className="library-safety-card">
          <ShieldCheck size={30}/>
          <span className="eyebrow">REGLA DE LA RUTA</span>
          <h3>Todo el conocimiento está abierto; el riesgo no.</h3>
          <p>Teoría, cálculo, diagramas y diseño están disponibles desde ahora. Las prácticas autónomas siguen limitadas a baja tensión; red doméstica, tableros, motores y strings fotovoltaicos se marcan como práctica supervisada.</p>
        </div>
      </section>

      <section className="library-controls">
        <label className="library-search">
          <span>Buscar en Electricidad</span>
          <input value={query} onChange={(e: any) => setQuery(e.target.value)} placeholder="Ej. multímetro, caída de tensión, motores, solar..." />
        </label>
        <div className="stage-filter" role="tablist" aria-label="Filtrar por etapa">
          <button className={stage === 0 ? 'active' : ''} onClick={() => setStage(0)}>Todas</button>
          {stageGuides.map(item => <button key={item.number} className={stage === Number(item.number) ? 'active' : ''} onClick={() => setStage(Number(item.number))}>{item.number}</button>)}
        </div>
      </section>

      <div className="library-stage-summary">
        {(stage === 0 ? stageGuides : stageGuides.filter(item => Number(item.number) === stage)).map(item => (
          <article key={item.number}>
            <span className="library-stage-number">{item.number}</span>
            <div><span className="eyebrow">{item.level}</span><h2>{item.title}</h2><p>{item.summary}</p><small><Hammer size={14}/> Proyecto: {item.project}</small></div>
          </article>
        ))}
      </div>

      <section className="topic-library-section">
        <div className="section-heading compact-heading"><div><span className="eyebrow">LECCIONES DISPONIBLES</span><h2>{filtered.length} temas encontrados</h2></div><p>Las tarjetas son compactas; el contenido de estudio mantiene texto de 16 px o más.</p></div>
        <div className="topic-library-grid">
          {filtered.map(topic => {
            const guide = stageGuides[topic.stage - 1]
            const isDone = done.includes(topic.id)
            return (
              <button className={`topic-library-card ${isDone ? 'done' : ''}`} key={topic.id} onClick={() => openTopic(topic)}>
                <div className="topic-card-meta"><span>ETAPA {String(topic.stage).padStart(2, '0')}</span><span>{topic.category}</span></div>
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
                <div className="topic-card-foot"><span className={`safety-tag ${topic.safety}`}>{safetyLabel(topic.safety)}</span><span>{guide.level}</span>{isDone ? <CheckCircle2 size={17}/> : <ChevronRight size={17}/>}</div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="expert-sheets-section">
        <div className="section-heading compact-heading"><div><span className="eyebrow">FICHAS DE TALLER</span><h2>Referencia rápida</h2></div><p>Úsalas como recordatorio después de estudiar las lecciones completas.</p></div>
        <div className="expert-sheets-grid">
          {expertSheets.map(sheet => <article className="expert-sheet" key={sheet.title}><span className="sheet-pin"/><h3>{sheet.title}</h3><ul>{sheet.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}
        </div>
      </section>

      <section className="standards-note">
        <div><ShieldCheck size={24}/><div><span className="eyebrow">REFERENCIA PROFESIONAL · MÉXICO</span><h3>La ruta está pensada para estudiar el oficio con marco técnico real.</h3></div></div>
        <p>La biblioteca separa aprendizaje autónomo de intervención profesional. Para instalaciones de utilización se debe consultar la normativa vigente aplicable al proyecto; para seguridad de mantenimiento se requieren procedimientos formales de control de energía y personal competente.</p>
      </section>
    </div>
  )
}

function ElectricityTopicView({ setView, setSelectedStage, topicId, setSelectedTopicId, done, setDone, masteryMap, setMasteryMap }: { setView: (v: View) => void; setSelectedStage: (n: number) => void; topicId: string; setSelectedTopicId: (id: string) => void; done: string[]; setDone: (ids: string[]) => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const topic = electricityTopics.find(item => item.id === topicId) || electricityTopics[0]
  const stageTopics = electricityTopics.filter(item => item.stage === topic.stage)
  const stageIndex = stageTopics.findIndex(item => item.id === topic.id)
  const stage = stageGuides[topic.stage - 1]
  const isDone = done.includes(topic.id)
  const safety = safetyCopy(topic.safety)
  const masteryKey = `electricity-skill-${topic.id}`
  const topicLevel = masteryMap[masteryKey] || (isDone ? 1 : 0)

  const goTopic = (nextIndex: number) => {
    const next = stageTopics[Math.max(0, Math.min(stageTopics.length - 1, nextIndex))]
    setSelectedTopicId(next.id)
    setSelectedStage(next.stage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToStage = () => {
    setSelectedStage(topic.stage)
    setView(topic.stage === 1 ? 'electricity' : 'stage')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDone = () => {
    const next = !isDone
    setDone(next ? [...done, topic.id] : done.filter(id => id !== topic.id))
    setMasteryMap({ ...masteryMap, [masteryKey]: next ? Math.max(1, topicLevel) as MasteryLevel : 0 })
  }

  return (
    <div className="topic-study-shell">
      <div className="topic-study-topline">
        <button className="back-link" onClick={backToStage}><ArrowLeft size={17}/> Etapa {topic.stage}: {stage.title}</button>
        <div><span>Etapa {topic.stage} · Lección {stageIndex + 1} de {stageTopics.length}</span><div className="topic-progress-track"><span style={{ width: `${((stageIndex + 1) / stageTopics.length) * 100}%` }}/></div></div>
      </div>

      <div className="topic-study-grid">
        <article className="topic-study-article">
          <header className="topic-study-header">
            <div className="topic-study-meta"><span className="eyebrow">ETAPA {String(topic.stage).padStart(2, '0')} · {stage.title.toUpperCase()}</span><span className={`safety-tag ${topic.safety}`}>{safetyLabel(topic.safety)}</span></div>
            <h1>{topic.title}</h1>
            <p>{topic.summary}</p>
          </header>

          <section className="learning-outcomes">
            <span className="section-kicker">AL TERMINAR PODRÁS</span>
            <div className="outcome-grid">{topic.concepts.map(concept => <div key={concept}><CheckCircle2 size={19}/><span>{concept}</span></div>)}</div>
          </section>

          <section className="lesson-section deep-theory-section">
            <span className="section-kicker">TEORÍA · MODELO MENTAL</span>
            <h2>Cómo debes pensar este tema</h2>
            <p className="lead-paragraph">{topic.summary}</p>
            <p>Para dominar <strong>{topic.title.toLowerCase()}</strong> no basta con reconocer el término. Necesitas relacionarlo con las demás variables del sistema, predecir qué debería ocurrir y después comprobar esa predicción con cálculo, simulación o medición apropiada.</p>
            <div className="concept-depth-grid">
              {topic.concepts.map((concept, i) => <div key={concept}><span>{String(i + 1).padStart(2, '0')}</span><p>{concept}</p></div>)}
            </div>
            {topic.formula && <div className="formula-ribbon"><Calculator size={22}/><div><small>RELACIÓN CLAVE</small><strong>{topic.formula}</strong></div></div>}
          </section>

          <section className="lesson-section">
            <span className="section-kicker">EJEMPLO RAZONADO</span>
            <h2>Llévalo a una situación concreta</h2>
            <div className="reasoned-example"><span>CASO</span><p>{topic.example}</p><div className="example-method"><strong>Método OficiosLab</strong><ol><li>Identifica qué sabes y qué falta.</li><li>Predice el resultado antes de medir o calcular.</li><li>Comprueba y compara contra lo esperado.</li><li>Si no coincide, explica qué supuesto pudo fallar.</li></ol></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">PRÁCTICA / TRANSFERENCIA</span>
            <h2>Convierte teoría en habilidad</h2>
            <div className={`practice-transfer-card ${topic.safety}`}><Hammer size={26}/><div><p>{topic.practice}</p><small>{safety.practiceNote}</small></div></div>
          </section>

          <section className="lesson-section">
            <span className="section-kicker">ERRORES FRECUENTES</span>
            <h2>Lo que quiero que aprendas a detectar</h2>
            <div className="mistake-card"><Wrench size={24}/><div><p>{topic.mistakes}</p><strong>Pregunta de control:</strong><span>¿Qué medición, dato o evidencia usarías para demostrar que tu conclusión es correcta?</span></div></div>
          </section>

          <section className="topic-checkpoint">
            <div><span className="eyebrow">CONTROL DE PROGRESO</span><h2>¿Ya puedes explicarlo sin leer?</h2><p>Marcar una lección no certifica competencia. Significa que ya estudiaste el material y puedes pasar a ejercicios, simulación y práctica correspondiente.</p><small className="topic-mastery-label">Nivel actual: <strong>{masteryLabels[topicLevel]}</strong></small></div>
            <button className={`complete-btn ${isDone ? 'completed' : ''}`} onClick={toggleDone}>{isDone ? <><CheckCircle2 size={20}/> Estudiada</> : <><Check size={20}/> Marcar como estudiada</>}</button>
          </section>

          <div className="topic-nav">
            <button disabled={stageIndex === 0} onClick={() => goTopic(stageIndex - 1)}><ArrowLeft size={18}/><span><small>ANTERIOR</small>{stageIndex > 0 ? stageTopics[stageIndex - 1].title : 'Inicio de etapa'}</span></button>
            <button disabled={stageIndex === stageTopics.length - 1} onClick={() => goTopic(stageIndex + 1)}><span><small>SIGUIENTE</small>{stageIndex < stageTopics.length - 1 ? stageTopics[stageIndex + 1].title : 'Fin de etapa'}</span><ArrowRight size={18}/></button>
          </div>
        </article>

        <aside className="topic-study-aside">
          <div className={`study-safety-panel ${topic.safety}`}><ShieldCheck size={25}/><span className="eyebrow">NIVEL DE PRÁCTICA</span><h3>{safety.title}</h3><p>{safety.text}</p></div>
          <div className="study-stage-panel"><span className="eyebrow">ETAPA {stage.number}</span><h3>{stage.title}</h3><p>{stage.summary}</p><div><Hammer size={16}/><span><small>PROYECTO DE ETAPA</small><strong>{stage.project}</strong></span></div></div>
          <div className="study-index-panel"><span className="eyebrow">EN ESTA ETAPA</span>{electricityTopics.filter(item => item.stage === topic.stage).map(item => <button key={item.id} className={item.id === topic.id ? 'active' : ''} onClick={() => { setSelectedTopicId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span>{item.order}</span>{item.title}{done.includes(item.id) && <CheckCircle2 size={15}/>}</button>)}</div>
        </aside>
      </div>
    </div>
  )
}


function tradeSkillKey(routeId: string, stageNumber: string, index: number) {
  return `${routeId}-s${stageNumber}-k${index + 1}`
}

function tradePracticeKey(routeId: string, stageNumber: string, index: number) {
  return `${routeId}-s${stageNumber}-p${index + 1}`
}

function tradeSafetyLabel(level: 'safe' | 'design' | 'supervised') {
  if (level === 'safe') return 'Práctica autónoma'
  if (level === 'design') return 'Diseño / análisis'
  return 'Práctica supervisada'
}

function tradeRouteStats(route: TradeRoute) {
  return {
    skills: route.stages.reduce((sum, stage) => sum + stage.skills.length, 0),
    practices: route.stages.reduce((sum, stage) => sum + stage.practices.length, 0),
    projects: route.stages.length,
  }
}

function TradeRouteView({ routeId, setView, setStage, skillDone, practiceDone }: { routeId: string; setView: (v: View) => void; setStage: (n: number) => void; skillDone: string[]; practiceDone: string[] }) {
  const route = getTradeRoute(routeId) || tradeRoutes[0]
  const meta = routes.find(item => item.id === route.id) || routes[1]
  const Icon = meta.icon
  const stats = tradeRouteStats(route)
  const routeSkillDone = skillDone.filter(id => id.startsWith(`${route.id}-`)).length
  const routePracticeDone = practiceDone.filter(id => id.startsWith(`${route.id}-`)).length
  const learningProgress = Math.round(((routeSkillDone + routePracticeDone) / Math.max(1, stats.skills + stats.practices)) * 100)

  const openStage = (index: number) => {
    setStage(index + 1)
    setView('trade-stage')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="page-wrap compact trade-route-page">
    <button className="back-link" onClick={() => setView('home')}><ArrowLeft size={17}/> Todas las rutas</button>

    <section className="trade-route-hero">
      <div className={`trade-hero-icon tone-${meta.tone}`}><Icon size={34}/></div>
      <div className="trade-hero-copy">
        <span className="eyebrow">RUTA PROFESIONAL · DOMINIO PRÁCTICO</span>
        <h1>{route.name}</h1>
        <p>{route.target}</p>
        <div className="trade-hero-metrics">
          <span><strong>{stats.skills}</strong> competencias</span>
          <span><strong>{stats.practices}</strong> prácticas guiadas</span>
          <span><strong>{stats.projects}</strong> proyectos de etapa</span>
        </div>
      </div>
      <div className="trade-route-progress-card">
        <small>PROGRESO FORMATIVO</small><strong>{learningProgress}%</strong>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${learningProgress}%` }}/></div>
        <span>{routeSkillDone} competencias estudiadas · {routePracticeDone} prácticas hechas</span>
      </div>
    </section>

    <section className="mastery-contract">
      <div><BadgeCheck size={28}/><div><span className="eyebrow">ESTÁNDAR OFICIOSLAB</span><h2>Leer no basta para decir “yo puedo hacerlo bien”.</h2></div></div>
      <div className="mastery-contract-steps">
        <span><b>01</b><strong>Entender</strong><small>Explicar sin copiar</small></span>
        <span><b>02</b><strong>Practicar</strong><small>Ejecutar con guía</small></span>
        <span><b>03</b><strong>Repetir</strong><small>Lograr consistencia</small></span>
        <span><b>04</b><strong>Diagnosticar</strong><small>Corregir errores</small></span>
        <span><b>05</b><strong>Integrar</strong><small>Proyecto completo</small></span>
      </div>
      <p><ShieldCheck size={17}/>{route.safetyNote}</p>
    </section>

    <section className="trade-stage-map">
      <div className="section-heading"><div><span className="eyebrow">MAPA DE DOMINIO</span><h2>{route.stages.length} etapas, cada una con práctica real.</h2></div><p>Las tarjetas no son simples módulos de lectura: cada etapa termina en prácticas verificables y un proyecto de integración.</p></div>
      <div className="trade-stage-grid">
        {route.stages.map((stage, index) => {
          const skillKeys = stage.skills.map((_, i) => tradeSkillKey(route.id, stage.number, i))
          const practiceKeys = stage.practices.map((_, i) => tradePracticeKey(route.id, stage.number, i))
          const doneSkills = skillKeys.filter(id => skillDone.includes(id)).length
          const donePractices = practiceKeys.filter(id => practiceDone.includes(id)).length
          const pct = Math.round(((doneSkills + donePractices) / Math.max(1, stage.skills.length + stage.practices.length)) * 100)
          return <button className="trade-stage-card" key={stage.number} onClick={() => openStage(index)}>
            <div className="trade-stage-card-top"><span>{stage.number}</span><small>{stage.level}</small><strong>{pct}%</strong></div>
            <h3>{stage.title}</h3><p>{stage.summary}</p>
            <div className="trade-stage-card-stats"><span><BookOpen size={14}/>{stage.skills.length} competencias</span><span><Hammer size={14}/>{stage.practices.length} prácticas</span></div>
            <div className="trade-stage-progress"><i style={{ width: `${pct}%` }}/></div>
            <div className="trade-stage-project"><small>PROYECTO</small><strong>{stage.project}</strong><ChevronRight size={17}/></div>
          </button>
        })}
      </div>
    </section>
  </div>
}

function TradeStageView({ routeId, stageNumber, setStage, setView, skillDone, setSkillDone, practiceDone, setPracticeDone, masteryMap, setMasteryMap, openSkill, openAssessment, openInspector }: { routeId: string; stageNumber: number; setStage: (n: number) => void; setView: (v: View) => void; skillDone: string[]; setSkillDone: (ids: string[]) => void; practiceDone: string[]; setPracticeDone: (ids: string[]) => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void; openSkill: (index: number) => void; openAssessment: () => void; openInspector: () => void }) {
  const route = getTradeRoute(routeId) || tradeRoutes[0]
  const safeIndex = Math.max(0, Math.min(route.stages.length - 1, stageNumber - 1))
  const stage = route.stages[safeIndex]
  const skillKeys = stage.skills.map((_, i) => tradeSkillKey(route.id, stage.number, i))
  const practiceKeys = stage.practices.map((_, i) => tradePracticeKey(route.id, stage.number, i))
  const doneSkills = skillKeys.filter(id => skillDone.includes(id)).length
  const donePractices = practiceKeys.filter(id => practiceDone.includes(id)).length
  const pct = Math.round(((doneSkills + donePractices) / Math.max(1, stage.skills.length + stage.practices.length)) * 100)
  const projectKey = `${route.id}-${stage.number}-project`
  const projectIntegrated = (masteryMap[projectKey] || 0) >= 5

  const openStage = (n: number) => { setStage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const setMastery = (id: string, level: MasteryLevel) => setMasteryMap({ ...masteryMap, [id]: level })
  const togglePractice = (id: string) => {
    const nextDone = !practiceDone.includes(id)
    setPracticeDone(nextDone ? [...practiceDone, id] : practiceDone.filter(item => item !== id))
    setMastery(id, nextDone ? Math.max(2, masteryMap[id] || 0) as MasteryLevel : 0)
  }

  return <div className="page-wrap compact trade-stage-page">
    <button className="back-link" onClick={() => setView('trade-route')}><ArrowLeft size={17}/> Ruta {route.name}</button>

    <nav className="trade-stage-switcher" aria-label="Cambiar etapa">
      {route.stages.map((item, index) => <button className={index === safeIndex ? 'active' : ''} key={item.number} onClick={() => openStage(index + 1)}><span>{item.number}</span><small>{item.title}</small></button>)}
    </nav>

    <section className="trade-stage-hero">
      <div className="trade-stage-number">{stage.number}</div>
      <div><span className="eyebrow">{route.name.toUpperCase()} · {stage.level.toUpperCase()}</span><h1>{stage.title}</h1><p>{stage.summary}</p></div>
      <div className="trade-stage-score"><strong>{pct}%</strong><span>{doneSkills}/{stage.skills.length} estudiadas · {donePractices}/{stage.practices.length} prácticas</span><div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }}/></div></div>
    </section>

    <section className="trade-principles">
      <div className="section-heading"><div><span className="eyebrow">MODELO MENTAL</span><h2>Principios que debes poder explicar</h2></div><p>No los marques como “aprendidos” por leerlos una vez. Úsalos para justificar decisiones durante las prácticas.</p></div>
      <div className="trade-principle-grid">{stage.principles.map((principle, index) => <article key={principle}><span>{String(index + 1).padStart(2, '0')}</span><p>{principle}</p></article>)}</div>
    </section>

    <div className="trade-stage-body">
      <section className="trade-skill-section">
        <div className="panel-heading"><div><span className="eyebrow">COMPETENCIAS</span><h2>Qué tienes que manejar</h2></div><span className="difficulty-pill">{stage.level.toUpperCase()}</span></div>
        <p className="panel-intro">Marca una competencia como estudiada solo cuando puedas explicarla, reconocer un error típico y relacionarla con una práctica de esta etapa.</p>
        <div className="trade-skill-grid">
          {stage.skills.map((skill, index) => {
            const id = skillKeys[index]
            const isDone = skillDone.includes(id)
            const level = masteryMap[id] || (isDone ? 1 : 0)
            return <button className={`trade-skill-item ${isDone ? 'done' : ''}`} key={id} onClick={() => openSkill(index)}><span>{isDone ? <Check size={16}/> : String(index + 1).padStart(2, '0')}</span><strong>{skill}</strong><small>{level ? masteryLabels[level] : 'Abrir lección completa'}</small><ChevronRight size={16}/></button>
          })}
        </div>
      </section>

      <aside className="trade-stage-side">
        <div className="aside-card stage-project-card"><span className="eyebrow">PROYECTO DE CIERRE</span><Hammer size={28}/><h3>{stage.project}</h3><p>El proyecto es la prueba de integración. No cuenta como completado por haber leído las competencias.</p></div>
        <div className="aside-card safety-card"><ShieldCheck size={24}/><div><span className="eyebrow">LÍMITE DE SEGURIDAD</span><h3>Competencia antes que riesgo</h3><p>{route.safetyNote}</p></div></div>
      </aside>
    </div>

    <section className="trade-practice-lab">
      <div className="stage-practices-heading"><div><span className="eyebrow">LABORATORIO DE ETAPA</span><h2>{stage.practices.length} prácticas para convertir teoría en oficio</h2><p>Repite las prácticas hasta que el resultado sea consistente. Una primera ejecución con ayuda es aprendizaje, no dominio.</p></div><div className="practice-counter"><strong>{donePractices}/{stage.practices.length}</strong><span>completadas</span></div></div>
      <div className="trade-practice-grid">
        {stage.practices.map((practice, index) => {
          const id = practiceKeys[index]
          const done = practiceDone.includes(id)
          return <article className={`trade-practice-card ${done ? 'done' : ''}`} key={id}>
            <div className="trade-practice-top"><span>{String(index + 1).padStart(2, '0')}</span><small className={`trade-safety ${practice.safety}`}>{tradeSafetyLabel(practice.safety)}</small></div>
            <h3>{practice.title}</h3>
            <div className="trade-practice-field"><small>OBJETIVO</small><p>{practice.objective}</p></div>
            <div className="trade-practice-field"><small>EVIDENCIA / ENTREGABLE</small><p>{practice.deliverable}</p></div>
            <div className="trade-practice-method"><b>1</b><span>Prepara materiales y criterio de éxito.</span><b>2</b><span>Ejecuta con guía la primera vez.</span><b>3</b><span>Repite sin mirar instrucciones.</span><b>4</b><span>Introduce o diagnostica un defecto y documenta evidencia.</span></div>
            <div className="practice-mastery-row">
              {[2,3,4].map(level => <button key={level} className={(masteryMap[id] || 0) >= level ? 'active' : ''} onClick={() => { setMastery(id, level as MasteryLevel); if (!practiceDone.includes(id)) setPracticeDone([...practiceDone, id]) }}>{masteryLabels[level]}</button>)}
            </div>
            <div className="practice-actions"><button className={done ? 'complete-btn completed' : 'complete-btn'} onClick={() => togglePractice(id)}>{done ? <><CheckCircle2 size={18}/> Registrada</> : <><Hammer size={18}/> Registrar guiada</>}</button><button className="evidence-btn" onClick={openInspector}><Camera size={17}/> Evidencia / foto</button></div>
          </article>
        })}
      </div>
    </section>

    <section className={`trade-capstone ${projectIntegrated ? 'integrated' : ''}`}><div><span className="eyebrow light">CAPSTONE DE ETAPA</span><h2>{stage.project}</h2><p>Cuando completes competencias y prácticas, haz este proyecto sin seguir instrucciones paso a paso. Si necesitas mirar cada paso, todavía estás en entrenamiento.</p><button className="capstone-complete" onClick={() => setMastery(projectKey, projectIntegrated ? 0 : 5)}>{projectIntegrated ? <><CheckCircle2 size={17}/> Integración registrada</> : <><BadgeCheck size={17}/> Registrar integración demostrada</>}</button></div><BadgeCheck size={44}/></section>

    <section className="stage-exam-strip"><div><span className="eyebrow">EVALUACIÓN SIN RECETA</span><h3>Demuestra que puedes decidir, diagnosticar y justificar.</h3><p>Recibirás un caso abierto de esta etapa. No te damos los pasos: debes proponerlos y contrastarlos con una rúbrica.</p></div><button onClick={openAssessment}>Iniciar evaluación <ArrowRight size={17}/></button></section>

    <div className="stage-bottom-nav">
      <button disabled={safeIndex === 0} onClick={() => openStage(safeIndex)}><ArrowLeft size={17}/><span><small>ETAPA ANTERIOR</small>{safeIndex > 0 ? route.stages[safeIndex - 1].title : 'Inicio'}</span></button>
      {safeIndex < route.stages.length - 1 ? <button onClick={() => openStage(safeIndex + 2)}><span><small>SIGUIENTE ETAPA</small>{route.stages[safeIndex + 1].title}</span><ArrowRight size={17}/></button> : <button onClick={() => setView('trade-route')}><span><small>RUTA COMPLETA</small>Volver al mapa</span><BadgeCheck size={17}/></button>}
    </div>
  </div>
}


function TradeLessonView({ routeId, stageNumber, skillIndex, setView, skillDone, setSkillDone, masteryMap, setMasteryMap }: { routeId: string; stageNumber: number; skillIndex: number; setView: (v: View) => void; skillDone: string[]; setSkillDone: (ids: string[]) => void; masteryMap: Record<string, MasteryLevel>; setMasteryMap: (v: Record<string, MasteryLevel>) => void }) {
  const route = getTradeRoute(routeId) || tradeRoutes[0]
  const stage = route.stages[Math.max(0, Math.min(route.stages.length - 1, stageNumber - 1))]
  const safeSkillIndex = Math.max(0, Math.min(stage.skills.length - 1, skillIndex))
  const skill = stage.skills[safeSkillIndex]
  const key = tradeSkillKey(route.id, stage.number, safeSkillIndex)
  const lesson = buildTradeLesson(route, stage, skill, safeSkillIndex)
  const level = masteryMap[key] || (skillDone.includes(key) ? 1 : 0)
  const [check, setCheck] = useState([false, false, false])

  const markStudied = () => {
    if (!skillDone.includes(key)) setSkillDone([...skillDone, key])
    setMasteryMap({ ...masteryMap, [key]: Math.max(1, level) as MasteryLevel })
  }

  return <div className="page-wrap lesson-page trade-lesson-page">
    <button className="back-link" onClick={() => setView('trade-stage')}><ArrowLeft size={17}/> {route.name} · {stage.title}</button>
    <header className="deep-lesson-hero">
      <div><span className="eyebrow">{route.name.toUpperCase()} · COMPETENCIA {String(safeSkillIndex + 1).padStart(2,'0')}</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></div>
      <div className="mastery-badge"><small>NIVEL ACTUAL</small><strong>{masteryLabels[level]}</strong><span>{stage.level}</span></div>
    </header>

    <section className="lesson-reading-grid">
      <article className="lesson-main-card"><span className="eyebrow">POR QUÉ IMPORTA</span><h2>Entiende el problema antes de memorizar el procedimiento</h2><p>{lesson.why}</p><div className="lesson-example"><strong>Ejemplo aplicado</strong><p>{lesson.example}</p></div></article>
      <aside className="aside-card safety-card"><ShieldCheck size={24}/><div><span className="eyebrow">LÍMITE DE SEGURIDAD</span><h3>Aprender no elimina el riesgo</h3><p>{route.safetyNote}</p></div></aside>
    </section>

    <section className="deep-concepts"><span className="eyebrow">MODELO MENTAL</span><h2>Cuatro ideas que deben guiar tus decisiones</h2><div className="deep-concept-grid">{lesson.principles.map((item,i)=><article key={item}><span>{String(i+1).padStart(2,'0')}</span><p>{item}</p></article>)}</div></section>

    <section className="technical-depth"><div><span className="eyebrow">DETALLE TÉCNICO</span><h2>Lo que conecta esta habilidad con el oficio completo</h2></div>{lesson.technical.map((item,i)=><article key={item}><span>{String(i+1).padStart(2,'0')}</span><p>{item}</p></article>)}</section>

    <section className="method-section"><div><span className="eyebrow">MÉTODO DE TRABAJO</span><h2>Cómo pensar esta competencia en campo</h2></div><div className="method-timeline">{lesson.method.map((item,i)=><article key={item}><b>{i+1}</b><p>{item}</p></article>)}</div></section>

    <section className="lesson-reading-grid">
      <article className="mistakes-panel"><span className="eyebrow">ERRORES FRECUENTES</span><h2>Lo que debes aprender a detectar</h2>{lesson.mistakes.map((m,i)=><div key={m}><X size={17}/><span><b>Error {i+1}</b>{m}</span></div>)}</article>
      <article className="transfer-panel"><span className="eyebrow">TRANSFERENCIA</span><h2>No cierres la lección leyendo</h2><p>{lesson.transfer}</p><button onClick={() => setView('trade-stage')}>Ir a las prácticas <Hammer size={17}/></button></article>
    </section>

    <section className="knowledge-check"><div><span className="eyebrow">COMPROBACIÓN</span><h2>Márcala solo si realmente puedes responder</h2></div><div className="knowledge-check-list">{lesson.checks.map((item,i)=><label key={item}><input type="checkbox" checked={check[i]} onChange={() => setCheck(check.map((v,j)=>j===i?!v:v))}/><span>{item}</span></label>)}</div><button className="primary-btn" disabled={!check.every(Boolean)} onClick={markStudied}>{level >= 1 ? <><CheckCircle2 size={18}/> Competencia estudiada</> : <><BadgeCheck size={18}/> Registrar como estudiada</>}</button></section>
  </div>
}

function AssessmentView({ routeId, stageNumber, setView }: { routeId: string; stageNumber: number; setView: (v: View) => void }) {
  let route: TradeRoute
  let stage: TradeStage
  if (routeId === 'electricity') {
    const guide = stageGuides[Math.max(0, Math.min(stageGuides.length - 1, stageNumber - 1))]
    const topics = electricityTopics.filter(t => t.stage === stageNumber)
    route = { id: 'electricity', name: 'Electricidad', subtitle: '', target: '', safetyNote: 'En red eléctrica y trabajos con riesgo significativo, usa simulación, banco didáctico o supervisión competente.', stages: [] }
    stage = { number: guide.number, title: guide.title, level: guide.level, summary: guide.summary, principles: topics.slice(0,3).map(t => t.summary), skills: topics.map(t=>t.title), practices: [], project: guide.project }
  } else {
    route = getTradeRoute(routeId) || tradeRoutes[0]
    stage = route.stages[Math.max(0, Math.min(route.stages.length - 1, stageNumber - 1))]
  }
  const exam = buildStageAssessment(route, stage)
  const [answers, setAnswers] = useState(['','','',''])
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const complete = answers.every(a => a.trim().length >= 30)

  const evaluate = async () => {
    setLoading(true)
    const prompt = `Actúa como evaluador de OficiosLab. Evalúa una respuesta de formación en ${route.name}, etapa ${stage.title}. No certifiques seguridad ni competencia profesional. Usa esta rúbrica: ${exam.rubric.join('; ')}. Caso: ${exam.scenario}. Respuestas del alumno:\n${answers.map((a,i)=>`${i+1}. ${a}`).join('\n')}\nDevuelve: fortalezas, huecos concretos, 3 preguntas de seguimiento y una puntuación orientativa 0-100 explicada.`
    let evaluation = ''
    try {
      evaluation = await askOficiosAi(prompt)
    } catch {
      evaluation = `Modo de autoevaluación local. Revisa tu respuesta contra esta rúbrica:\n\n${exam.rubric.map((r,i)=>`${i+1}. ${r}`).join('\n')}\n\nUna respuesta sólida debe incluir decisiones justificadas, mediciones o evidencia, diagnóstico de causas y límites claros de seguridad. Si alguna respuesta depende de “yo creo” sin decir cómo comprobarlo, todavía hay una brecha.`
    }
    setFeedback(evaluation)
    try { await saveAssessmentAttempt({ routeId, stageNumber, answers, feedback: evaluation }) } catch {}
    setLoading(false)
  }

  return <div className="page-wrap compact assessment-page">
    <button className="back-link" onClick={() => setView(routeId === 'electricity' ? 'stage' : 'trade-stage')}><ArrowLeft size={17}/> Volver a la etapa</button>
    <section className="assessment-hero"><div><span className="eyebrow">EVALUACIÓN PRÁCTICA · SIN RECETA</span><h1>{exam.title}</h1><p>{exam.scenario}</p></div><ClipboardCheck size={54}/></section>
    <div className="assessment-layout"><section className="assessment-questions">{exam.prompts.map((p,i)=><article key={p}><span>{String(i+1).padStart(2,'0')}</span><h3>{p}</h3><textarea value={answers[i]} onChange={e=>setAnswers(answers.map((a,j)=>j===i?e.target.value:a))} placeholder="Responde con decisiones, medidas, comprobaciones y límites..."/></article>)}</section><aside className="assessment-rubric"><span className="eyebrow">RÚBRICA</span><h3>Qué debe aparecer en una respuesta competente</h3>{exam.rubric.map(r=><p key={r}><Check size={16}/>{r}</p>)}<button className="primary-btn" disabled={!complete || loading} onClick={evaluate}>{loading ? 'Evaluando...' : 'Evaluar intento'}</button><small>Con OPENAI_API_KEY configurada, la retroalimentación usa IA. Sin ella, funciona la rúbrica local.</small></aside></div>
    {feedback && <section className="ai-feedback"><span className="eyebrow">RETROALIMENTACIÓN</span><pre>{feedback}</pre></section>}
  </div>
}

async function askOficiosAi(prompt: string, imageDataUrl?: string) {
  const response = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, imageDataUrl }) })
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'IA no disponible')
  return data.text as string
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function InspectorView({ setView }: { setView: (v: View) => void }) {
  const routeOptions = [{ id: 'electricity', name: 'Electricidad' }, ...tradeRoutes.map(r => ({ id: r.id, name: r.name }))]
  const [routeId, setRouteId] = useState('electricity')
  const [stageIndex, setStageIndex] = useState(0)
  const [practiceTitle, setPracticeTitle] = useState('Práctica libre')
  const [notes, setNotes] = useState('')
  const [materialsUsed, setMaterialsUsed] = useState('')
  const [errorsFound, setErrorsFound] = useState('')
  const [corrections, setCorrections] = useState('')
  const [attempt, setAttempt] = useState(1)
  const [result, setResult] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const trade = routeId === 'electricity' ? null : getTradeRoute(routeId)
  const stages = routeId === 'electricity' ? stageGuides.map(g => ({ title: g.title })) : (trade?.stages || [])
  const stageTitle = stages[Math.max(0, Math.min(stages.length - 1, stageIndex))]?.title || 'Etapa libre'

  const onPhoto = async (file?: File) => {
    if (!file) return
    setPhoto(file); setPreview(await fileToDataUrl(file)); setSaved(false)
  }
  const inspect = async () => {
    if (!photo) return
    setLoading(true); setSaved(false)
    const prompt = `Eres Inspector IA de OficiosLab. Revisa SOLO lo visible en la foto de una práctica de ${routeOptions.find(r=>r.id===routeId)?.name}, etapa ${stageTitle}. El usuario dice: ${notes || 'sin notas'}. Materiales declarados: ${materialsUsed || 'no indicados'}. Errores que ya detectó: ${errorsFound || 'ninguno declarado'}. Correcciones aplicadas: ${corrections || 'ninguna declarada'}. No certifiques que una instalación es segura ni que cumple norma a partir de una foto. Separa claramente: 1) Lo que sí se observa, 2) posibles defectos visibles, 3) lo que NO puede verificarse por foto, 4) mediciones/comprobaciones que el alumno debe hacer, 5) prioridad de correcciones. Si hay posible riesgo, indica detenerse y usar supervisión competente.`
    try { setResult(await askOficiosAi(prompt, preview)) }
    catch { setResult(`INSPECCIÓN GUIADA LOCAL\n\nSin conexión de IA no puedo inferir defectos visuales de la foto. Úsala como evidencia y comprueba manualmente:\n• geometría, alineación o recorrido;\n• fijaciones/uniones visibles;\n• daños, bordes, fugas o terminaciones;\n• medidas contra tu criterio de aceptación;\n• condición segura antes de tocar o energizar.\n\nNotas del trabajo: ${notes || 'sin notas'}.\n\nPara análisis visual automático, configura OPENAI_API_KEY en .env.`) }
    finally { setLoading(false) }
  }
  const save = async () => {
    if (!photo) return
    await saveEvidence({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), routeId, routeName: routeOptions.find(r=>r.id===routeId)?.name || routeId, stageTitle, practiceTitle, notes, materials: materialsUsed, errors: errorsFound, corrections, attempt, result, mastery: 2, photo })
    setSaved(true)
  }

  return <div className="page-wrap compact inspector-page">
    <section className="tool-hero"><div><span className="eyebrow">INSPECTOR IA</span><h1>Convierte cada práctica en evidencia revisable.</h1><p>Sube una foto, añade contexto y recibe una revisión visual cuando la IA esté configurada. El inspector nunca sustituye mediciones, norma, cálculo ni una inspección profesional.</p></div><Camera size={58}/></section>
    <div className="inspector-grid"><section className="inspector-form"><label>Oficio<select value={routeId} onChange={e=>{setRouteId(e.target.value);setStageIndex(0)}}>{routeOptions.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label><label>Etapa<select value={stageIndex} onChange={e=>setStageIndex(Number(e.target.value))}>{stages.map((s,i)=><option value={i} key={`${s.title}-${i}`}>{i+1}. {s.title}</option>)}</select></label><label>Práctica<input value={practiceTitle} onChange={e=>setPracticeTitle(e.target.value)}/></label><div className="inspector-mini-grid"><label>Intento<input type="number" min="1" value={attempt} onChange={e=>setAttempt(Math.max(1,Number(e.target.value)||1))}/></label><label>Materiales usados<input value={materialsUsed} onChange={e=>setMaterialsUsed(e.target.value)} placeholder="Herramientas y materiales"/></label></div><label>¿Qué hiciste y qué quieres revisar?<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Medidas, resultado esperado, duda concreta..."/></label><div className="inspector-mini-grid"><label>Errores detectados<textarea value={errorsFound} onChange={e=>setErrorsFound(e.target.value)} placeholder="Qué salió mal o qué sospechas"/></label><label>Correcciones realizadas<textarea value={corrections} onChange={e=>setCorrections(e.target.value)} placeholder="Qué cambiaste y por qué"/></label></div><label className="photo-drop"><Camera size={24}/><strong>{photo ? photo.name : 'Seleccionar fotografía'}</strong><span>JPG, PNG o WEBP</span><input type="file" accept="image/*" onChange={e=>onPhoto(e.target.files?.[0])}/></label><div className="inspector-actions"><button className="primary-btn" disabled={!photo || loading} onClick={inspect}>{loading ? 'Analizando...' : 'Analizar evidencia'}</button><button className="secondary-btn" disabled={!photo} onClick={save}>{saved ? 'Guardada ✓' : 'Guardar en portafolio'}</button></div></section><aside className="inspector-preview">{preview ? <img src={preview} alt="Evidencia de práctica"/> : <div className="empty-photo"><Camera size={44}/><p>Tu fotografía aparecerá aquí.</p></div>}{result && <pre>{result}</pre>}</aside></div>
  </div>
}

function TutorView({ setView }: { setView: (v: View) => void }) {
  const [routeId, setRouteId] = useState('electricity')
  const [stageIndex, setStageIndex] = useState(0)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const trade = routeId === 'electricity' ? null : getTradeRoute(routeId)
  const stages = routeId === 'electricity' ? stageGuides.map(g=>({ title:g.title, summary:g.summary })) : (trade?.stages || [])
  const stage = stages[Math.max(0, Math.min(stages.length-1, stageIndex))]
  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    const context = routeId === 'electricity' ? `Electricidad, etapa ${stage?.title}. ${stage?.summary}` : `${trade?.name}, etapa ${(stage as TradeStage)?.title}. ${(stage as TradeStage)?.summary}. Principios: ${(stage as TradeStage)?.principles?.join('; ')}`
    const prompt = `Eres Maestro IA de OficiosLab. Enseña de forma práctica y clara. Contexto: ${context}. Pregunta: ${question}. Responde en español con: explicación, ejemplo, cómo comprobarlo, error frecuente y siguiente práctica. Si implica riesgo alto, no des instrucciones para trabajar energizado o intervenir elementos estructurales sin supervisión; propón simulación o banco didáctico.`
    try { setAnswer(await askOficiosAi(prompt)) }
    catch { setAnswer(routeId === 'electricity' ? `Modo Maestro local: relaciona tu duda con el principio, la medición y el error que debes descartar. En electricidad, no modifiques conexiones con la fuente activa. Para una respuesta generativa completa configura OPENAI_API_KEY.\n\nTu pregunta: ${question}` : localTutorAnswer(question, trade || undefined, stage as TradeStage)) }
    finally { setLoading(false) }
  }
  return <div className="page-wrap compact tutor-page"><section className="tool-hero"><div><span className="eyebrow">MAESTRO IA</span><h1>Pregunta mientras estudias o mientras una práctica no sale.</h1><p>El tutor usa el contexto del oficio y etapa. Sin API también ofrece respuestas locales basadas en la ruta.</p></div><Sparkles size={58}/></section><div className="tutor-layout"><aside className="tutor-context"><label>Oficio<select value={routeId} onChange={e=>{setRouteId(e.target.value);setStageIndex(0)}}><option value="electricity">Electricidad</option>{tradeRoutes.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label><label>Etapa<select value={stageIndex} onChange={e=>setStageIndex(Number(e.target.value))}>{stages.map((s,i)=><option key={`${s.title}-${i}`} value={i}>{i+1}. {s.title}</option>)}</select></label><div className="context-card"><small>CONTEXTO ACTUAL</small><strong>{stage?.title}</strong><p>{(stage as any)?.summary}</p></div></aside><section className="tutor-chat"><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ejemplo: mi medición no coincide con el cálculo, ¿qué debo revisar primero?"/><button className="primary-btn" disabled={!question.trim() || loading} onClick={ask}><Send size={17}/>{loading ? 'Pensando...' : 'Preguntar al Maestro'}</button>{answer && <div className="tutor-answer"><pre>{answer}</pre></div>}</section></div></div>
}

function PortfolioView({ setView }: { setView: (v: View) => void }) {
  const [entries, setEntries] = useState<EvidenceEntry[]>([])
  const [urls, setUrls] = useState<Record<string,string>>({})
  const reload = async () => {
    const rows = await listEvidence()
    setEntries(rows)
    const next: Record<string,string> = {}
    rows.forEach(row => { if (row.photoUrl) next[row.id] = row.photoUrl; else if (row.photo) next[row.id] = URL.createObjectURL(row.photo) })
    setUrls(next)
  }
  useEffect(() => { reload(); return () => Object.values(urls).forEach(url => URL.revokeObjectURL(url)) }, [])
  const remove = async (id:string) => { await deleteEvidence(id); await reload() }
  return <div className="page-wrap compact portfolio-page"><section className="tool-hero"><div><span className="eyebrow">PORTAFOLIO DE PRÁCTICAS</span><h1>Tu progreso tiene que dejar evidencia.</h1><p>Guarda fotografías, contexto, resultado e inspecciones. Esto convierte “ya lo vi” en un historial real de ejecuciones y correcciones.</p></div><ClipboardCheck size={58}/></section><div className="portfolio-stats"><article><strong>{entries.length}</strong><span>evidencias</span></article><article><strong>{new Set(entries.map(e=>e.routeId)).size}</strong><span>oficios con evidencia</span></article><article><strong>{entries.filter(e=>e.result).length}</strong><span>revisiones registradas</span></article></div>{entries.length===0 ? <section className="empty-portfolio"><Camera size={38}/><h2>Todavía no tienes evidencia guardada.</h2><p>Abre Inspector IA después de una práctica y guarda al menos una foto con notas.</p><button onClick={()=>setView('inspector')}>Abrir Inspector</button></section> : <div className="portfolio-grid">{entries.map(entry=><article key={entry.id}>{urls[entry.id] && <img src={urls[entry.id]} alt={entry.practiceTitle}/>}<div className="portfolio-card-body"><small>{entry.routeName} · {entry.stageTitle}</small><h3>{entry.practiceTitle}</h3><p>{entry.notes || 'Sin notas'}</p><div className="portfolio-meta-list"><span><b>Intento</b>{entry.attempt || 1}</span><span><b>Materiales</b>{entry.materials || 'No registrados'}</span><span><b>Errores</b>{entry.errors || 'No registrados'}</span><span><b>Correcciones</b>{entry.corrections || 'No registradas'}</span></div>{entry.result && <details><summary>Ver revisión</summary><pre>{entry.result}</pre></details>}<footer><span>{new Date(entry.createdAt).toLocaleDateString()}</span><button onClick={()=>remove(entry.id)} aria-label="Eliminar evidencia"><Trash2 size={16}/></button></footer></div></article>)}</div>}</div>
}

function MasteryView({ setView, setSelectedTradeId, electricitySkillDone, electricityPracticeDone, tradeSkillDone, tradePracticeDone, masteryMap }: { setView: (v: View) => void; setSelectedTradeId: (id: string) => void; electricitySkillDone: number; electricityPracticeDone: number; tradeSkillDone: string[]; tradePracticeDone: string[]; masteryMap: Record<string, MasteryLevel> }) {
  const cards = [
    { id: 'electricity', name: 'Electricidad', skills: totalElectricSkills, practices: stagePractices.length + 1, doneSkills: electricitySkillDone, donePractices: electricityPracticeDone },
    ...tradeRoutes.map(route => { const stats = tradeRouteStats(route); return { id: route.id, name: route.name, skills: stats.skills, practices: stats.practices, doneSkills: tradeSkillDone.filter(id => id.startsWith(`${route.id}-`)).length, donePractices: tradePracticeDone.filter(id => id.startsWith(`${route.id}-`)).length } })
  ]
  const masteryValues = Object.values(masteryMap)
  const unguided = masteryValues.filter(v => v >= 3).length
  const diagnostic = masteryValues.filter(v => v >= 4).length
  const integrated = masteryValues.filter(v => v >= 5).length
  const open = (id: string) => { if (id === 'electricity') setView('electricity'); else { setSelectedTradeId(id); setView('trade-route') }; window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <div className="page-wrap compact mastery-page">
    <section className="mastery-hero">
      <div><span className="eyebrow">CENTRO DE DOMINIO</span><h1>La meta no es terminar contenido.<br/>Es poder ejecutar con criterio.</h1><p>OficiosLab separa cuatro evidencias: conocimiento, práctica repetida, diagnóstico y proyecto integrado. En tareas de alto riesgo se añade experiencia de campo supervisada antes de considerar autonomía.</p></div>
      <BadgeCheck size={76}/>
    </section>

    <section className="mastery-evidence-summary"><article><strong>{masteryValues.length}</strong><span>registros de dominio</span></article><article><strong>{unguided}</strong><span>ejecuciones sin guía</span></article><article><strong>{diagnostic}</strong><span>competencias con diagnóstico</span></article><article><strong>{integrated}</strong><span>integraciones demostradas</span></article><button onClick={() => setView('portfolio')}><Camera size={18}/> Ver portafolio</button></section>

    <section className="mastery-thresholds">
      <article><span>01</span><h3>Conocimiento</h3><p>Puedes explicar principios, unidades, materiales y límites sin leer la respuesta.</p></article>
      <article><span>02</span><h3>Ejecución</h3><p>Realizas la tarea guiada y después la repites con menos ayuda y calidad consistente.</p></article>
      <article><span>03</span><h3>Diagnóstico</h3><p>Reconoces defectos, formulas hipótesis y corriges la causa en vez de improvisar.</p></article>
      <article><span>04</span><h3>Integración</h3><p>Resuelves un proyecto completo con presupuesto, control de calidad y documentación.</p></article>
      <article><span>05</span><h3>Campo</h3><p>Cuando hay riesgo relevante, transfieres la habilidad a obra real con supervisión competente.</p></article>
    </section>

    <section className="mastery-route-section">
      <div className="section-heading"><div><span className="eyebrow">TODAS LAS PROFESIONES</span><h2>El mismo estándar aplica a cada ruta.</h2></div><p>No voy a tratar albañilería, plomería o panel de yeso como cursos decorativos: todas tienen práctica, diagnóstico y proyecto final.</p></div>
      <div className="mastery-route-grid">
        {cards.map(card => {
          const total = card.skills + card.practices
          const done = Math.min(total, card.doneSkills + card.donePractices)
          const pct = Math.round((done / Math.max(1,total)) * 100)
          return <button key={card.id} onClick={() => open(card.id)}><div><strong>{card.name}</strong><span>{card.skills} competencias · {card.practices} prácticas</span></div><b>{pct}%</b><div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }}/></div><small>{card.doneSkills} estudiadas · {card.donePractices} prácticas registradas</small></button>
        })}
      </div>
    </section>

    <section className="mastery-warning"><ShieldCheck size={26}/><div><h3>“Terminé la ruta” no significa automáticamente “ya debo trabajar solo”.</h3><p>En actividades con red eléctrica, estructura, altura, gas, excavación u otros riesgos significativos, el dominio académico/didáctico debe complementarse con práctica de campo supervisada, normativa vigente y responsabilidades profesionales aplicables.</p></div></section>
  </div>
}

function safetyLabel(level: ElectricityTopic['safety']) {
  if (level === 'safe') return 'Práctica autónoma segura'
  if (level === 'theory') return 'Teoría / simulación'
  if (level === 'design') return 'Diseño / cálculo'
  return 'Práctica supervisada'
}

function safetyCopy(level: ElectricityTopic['safety']) {
  if (level === 'safe') return { title: 'Baja tensión / práctica controlada', text: 'Puedes realizar la práctica propuesta con pilas o fuentes limitadas de baja tensión, revisando conexiones antes de energizar.', practiceNote: 'Práctica autónoma: mantén el montaje en baja tensión y desconecta la fuente antes de modificar conexiones.' }
  if (level === 'theory') return { title: 'Aprende y simula primero', text: 'Este contenido se estudia con diagramas, cálculos y simuladores. No necesitas intervenir una instalación real para dominar el concepto.', practiceNote: 'Práctica recomendada: simulación, análisis de fichas técnicas o ejercicios de escritorio.' }
  if (level === 'design') return { title: 'Diseño profesional sin intervención', text: 'Puedes realizar cálculos, planos, selección teórica y documentación. La ejecución real debe validar normativa, condiciones de sitio y responsabilidad técnica.', practiceNote: 'Haz el ejercicio en plano, tabla o simulador. No conviertas un ejemplo de diseño en instrucciones de obra sin validación profesional.' }
  return { title: 'Requiere supervisión competente', text: 'El contenido explica criterio, diagnóstico y secuencia profesional, pero no convierte una intervención de red en una práctica autónoma. Trabajos con tensión peligrosa requieren desenergización, verificación, controles y personal competente.', practiceNote: 'Realiza esta transferencia con simulador, tablero didáctico aislado o supervisión profesional; no trabajes sobre partes energizadas.' }
}

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  BookOpen,
  CreditCard,
  MessageCircleQuestion,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  PhoneCall,
  Smartphone,
  Eye,
  Share2,
  Lock,
  Sparkles,
  Home,
  X
} from 'lucide-react';

export default function App() {
  // Estado de pantalla de bienvenida (Splash)
  const [showWelcome, setShowWelcome] = useState(true);
  // Navegación principal: 'home' | 'simulador' | 'aprender' | 'asistente'
  const [activeTab, setActiveTab] = useState<'home' | 'simulador' | 'aprender' | 'asistente'>('home');
  // Control de lectura en voz alta
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Estados del Simulador de Pago Móvil
  const [banco, setBanco] = useState('0102 - Banco de Venezuela');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monto, setMonto] = useState('');
  const [pagoEstado, setPagoEstado] = useState<'form' | 'alerta_monto' | 'exito'>('form');

  // Estados del Módulo Aprender
  const [guiaSeleccionada, setGuiaSeleccionada] = useState<number | null>(null);

  // Estados del Asistente Rápido
  const [respuestaAsistente, setRespuestaAsistente] = useState<string>(
    '¡Hola! Toca cualquiera de las preguntas de abajo y te explicaré paso a paso con voz tranquila.'
  );

  // Estados del Botón de Auxilio Familiar (Confirmación previa -> Cuenta regresiva -> Enviado)
  const [panicStage, setPanicStage] = useState<'idle' | 'confirm' | 'countdown' | 'sent'>('idle');
  const [countdown, setCountdown] = useState(5);

  // Función de síntesis de voz pausada (Rate 0.9)
  const hablar = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-VE';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeakingText(texto);
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Manejo de cuenta regresiva del botón de auxilio
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (panicStage === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (panicStage === 'countdown' && countdown === 0) {
      setPanicStage('sent');
      hablar('Alerta enviada con éxito a tus familiares de confianza. Mantén la calma, ya van en camino o te llamarán.');
    }
    return () => clearTimeout(timer);
  }, [panicStage, countdown]);

  // Guías prácticas del módulo Aprender
  const guias = [
    {
      id: 1,
      titulo: 'Botones y gestos básicos de tu teléfono',
      resumen: 'Aprende a usar los botones físicos y a moverte por la pantalla sin miedo.',
      icono: Smartphone,
      pasos: [
        'Botón lateral de encendido: Presiónalo una vez corta para encender o apagar la pantalla. Si lo mantienes presionado varios segundos, aparecerá la opción de apagar o reiniciar el teléfono.',
        'Botones de volumen: Están al costado. El de arriba sube el sonido de las llamadas y mensajes; el de abajo lo baja.',
        'Tocar vs. Deslizar: Para abrir algo, da un toque suave y rápido con la yema del dedo. Para leer hacia abajo, apoya el dedo y deslízalo hacia arriba suavemente.',
        'Volver atrás o ir al inicio: En la parte inferior de la pantalla verás una flecha (para regresar un paso) y un círculo o casita (para volver a la pantalla principal si te pierdes).'
      ]
    },
    {
      id: 2,
      titulo: 'Cómo agrandar la letra y mejorar el brillo',
      resumen: 'Configura tu pantalla para leer mensajes y recibos sin forzar la vista.',
      icono: Eye,
      pasos: [
        'Desliza tu dedo desde el borde superior de la pantalla hacia abajo para abrir el panel rápido.',
        'Busca la barra con el dibujo de un sol y muévela hacia la derecha para dar más claridad a la pantalla.',
        'Para letra más grande: Entra en "Ajustes" (el icono de la tuerca), busca "Pantalla" y toca en "Tamaño de fuente".',
        'Mueve el selector hacia la derecha hasta que las palabras se vean grandes y cómodas.'
      ]
    },
    {
      id: 3,
      titulo: 'Identificar mensajes y enlaces falsos',
      resumen: 'Evita estafas por WhatsApp o SMS que prometen bonos o premios.',
      icono: AlertTriangle,
      pasos: [
        'Desconfía de mensajes de números desconocidos que digan "Ganaste un bono" o "Tu cuenta será bloqueada hoy".',
        'Nunca toques enlaces (letras azules) que te pidan ingresar tu cédula, clave del banco o códigos que te llegan por SMS.',
        'Los bancos nunca te llaman ni te escriben por WhatsApp pidiendo tu contraseña ni el código de seguridad.',
        'Si tienes dudas, cierra el mensaje y consulta primero con un familiar de confianza.'
      ]
    },
    {
      id: 4,
      titulo: 'Guardar y enviar comprobantes de pago',
      resumen: 'Cómo tomar captura de pantalla y compartir tu recibo por WhatsApp.',
      icono: Share2,
      pasos: [
        'Al terminar una transferencia o Pago Móvil, espera a que salga el mensaje "Operación Exitosa".',
        'Toca el botón que dice "Compartir comprobante" o presiona al mismo tiempo el botón de bajar volumen y el botón de encendido.',
        'La imagen quedará guardada en tu galería de fotos.',
        'Abre el chat de WhatsApp de la persona, toca el icono del clip o cámara, elige la foto del recibo y envíala.'
      ]
    },
    {
      id: 5,
      titulo: 'Cuidar tus claves y tu dinero',
      resumen: 'Hábitos sencillos para usar la banca digital con total tranquilidad.',
      icono: Lock,
      pasos: [
        'Anota tus claves en una libreta física guardada en casa, nunca en notas abiertas dentro del teléfono.',
        'Verifica siempre dos veces el número de teléfono, la cédula y los ceros del monto antes de confirmar un Pago Móvil.',
        'No hagas operaciones bancarias conectado a redes Wi-Fi públicas de plazas o centros comerciales.'
      ]
    }
  ];

  // Consultas rápidas del Asistente (sin micrófono)
  const preguntasFrecuentes = [
    {
      pregunta: '¿Cómo hago un Pago Móvil sin equivocarme?',
      respuesta:
        'Primero ten a la mano tres datos: el banco, la cédula y el teléfono de la persona. Escríbelos con calma, revisa bien los ceros del monto y antes de aceptar verifica que todos los números coincidan. Puedes practicar aquí mismo en el botón Practicar Pago Móvil.'
    },
    {
      pregunta: 'Me llegó un mensaje diciendo que gané un premio, ¿qué hago?',
      respuesta:
        '¡Ten mucho cuidado! No toques ningún enlace azul ni respondas ese mensaje. Por lo general son intentos de estafa para robar tus datos. Bórralo de inmediato o muéstraselo a un familiar.'
    },
    {
      pregunta: 'Me perdí en el teléfono y no sé cómo salir',
      respuesta:
        'Mantén la calma, no has dañado nada. Mira la parte de abajo de la pantalla de tu celular y toca el botón del medio que tiene forma de círculo o casita. Eso te llevará de vuelta a tu pantalla principal.'
    },
    {
      pregunta: '¿Para qué sirve el botón rojo de Auxilio Familiar?',
      respuesta:
        'Si en algún momento te sientes confundido, crees que cometiste un error con tu dinero o tienes una emergencia, toca el botón rojo de abajo. Te pedirá confirmar y avisará a tus familiares de confianza para que te ayuden.'
    }
  ];

  // Validar envío en el simulador
  const manejarSimulacionPago = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = parseFloat(monto.replace(',', '.'));
    if (!cedula || !telefono || isNaN(valorNumerico) || valorNumerico <= 0) {
      hablar('Por favor completa todos los datos con calma antes de continuar.');
      return;
    }

    // Regla de prevención IA: detectar monto inusualmente alto (> 5000 Bs en práctica)
    if (valorNumerico >= 5000) {
      setPagoEstado('alerta_monto');
      hablar(
        `Atención: Estás intentando enviar ${valorNumerico} bolívares. Es un monto elevado. Verifica que no hayas agregado un cero de más antes de confirmar.`
      );
    } else {
      setPagoEstado('exito');
      hablar('¡Excelente! Has completado tu Pago Móvil de práctica correctamente y sin arriesgar dinero real.');
    }
  };

  // ==========================================
  // PANTALLA DE BIENVENIDA (SPLASH SCREEN)
  // ==========================================
  if (showWelcome) {
    return (
      <div
        onClick={() => {
          setShowWelcome(false);
          hablar('Bienvenido a Conecta Mayor. Toca cualquiera de las opciones grandes en pantalla para comenzar.');
        }}
        className="min-h-screen bg-[#FAF7F2] text-[#0F294A] flex flex-col justify-between items-center p-6 cursor-pointer select-none border-8 border-[#0F294A]"
      >
        <div className="w-full max-w-md text-center pt-6">
          <span className="inline-block bg-[#E6EEF8] text-[#0F294A] border-2 border-[#0F294A] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
            Universidad de las Ciencias • HFM
          </span>
        </div>

        <div className="w-full max-w-md flex flex-col items-center text-center my-auto space-y-6">
          <div className="w-28 h-28 rounded-3xl bg-[#0F294A] text-[#FAF7F2] flex items-center justify-center shadow-lg border-4 border-[#D97706]">
            <Sparkles className="w-14 h-14 text-[#FBBF24]" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F294A]">
              Conecta Mayor
            </h1>
            <p className="text-xl font-medium text-[#334155] leading-relaxed">
              Tu guía sencilla y segura para aprender a usar tu teléfono y realizar pagos sin miedo.
            </p>
          </div>

          <div className="w-full bg-white border-2 border-[#CBD5E1] rounded-2xl p-5 shadow-sm">
            <p className="text-lg font-semibold text-[#0F294A]">
              • Letras grandes y claras
            </p>
            <p className="text-lg font-semibold text-[#0F294A] mt-1">
              • Práctica sin dinero real
            </p>
            <p className="text-lg font-semibold text-[#0F294A] mt-1">
              • Ayuda familiar a un toque
            </p>
          </div>
        </div>

        <div className="w-full max-w-md pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowWelcome(false);
              hablar('Bienvenido a Conecta Mayor.');
            }}
            className="w-full bg-[#0F294A] hover:bg-[#1E3A8A] active:scale-98 text-white text-2xl font-bold py-6 px-6 rounded-2xl shadow-md border-b-4 border-[#D97706] transition"
          >
            Toca aquí para entrar →
          </button>
          <p className="text-center text-sm text-[#475569] mt-3 font-medium">
            Toca en cualquier parte de la pantalla para continuar
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // APLICACIÓN PRINCIPAL (SILVER-UI EDITORIAL)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F294A] flex flex-col font-sans">
      {/* CABECERA SUPERIOR */}
      <header className="bg-[#0F294A] text-white px-4 py-4 shadow-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeTab !== 'home' && (
              <button
                onClick={() => {
                  setActiveTab('home');
                  setGuiaSeleccionada(null);
                  setPagoEstado('form');
                }}
                className="bg-white/15 hover:bg-white/25 p-2.5 rounded-xl flex items-center gap-1.5 text-base font-bold"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="w-6 h-6" />
                <span>Inicio</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none">
                Conecta Mayor
              </h1>
              <p className="text-xs text-amber-300 font-semibold mt-1">
                Inclusión Digital Segura
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              hablar(
                'Estás en Conecta Mayor. Elige una de las tarjetas grandes en pantalla: Practicar Pago Móvil, Guías de Aprendizaje o Preguntas Rápidas.'
              )
            }
            className="bg-[#D97706] hover:bg-[#B45309] text-white px-3.5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow"
          >
            <Volume2 className="w-5 h-5" />
            <span>Escuchar ayuda</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 pb-32 space-y-6">
        {/* VISTA 1: MENÚ PRINCIPAL */}
        {activeTab === 'home' && (
          <>
            <div className="bg-white border-2 border-[#0F294A] rounded-2xl p-5 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#0F294A]">
                ¿Qué deseas hacer hoy?
              </h2>
              <p className="text-lg text-[#334155] mt-1">
                Toca con calma la opción que necesites:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Opción 1: Simulador */}
              <button
                onClick={() => {
                  setActiveTab('simulador');
                  hablar('Simulador de Pago Móvil. Aquí puedes practicar sin usar dinero real.');
                }}
                className="bg-white hover:bg-[#F1F5F9] border-2 border-[#0F294A] border-l-8 border-l-[#0F294A] rounded-2xl p-5 text-left shadow-sm flex items-center gap-4 transition"
              >
                <div className="bg-[#E6EEF8] p-4 rounded-2xl shrink-0">
                  <CreditCard className="w-9 h-9 text-[#0F294A]" />
                </div>
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-extrabold px-2.5 py-0.5 rounded-md mb-1">
                    100% SIN RIESGO
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0F294A]">
                    Practicar Pago Móvil
                  </h3>
                  <p className="text-base text-[#334155] mt-0.5">
                    Ensaya cómo enviar dinero paso a paso sin tocar tu cuenta real.
                  </p>
                </div>
              </button>

              {/* Opción 2: Aprender */}
              <button
                onClick={() => {
                  setActiveTab('aprender');
                  hablar('Centro de Aprendizaje. Elige una guía para aprender a usar tu teléfono y evitar estafas.');
                }}
                className="bg-white hover:bg-[#F1F5F9] border-2 border-[#0F294A] border-l-8 border-l-[#D97706] rounded-2xl p-5 text-left shadow-sm flex items-center gap-4 transition"
              >
                <div className="bg-amber-100 p-4 rounded-2xl shrink-0">
                  <BookOpen className="w-9 h-9 text-[#B45309]" />
                </div>
                <div>
                  <span className="inline-block bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-0.5 rounded-md mb-1">
                    5 GUÍAS FÁCILES
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0F294A]">
                    Aprender y Evitar Estafas
                  </h3>
                  <p className="text-base text-[#334155] mt-0.5">
                    Guías paso a paso para manejar tu celular, agrandar letras y cuidarte.
                  </p>
                </div>
              </button>

              {/* Opción 3: Asistente Rápido (Sin micrófono) */}
              <button
                onClick={() => {
                  setActiveTab('asistente');
                  hablar('Consultas Rápidas. Toca una pregunta en pantalla para escuchar la respuesta.');
                }}
                className="bg-white hover:bg-[#F1F5F9] border-2 border-[#0F294A] border-l-8 border-l-[#0369A1] rounded-2xl p-5 text-left shadow-sm flex items-center gap-4 transition"
              >
                <div className="bg-sky-100 p-4 rounded-2xl shrink-0">
                  <MessageCircleQuestion className="w-9 h-9 text-[#0369A1]" />
                </div>
                <div>
                  <span className="inline-block bg-sky-100 text-sky-900 text-xs font-extrabold px-2.5 py-0.5 rounded-md mb-1">
                    RESPUESTAS CON VOZ
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0F294A]">
                    Preguntas Rápidas
                  </h3>
                  <p className="text-base text-[#334155] mt-0.5">
                    Toca una duda común y escucha una explicación clara y pausada.
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* VISTA 2: SIMULADOR DE PAGO MÓVIL */}
        {activeTab === 'simulador' && (
          <div className="bg-white border-2 border-[#0F294A] rounded-2xl p-5 shadow-sm space-y-5">
            <div className="border-b-2 border-[#E2E8F0] pb-4">
              <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-1 rounded-full">
                MODO PRÁCTICA • DINERO FICTICIO
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F294A] mt-2">
                Simulador de Pago Móvil
              </h2>
              <p className="text-base text-[#334155] mt-1">
                Prueba rellenar los datos. Si escribes un monto muy alto (ej. 5000 o más), nuestro sistema te avisará para prevenir errores.
              </p>
            </div>

            {pagoEstado === 'form' && (
              <form onSubmit={manejarSimulacionPago} className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-[#0F294A] mb-1">
                    1. Banco destino:
                  </label>
                  <select
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="w-full p-4 text-lg border-2 border-[#0F294A] rounded-xl bg-[#FAF7F2] font-semibold"
                  >
                    <option>0102 - Banco de Venezuela</option>
                    <option>0105 - Banco Mercantil</option>
                    <option>0108 - Banco Provincial</option>
                    <option>0134 - Banesco</option>
                    <option>0172 - Bancamiga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-[#0F294A] mb-1">
                    2. Cédula de identidad:
                  </label>
                  <input
                    type="number"
                    placeholder="Ejemplo: 12345678"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full p-4 text-xl border-2 border-[#0F294A] rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-[#0F294A] mb-1">
                    3. Número de teléfono:
                  </label>
                  <input
                    type="tel"
                    placeholder="Ejemplo: 04141234567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-4 text-xl border-2 border-[#0F294A] rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-[#0F294A] mb-1">
                    4. Monto en Bolívares (Bs.):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ejemplo: 250"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full p-4 text-xl border-2 border-[#0F294A] rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F294A] hover:bg-[#1E3A8A] text-white text-xl font-extrabold py-5 rounded-2xl shadow mt-2"
                >
                  Verificar y Practicar Envío
                </button>
              </form>
            )}

            {/* Alerta inteligente de monto alto */}
            {pagoEstado === 'alerta_monto' && (
              <div className="bg-amber-50 border-4 border-[#D97706] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 text-[#B45309]">
                  <AlertTriangle className="w-10 h-10 shrink-0" />
                  <h3 className="text-2xl font-extrabold">
                    ¡Detente y revisa el monto!
                  </h3>
                </div>
                <p className="text-lg text-[#0F294A] font-medium leading-relaxed">
                  Escribiste <strong>Bs. {monto}</strong>. Es una cantidad alta. Muchas veces ocurre al presionar un cero de más por error.
                </p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={() => setPagoEstado('form')}
                    className="w-full bg-[#0F294A] text-white text-lg font-bold py-4 rounded-xl"
                  >
                    Corregir el monto
                  </button>
                  <button
                    onClick={() => {
                      setPagoEstado('exito');
                      hablar('Práctica confirmada con éxito.');
                    }}
                    className="w-full bg-white border-2 border-[#0F294A] text-[#0F294A] text-lg font-bold py-4 rounded-xl"
                  >
                    El monto es correcto, continuar práctica
                  </button>
                </div>
              </div>
            )}

            {/* Resultado exitoso */}
            {pagoEstado === 'exito' && (
              <div className="bg-emerald-50 border-4 border-emerald-700 rounded-2xl p-6 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-700 mx-auto" />
                <h3 className="text-2xl font-extrabold text-emerald-950">
                  ¡Práctica Completada con Éxito!
                </h3>
                <p className="text-lg text-emerald-900">
                  Simulaste un Pago Móvil de <strong>Bs. {monto}</strong> al banco <strong>{banco}</strong>. Recuerda que esto es un ensayo y no se descontó dinero real.
                </p>
                <button
                  onClick={() => {
                    setCedula('');
                    setTelefono('');
                    setMonto('');
                    setPagoEstado('form');
                  }}
                  className="w-full bg-emerald-800 text-white text-xl font-bold py-4 rounded-xl"
                >
                  Hacer otra práctica
                </button>
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: APRENDER (CON GUÍAS ÚTILES Y DE MANIPULACIÓN DEL TELÉFONO) */}
        {activeTab === 'aprender' && (
          <div className="space-y-4">
            {guiaSeleccionada === null ? (
              <>
                <div className="bg-white border-2 border-[#0F294A] rounded-2xl p-5">
                  <h2 className="text-2xl font-extrabold text-[#0F294A]">
                    Guías Prácticas Paso a Paso
                  </h2>
                  <p className="text-lg text-[#334155] mt-1">
                    Toca cualquier tema para leerlo o escucharlo en voz alta:
                  </p>
                </div>

                {guias.map((guia) => {
                  const Icono = guia.icono;
                  return (
                    <button
                      key={guia.id}
                      onClick={() => {
                        setGuiaSeleccionada(guia.id);
                        hablar(`${guia.titulo}. ${guia.pasos.join(' ')}`);
                      }}
                      className="w-full bg-white hover:bg-[#F1F5F9] border-2 border-[#0F294A] rounded-2xl p-5 text-left flex items-start gap-4 shadow-sm"
                    >
                      <div className="bg-[#E6EEF8] p-3.5 rounded-xl shrink-0 mt-1">
                        <Icono className="w-8 h-8 text-[#0F294A]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0F294A]">
                          {guia.titulo}
                        </h3>
                        <p className="text-base text-[#334155] mt-1">
                          {guia.resumen}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              (() => {
                const guiaActual = guias.find((g) => g.id === guiaSeleccionada)!;
                return (
                  <div className="bg-white border-2 border-[#0F294A] rounded-2xl p-5 space-y-5">
                    <button
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setGuiaSeleccionada(null);
                      }}
                      className="inline-flex items-center gap-2 text-lg font-bold text-[#0F294A] bg-[#E6EEF8] px-4 py-2 rounded-xl"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Ver todas las guías
                    </button>

                    <h2 className="text-2xl font-extrabold text-[#0F294A]">
                      {guiaActual.titulo}
                    </h2>

                    <button
                      onClick={() => hablar(guiaActual.pasos.join('. '))}
                      className="w-full bg-[#D97706] text-white text-lg font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-6 h-6" />
                      Escuchar esta guía completa
                    </button>

                    <ol className="space-y-4">
                      {guiaActual.pasos.map((paso, idx) => (
                        <li
                          key={idx}
                          className="bg-[#FAF7F2] border-2 border-[#CBD5E1] rounded-xl p-4 flex gap-3.5 items-start"
                        >
                          <span className="bg-[#0F294A] text-white font-extrabold w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg">
                            {idx + 1}
                          </span>
                          <p className="text-lg text-[#0F294A] leading-relaxed font-medium">
                            {paso}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* VISTA 4: CONSULTAS RÁPIDAS (SIN MICRÓFONO, SOLO OPCIONES ESPECÍFICAS) */}
        {activeTab === 'asistente' && (
          <div className="space-y-5">
            <div className="bg-[#0F294A] text-white rounded-2xl p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                  Respuesta de tu Guía Virtual
                </span>
                <button
                  onClick={() => hablar(respuestaAsistente)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  Repetir voz
                </button>
              </div>
              <p className="text-xl leading-relaxed font-medium">
                “{respuestaAsistente}”
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-[#0F294A]">
                Toca una pregunta para ver y escuchar la respuesta:
              </h3>
              {preguntasFrecuentes.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRespuestaAsistente(item.respuesta);
                    hablar(item.respuesta);
                  }}
                  className="w-full bg-white hover:bg-[#E6EEF8] border-2 border-[#0F294A] rounded-2xl p-4 text-left text-lg font-bold text-[#0F294A] shadow-sm transition"
                >
                  {item.pregunta}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA ACADÉMICO */}
      <footer className="bg-[#E2E8F0] border-t-2 border-[#CBD5E1] px-4 py-4 pb-28 text-center text-sm text-[#334155]">
        <p className="font-extrabold text-[#0F294A]">
          Conecta Mayor • Plataforma de Inclusión Digital
        </p>
        <p className="mt-1 font-medium">
          Desarrollado por: Juan Andrés Bermúdez y Sinahy López
        </p>
        <p className="text-xs mt-0.5">
          Universidad Nacional de las Ciencias "Dr. Humberto Fernández-Morán"
        </p>
      </footer>

      {/* BARRA INFERIOR FIJA CON BOTÓN DE AUXILIO FAMILIAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t-4 border-[#0F294A] p-3 z-30 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              setGuiaSeleccionada(null);
            }}
            className="bg-[#E6EEF8] text-[#0F294A] border-2 border-[#0F294A] px-4 py-3.5 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 shrink-0"
          >
            <Home className="w-6 h-6" />
            <span>Menú</span>
          </button>

          <button
            onClick={() => {
              setPanicStage('confirm');
              hablar(
                'Has tocado el botón de auxilio familiar. Lee el mensaje en pantalla y confirma si deseas enviar la alerta.'
              );
            }}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white font-extrabold text-lg py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow"
          >
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <span>Botón de Auxilio Familiar</span>
          </button>
        </div>
      </div>

      {/* MODAL DE AUXILIO FAMILIAR (1. EXPLICACIÓN -> 2. CUENTA REGRESIVA -> 3. ENVIADO) */}
      {panicStage !== 'idle' && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-red-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            {/* PASO 1: MENSAJE EXPLICATIVO Y CONFIRMACIÓN */}
            {panicStage === 'confirm' && (
              <>
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <ShieldAlert className="w-8 h-8" />
                    <h3 className="text-2xl font-extrabold">¿Qué hace este botón?</h3>
                  </div>
                  <button
                    onClick={() => setPanicStage('idle')}
                    className="p-2 text-slate-500 hover:text-slate-800"
                    aria-label="Cerrar"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <div className="space-y-3 text-lg text-[#0F294A] leading-relaxed">
                  <p>
                    Al activar el <strong>Auxilio Familiar</strong>, la aplicación enviará de inmediato un mensaje de alerta y tu ubicación actual a tus familiares de confianza para que te llamen o acudan a ayudarte.
                  </p>
                  <p className="font-bold text-red-800">
                    ¿Estás seguro de que deseas continuar?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCountdown(5);
                      setPanicStage('countdown');
                      hablar('Iniciando cuenta regresiva de 5 segundos para enviar la alerta.');
                    }}
                    className="w-full bg-red-700 hover:bg-red-800 text-white text-xl font-extrabold py-4 rounded-2xl shadow"
                  >
                    Sí, continuar con la alerta
                  </button>
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      setPanicStage('idle');
                    }}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-[#0F294A] text-lg font-bold py-4 rounded-2xl"
                  >
                    No, cancelar y volver
                  </button>
                </div>
              </>
            )}

            {/* PASO 2: CUENTA REGRESIVA DE 5 SEGUNDOS */}
            {panicStage === 'countdown' && (
              <div className="text-center space-y-5 py-2">
                <h3 className="text-2xl font-extrabold text-red-700">
                  Enviando alerta familiar en...
                </h3>
                <div className="w-28 h-28 rounded-full bg-red-100 border-4 border-red-700 flex items-center justify-center mx-auto">
                  <span className="text-5xl font-black text-red-700">
                    {countdown}
                  </span>
                </div>
                <p className="text-lg text-[#334155] font-medium">
                  Si lo presionaste por error, toca el botón de abajo para detenerlo.
                </p>
                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setPanicStage('idle');
                  }}
                  className="w-full bg-[#0F294A] text-white text-xl font-extrabold py-4 rounded-2xl"
                >
                  Detener envío ahora
                </button>
              </div>
            )}

            {/* PASO 3: ALERTA ENVIADA */}
            {panicStage === 'sent' && (
              <div className="text-center space-y-5 py-2">
                <PhoneCall className="w-16 h-16 text-emerald-700 mx-auto" />
                <h3 className="text-2xl font-extrabold text-emerald-900">
                  ¡Alerta Enviada a tus Familiares!
                </h3>
                <p className="text-lg text-[#0F294A] leading-relaxed">
                  Tus contactos de confianza han recibido tu aviso de ayuda y ubicación. Mantén la calma y deja tu teléfono cerca.
                </p>
                <button
                  onClick={() => setPanicStage('idle')}
                  className="w-full bg-[#0F294A] text-white text-xl font-bold py-4 rounded-2xl"
                >
                  Entendido, volver a la aplicación
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

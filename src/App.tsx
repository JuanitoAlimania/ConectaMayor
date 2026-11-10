import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  BookOpen, 
  Mic, 
  MicOff, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  PhoneCall, 
  RefreshCw, 
  Zap, 
  Lock, 
  UserCheck, 
  Award,
  Send,
  Eye,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('home'); // home, payment_sim, learning, panic
  const [highContrast, setHighContrast] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState('large'); // normal, large, xlarge

  // Voice Assistant state
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('¡Hola! Soy Tu Guía Conecta. ¿En qué puedo ayudarte hoy? Toca el micrófono o elige una opción.');
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Pago Móvil Simulator States
  const [simStep, setSimStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    bank: '0102 - Banco de Venezuela',
    phone: '0414-1234567',
    idCard: 'V-12.345.678',
    amount: '50.00',
    concept: 'Compra de medicamentos'
  });
  const [simAlert, setSimAlert] = useState(null);
  const [simSuccess, setSimSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Emergency Modal
  const [panicActive, setPanicActive] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState(5);
  const [panicSent, setPanicSent] = useState(false);

  // Tutorial state
  const [completedLessons, setCompletedLessons] = useState([1]);
  const [activeLesson, setActiveLesson] = useState(null);

  // Web Speech Synthesis
  const speakText = (text) => {
    if (!soundEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; // Slightly slower for elderly users
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initial welcome voice narration
  useEffect(() => {
    speakText("Bienvenido a Conecta Mayor. Tu plataforma de inclusión digital segura.");
  }, []);

  // Panic countdown logic
  useEffect(() => {
    let timer;
    if (panicActive && panicCountdown > 0) {
      timer = setInterval(() => {
        setPanicCountdown((prev) => prev - 1);
      }, 1000);
    } else if (panicActive && panicCountdown === 0) {
      setPanicSent(true);
      setPanicActive(false);
      speakText("Alerta de emergencia enviada a tus familiares registrados.");
    }
    return () => clearInterval(timer);
  }, [panicActive, panicCountdown]);

  // Voice Assistant simulation trigger
  const handleVoiceAssistant = (command = '') => {
    const query = command || voiceQuery;
    setIsListening(true);
    speakText("Escuchando tu petición...");

    setTimeout(() => {
      setIsListening(false);
      let response = "";
      const lower = query.toLowerCase();

      if (lower.includes('pago') || lower.includes('transferir') || lower.includes('dinero')) {
        response = "Te llevaré al Simulador de Pago Móvil para practicar sin ningún riesgo.";
        setActiveTab('payment_sim');
      } else if (lower.includes('aprender') || lower.includes('clase') || lower.includes('curso')) {
        response = "Excelente. Vamos al Centro de Aprendizaje Digital.";
        setActiveTab('learning');
      } else if (lower.includes('emergencia') || lower.includes('ayuda') || lower.includes('familia')) {
        response = "Abriendo el botón de emergencia familiar.";
        triggerPanic();
      } else {
        response = `Entendido. Te muestro las opciones principales para utilizar la aplicación de forma fácil y segura.`;
      }

      setAssistantMessage(response);
      speakText(response);
      setVoiceQuery('');
    }, 1800);
  };

  const triggerPanic = () => {
    setPanicCountdown(5);
    setPanicActive(true);
    setPanicSent(false);
    speakText("Iniciando envío de alerta a tus familiares en 5 segundos. Toca cancelar si fue un error.");
  };

  const cancelPanic = () => {
    setPanicActive(false);
    setPanicSent(false);
    speakText("Alerta de emergencia cancelada.");
  };

  // Step narrator for simulator
  const readSimStepGuide = (stepNumber) => {
    let guideText = "";
    switch(stepNumber) {
      case 1:
        guideText = "Paso 1: Revisa el banco de destino. Asegúrate de que sea el banco correcto de la persona a quien le vas a enviar dinero.";
        break;
      case 2:
        guideText = "Paso 2: Ingresa el número de teléfono celular y la cédula de identidad del beneficiario. Verifica bien cada número.";
        break;
      case 3:
        guideText = "Paso 3: Escribe el monto en Bolívares. Recuerda verificar el punto decimal.";
        break;
      case 4:
        guideText = "Paso 4: Pantalla de Verificación de Seguridad. Comprueba los datos antes de confirmar. ¡Nunca compartas tu clave secreta con nadie!";
        break;
      default:
        guideText = "Simulador listo.";
    }
    speakText(guideText);
  };

  const nextSimStep = () => {
    if (simStep === 3) {
      // Security Check Warning trigger on step 3
      if (parseFloat(paymentData.amount) > 500) {
        setSimAlert("⚠️ Advertencia de Seguridad: El monto es elevado. ¿Estás seguro de enviar esta cantidad?");
      } else {
        setSimAlert(null);
      }
    }
    const next = Math.min(simStep + 1, 4);
    setSimStep(next);
    readSimStepGuide(next);
  };

  const prevSimStep = () => {
    const prev = Math.max(simStep - 1, 1);
    setSimStep(prev);
    readSimStepGuide(prev);
  };

  const handleSimFinish = () => {
    setSimSuccess(true);
    setAttempts(prev => prev + 1);
    speakText("¡Felicidades! Has completado con éxito la práctica de Pago Móvil. No se usó dinero real.");
  };

  const resetSim = () => {
    setSimStep(1);
    setSimSuccess(false);
    setSimAlert(null);
    speakText("Simulador reiniciado. Puedes volver a practicar.");
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'} font-sans flex flex-col justify-between transition-colors duration-300`}>
      
      {/* ACCESSIBILITY TOP NAVIGATION HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow-md border-2 border-amber-200">
              CM
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-amber-300">Conecta Mayor</h1>
              <p className="text-xs text-slate-300 font-medium">Inclusión Digital Segura para el Adulto Mayor</p>
            </div>
          </div>

          {/* Quick Accessibility Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) speakText("Sonido y voz activados");
              }}
              className={`p-3 rounded-xl flex items-center gap-2 font-bold transition-all text-base border-2 ${soundEnabled ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
              aria-label="Activar o desactivar voz"
              title="Voz de Asistencia"
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              <span className="hidden sm:inline">{soundEnabled ? 'Voz Activada' : 'Sin Voz'}</span>
            </button>

            <button 
              onClick={() => {
                setHighContrast(!highContrast);
                speakText(highContrast ? "Modo suave activado" : "Modo alto contraste activado");
              }}
              className="p-3 bg-slate-700 hover:bg-slate-600 text-amber-300 border-2 border-amber-400/40 rounded-xl font-bold text-base flex items-center gap-1"
              title="Cambiar Contraste"
            >
              <Zap size={22} />
              <span className="hidden sm:inline">Contraste</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-grow flex flex-col gap-6">

        {/* VOICE ASSISTANT PERMANENT BANNER / BAR */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/10 border-2 border-amber-400/50 rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-amber-400'} text-slate-950 shadow-lg`}>
              <Mic size={28} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-500/30">Asistente de Voz Inteligente</span>
              <p className="text-lg md:text-xl font-medium mt-1 leading-snug">
                "{assistantMessage}"
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowVoiceModal(true)}
            className="w-full md:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg border-2 border-amber-200 transition-transform active:scale-95"
          >
            <Mic size={24} />
            <span>Hablar con Guía</span>
          </button>
        </div>

        {/* VOICE MODAL INTERACTION */}
        {showVoiceModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border-4 border-amber-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h3 className="text-2xl font-extrabold text-amber-300 flex items-center gap-2">
                  <Mic className="text-amber-400" /> Asistente de Voz Inteligente
                </h3>
                <button 
                  onClick={() => setShowVoiceModal(false)}
                  className="text-slate-400 hover:text-white text-3xl font-bold px-3 py-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-lg text-slate-200">
                Presiona el botón rojo y habla. O presiona uno de los comandos rápidos de abajo:
              </p>

              <div className="flex flex-col items-center justify-center py-4">
                <button
                  onClick={() => handleVoiceAssistant("Quiero hacer una consulta general")}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2 shadow-xl border-4 transition-all ${
                    isListening ? 'bg-red-600 border-red-300 animate-bounce' : 'bg-amber-400 border-amber-200 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  <Mic size={40} />
                  <span className="font-bold text-xs uppercase">{isListening ? 'Escuchando' : 'Toca y Habla'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-400">Preguntas o Comandos Frecuentes:</p>
                <button 
                  onClick={() => {
                    handleVoiceAssistant("Quiero practicar pago móvil");
                    setShowVoiceModal(false);
                  }}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-left font-bold text-amber-300 border border-slate-600 flex items-center gap-3"
                >
                  <Smartphone size={20} /> "Quiero practicar Pago Móvil sin dinero real"
                </button>
                <button 
                  onClick={() => {
                    handleVoiceAssistant("Enseñame a protegerme de estafas");
                    setShowVoiceModal(false);
                  }}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-left font-bold text-amber-300 border border-slate-600 flex items-center gap-3"
                >
                  <ShieldCheck size={20} /> "¿Cómo evito estafas telefónicas o de internet?"
                </button>
                <button 
                  onClick={() => {
                    handleVoiceAssistant("Necesito ayuda de mi familia");
                    setShowVoiceModal(false);
                  }}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-left font-bold text-amber-300 border border-slate-600 flex items-center gap-3"
                >
                  <PhoneCall size={20} /> "Quiero avisar a mi familia que necesito ayuda"
                </button>
              </div>

              <button
                onClick={() => setShowVoiceModal(false)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-lg border border-slate-500"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS (Silver-UI Extra Large Accessible Buttons) */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              speakText("Inicio");
            }}
            className={`p-4 rounded-2xl font-extrabold text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-md ${
              activeTab === 'home' 
                ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105 z-10' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Home size={32} />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('payment_sim');
              readSimStepGuide(simStep);
            }}
            className={`p-4 rounded-2xl font-extrabold text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-md ${
              activeTab === 'payment_sim' 
                ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105 z-10' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Smartphone size={32} />
            <span>Práctica Pago Móvil</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('learning');
              speakText("Centro de Aprendizaje Digital");
            }}
            className={`p-4 rounded-2xl font-extrabold text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-md ${
              activeTab === 'learning' 
                ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105 z-10' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
          >
            <BookOpen size={32} />
            <span>Aprender</span>
          </button>

          <button
            onClick={() => {
              triggerPanic();
            }}
            className="p-4 rounded-2xl font-extrabold text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-4 bg-red-600 hover:bg-red-500 text-white border-red-300 transition-all shadow-md active:scale-95"
          >
            <AlertTriangle size={32} className="animate-bounce" />
            <span>Botón de Auxilio</span>
          </button>
        </nav>

        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <section className="flex flex-col gap-6">
            
            {/* Banner info */}
            <div className="bg-slate-800 border-3 border-amber-400/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="inline-block bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-sm font-bold">
                  Universidad de las Ciencias "Humberto Fernández Morán"
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  Bienvenido a tu Espacio Digital Seguro
                </h2>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  Aquí aprenderás a usar la tecnología a tu propio ritmo, sin miedos, sin riesgos y con la ayuda constante de tu asistente virtual.
                </p>
              </div>

              <div className="w-full md:w-56 bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-center flex flex-col items-center gap-3">
                <ShieldCheck size={48} className="text-emerald-400" />
                <span className="font-bold text-lg text-emerald-400">100% Protegido</span>
                <p className="text-xs text-slate-400">Entorno simulado seguro. Ninguna transacción en esta app utiliza dinero real.</p>
              </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div 
                onClick={() => {
                  setActiveTab('payment_sim');
                  readSimStepGuide(1);
                }}
                className="bg-slate-800 hover:bg-slate-750 border-3 border-amber-400/30 hover:border-amber-400 rounded-3xl p-6 cursor-pointer transition-all shadow-lg flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    <Smartphone size={32} />
                  </div>
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-3 py-1 rounded-full uppercase">Recomendado</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Simulador de Pago Móvil</h3>
                  <p className="text-slate-300 text-base">Practica enviar pagos paso a paso sin gastar dinero real. Pierde el miedo a equivocarte.</p>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-lg group-hover:translate-x-1 transition-transform">
                  <span>Iniciar Práctica</span>
                  <ArrowRight size={20} />
                </div>
              </div>

              <div 
                onClick={() => {
                  setActiveTab('learning');
                  speakText("Centro de aprendizaje digital abre tus lecciones");
                }}
                className="bg-slate-800 hover:bg-slate-750 border-3 border-amber-400/30 hover:border-amber-400 rounded-3xl p-6 cursor-pointer transition-all shadow-lg flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                    <BookOpen size={32} />
                  </div>
                  <span className="text-xs font-bold bg-emerald-400 text-slate-950 px-3 py-1 rounded-full uppercase">3 Lecciones</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Educación Adaptativa</h3>
                  <p className="text-slate-300 text-base">Cursos sencillos sobre cómo evitar estafas, verificar bancos y usar claves seguras.</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-lg group-hover:translate-x-1 transition-transform">
                  <span>Ver Lecciones</span>
                  <ArrowRight size={20} />
                </div>
              </div>

              <div 
                onClick={() => triggerPanic()}
                className="bg-slate-800 hover:bg-slate-750 border-3 border-red-500/40 hover:border-red-500 rounded-3xl p-6 cursor-pointer transition-all shadow-lg flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <PhoneCall size={32} />
                  </div>
                  <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full uppercase">Emergencia</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Aviso a Familiares</h3>
                  <p className="text-slate-300 text-base">Un botón grande para avisar inmediatamente a tus hijos o familiares si te sientes desorientado.</p>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-bold text-lg group-hover:translate-x-1 transition-transform">
                  <span>Probar Alerta</span>
                  <ArrowRight size={20} />
                </div>
              </div>

            </div>

            {/* IMPACT STATS BANNER */}
            <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 flex flex-wrap justify-around items-center gap-4 text-center">
              <div>
                <span className="text-3xl font-extrabold text-amber-300 block">70%</span>
                <span className="text-sm text-slate-300 font-medium">Reducción de Errores</span>
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
              <div>
                <span className="text-3xl font-extrabold text-emerald-400 block">50%</span>
                <span className="text-sm text-slate-300 font-medium">Menos Fraudes</span>
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
              <div>
                <span className="text-3xl font-extrabold text-amber-300 block">85%</span>
                <span className="text-sm text-slate-300 font-medium">Mayor Autoestima Digital</span>
              </div>
            </div>

          </section>
        )}

        {/* VIEW 2: SIMULADOR DE PAGO MÓVIL (CORE FEATURE) */}
        {activeTab === 'payment_sim' && (
          <section className="bg-slate-800 border-3 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
            
            {/* Header del Simulador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                    Modo Práctica Segura
                  </span>
                  <span className="text-xs text-slate-400">Sin dinero real</span>
                </div>
                <h2 className="text-3xl font-extrabold text-amber-300 mt-1">Simulador de Pago Móvil</h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => readSimStepGuide(simStep)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-xl font-bold flex items-center gap-2 border border-slate-600"
                >
                  <Volume2 size={20} />
                  <span>Escuchar Instrucciones</span>
                </button>

                <button
                  onClick={resetSim}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold flex items-center gap-1 border border-slate-600"
                  title="Reiniciar Práctica"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            {/* INDICADOR DE PASOS */}
            {!simSuccess && (
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-700">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg transition-colors ${
                        simStep === step 
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30' 
                          : simStep > step 
                            ? 'bg-emerald-500 text-slate-950' 
                            : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {simStep > step ? '✓' : step}
                    </div>
                    <span className="hidden md:inline font-bold text-sm text-slate-300">
                      {step === 1 && 'Banco'}
                      {step === 2 && 'Datos'}
                      {step === 3 && 'Monto'}
                      {step === 4 && 'Revisar'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* FORMULARIO PASO A PASO */}
            {!simSuccess ? (
              <div className="flex flex-col gap-6">

                {/* PASO 1: BANCO */}
                {simStep === 1 && (
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                    <label className="text-xl font-bold text-amber-300 block">
                      Paso 1: Selecciona el Banco del Destinatario
                    </label>
                    <p className="text-slate-300 text-base">
                      Elige el banco de la persona a quien le enviarás el dinero de prueba.
                    </p>

                    <select
                      value={paymentData.bank}
                      onChange={(e) => setPaymentData({...paymentData, bank: e.target.value})}
                      className="w-full bg-slate-800 text-white text-xl font-bold p-4 rounded-2xl border-2 border-amber-400/50 focus:border-amber-400 outline-none"
                    >
                      <option value="0102 - Banco de Venezuela">0102 - Banco de Venezuela</option>
                      <option value="0108 - Banco Provincial">0108 - BBVA Provincial</option>
                      <option value="0134 - Banesco">0134 - Banesco Banco Universal</option>
                      <option value="0105 - Banco Mercantil">0105 - Banco Mercantil</option>
                      <option value="0172 - Bancamiga">0172 - Bancamiga</option>
                    </select>

                    <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-xl flex items-start gap-3">
                      <Info size={24} className="text-amber-400 shrink-0 mt-1" />
                      <p className="text-sm text-slate-200">
                        <strong>Consejo de Seguridad:</strong> Siempre confirma cuál es el banco receptor. Si eliges el equivocado, la transacción será rechazada.
                      </p>
                    </div>
                  </div>
                )}

                {/* PASO 2: TELÉFONO Y CÉDULA */}
                {simStep === 2 && (
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                    <label className="text-xl font-bold text-amber-300 block">
                      Paso 2: Ingresa Teléfono y Cédula
                    </label>
                    
                    <div className="space-y-2">
                      <span className="text-slate-300 font-bold block text-base">Número de Teléfono Celular:</span>
                      <input
                        type="text"
                        value={paymentData.phone}
                        onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                        className="w-full bg-slate-800 text-white text-2xl font-bold p-4 rounded-2xl border-2 border-amber-400/50 focus:border-amber-400 outline-none tracking-wider"
                        placeholder="Ej. 0414-1234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-slate-300 font-bold block text-base">Cédula de Identidad (V o E):</span>
                      <input
                        type="text"
                        value={paymentData.idCard}
                        onChange={(e) => setPaymentData({...paymentData, idCard: e.target.value})}
                        className="w-full bg-slate-800 text-white text-2xl font-bold p-4 rounded-2xl border-2 border-amber-400/50 focus:border-amber-400 outline-none tracking-wider"
                        placeholder="Ej. V-12.345.678"
                      />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-xl flex items-start gap-3">
                      <ShieldCheck size={24} className="text-emerald-400 shrink-0 mt-1" />
                      <p className="text-sm text-slate-200">
                        <strong>Verificación:</strong> Revisa que no falte ningún dígito en el número telefónico antes de avanzar.
                      </p>
                    </div>
                  </div>
                )}

                {/* PASO 3: MONTO Y CONCEPTO */}
                {simStep === 3 && (
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                    <label className="text-xl font-bold text-amber-300 block">
                      Paso 3: Indicar Monto en Bolívares (Bs.)
                    </label>

                    <div className="space-y-2">
                      <span className="text-slate-300 font-bold block text-base">Monto a Enviar (Bs.):</span>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-2xl font-extrabold text-amber-300">Bs.</span>
                        <input
                          type="number"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                          className="w-full bg-slate-800 text-white text-3xl font-extrabold p-4 pl-16 rounded-2xl border-2 border-amber-400/50 focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-slate-300 font-bold block text-base">Motivo o Concepto:</span>
                      <input
                        type="text"
                        value={paymentData.concept}
                        onChange={(e) => setPaymentData({...paymentData, concept: e.target.value})}
                        className="w-full bg-slate-800 text-white text-lg font-bold p-4 rounded-2xl border-2 border-slate-600 focus:border-amber-400 outline-none"
                        placeholder="Ej. Medicinas, mercado, etc."
                      />
                    </div>

                    {simAlert && (
                      <div className="bg-red-500/20 border-2 border-red-500 p-4 rounded-xl flex items-start gap-3 text-red-200 animate-pulse">
                        <AlertTriangle size={28} className="text-red-400 shrink-0" />
                        <div>
                          <strong className="block text-red-300 font-bold text-lg">Alerta de Seguridad Inteligente</strong>
                          <p className="text-sm">{simAlert}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 4: CONFIRMACIÓN Y REVISIÓN */}
                {simStep === 4 && (
                  <div className="space-y-4 bg-slate-900 p-6 rounded-2xl border-2 border-amber-400">
                    <div className="text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                        Confirmación Final
                      </span>
                      <h3 className="text-3xl font-extrabold text-white mt-2">Revisa los Datos del Pago</h3>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-2xl space-y-3 border border-slate-700 text-lg">
                      <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400 font-medium">Banco Receptor:</span>
                        <span className="font-bold text-amber-300">{paymentData.bank}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400 font-medium">Teléfono Destino:</span>
                        <span className="font-bold text-white">{paymentData.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400 font-medium">Cédula de Identidad:</span>
                        <span className="font-bold text-white">{paymentData.idCard}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400 font-medium">Monto a Enviar:</span>
                        <span className="font-extrabold text-2xl text-emerald-400">Bs. {paymentData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Concepto:</span>
                        <span className="font-bold text-slate-200">{paymentData.concept}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                      <Lock size={24} className="text-emerald-400 shrink-0" />
                      <p className="text-sm text-emerald-200">
                        <strong>Transacción Simulada:</strong> Recuerda que estás en un entorno de aprendizaje. No se debitará saldo real de tu cuenta.
                      </p>
                    </div>

                    <button
                      onClick={handleSimFinish}
                      className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-2xl rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-3 border-2 border-emerald-200"
                    >
                      <CheckCircle2 size={32} />
                      <span>Confirmar Pago de Prueba</span>
                    </button>
                  </div>
                )}

                {/* BOTONES DE NAVEGACIÓN ENTRE PASOS */}
                <div className="flex justify-between items-center gap-4 pt-2">
                  {simStep > 1 ? (
                    <button
                      onClick={prevSimStep}
                      className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold text-xl flex items-center gap-2 border border-slate-500"
                    >
                      <ArrowLeft size={24} />
                      <span>Anterior</span>
                    </button>
                  ) : <div />}

                  {simStep < 4 && (
                    <button
                      onClick={nextSimStep}
                      className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-extrabold text-xl flex items-center gap-2 border-2 border-amber-200 ml-auto shadow-lg"
                    >
                      <span>Siguiente Paso</span>
                      <ArrowRight size={24} />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* PANTALLA DE ÉXITO */
              <div className="bg-slate-900 p-8 rounded-3xl border-4 border-emerald-400 text-center space-y-6 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 border-4 border-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Award size={64} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl font-extrabold text-emerald-400">¡Práctica Lograda con Éxito!</h3>
                  <p className="text-xl text-slate-200 max-w-lg mx-auto">
                    Has completado el proceso de Pago Móvil de manera impecable y segura.
                  </p>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 max-w-md mx-auto text-left">
                  <p className="text-sm text-slate-400 font-bold mb-1">Resumen del ejercicio:</p>
                  <p className="text-slate-200">✓ Envaste a: <strong>{paymentData.phone}</strong></p>
                  <p className="text-slate-200">✓ Monto: <strong>Bs. {paymentData.amount}</strong></p>
                  <p className="text-slate-200">✓ Banco: <strong>{paymentData.bank}</strong></p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button
                    onClick={resetSim}
                    className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-extrabold text-xl border-2 border-amber-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={24} />
                    <span>Practicar de Nuevo</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('learning')}
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold text-xl border border-slate-500 flex items-center justify-center gap-2"
                  >
                    <BookOpen size={24} />
                    <span>Ir a Lecciones de Seguridad</span>
                  </button>
                </div>
              </div>
            )}

          </section>
        )}

        {/* VIEW 3: CENTRO DE APRENDIZAJE DIGITAL (EDUCACIÓN ADAPTATIVA) */}
        {activeTab === 'learning' && (
          <section className="flex flex-col gap-6">
            
            <div className="bg-slate-800 border-3 border-amber-400/40 rounded-3xl p-6 shadow-xl">
              <h2 className="text-3xl font-extrabold text-amber-300 mb-2">Centro de Aprendizaje Adaptativo</h2>
              <p className="text-slate-300 text-lg">
                Lecciones cortas diseñadas especialmente para adultos mayores. Aprende a reconocer estafas y navegar seguro.
              </p>
            </div>

            {/* LESSON CARDS */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Lección 1 */}
              <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-400/20 text-amber-300 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-2xl border border-amber-400/30">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">¿Cómo reconocer llamadas sospechosas?</h3>
                    <p className="text-slate-300 text-base mt-1">
                      Aprende por qué NUNCA debes entregar tus claves bancarias o códigos que te lleguen por SMS.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveLesson(1);
                    speakText("Lección 1: Nunca compartas códigos que te lleguen al teléfono ni contraseñas. Ningún banco te pedirá tu clave por llamada.");
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shrink-0"
                >
                  <Eye size={20} />
                  <span>Ver Lección</span>
                </button>
              </div>

              {/* Lección 2 */}
              <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-400/20 text-emerald-300 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-2xl border border-emerald-400/30">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Verificación de Beneficiarios en Pago Móvil</h3>
                    <p className="text-slate-300 text-base mt-1">
                      Consejos prácticos para verificar la cédula y nombre antes de presionar enviar.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveLesson(2);
                    speakText("Lección 2: Antes de transferir, dicta o escribe lentamente la cédula y llama a la persona si tienes dudas.");
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shrink-0"
                >
                  <Eye size={20} />
                  <span>Ver Lección</span>
                </button>
              </div>

              {/* Lección 3 */}
              <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-sky-400/20 text-sky-300 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-2xl border border-sky-400/30">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Uso del Asistente de Voz para Escribir Mensajes</h3>
                    <p className="text-slate-300 text-base mt-1">
                      Cómo dictarle a tu celular sin necesidad de forzar la vista en el teclado pequeño.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveLesson(3);
                    speakText("Lección 3: Usa el icono del micrófono en tu celular para hablar en lugar de escribir con dedos cansados.");
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shrink-0"
                >
                  <Eye size={20} />
                  <span>Ver Lección</span>
                </button>
              </div>

            </div>

            {/* MODAL DETALLE DE LECCIÓN */}
            {activeLesson && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-800 border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-2xl font-extrabold text-amber-300">
                      {activeLesson === 1 && "Lección 1: Evitando Estafas por Teléfono"}
                      {activeLesson === 2 && "Lección 2: Verificación de Datos"}
                      {activeLesson === 3 && "Lección 3: Dictado por Voz"}
                    </h3>
                    <button 
                      onClick={() => setActiveLesson(null)}
                      className="text-slate-400 hover:text-white text-3xl font-bold px-3 py-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-slate-200 text-lg leading-relaxed">
                    {activeLesson === 1 && (
                      <>
                        <p className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                          🔴 <strong>Regla de Oro:</strong> Si recibes una llamada diciendo que son del banco o del soporte técnico solicitándote un código SMS, <strong>COLGA INMEDIATAMENTE</strong>.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base">
                          <li>Los bancos verdaderos nunca te piden claves secretas por teléfono.</li>
                          <li>Si tienes dudas, pide ayuda a un familiar antes de realizar cualquier acción.</li>
                        </ul>
                      </>
                    )}

                    {activeLesson === 2 && (
                      <>
                        <p className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                          🟢 <strong>Regla de Oro:</strong> Verifica siempre los últimos 4 dígitos del teléfono antes de enviar cualquier Pago Móvil.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base">
                          <li>Si te equivocas en un número de la cédula, el dinero irá a otra persona.</li>
                          <li>Usa el simulador de Conecta Mayor para practicar las veces que quieras.</li>
                        </ul>
                      </>
                    )}

                    {activeLesson === 3 && (
                      <>
                        <p className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                          🔵 <strong>Regla de Oro:</strong> Hablarle a tu teléfono es más fácil que escribir.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base">
                          <li>Busca el símbolo del micrófono en la pantalla de Conecta Mayor.</li>
                          <li>Habla de forma pausada y clara para que la app entienda tu solicitud.</li>
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => {
                        if (!completedLessons.includes(activeLesson)) {
                          setCompletedLessons([...completedLessons, activeLesson]);
                        }
                        setActiveLesson(null);
                        speakText("Lección completada. ¡Muy bien!");
                      }}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-extrabold text-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={24} />
                      <span>Marcar como Entendido</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </section>
        )}

      </main>

      {/* EMERGENCY MODAL (PANIC BUTTON CONTROLLER) */}
      {panicActive && (
        <div className="fixed inset-0 bg-red-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-red-500 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6 animate-bounce-once">
            <div className="w-24 h-24 bg-red-600/30 text-red-500 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle size={64} />
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-red-400">ENVIANDO ALERTA A FAMILIARES</h3>
              <p className="text-slate-200 text-lg mt-2">
                Se enviará una notificación inmediata con tu ubicación aproximada a tus contactos de emergencia registrados.
              </p>
            </div>

            <div className="text-6xl font-black text-amber-300 bg-slate-800 py-4 rounded-2xl border border-slate-700">
              {panicCountdown} seg
            </div>

            <button
              onClick={cancelPanic}
              className="w-full py-5 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-extrabold text-2xl border-2 border-slate-500 shadow-xl active:scale-95"
            >
              CANCELAR ALERTA (FUE UN ERROR)
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN DE ALERTA ENVIADA */}
      {panicSent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-emerald-400 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={56} />
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-emerald-400">¡ALERTA ENVIADA!</h3>
              <p className="text-slate-200 text-lg mt-2">
                Tus familiares han sido notificados. Mantén la calma, te contactarán pronto.
              </p>
            </div>

            <button
              onClick={() => setPanicSent(false)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-extrabold text-xl"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      )}

      {/* FOOTER ACADÉMICO Y PRESENTACIÓN */}
      <footer className="bg-slate-950 border-t border-slate-800 p-4 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-300">Conecta Mayor • Plataforma Inteligente de Inclusión Digital</p>
            <p>Presentado por: Juan Bermudez y Sinahy López | Universidad de las Ciencias "Humberto Fernández Morán"</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-amber-400 font-semibold">
            Prototipo MVP Interactivo
          </div>
        </div>
      </footer>

    </div>
  );
}

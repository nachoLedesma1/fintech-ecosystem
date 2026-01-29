import { useState } from 'react';

const CardComponent = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false); // Controla el giro
    const [showNumber, setShowNumber] = useState(false); // Controla si se ven los números

    // Función para ocultar/mostrar números
    const formatCardNumber = (number) => {
        if (showNumber) return number; // Muestra todo "4500 1234..."
        return `•••• •••• •••• ${number.slice(-4)}`; // Muestra "**** **** **** 1234"
    };

    // Determinamos el color según el tipo (Débito = Azul/Violeta, Crédito = Oro/Naranja)
    const getGradient = () => {
        if (card.type === 'CREDIT') return 'from-orange-400 to-yellow-600';
        return 'from-blue-600 to-purple-700';
    };

    return (
        <div className="group w-full max-w-sm h-56 m-auto perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>

            {/* Contenedor que gira (Inner) */}
            <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                {/* Cara frontal */}
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getGradient()} rounded-xl shadow-2xl p-6 text-white border-t border-l [backface-visibility:hidden] flex flex-col justify-between overflow-hidden`}>

                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>

                    {/* Header: Chip y Contactless */}
                    <div className="flex justify-between items-start z-10">
                        <div className="w-12 h-10 bg-yellow-200/90 rounded flex items-center justify-center border border-yellow-400 overflow-hidden shadow-inner">
                            <div className="w-full h-full border-2 border-yellow-600/50 rounded grid grid-cols-2">
                                <div className="border-r border-yellow-600/50"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rotate-90 text-2xl opacity-80">)))</div>
                            {/* Botón Ojito (detiene la propagación para que no gire la tarjeta al clickearlo) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowNumber(!showNumber); }}
                                className="text-gray-300 hover:text-white transition p-1 z-20"
                                title={showNumber ? "Ocultar datos" : "Mostrar datos"}
                            >
                                {showNumber ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Número de Tarjeta */}
                    <div className="mt-2 z-10">
                        <p className="font-mono text-2xl tracking-widest shadow-black drop-shadow-md">
                            {formatCardNumber(card.number)}
                        </p>
                    </div>

                    {/* Footer: Datos */}
                    <div className="flex justify-between items-end z-10">
                        <div>
                            <p className="text-[10px] text-gray-300 uppercase mb-0.5">Titular</p>
                            <p className="font-bold tracking-wide uppercase text-sm truncate max-w-[180px]">
                                {card.cardHolder}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] text-gray-300 uppercase mb-0.5">Vence</p>
                            <p className="font-mono font-bold">{card.expiryDate}</p>
                        </div>
                    </div>

                    {/* Logo Tipo (Visa/Master simulación) */}
                    <div className="absolute bottom-4 right-6 opacity-20 text-4xl font-black italic">
                        BANK
                    </div>
                </div>

                {/* Cara tracera (dorso) */}
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-bl ${getGradient()} rounded-xl shadow-2xl text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden`}>

                    {/* Banda Magnética */}
                    <div className="w-full h-12 bg-black mt-6 opacity-90"></div>

                    <div className="p-6">
                        <div className="flex justify-between items-center mt-2">
                            {/* Panel de Firma */}
                            <div className="w-3/4 h-10 bg-gray-200 rounded flex items-center px-2">
                                <div className="w-full h-6 bg-white pattern-lines opacity-50"></div>
                            </div>

                            {/* CVV */}
                            <div className="w-1/4 h-10 flex items-center justify-center pl-2">
                                <div className="border-2 border-red-500 rounded-full w-full h-full flex items-center justify-center bg-white text-black font-bold font-mono">
                                    {showNumber ? card.cvv : '***'}
                                </div>
                            </div>
                        </div>
                        <p className="text-right text-[10px] text-gray-300 mt-1 mr-2">CÓDIGO DE SEGURIDAD</p>

                        {/* Texto Legal de Relleno */}
                        <div className="mt-6 text-[8px] text-gray-400 text-justify leading-tight opacity-70">
                            Esta tarjeta es intransferible y propiedad del Banco Digital.
                            El uso de la misma implica la aceptación de los términos y condiciones.
                            Si encuentra esta tarjeta, por favor devuélvala a la sucursal más cercana.
                            <br /><br />
                            <span className="font-bold text-white">Soporte 24hs: 0800-BANCO-DEV</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CardComponent;
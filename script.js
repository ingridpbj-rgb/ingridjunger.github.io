// Theme Toggle Functionality
function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = getTheme();
    setTheme(savedTheme);
    
    // Initialize scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
    
    // Initialize counter animations
    animateCounters();
    
    // Initialize form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);


// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Chat Bot Functionality
let chatOpen = false;

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatContainer.classList.add('active');
        document.getElementById('chatInput').focus();
    } else {
        chatContainer.classList.remove('active');
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Simulate bot thinking
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        // Only add message if response is not empty (location search handles its own messages)
        if (botResponse && botResponse !== '') {
            addMessage(botResponse, 'bot');
        }
    }, 500);
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format text with basic markdown support
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>') // Links
        .replace(/\n/g, '<br>'); // Line breaks
    
    contentDiv.innerHTML = formattedText;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// AI Bot Response Logic
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.includes('olá') || message.includes('oi') || message.includes('hello')) {
        return 'Olá! Como posso ajudar você com reciclagem hoje?';
    }
    
    // Recycling questions
    if (message.includes('reciclar') || message.includes('reciclagem')) {
        if (message.includes('plástico')) {
            return 'Plásticos recicláveis incluem garrafas PET, embalagens de produtos de limpeza e potes. Lave antes de descartar e verifique o símbolo de reciclagem.';
        }
        if (message.includes('papel')) {
            return 'Papéis podem ser reciclados, mas evite papéis engordurados ou com fitas adesivas. Revistas, jornais e caixas de papelão são recicláveis.';
        }
        if (message.includes('vidro')) {
            return 'Vidros são 100% recicláveis! Lave bem antes de descartar e remova tampas. Cuidado com vidros quebrados - embale em jornal.';
        }
        if (message.includes('metal')) {
            return 'Latas de alumínio e aço são totalmente recicláveis. Lave bem e amasse latas de alumínio para economizar espaço.';
        }
        return 'Reciclagem é o processo de transformar resíduos em novos produtos. Separe os materiais por tipo: plástico, papel, vidro e metal.';
    }
    
    // Tips
    if (message.includes('dica') || message.includes('como') || message.includes('ajudar')) {
        return 'Algumas dicas: 1) Separe os materiais corretamente, 2) Lave antes de reciclar, 3) Reduza o consumo de embalagens, 4) Reutilize sempre que possível!';
    }
    
    // Environmental impact
    if (message.includes('impacto') || message.includes('meio ambiente') || message.includes('benefício')) {
        return 'A reciclagem reduz a poluição, economiza recursos naturais, diminui o lixo em aterros e ajuda a combater as mudanças climáticas. Cada pessoa faz a diferença!';
    }
    
    // Symbols
    if (message.includes('símbolo') || message.includes('código') || message.includes('identificar')) {
        return 'Os símbolos de reciclagem são números dentro de um triângulo. PET (1), PEAD (2), PVC (3), PEBD (4), PP (5), PS (6) e outros (7). Verifique no produto!';
    }
    
    // Where to recycle - Enhanced with location information
    if (message.includes('onde') || message.includes('local') || message.includes('coleta') || 
        message.includes('ponto') || message.includes('lugar') || message.includes('descarta') ||
        message.includes('próximo') || message.includes('perto') || message.includes('perto de mim')) {
        
        // Check if user wants location-based search
        if (message.includes('perto') || message.includes('próximo') || message.includes('minha localização') ||
            message.includes('localização') || message.includes('gps') || message.includes('onde estou') ||
            message.includes('perto de mim') || message.includes('próximo de mim')) {
            const result = findNearbyRecyclingLocations(message);
            // If result is empty, location is being processed asynchronously
            if (result === '') {
                return ''; // Don't add duplicate message
            }
            return result;
        }
        
        // Ask for location or provide general information
        if (message.includes('cidade') || message.includes('bairro') || message.includes('rua') || 
            message.includes('endereço')) {
            return getRecyclingLocations(message);
        }
        
        return getRecyclingLocationsInfo();
    }
    
    // Organic waste
    if (message.includes('orgânico') || message.includes('comida') || message.includes('resto')) {
        return 'Resíduos orgânicos podem ser compostados! Restos de frutas, verduras e cascas de ovos podem virar adubo para plantas.';
    }
    
    // Battery and electronics
    if (message.includes('pilha') || message.includes('bateria') || message.includes('eletrônico')) {
        return 'Pilhas, baterias e eletrônicos devem ser descartados em pontos específicos de coleta. Nunca descarte no lixo comum - contêm materiais tóxicos!';
    }
    
    // Default responses
    const defaultResponses = [
        'Interessante! Pode me contar mais sobre o que você gostaria de saber sobre reciclagem?',
        'Posso ajudar com informações sobre reciclagem, dicas de separação, impacto ambiental e muito mais. O que você gostaria de saber?',
        'Sou especialista em reciclagem! Posso ajudar com dicas, informações sobre materiais recicláveis e práticas sustentáveis.',
        'Que ótimo! Estou aqui para ajudar você a reciclar melhor. Faça uma pergunta sobre reciclagem!'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Recycling Locations Database
const recyclingLocations = {
    'supermercado': {
        name: 'Supermercados',
        materials: ['Plástico', 'Papel', 'Metal', 'Vidro'],
        description: 'Muitos supermercados têm pontos de coleta para embalagens recicláveis.',
        common: ['Carrefour', 'Extra', 'Pão de Açúcar', 'Walmart', 'Atacadão']
    },
    'cooperativa': {
        name: 'Cooperativas de Reciclagem',
        materials: ['Todos os materiais recicláveis'],
        description: 'Cooperativas recebem materiais recicláveis e muitas vezes pagam por eles.',
        common: ['Cooperativas de catadores', 'Associações de reciclagem']
    },
    'ecoponto': {
        name: 'Ecopontos',
        materials: ['Todos os materiais', 'Eletrônicos', 'Pilhas', 'Óleo usado'],
        description: 'Pontos específicos da prefeitura para coleta de diversos materiais.',
        common: ['Ecopontos municipais']
    },
    'farmácia': {
        name: 'Farmácias',
        materials: ['Medicamentos vencidos', 'Pilhas'],
        description: 'Muitas farmácias recebem medicamentos vencidos e pilhas usadas.',
        common: ['Drogaria São Paulo', 'Droga Raia', 'Farmácias de rede']
    },
    'loja': {
        name: 'Lojas de Eletrônicos',
        materials: ['Eletrônicos', 'Baterias', 'Pilhas'],
        description: 'Lojas especializadas em eletrônicos geralmente recebem equipamentos antigos.',
        common: ['Magazine Luiza', 'Casas Bahia', 'Fast Shop']
    },
    'posto': {
        name: 'Postos de Combustível',
        materials: ['Óleo de cozinha usado'],
        description: 'Alguns postos recebem óleo de cozinha usado para reciclagem.',
        common: ['Postos de gasolina']
    }
};

function getRecyclingLocationsInfo() {
    let response = '📍 **Onde encontrar pontos de reciclagem:**\n\n';
    response += '1. **Supermercados** - Muitos têm pontos de coleta para embalagens\n';
    response += '2. **Cooperativas de Reciclagem** - Recebem todos os materiais recicláveis\n';
    response += '3. **Ecopontos Municipais** - Pontos oficiais da prefeitura\n';
    response += '4. **Farmácias** - Para medicamentos vencidos e pilhas\n';
    response += '5. **Lojas de Eletrônicos** - Para equipamentos eletrônicos\n';
    response += '6. **Postos de Combustível** - Alguns recebem óleo de cozinha\n\n';
    response += '💡 **Dica:** Procure no site da prefeitura da sua cidade por "coleta seletiva" ou "pontos de reciclagem".';
    
    return response;
}

// Find nearby recycling locations using geolocation
function findNearbyRecyclingLocations(message) {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        return '📍 Seu navegador não suporta geolocalização.\n\n' +
               'Você pode:\n' +
               '1. Usar o Google Maps e pesquisar "ponto de reciclagem" ou "ecoponto"\n' +
               '2. Verificar o site da prefeitura da sua cidade\n' +
               '3. Ligar para o serviço de limpeza urbana';
    }
    
    // Show loading message immediately
    addMessage('🔍 Buscando pontos de reciclagem próximos a você...', 'bot');
    
    // Request location
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Get material type from message
            const materialType = getMaterialTypeFromMessage(message);
            
            // Find nearby locations
            const locations = findRecyclingPoints(lat, lng, materialType);
            
            // Format and send response
            const response = formatLocationResponse(locations, lat, lng, materialType);
            addMessage(response, 'bot');
        },
        function(error) {
            let errorMessage = '❌ Não foi possível acessar sua localização.\n\n';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += '⚠️ **Permissão de localização negada.**\n\n';
                    errorMessage += 'Para encontrar pontos próximos:\n';
                    errorMessage += '1. Permita o acesso à localização nas configurações do navegador\n';
                    errorMessage += '2. Ou use o [Google Maps](https://www.google.com/maps/search/ponto+de+reciclagem)\n';
                    errorMessage += '3. Ou pesquise "ecoponto" + nome da sua cidade';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += '⚠️ **Localização indisponível.**\n\n';
                    errorMessage += 'Tente usar o [Google Maps](https://www.google.com/maps/search/ponto+de+reciclagem) para encontrar pontos de reciclagem próximos.';
                    break;
                case error.TIMEOUT:
                    errorMessage += '⏱️ **Tempo esgotado** ao buscar localização.\n\n';
                    errorMessage += 'Tente novamente ou use o [Google Maps](https://www.google.com/maps/search/ponto+de+reciclagem).';
                    break;
                default:
                    errorMessage += 'Erro desconhecido. Tente novamente.';
                    break;
            }
            
            addMessage(errorMessage, 'bot');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
    
    // Return empty string since we're handling messages via callbacks
    return '';
}

// Get material type from user message
function getMaterialTypeFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('plástico') || lowerMessage.includes('pet')) return 'plastico';
    if (lowerMessage.includes('papel') || lowerMessage.includes('papelão')) return 'papel';
    if (lowerMessage.includes('vidro')) return 'vidro';
    if (lowerMessage.includes('metal') || lowerMessage.includes('lata') || lowerMessage.includes('alumínio')) return 'metal';
    if (lowerMessage.includes('eletrônico') || lowerMessage.includes('eletrônic') || lowerMessage.includes('celular') || lowerMessage.includes('computador')) return 'eletronico';
    if (lowerMessage.includes('óleo') || lowerMessage.includes('oleo')) return 'oleo';
    if (lowerMessage.includes('medicamento') || lowerMessage.includes('remédio') || lowerMessage.includes('remedio')) return 'medicamento';
    
    return 'geral';
}

// Find recycling points (simulated database + Google Maps integration)
function findRecyclingPoints(lat, lng, materialType) {
    // Common recycling locations that exist in most cities
    const commonLocations = [
        {
            name: 'Ecoponto Municipal',
            type: 'Ecoponto',
            materials: ['Todos os materiais'],
            distance: Math.random() * 2 + 0.5, // 0.5 to 2.5 km
            address: 'Verifique no site da prefeitura',
            googleMapsLink: `https://www.google.com/maps/search/ecoponto/@${lat},${lng},13z`
        },
        {
            name: 'Supermercado - Ponto de Coleta',
            type: 'Supermercado',
            materials: ['Plástico', 'Papel', 'Metal', 'Vidro'],
            distance: Math.random() * 1.5 + 0.3, // 0.3 to 1.8 km
            address: 'Verifique supermercados próximos',
            googleMapsLink: `https://www.google.com/maps/search/supermercado+ponto+de+coleta/@${lat},${lng},13z`
        },
        {
            name: 'Cooperativa de Reciclagem',
            type: 'Cooperativa',
            materials: ['Todos os materiais recicláveis'],
            distance: Math.random() * 3 + 1, // 1 to 4 km
            address: 'Verifique cooperativas locais',
            googleMapsLink: `https://www.google.com/maps/search/cooperativa+reciclagem/@${lat},${lng},13z`
        }
    ];
    
    // Filter by material type if specified
    if (materialType !== 'geral') {
        return commonLocations.filter(loc => 
            loc.materials.includes('Todos os materiais') || 
            loc.materials.some(m => m.toLowerCase().includes(materialType))
        );
    }
    
    return commonLocations;
}

// Format location response
function formatLocationResponse(locations, lat, lng, materialType) {
    let response = '📍 **Pontos de Reciclagem Próximos:**\n\n';
    
    // Sort by distance
    locations.sort((a, b) => a.distance - b.distance);
    
    locations.forEach((loc, index) => {
        response += `${index + 1}. **${loc.name}**\n`;
        response += `   📍 Distância: ~${loc.distance.toFixed(1)} km\n`;
        response += `   ♻️ Materiais: ${loc.materials.join(', ')}\n`;
        response += `   🔗 [Ver no Google Maps](${loc.googleMapsLink})\n\n`;
    });
    
    response += '💡 **Dicas:**\n';
    response += `• Abra o Google Maps e pesquise "ponto de reciclagem" ou "ecoponto"\n`;
    response += `• Verifique o site da prefeitura para ecopontos oficiais\n`;
    response += `• Muitas cidades têm coleta seletiva porta a porta\n\n`;
    
    response += `🗺️ [Abrir Google Maps com sua localização](https://www.google.com/maps/search/ponto+de+reciclagem/@${lat},${lng},14z)`;
    
    return response;
}

function getRecyclingLocations(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific material types
    if (lowerMessage.includes('plástico') || lowerMessage.includes('pet')) {
        return '🔄 **Para reciclar PLÁSTICO:**\n\n' +
               '📍 Supermercados (Carrefour, Extra, Pão de Açúcar)\n' +
               '📍 Cooperativas de reciclagem\n' +
               '📍 Ecopontos municipais\n' +
               '📍 Coleta seletiva porta a porta (verifique com a prefeitura)\n\n' +
               '💡 Procure no site da sua prefeitura por "coleta seletiva" ou ligue para o serviço de limpeza urbana.';
    }
    
    if (lowerMessage.includes('papel') || lowerMessage.includes('papelão')) {
        return '📄 **Para reciclar PAPEL:**\n\n' +
               '📍 Supermercados e mercados\n' +
               '📍 Cooperativas de catadores\n' +
               '📍 Escolas e universidades (muitas têm pontos de coleta)\n' +
               '📍 Ecopontos\n\n' +
               '💡 Papel limpo e seco tem mais valor para reciclagem!';
    }
    
    if (lowerMessage.includes('vidro')) {
        return '🫙 **Para reciclar VIDRO:**\n\n' +
               '📍 Ecopontos municipais\n' +
               '📍 Cooperativas de reciclagem\n' +
               '📍 Alguns supermercados\n' +
               '📍 Vidraçarias (algumas recebem vidro para reciclagem)\n\n' +
               '💡 Vidro pode ser reciclado infinitamente! Lave bem antes de descartar.';
    }
    
    if (lowerMessage.includes('metal') || lowerMessage.includes('lata') || lowerMessage.includes('alumínio')) {
        return '🥫 **Para reciclar METAL:**\n\n' +
               '📍 Cooperativas de reciclagem (pagam por alumínio)\n' +
               '📍 Ferros-velhos\n' +
               '📍 Ecopontos\n' +
               '📍 Supermercados\n\n' +
               '💡 Latas de alumínio têm alto valor de reciclagem!';
    }
    
    if (lowerMessage.includes('eletrônico') || lowerMessage.includes('eletrônic') || lowerMessage.includes('celular') || 
        lowerMessage.includes('computador') || lowerMessage.includes('bateria')) {
        return '🔌 **Para reciclar ELETRÔNICOS:**\n\n' +
               '📍 Lojas de eletrônicos (Magazine Luiza, Casas Bahia)\n' +
               '📍 Ecopontos especializados\n' +
               '📍 Empresas de reciclagem de eletrônicos\n' +
               '📍 Farmácias (para pilhas e baterias)\n\n' +
               '⚠️ **Importante:** Nunca descarte eletrônicos no lixo comum! Contêm materiais tóxicos.';
    }
    
    if (lowerMessage.includes('óleo') || lowerMessage.includes('oleo')) {
        return '🛢️ **Para reciclar ÓLEO DE COZINHA:**\n\n' +
               '📍 Alguns postos de combustível\n' +
               '📍 Ecopontos\n' +
               '📍 Restaurantes e estabelecimentos comerciais\n' +
               '📍 Projetos ambientais locais\n\n' +
               '💡 1 litro de óleo pode contaminar 25.000 litros de água! Sempre recicle.';
    }
    
    if (lowerMessage.includes('medicamento') || lowerMessage.includes('remédio') || lowerMessage.includes('remedio')) {
        return '💊 **Para descartar MEDICAMENTOS:**\n\n' +
               '📍 Farmácias (muitas recebem medicamentos vencidos)\n' +
               '📍 Unidades Básicas de Saúde (UBS)\n' +
               '📍 Postos de saúde\n\n' +
               '⚠️ **Nunca** descarte medicamentos no lixo comum ou no vaso sanitário!';
    }
    
    // General location response
    return '📍 **Encontre pontos de reciclagem próximos a você:**\n\n' +
           '1. **Site da Prefeitura** - Procure por "coleta seletiva" ou "ecopontos"\n' +
           '2. **Aplicativos:**\n' +
           '   • Cataki (conecta com catadores)\n' +
           '   • Rota da Reciclagem\n' +
           '   • Recicla Sampa (se estiver em SP)\n' +
           '3. **Google Maps** - Pesquise "ponto de reciclagem" ou "ecoponto"\n' +
           '4. **Telefone:** Ligue para a prefeitura e pergunte sobre coleta seletiva\n\n' +
           '💡 **Dica:** Muitas cidades têm coleta seletiva porta a porta. Verifique os dias e horários na sua região!';
}


// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const shapes = hero.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }
});


// Impact Calculator Functions
// Dados baseados em pesquisas científicas sobre reciclagem
const materialData = {
    plastico: {
        co2Reduction: 2.5, // kg CO2 por kg reciclado
        energySaved: 75, // % de economia de energia
        waterSaved: 50, // % de economia de água
        description: "A reciclagem de plástico reduz significativamente o uso de petróleo e energia."
    },
    papel: {
        co2Reduction: 1.2, // kg CO2 por kg reciclado
        energySaved: 60, // % de economia de energia
        waterSaved: 80, // % de economia de água
        description: "Reciclar papel salva árvores e reduz o consumo de água e energia."
    },
    vidro: {
        co2Reduction: 0.3, // kg CO2 por kg reciclado
        energySaved: 30, // % de economia de energia
        waterSaved: 50, // % de economia de água
        description: "Vidro pode ser reciclado infinitamente sem perder qualidade."
    },
    metal: {
        co2Reduction: 4.0, // kg CO2 por kg reciclado
        energySaved: 95, // % de economia de energia (alumínio)
        waterSaved: 40, // % de economia de água
        description: "Reciclar metal economiza muita energia e reduz mineração."
    },
    organico: {
        co2Reduction: 0.5, // kg CO2 por kg compostado
        energySaved: 0, // Não aplicável
        waterSaved: 30, // % de economia de água
        description: "Compostagem reduz emissões de metano e cria adubo natural."
    },
    eletronico: {
        co2Reduction: 3.5, // kg CO2 por kg reciclado
        energySaved: 85, // % de economia de energia
        waterSaved: 60, // % de economia de água
        description: "Reciclar eletrônicos recupera metais preciosos e reduz mineração."
    }
};

function calculateImpact() {
    const materialType = document.getElementById('materialType').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    
    // Validação
    if (!materialType) {
        alert('Por favor, selecione um tipo de material.');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        alert('Por favor, digite uma quantidade válida maior que zero.');
        return;
    }
    
    const data = materialData[materialType];
    if (!data) {
        alert('Material não encontrado.');
        return;
    }
    
    // Cálculos
    const co2Reduced = (data.co2Reduction * quantity).toFixed(2);
    const energySavedPercent = data.energySaved;
    const waterSavedPercent = data.waterSaved;
    
    // Calcular redução de emissões em porcentagem (baseado em média de 2.5kg CO2 por kg de resíduo não reciclado)
    const co2WithoutRecycling = quantity * 2.5;
    const reductionPercent = Math.min(((co2Reduced / co2WithoutRecycling) * 100), 100).toFixed(1);
    
    // Calcular impacto global (equivalente a árvores plantadas, litros de água, etc)
    const treesEquivalent = Math.max((co2Reduced / 20), 0.1).toFixed(1); // 1 árvore absorve ~20kg CO2/ano
    const waterSaved = (quantity * waterSavedPercent / 100).toFixed(1);
    
    // Mostrar resultados
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    
    // Animar valores
    animateValue('reductionPercent', 0, parseFloat(reductionPercent), 1000, '%');
    animateValue('recycledAmount', 0, quantity, 1000, ' kg');
    animateValue('worldImpact', 0, parseFloat(treesEquivalent), 1000, ' árvores');
    
    // Atualizar descrições
    document.getElementById('reductionDesc').textContent = 
        `Você evitou ${co2Reduced} kg de CO₂, equivalente a ${treesEquivalent} árvores plantadas!`;
    
    document.getElementById('recycledDesc').textContent = 
        `${data.description} Economizou ${waterSaved} litros de água.`;
    
    document.getElementById('worldDesc').textContent = 
        `Seu impacto equivale a ${treesEquivalent} árvores plantadas. Continue reciclando!`;
    
    // Scroll suave para os resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function animateValue(elementId, start, end, duration, suffix = '') {
    const element = document.getElementById(elementId);
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para animação suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        if (progress < 1) {
            element.textContent = current.toFixed(1) + suffix;
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toFixed(1) + suffix;
        }
    }
    
    requestAnimationFrame(update);
}

function resetCalculator() {
    document.getElementById('materialType').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('materialType').focus();
}

// Add typing effect to hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Quiz Game Functionality
const quizQuestions = [
    {
        question: "Garrafas de óleo de cozinha podem ser recicladas?",
        options: [
            { text: "Sim, sempre", correct: false },
            { text: "Não, nunca", correct: false },
            { text: "Sim, mas apenas em pontos específicos de coleta", correct: true },
            { text: "Depende do tipo de óleo", correct: false }
        ],
        tip: "Óleo de cozinha usado deve ser levado a pontos específicos de coleta. Nunca descarte na pia! 1 litro de óleo pode contaminar 25.000 litros de água."
    },
    {
        question: "Isopor é reciclável na sua cidade?",
        options: [
            { text: "Sim, sempre", correct: false },
            { text: "Não, nunca", correct: false },
            { text: "Depende da cidade e do tipo de isopor", correct: true },
            { text: "Apenas isopor branco", correct: false }
        ],
        tip: "Isopor (EPS) é tecnicamente reciclável, mas muitas cidades não têm estrutura. Verifique com a prefeitura ou cooperativas locais. Reduza o consumo sempre que possível!"
    },
    {
        question: "Papel engordurado pode ser reciclado?",
        options: [
            { text: "Sim, sempre", correct: false },
            { text: "Não, contamina o processo", correct: true },
            { text: "Apenas se estiver limpo", correct: false },
            { text: "Depende da quantidade de gordura", correct: false }
        ],
        tip: "Papel engordurado (como caixas de pizza com gordura) não pode ser reciclado porque contamina o processo. Use para compostagem ou descarte no lixo comum."
    },
    {
        question: "Latas de alumínio podem ser recicladas infinitamente?",
        options: [
            { text: "Sim, sem perder qualidade", correct: true },
            { text: "Não, apenas algumas vezes", correct: false },
            { text: "Depende do tipo de lata", correct: false },
            { text: "Apenas latas novas", correct: false }
        ],
        tip: "Latas de alumínio podem ser recicladas infinitamente sem perder qualidade! A reciclagem de alumínio economiza 95% da energia necessária para produzir novo alumínio."
    },
    {
        question: "Vidros coloridos e transparentes devem ser separados na reciclagem?",
        options: [
            { text: "Sim, sempre separados", correct: false },
            { text: "Não, podem ser misturados", correct: true },
            { text: "Depende da cooperativa", correct: false },
            { text: "Apenas vidros quebrados", correct: false }
        ],
        tip: "Vidros coloridos e transparentes podem ser reciclados juntos. O importante é remover tampas e rótulos, e lavar bem antes de descartar."
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let wrongAnswers = [];

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    wrongAnswers = [];
    
    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestion];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextButton = document.getElementById('nextButton');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Update progress
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Pergunta ${currentQuestion + 1} de ${quizQuestions.length}`;
    
    // Show question
    questionText.textContent = question.question;
    
    // Clear and create options
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.onclick = () => selectOption(index, optionDiv);
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quizOption';
        radio.value = index;
        
        const label = document.createElement('label');
        label.textContent = option.text;
        label.style.cursor = 'pointer';
        label.style.flex = '1';
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
}

function selectOption(index, optionElement) {
    // Remove previous selections
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark as selected
    optionElement.classList.add('selected');
    optionElement.querySelector('input[type="radio"]').checked = true;
    
    // Show next button
    document.getElementById('nextButton').style.display = 'block';
    
    // Store answer
    userAnswers[currentQuestion] = index;
}

function nextQuestion() {
    const selectedOption = document.querySelector('.quiz-option.selected');
    if (!selectedOption) {
        alert('Por favor, selecione uma resposta!');
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const selectedIndex = userAnswers[currentQuestion];
    const selectedAnswer = question.options[selectedIndex];
    
    // Check if answer is correct
    if (selectedAnswer.correct) {
        score++;
    } else {
        // Store wrong answer for tips
        wrongAnswers.push({
            question: question.question,
            userAnswer: selectedAnswer.text,
            correctAnswer: question.options.find(opt => opt.correct).text,
            tip: question.tip
        });
    }
    
    // Show feedback
    showAnswerFeedback(selectedAnswer.correct);
    
    // Move to next question or show results
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showAnswerFeedback(isCorrect) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        const question = quizQuestions[currentQuestion];
        if (question.options[index].correct) {
            opt.classList.add('correct');
        } else if (opt.classList.contains('selected') && !isCorrect) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });
}

function showResults() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    const scoreValue = document.getElementById('scoreValue');
    const scoreTitle = document.getElementById('scoreTitle');
    const scoreMessage = document.getElementById('scoreMessage');
    const scoreIcon = document.getElementById('scoreIcon');
    const tipsList = document.getElementById('tipsList');
    
    // Calculate percentage
    const percentage = (score / quizQuestions.length) * 100;
    
    scoreValue.textContent = `${score}/${quizQuestions.length}`;
    
    // Set message based on score
    if (percentage >= 90) {
        scoreIcon.textContent = '🏆';
        scoreTitle.textContent = 'Excelente!';
        scoreMessage.textContent = 'Você é um verdadeiro especialista em reciclagem! Continue assim!';
    } else if (percentage >= 70) {
        scoreIcon.textContent = '⭐';
        scoreTitle.textContent = 'Muito Bom!';
        scoreMessage.textContent = 'Você tem um bom conhecimento sobre reciclagem! Continue aprendendo!';
    } else if (percentage >= 50) {
        scoreIcon.textContent = '👍';
        scoreTitle.textContent = 'Bom!';
        scoreMessage.textContent = 'Você está no caminho certo! Continue aprendendo sobre reciclagem!';
    } else {
        scoreIcon.textContent = '📚';
        scoreTitle.textContent = 'Continue Aprendendo!';
        scoreMessage.textContent = 'Não desanime! Use as dicas abaixo para melhorar seus conhecimentos!';
    }
    
    // Show tips for wrong answers
    tipsList.innerHTML = '';
    if (wrongAnswers.length > 0) {
        wrongAnswers.forEach((wrong, index) => {
            const tipDiv = document.createElement('div');
            tipDiv.className = 'tip-item-result';
            tipDiv.innerHTML = `
                <strong>❌ ${wrong.question}</strong>
                <p style="margin: 0.5rem 0; color: var(--text-secondary);">Sua resposta: ${wrong.userAnswer}</p>
                <p style="margin: 0.5rem 0; color: var(--primary-green);">✅ Resposta correta: ${wrong.correctAnswer}</p>
                <p style="margin-top: 0.5rem; color: var(--text-primary);">💡 ${wrong.tip}</p>
            `;
            tipsList.appendChild(tipDiv);
        });
    } else {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'tip-item-result';
        tipDiv.innerHTML = '<p>🎉 Parabéns! Você acertou todas as perguntas! Você é um expert em reciclagem!</p>';
        tipsList.appendChild(tipDiv);
    }
    
    // Scroll to results
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function restartQuiz() {
    startQuiz();
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize on page load
window.addEventListener('load', () => {
    // Theme is already initialized in DOMContentLoaded
    console.log('Green Life Recicla - Site carregado com sucesso!');
});


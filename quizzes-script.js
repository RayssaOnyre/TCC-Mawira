document.addEventListener('DOMContentLoaded', () => {
    // Referências para as seções
    const quizListSection = document.getElementById('quiz-list-section');
    const quizInterfaceSection = document.getElementById('quiz-interface-section');
    const quizResultSection = document.getElementById('quiz-result-section');

    // Referências para elementos da interface do quiz
    const quizCardsGrid = document.querySelector('.quiz-cards-grid');
    const currentQuizTitle = document.getElementById('current-quiz-title');
    const progressBarFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const questionImageContainer = document.createElement('div'); // Novo container para imagem
    questionImageContainer.classList.add('question-image-container');
    questionText.parentNode.insertBefore(questionImageContainer, questionText); // Insere antes do texto da pergunta

    // Referências para elementos do resultado do quiz
    const resultTitle = document.getElementById('result-title');
    const resultContent = document.getElementById('result-content');
    const viewProductsButton = document.getElementById('view-products-button');
    const shareResultButton = document.getElementById('share-result-button');
    const startNewQuizButton = document.getElementById('start-new-quiz-button');

    // Estado do Quiz
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = []; // Armazena as respostas do usuário para o quiz atual

    // Simulação de Quizzes (em um projeto real, isso viria de um backend/API)
    const quizzes = [
        {
            id: 'tipo-cabelo',
            title: 'Qual seu tipo de cabelo?',
            description: 'Descubra a oleosidade, textura e estrutura dos seus fios.',
            questions: [
                {
                    question: 'Com que frequência você lava seu cabelo para sentir que ele está limpo?',
                    image: 'images/freq-lavagem.jpg',
                    options: [
                        { text: 'Diariamente ou em dias alternados', value: 'oleoso' },
                        { text: '2-3 vezes por semana', value: 'normal' },
                        { text: '1-2 vezes por semana ou menos', value: 'seco' }
                    ]
                },
                {
                    question: 'Como seu couro cabeludo se sente no final do dia?',
                    image: 'images/couro-cabeludo.jpg',
                    options: [
                        { text: 'Oleoso e pesado', value: 'oleoso' },
                        { text: 'Normal, sem oleosidade excessiva', value: 'normal' },
                        { text: 'Ressecado e com coceira', value: 'seco' }
                    ]
                },
                {
                    question: 'Como as pontas do seu cabelo costumam se apresentar?',
                    image: 'images/pontas-duplas.jpg',
                    options: [
                        { text: 'Normal, sem muito ressecamento', value: 'normal' },
                        { text: 'Secas, com pontas duplas', value: 'seco' },
                        { text: 'Oleosas, como o resto do cabelo', value: 'oleoso' }
                    ]
                },
                {
                    question: 'Qual a espessura de um fio de cabelo seu? (Compare com uma linha de costura)',
                    image: 'images/espessura-fio.jpg',
                    options: [
                        { text: 'Muito fino, quase invisível', value: 'fino' },
                        { text: 'Médio, como uma linha comum', value: 'medio' },
                        { text: 'Grosso, como uma linha de bordado', value: 'grosso' }
                    ]
                },
                {
                    question: 'Qual a sua curvatura natural do cabelo? (Olhe o seu cabelo molhado e sem produto)',
                    image: 'images/curvatura-cabelo.jpg',
                    options: [
                        { text: 'Liso (sem curvatura)', value: 'liso' },
                        { text: 'Ondulado (curvas leves em "S")', value: 'ondulado' },
                        { text: 'Cacheado (cachos definidos em "S")', value: 'cacheado' },
                        { text: 'Crespo (cachos apertados ou em "Z")', value: 'crespo' }
                    ]
                },
                {
                    question: 'Seu cabelo absorve água facilmente ou demora para molhar?',
                    image: 'images/porosidade-cabelo.jpg',
                    options: [
                        { text: 'Absorve rápido e seca rápido (alta porosidade)', value: 'alta_porosidade' },
                        { text: 'Absorve normalmente (média porosidade)', value: 'media_porosidade' },
                        { text: 'Demora para molhar e para secar (baixa porosidade)', value: 'baixa_porosidade' }
                    ]
                },
                {
                    question: 'Você costuma sentir que seu cabelo está opaco e sem brilho?',
                    image: 'images/cabelo-opaco.jpg',
                    options: [
                        { text: 'Sempre ou na maioria das vezes', value: 'opaco' },
                        { text: 'Às vezes', value: 'pouco_opaco' },
                        { text: 'Raramente, ele é bem brilhoso', value: 'brilhoso' }
                    ]
                },
                {
                    question: 'Com que frequência você usa ferramentas de calor (secador, chapinha, babyliss)?',
                    image: 'images/ferramentas-calor.jpg',
                    options: [
                        { text: 'Diariamente ou quase todos os dias', value: 'muito_calor' },
                        { text: 'Algumas vezes por semana', value: 'moderado_calor' },
                        { text: 'Raramente ou nunca', value: 'pouco_calor' }
                    ]
                },
                {
                    question: 'Seu cabelo embaraça com facilidade?',
                    image: 'images/cabelo-embaracado.jpg',
                    options: [
                        { text: 'Sim, muito fácil e forma nós', value: 'muito_embaraca' },
                        { text: 'Às vezes, um pouco', value: 'as_vezes_embaraca' },
                        { text: 'Não, desembaraça facilmente', value: 'nao_embaraca' }
                    ]
                }
            ],
            // Lógica de cálculo do resultado (exemplo simples)
            calculateResult: (answers) => {
                const scores = {
                    oleoso: 0, normal: 0, seco: 0, misto: 0,
                    liso: 0, ondulado: 0, cacheado: 0, crespo: 0,
                    fino: 0, medio: 0, grosso: 0,
                    alta_porosidade: 0, media_porosidade: 0, baixa_porosidade: 0,
                    opaco: 0, brilhoso: 0,
                    danificado: 0, saudavel_geral: 0
                };

                answers.forEach(answer => {
                    scores[answer.value]++;
                });

                let tipoCabelo = [];
                let recomendacao = '';

                // Oleosidade/Ressecamento
                if (scores.oleoso >= 3 || (scores.oleoso >= 2 && scores.seco >= 1)) {
                    tipoCabelo.push('Misto (raiz oleosa, pontas secas)');
                    recomendacao += 'Seu cabelo é misto, com oleosidade na raiz e ressecamento nas pontas. Use shampoos para controle de oleosidade no couro cabeludo e condicionadores/máscaras hidratantes nas pontas. Evite produtos pesados na raiz. Hidratações semanais são essenciais! ';
                } else if (scores.oleoso >= 2) {
                    tipoCabelo.push('Oleoso');
                    recomendacao += 'Seu cabelo tende a ser oleoso. Opte por shampoos adstringentes e que controlem a oleosidade na raiz. Evite condicionar a raiz e prefira produtos leves. Lave com frequência moderada e use finalizadores sem óleo. ';
                } else if (scores.seco >= 2) {
                    tipoCabelo.push('Seco');
                    recomendacao += 'Seu cabelo é seco e precisa de muita hidratação e nutrição. Use shampoos suaves e hidratantes, e invista em máscaras de tratamento profundas. Condicione bem as pontas e use óleos finalizadores para selar a umidade. ';
                } else {
                    tipoCabelo.push('Normal');
                    recomendacao += 'Seu cabelo é considerado normal, com um bom equilíbrio de oleosidade e hidratação. Mantenha uma rotina de cuidados equilibrada, com hidratações regulares para preservar a saúde dos fios. ';
                }

                // Curvatura
                const curvaturaOrder = ['crespo', 'cacheado', 'ondulado', 'liso'];
                let detectedCurvatura = '';
                for (const curv of curvaturaOrder) {
                    if (scores[curv] > 0) {
                        detectedCurvatura = curv.charAt(0).toUpperCase() + curv.slice(1);
                        tipoCabelo.push(detectedCurvatura);
                        break;
                    }
                }
                if (detectedCurvatura) {
                    recomendacao += `Para a sua curvatura ${detectedCurvatura}, foque em produtos que realcem a forma natural dos seus fios. `;
                }

                // Espessura
                const espessuraOrder = ['grosso', 'medio', 'fino'];
                let detectedEspessura = '';
                for (const esp of espessuraOrder) {
                    if (scores[esp] > 0) {
                        detectedEspessura = esp.charAt(0).toUpperCase() + esp.slice(1);
                        tipoCabelo.push(detectedEspessura);
                        break;
                    }
                }
                if (detectedEspessura) {
                    recomendacao += `Sendo um cabelo ${detectedEspessura}, ele tem necessidades específicas de tratamento e produtos. `;
                }

                // Porosidade
                const porosidadeOrder = ['alta_porosidade', 'media_porosidade', 'baixa_porosidade'];
                let detectedPorosidade = '';
                for (const poro of porosidadeOrder) {
                    if (scores[poro] > 0) {
                        detectedPorosidade = poro.replace('_', ' ').replace('porosidade', 'Porosidade').charAt(0).toUpperCase() + poro.replace('_', ' ').slice(1);
                        tipoCabelo.push(detectedPorosidade);
                        break;
                    }
                }
                if (detectedPorosidade === 'Alta porosidade') {
                    recomendacao += 'Sua alta porosidade indica que o cabelo absorve, mas perde água rapidamente. Invista em reconstruções e nutrições para selar as cutículas. ';
                } else if (detectedPorosidade === 'Baixa porosidade') {
                    recomendacao += 'Sua baixa porosidade dificulta a absorção de produtos. Prefira produtos mais leves e que penetrem melhor, use calor úmido para abrir as cutículas. ';
                } else if (detectedPorosidade === 'Média porosidade') {
                    recomendacao += 'Com média porosidade, seu cabelo tem bom equilíbrio. Mantenha uma rotina balanceada de hidratação e nutrição. ';
                }
                 if (scores.opaco > scores.brilhoso) {
                    recomendacao += 'A opacidade sugere falta de hidratação ou selagem das cutículas. Adicione mais brilho com óleos finalizadores e máscaras hidratantes. ';
                 }
                if (scores.muito_calor > 0 || scores.muito_embaraca > 0) {
                    recomendacao += 'O uso frequente de calor e o embaraçamento excessivo podem indicar danos. Use protetor térmico e invista em tratamentos de reparação. ';
                }


                return {
                    title: `Seu Cabelo: ${tipoCabelo.join(', ')}!`,
                    description: `<p>${recomendacao} Lembre-se: A Mawira tem os produtos e dicas ideais para a sua rotina capilar!</p>`,
                    type: tipoCabelo.join(', ') // Valor consolidado para salvar no perfil
                };
            }
        },
        {
            id: 'rotina-ideal',
            title: 'Rotina ideal para seus fios',
            description: 'Descubra a frequência e os produtos certos para sua rotina de cuidados.',
            questions: [
                {
                    question: 'Qual o seu principal objetivo com os cuidados capilares?',
                    image: 'images/objetivo-cabelo.jpg',
                    options: [
                        { text: 'Hidratação profunda e maciez', value: 'hidratacao' },
                        { text: 'Controle de oleosidade e limpeza', value: 'oleosidade' },
                        { text: 'Força, crescimento e anti-queda', value: 'forca_crescimento' },
                        { text: 'Definição de cachos/ondas', value: 'definicao' },
                        { text: 'Reparação de danos e brilho', value: 'reparacao' },
                        { text: 'Redução de frizz e alinhamento', value: 'frizz' }
                    ]
                },
                {
                    question: 'Com que frequência você consegue dedicar tempo aos cuidados capilares?',
                    image: 'images/tempo-cabelo.jpg',
                    options: [
                        { text: 'Diariamente ou quase todos os dias', value: 'rotina_diaria' },
                        { text: 'Algumas vezes por semana', value: 'rotina_semanal' },
                        { text: '1-2 vezes por semana, no máximo', value: 'rotina_ocasional' },
                        { text: 'Preciso de algo muito rápido e prático', value: 'rotina_rapida' }
                    ]
                },
                {
                    question: 'Você utiliza ou pretende utilizar tratamentos mais intensivos (máscaras, ampolas, óleos)?',
                    image: 'images/tratamento-intensivo.jpg',
                    options: [
                        { text: 'Sim, gosto de tratamentos profundos', value: 'intensivo_sim' },
                        { text: 'Talvez, se for prático', value: 'intensivo_talvez' },
                        { text: 'Não, prefiro o básico', value: 'intensivo_nao' }
                    ]
                },
                {
                    question: 'Qual é a condição atual do seu cabelo?',
                    image: 'images/condicao-cabelo.jpg',
                    options: [
                        { text: 'Saudável, sem danos aparentes', value: 'condicao_saudavel' },
                        { text: 'Ressecado e com pontas duplas', value: 'condicao_ressecado' },
                        { text: 'Quebradiço e elástico', value: 'condicao_danificado' },
                        { text: 'Oleoso na raiz e seco nas pontas', value: 'condicao_misto' }
                    ]
                },
                {
                    question: 'Você tem preferência por produtos veganos, naturais ou com ingredientes específicos?',
                    image: 'images/preferencia-ingredientes.jpg',
                    options: [
                        { text: 'Sim, naturais/veganos', value: 'pref_natural' },
                        { text: 'Sem preferência, o que funcionar', value: 'pref_neutra' },
                        { text: 'Não me importo com ingredientes, apenas resultado', value: 'pref_resultado' }
                    ]
                },
                {
                    question: 'Seu cabelo reage melhor a produtos com ou sem sulfato?',
                    image: 'images/sulfato-cabelo.jpg',
                    options: [
                        { text: 'Com sulfato, sinto que limpa mais', value: 'pref_sulfato' },
                        { text: 'Sem sulfato, para limpeza suave', value: 'pref_sem_sulfato' },
                        { text: 'Não sei/não tenho preferência', value: 'pref_nao_sei' }
                    ]
                },
                {
                    question: 'Você costuma usar protetor térmico antes de ferramentas de calor?',
                    image: 'images/protetor-termico.jpg',
                    options: [
                        { text: 'Sempre', value: 'usa_protetor' },
                        { text: 'Às vezes', value: 'as_vezes_protetor' },
                        { text: 'Nunca', value: 'nunca_protetor' }
                    ]
                },
                {
                    question: 'Você realiza cronograma capilar ou pretende começar?',
                    image: 'images/cronograma-capilar.jpg',
                    options: [
                        { text: 'Já faço ou quero começar', value: 'cronograma_sim' },
                        { text: 'Talvez no futuro, se for simples', value: 'cronograma_talvez' },
                        { text: 'Não me interesso/não tenho tempo', value: 'cronograma_nao' }
                    ]
                },
                {
                    question: 'Qual a sua principal preocupação com o couro cabeludo?',
                    image: 'images/preocupacao-couro.jpg',
                    options: [
                        { text: 'Oleosidade excessiva', value: 'couro_oleoso' },
                        { text: 'Ressecamento ou caspa', value: 'couro_seco_caspa' },
                        { text: 'Sensibilidade ou coceira', value: 'couro_sensivel' },
                        { text: 'Queda ou afinamento', value: 'couro_queda' },
                        { text: 'Saudável, sem preocupações', value: 'couro_saudavel' }
                    ]
                }
            ],
            calculateResult: (answers) => {
                const scores = {
                    hidratacao: 0, oleosidade: 0, forca_crescimento: 0, definicao: 0, reparacao: 0, frizz: 0,
                    rotina_diaria: 0, rotina_semanal: 0, rotina_ocasional: 0, rotina_rapida: 0,
                    intensivo_sim: 0, intensivo_talvez: 0, intensivo_nao: 0,
                    condicao_saudavel: 0, condicao_ressecado: 0, condicao_danificado: 0, condicao_misto: 0,
                    pref_natural: 0, pref_neutra: 0, pref_resultado: 0,
                    pref_sulfato: 0, pref_sem_sulfato: 0, pref_nao_sei: 0,
                    usa_protetor: 0, as_vezes_protetor: 0, nunca_protetor: 0,
                    cronograma_sim: 0, cronograma_talvez: 0, cronograma_nao: 0,
                    couro_oleoso: 0, couro_seco_caspa: 0, couro_sensivel: 0, couro_queda: 0, couro_saudavel: 0
                };

                answers.forEach(answer => {
                    scores[answer.value]++;
                });

                let rotinaRecomendada = '';
                let tipoRotina = [];

                // Objetivos
                if (scores.hidratacao) tipoRotina.push('foco em Hidratação');
                if (scores.oleosidade) tipoRotina.push('foco em Controle de Oleosidade');
                if (scores.forca_crescimento) tipoRotina.push('foco em Força e Crescimento');
                if (scores.definicao) tipoRotina.push('foco em Definição');
                if (scores.reparacao) tipoRotina.push('foco em Reparação');
                if (scores.frizz) tipoRotina.push('foco em Anti-frizz');

                rotinaRecomendada += `Sua rotina ideal tem ${tipoRotina.join(' e ')}. `;

                // Tempo disponível
                if (scores.rotina_diaria) rotinaRecomendada += 'Você pode investir em uma rotina completa, com etapas diárias e complementos. ';
                else if (scores.rotina_semanal) rotinaRecomendada += 'Uma rotina semanal com produtos eficientes e hidratações regulares será perfeita. ';
                else if (scores.rotina_ocasional || scores.rotina_rapida) rotinaRecomendada += 'Priorize produtos multifuncionais e leave-ins que otimizem seu tempo. ';

                // Tratamentos intensivos
                if (scores.intensivo_sim || scores.cronograma_sim) {
                    rotinaRecomendada += 'Para você, o cronograma capilar será muito benéfico, alternando hidratação, nutrição e reconstrução. ';
                } else if (scores.intensivo_talvez || scores.cronograma_talvez) {
                    rotinaRecomendada += 'Experimente iniciar com máscaras semanais e observe os resultados. ';
                }

                // Condição do cabelo
                if (scores.condicao_danificado || scores.condicao_ressecado) {
                    rotinaRecomendada += 'Seu cabelo precisa de atenção extra para reparar danos. Fique de olho em linhas reconstrutoras e nutritivas. ';
                } else if (scores.condicao_misto) {
                    rotinaRecomendada += 'Use produtos específicos para raízes oleosas e pontas secas, equilibrando o tratamento. ';
                }

                // Preferências de produto
                if (scores.pref_natural) rotinaRecomendada += 'Busque linhas de produtos naturais ou veganos, que se alinham à sua preferência. ';
                if (scores.pref_sem_sulfato) rotinaRecomendada += 'Produtos sem sulfato serão ideais para uma limpeza mais suave. ';

                // Proteção térmica
                if (scores.nunca_protetor || scores.as_vezes_protetor) {
                    rotinaRecomendada += 'É fundamental usar protetor térmico sempre que usar calor para evitar danos futuros. ';
                }

                // Couro cabeludo
                if (scores.couro_oleoso) rotinaRecomendada += 'Inclua shampoos e tônicos que controlem a oleosidade do couro cabeludo. ';
                if (scores.couro_seco_caspa) rotinaRecomendada += 'Procure produtos específicos para ressecamento ou caspa no couro cabeludo. ';
                if (scores.couro_sensivel) rotinaRecomendada += 'Produtos suaves e hipoalergênicos serão melhores para seu couro cabeludo sensível. ';
                if (scores.couro_queda) rotinaRecomendada += 'Considere tônicos e shampoos fortalecedores para ajudar na queda capilar. ';

                return {
                    title: 'Sua Rotina de Cuidados Ideal!',
                    description: `<p>${rotinaRecomendada} Na Mawira, você encontra tudo para montar essa rotina perfeita!</p>`,
                    type: 'Rotina Ideal'
                };
            }
        },
        {
            id: 'saude-capilar',
            title: 'Como está sua saúde capilar?',
            description: 'Avalie a saúde dos seus fios e couro cabeludo para identificar problemas.',
            questions: [
                {
                    question: 'Você nota queda de cabelo acima do normal?',
                    image: 'images/queda-cabelo.jpg',
                    options: [
                        { text: 'Sim, muitos fios na escova e no banho', value: 'queda_severa' },
                        { text: 'Um pouco mais que o normal', value: 'queda_moderada' },
                        { text: 'Não, queda normal', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Seu cabelo está com as pontas duplas, ressecadas ou espigadas?',
                    image: 'images/pontas-danificadas.jpg',
                    options: [
                        { text: 'Sim, visivelmente danificadas', value: 'pontas_danificadas' },
                        { text: 'Um pouco ressecadas', value: 'pontas_ressecadas' },
                        { text: 'Não, estão saudáveis', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Qual a elasticidade do seu cabelo quando molhado? (Puxe um fio delicadamente)',
                    image: 'images/elasticidade-cabelo.jpg',
                    options: [
                        { text: 'Estica muito e não volta, ou quebra fácil (elástico/quebradiço)', value: 'danificado_elastico' },
                        { text: 'Estica e volta, mas não muito (normal)', value: 'saudavel_geral' },
                        { text: 'Não estica quase nada (rígido)', value: 'danificado_rigido' }
                    ]
                },
                {
                    question: 'Seu couro cabeludo apresenta coceira, vermelhidão ou descamação?',
                    image: 'images/couro-irritado.jpg',
                    options: [
                        { text: 'Sim, frequentemente', value: 'couro_problema_grave' },
                        { text: 'Às vezes, um pouco', value: 'couro_problema_leve' },
                        { text: 'Não, é saudável', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Seu cabelo está opaco, sem brilho e sem vida?',
                    image: 'images/cabelo-sem-brilho.jpg',
                    options: [
                        { text: 'Sim, ele está bem opaco', value: 'opaco_sem_vida' },
                        { text: 'Um pouco opaco em algumas áreas', value: 'leve_opaco' },
                        { text: 'Não, ele tem brilho natural', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Você faz uso frequente de química (coloração, descoloração, alisamento, permanente)?',
                    image: 'images/quimica-cabelo.jpg',
                    options: [
                        { text: 'Sim, frequentemente ou recente', value: 'uso_quimica' },
                        { text: 'Às vezes, mas com cautela', value: 'uso_moderado_quimica' },
                        { text: 'Não, meu cabelo não tem química', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Seu cabelo está com frizz excessivo e difícil de controlar?',
                    image: 'images/frizz-excessivo.jpg',
                    options: [
                        { text: 'Sim, muito frizz', value: 'frizz_alto' },
                        { text: 'Um pouco de frizz, normal', value: 'frizz_normal' },
                        { text: 'Não, ele é bem alinhado', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Você nota que seu cabelo tem dificuldade para crescer ou está afinando?',
                    image: 'images/crescimento-afinamento.jpg',
                    options: [
                        { text: 'Sim, cresce devagar e está afinando', value: 'crescimento_lento_afinamento' },
                        { text: 'Cresce normalmente, mas me preocupo', value: 'crescimento_normal' },
                        { text: 'Não, ele cresce bem e é encorpado', value: 'saudavel_geral' }
                    ]
                },
                {
                    question: 'Você costuma sentir dor ou sensibilidade ao tocar o couro cabeludo?',
                    image: 'images/couro-sensibilidade.jpg',
                    options: [
                        { text: 'Sim, com frequência', value: 'couro_sensivel' },
                        { text: 'Às vezes, dependendo do produto', value: 'couro_leve_sensivel' },
                        { text: 'Não, é tranquilo', value: 'saudavel_geral' }
                    ]
                }
            ],
            calculateResult: (answers) => {
                const healthScores = {
                    saudavel: 0, queda: 0, pontas: 0, elasticidade: 0, couro: 0,
                    brilho: 0, quimica: 0, frizz: 0, crescimento: 0, sensibilidade: 0
                };

                answers.forEach(answer => {
                    if (answer.value.includes('saudavel_geral')) healthScores.saudavel++;
                    if (answer.value.includes('queda')) healthScores.queda++;
                    if (answer.value.includes('pontas')) healthScores.pontas++;
                    if (answer.value.includes('elastico') || answer.value.includes('rigido')) healthScores.elasticidade++;
                    if (answer.value.includes('couro_problema') || answer.value.includes('couro_sensivel')) healthScores.couro++;
                    if (answer.value.includes('opaco')) healthScores.brilho++;
                    if (answer.value.includes('quimica')) healthScores.quimica++;
                    if (answer.value.includes('frizz_alto')) healthScores.frizz++;
                    if (answer.value.includes('crescimento_lento_afinamento')) healthScores.crescimento++;
                    if (answer.value.includes('couro_sensivel') || answer.value.includes('couro_leve_sensivel')) healthScores.sensibilidade++;
                });

                let resultTitleText = 'Sua Saúde Capilar está Ótima!';
                let resultDescriptionText = '<p>Parabéns! Seus cabelos demonstram saúde e vitalidade. Continue com seus cuidados e explore nossos produtos para manter essa beleza.</p>';
                let resultType = 'Saudável';

                const totalIssues = healthScores.queda + healthScores.pontas + healthScores.elasticidade +
                                   healthScores.couro + healthScores.brilho + healthScores.quimica +
                                   healthScores.frizz + healthScores.crescimento + healthScores.sensibilidade;

                if (totalIssues > 4) {
                    resultTitleText = 'Sua Saúde Capilar Precisa de Atenção!';
                    resultDescriptionText = '<p>Identificamos múltiplos sinais de que seu cabelo pode estar precisando de cuidados mais intensivos. Recomendamos uma avaliação profissional e o uso de produtos específicos para reparação profunda, nutrição e fortalecimento.</p>';
                    resultType = 'Altamente Comprometida';
                } else if (totalIssues >= 2) {
                    resultTitleText = 'Sua Saúde Capilar Apresenta Alguns Desafios.';
                    resultDescriptionText = '<p>Seu cabelo mostra alguns sinais de alerta. É hora de focar em tratamentos direcionados. Invista em hidratação, nutrição e produtos específicos para as suas principais preocupações.</p>';
                    resultType = 'Com Desafios';
                }

                if (healthScores.queda >= 1) resultDescriptionText += '<p><strong>Queda:</strong> Considere produtos fortalecedores e que estimulem o couro cabeludo. Em casos persistentes, procure um dermatologista.</p>';
                if (healthScores.pontas >= 1) resultDescriptionText += '<p><strong>Pontas:</strong> Máscaras nutritivas e óleos reparadores de pontas são essenciais.</p>';
                if (healthScores.elasticidade >= 1) resultDescriptionText += '<p><strong>Elasticidade/Quebra:</strong> Seu cabelo pode precisar de reconstrução com proteínas. Reduza o uso de ferramentas de calor e químicas.</p>';
                if (healthScores.couro >= 1) resultDescriptionText += '<p><strong>Couro Cabeludo:</strong> Opte por shampoos e tônicos específicos para o seu problema (caspa, oleosidade, sensibilidade).</p>';
                if (healthScores.brilho >= 1) resultDescriptionText += '<p><strong>Brilho:</strong> Aumente a frequência de hidratações e use finalizadores com brilho.</p>';
                if (healthScores.quimica >= 1) resultDescriptionText += '<p><strong>Química:</strong> Invista em linhas pós-química para recuperação e proteção contínua.</p>';
                if (healthScores.frizz >= 1) resultDescriptionText += '<p><strong>Frizz:</strong> Produtos antifrizz, leave-ins e umectações podem ajudar a selar as cutículas.</p>';
                if (healthScores.crescimento >= 1) resultDescriptionText += '<p><strong>Crescimento:</strong> Use tônicos e shampoos com ativos que estimulem o crescimento saudável.</p>';
                if (healthScores.sensibilidade >= 1) resultDescriptionText += '<p><strong>Sensibilidade:</strong> Prefira produtos suaves e evite coçar ou agredir o couro.</p>';


                return {
                    title: resultTitleText,
                    description: resultDescriptionText + '<p>A Mawira tem a solução para cada um desses desafios!</p>',
                    type: resultType
                };
            }
        }
    ];

    // --- Funções de Exibição ---

    // Exibe a listagem de quizzes
    function showQuizList() {
        quizListSection.classList.add('active');
        quizInterfaceSection.classList.remove('active');
        quizResultSection.classList.remove('active');
        renderQuizCards();
        // Resetar estado do quiz
        currentQuiz = null;
        currentQuestionIndex = 0;
        userAnswers = [];
        // Limpa a imagem da pergunta anterior
        questionImageContainer.innerHTML = '';
    }

    // Renderiza os cards de quizzes na listagem
    function renderQuizCards() {
        quizCardsGrid.innerHTML = ''; // Limpa antes de renderizar
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            quizCard.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <button class="btn btn-primary start-quiz-btn" data-quiz-id="${quiz.id}">Fazer Quiz</button>
            `;
            quizCardsGrid.appendChild(quizCard);

            quizCard.querySelector('.start-quiz-btn').addEventListener('click', () => startQuiz(quiz.id));
        });
    }

    // Inicia um quiz específico
    function startQuiz(quizId) {
        currentQuiz = quizzes.find(q => q.id === quizId);
        if (!currentQuiz) {
            console.error('Quiz não encontrado:', quizId);
            showQuizList(); // Volta para a lista se o quiz não for encontrado
            return;
        }

        currentQuestionIndex = 0;
        userAnswers = [];
        currentQuizTitle.textContent = currentQuiz.title;

        quizListSection.classList.remove('active');
        quizResultSection.classList.remove('active');
        quizInterfaceSection.classList.add('active');

        renderQuestion();
    }

    // Renderiza a pergunta atual
    function renderQuestion() {
        const question = currentQuiz.questions[currentQuestionIndex];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = ''; // Limpa as opções anteriores

        // Adiciona imagem da pergunta, se existir
        questionImageContainer.innerHTML = ''; // Limpa imagem anterior
        if (question.image) {
            const img = document.createElement('img');
            img.src = question.image;
            img.alt = question.question; // Alt text para acessibilidade
            questionImageContainer.appendChild(img);
        }

        // Atualiza barra de progresso e texto
        const totalQuestions = currentQuiz.questions.length;
        progressBarFill.style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;
        progressText.textContent = `Questão ${currentQuestionIndex + 1} de ${totalQuestions}`;

        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option-button');
            optionButton.textContent = option.text;
            optionButton.dataset.value = option.value;
            optionButton.dataset.questionId = currentQuestionIndex; // Armazena o ID da pergunta para referência

            // Se o usuário já respondeu a esta pergunta, marque a opção selecionada
            const previousAnswer = userAnswers[currentQuestionIndex];
            if (previousAnswer && previousAnswer.value === option.value) {
                optionButton.classList.add('selected');
            }

            optionButton.addEventListener('click', () => selectOption(optionButton, option.value, currentQuestionIndex));
            optionsContainer.appendChild(optionButton);
        });

        // Habilita/desabilita botões de navegação
        backButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = userAnswers[currentQuestionIndex] === undefined; // Desabilita se a pergunta atual não foi respondida
    }

    // Seleciona uma opção de resposta
    function selectOption(selectedButton, value, questionId) {
        // Remove 'selected' de todas as opções da pergunta atual
        Array.from(optionsContainer.children).forEach(button => {
            button.classList.remove('selected');
        });

        // Adiciona 'selected' à opção clicada
        selectedButton.classList.add('selected');

        // Salva a resposta do usuário
        userAnswers[questionId] = { questionId, value };

        // Habilita o botão 'Próxima Pergunta'
        nextButton.disabled = false;
    }

    // Navega para a próxima pergunta
    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            // Última pergunta, exibir resultado
            displayQuizResult();
        }
    });

    // Navega para a pergunta anterior
    backButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });

    // Exibe a página de resultado do quiz
    function displayQuizResult() {
        quizInterfaceSection.classList.remove('active');
        quizResultSection.classList.add('active');

        // Calcula o resultado com base nas respostas
        const result = currentQuiz.calculateResult(userAnswers);

        resultTitle.textContent = result.title;
        resultContent.innerHTML = result.description;

        // **IMPORTANTE:** Lógica para salvar no perfil do usuário (requer sistema de autenticação)
        // Isso é apenas um placeholder. Em um site real, você faria uma requisição AJAX/Fetch
        // para um endpoint do seu backend, passando o ID do usuário e o resultado.
        // Simulando que o usuário está logado (remova isso em um ambiente real)
        const userIsLoggedIn = () => true; // Simula usuário logado para fins de teste

        if (userIsLoggedIn()) {
             // Exemplo de como você salvaria (em um backend, seria uma requisição HTTP)
             console.log(`Usuário logado. Salvando resultado do quiz "${currentQuiz.title}" com o tipo: ${result.type}`);
             // localStorage.setItem(`mawira_quiz_${currentQuiz.id}_result`, result.type);
             // Ou enviar para o backend:
             // fetch('/api/save-quiz-result', {
             //    method: 'POST',
             //    headers: { 'Content-Type': 'application/json' },
             //    body: JSON.stringify({ quizId: currentQuiz.id, userId: 'ID_DO_USUARIO', resultType: result.type })
             // });
        } else {
            console.log("Usuário não logado. Resultado não salvo automaticamente.");
        }
    }

    // Botão para fazer outro quiz
    startNewQuizButton.addEventListener('click', () => {
        showQuizList();
    });

    // Botão para compartilhar resultado (Exemplo simples)
    shareResultButton.addEventListener('click', () => {
        const text = `Acabei de fazer o quiz "${currentQuiz.title}" na Mawira e descobri: ${resultTitle.textContent}! Descubra o seu também: ${window.location.origin}/quizzes.html`;
        if (navigator.share) {
            navigator.share({
                title: 'Mawira - Meu Resultado de Quiz',
                text: text,
                url: window.location.href // URL atual da página
            }).then(() => console.log('Conteúdo compartilhado com sucesso!'))
              .catch((error) => console.error('Erro ao compartilhar:', error));
        } else {
            // Fallback para navegadores sem Web Share API
            alert('Copie e cole este texto para compartilhar: \n\n' + text);
        }
    });

    // Botão "Ver Produtos Recomendados" (placeholder)
    viewProductsButton.addEventListener('click', () => {
        alert('Redirecionando para a página de produtos recomendados! (Funcionalidade futura)');
        // Implementar redirecionamento para uma página de produtos filtrados
    });


    // --- Inicialização ---
    showQuizList(); // Mostra a lista de quizzes ao carregar a página

    // Lógica do menu hambúrguer (reaproveitada de script.js, mas para garantir que funciona aqui)
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    hamburgerMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navList.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const blogPostListSection = document.getElementById('blogPostListSection');
    const singlePostSection = document.getElementById('singlePostSection');
    const postListContainer = document.querySelector('.post-list');
    const singlePostImage = document.getElementById('singlePostImage');
    const singlePostTitle = document.getElementById('singlePostTitle');
    const singlePostMeta = document.getElementById('singlePostMeta');
    const singlePostContent = document.getElementById('singlePostContent');
    const backToBlogListButton = document.getElementById('backToBlogListButton');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryLinks = document.querySelectorAll('.categories a');
    const sidebar = document.querySelector('.sidebar');

    // --- Elementos do DOM de Comentários e Avaliações ---
    const commentsSection = document.querySelector('.comments-section'); // Adicionado
    const averageRatingDisplay = document.getElementById('averageRatingDisplay');
    const totalReviewsCount = document.getElementById('totalReviewsCount');
    const starRatingDisplay = document.getElementById('starRatingDisplay');
    const commentForm = document.getElementById('commentForm');
    const commentNameInput = document.getElementById('commentName');
    const commentRatingStars = document.getElementById('commentRatingStars');
    const commentTextarea = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');
    const noCommentsMessage = commentsList.querySelector('.no-comments-message'); // Corrigido para ser dentro de commentsList

    let currentPostId = null; // ID do post atualmente exibido
    let selectedRating = 0; // Avaliação selecionada pelo usuário no formulário

    // --- Dados dos Posts (com um novo campo para 'averageRating' e 'reviewsCount') ---
    const blogPosts = [
        // Adicionei 'comments' como um array vazio para cada post.
        // Em um cenário real, isso viria de um servidor, não seria parte do blogPosts fixo.
        // No nosso caso, os comentários para um post específico serão carregados do localStorage.
        {
            id: 'hidratacao',
            title: 'A Importância da Hidratação Capilar para Cabelos Saudáveis',
            meta: 'Publicado em 15 de Junho de 2025',
            image: 'https://via.placeholder.com/350x200/87CEEB/FFFFFF?Text=Cuidados',
            categories: ['cuidados'],
            excerpt: 'A hidratação é um passo fundamental em qualquer rotina de cuidados capilares. Cabelos hidratados são mais maleáveis, brilhantes e menos propensos à quebra e ao ressecamento. Descubra os melhores ingredientes e técnicas para manter seus fios sempre hidratados...',
            content: `
                <p>A hidratação capilar é a chave para ter cabelos saudáveis e deslumbrantes. Muitas vezes, negligenciada, essa etapa é crucial para repor a água e os nutrientes essenciais que os fios perdem diariamente devido a fatores como sol, vento, poluição, uso de ferramentas térmicas e químicas.</p>
                <h3>Por que Hidratar é Essencial?</h3>
                <p>Cabelos hidratados são sinônimo de vida! Eles ficam mais macios, brilhantes, sedosos e com elasticidade, o que previne a quebra e o ressecamento. Além disso, a hidratação ajuda a selar as cutículas, protegendo o interior do fio e mantendo a cor e a saúde capilar por mais tempo.</p>
                <h3>Melhores Ingredientes para Hidratação</h3>
                <ul>
                    <li><strong>Aloe Vera (Babosa):</strong> Rica em vitaminas e minerais, a babosa hidrata, fortalece e auxilia no crescimento dos fios.</li>
                    <li><strong>Glicerina:</strong> Um umectante natural que atrai a umidade do ar para o cabelo, mantendo-o hidratado.</li>
                    <li><strong>D-Pantenol (Vitamina B5):</strong> Proporciona hidratação profunda, brilho e maciez, além de fortalecer a barreira protetora do cabelo.</li>
                    <li><strong>Extratos vegetais:</strong> Camomila, calêndula, algas marinhas e chás possuem propriedades hidratantes e calmantes.</li>
                </ul>
                <h3>Dicas para uma Hidratação Eficaz:</h3>
                <ol>
                    <li>Lave os cabelos com um shampoo suave e remova o excesso de água com uma toalha.</li>
                    <li>Aplique a máscara de hidratação mecha por mecha, enluvando bem os fios.</li>
                    <li>Deixe agir pelo tempo indicado na embalagem (geralmente de 5 a 15 minutos).</li>
                    <li>Enxágue abundantemente até remover todo o produto e finalize como de costume.</li>
                </ol>
                <p>Inclua a hidratação na sua rotina semanal ou a cada 15 dias, dependendo da necessidade do seu cabelo. Seus fios agradecerão com mais saúde e beleza!</p>
            `
        },
        {
            id: 'mascara-abacate',
            title: 'Receita Caseira de Máscara de Abacate para Nutrição Intensa',
            meta: 'Publicado em 10 de Junho de 2025',
            image: 'https://via.placeholder.com/350x200/90EE90/FFFFFF?Text=M%C3%A1scara%20Natural',
            categories: ['receitas-caseiras'],
            excerpt: 'O abacate é um ingrediente poderoso para nutrir profundamente os cabelos, graças às suas gorduras saudáveis, vitaminas e minerais. Aprenda a preparar uma máscara capilar caseira simples e eficaz para revitalizar seus fios...',
            content: `
                <p>O abacate não é apenas delicioso, é também um superalimento para os seus cabelos! Rico em vitaminas A, D, E e B6, além de minerais como potássio e ácido fólico, ele nutre profundamente os fios, promovendo brilho, maciez e fortalecimento. Esta máscara caseira é perfeita para cabelos secos, opacos e danificados.</p>
                <h3>Ingredientes:</h3>
                <ul>
                    <li>1/2 abacate maduro</li>
                    <li>1 colher de sopa de azeite de oliva extra virgem (ou óleo de coco)</li>
                    <li>1 colher de sopa de mel (opcional, para mais brilho)</li>
                </ul>
                <h3>Modo de Preparo e Aplicação:</h3>
                <ol>
                    <li>Em um recipiente, amasse o abacate até obter um purê homogêneo, sem pedaços.</li>
                    <li>Adicione o azeite de oliva (e o mel, se usar) e misture bem até formar uma pasta cremosa.</li>
                    <li>Lave os cabelos com shampoo e retire o excesso de água com uma toalha.</li>
                    <li>Com os cabelos úmidos, aplique a máscara mecha por mecha, do comprimento às pontas, evitando a raiz se seu cabelo for oleoso.</li>
                    <li>Deixe agir por 20 a 30 minutos. Você pode cobrir o cabelo com uma touca térmica ou plástica para potencializar o efeito.</li>
                    <li>Enxágue abundantemente com água fria ou morna para remover todo o produto. Finalize com condicionador.</li>
                </ol>
                <p>Use esta máscara uma vez por semana ou a cada 15 dias para cabelos visivelmente mais nutridos, brilhantes e macios. Seu cabelo vai amar essa dose extra de carinho da natureza!</p>
            `
        },
        {
            id: 'transicao-capilar',
            title: 'Dicas Essenciais para uma Transição Capilar Suave e Saudável',
            meta: 'Publicado em 05 de Junho de 2025',
            image: 'https://via.placeholder.com/350x200/D3D3D3/000000?Text=Transi%C3%A7%C3%A3o',
            categories: ['transicao-capilar'],
            excerpt: 'A transição capilar é um período de descobertas e paciência. Se você está deixando de lado químicas e buscando seus cachos ou ondas naturais, confira estas dicas para tornar essa jornada mais tranquila e fortalecer seus cabelos...',
            content: `
                <p>A transição capilar é uma jornada de autoconhecimento e aceitação, onde você decide parar de usar químicas alisantes para permitir que seu cabelo retorne à sua textura natural. É um período desafiador, com duas texturas no mesmo fio (a parte com química e a parte natural), mas recompensador.</p>
                <h3>Dicas para uma Transição Leve:</h3>
                <ul>
                    <li><strong>Paciência é Tudo:</strong> O cabelo cresce cerca de 1 a 1,5 cm por mês. A transição pode levar meses ou até anos. Seja paciente consigo mesma!</li>
                    <li><strong>Hidrate MUITO:</strong> Cabelos em transição precisam de hidratação, nutrição e reconstrução. Máscaras capilares ajudam a manter a saúde e o aspecto dos fios, minimizando a diferença de textura.</li>
                    <li><strong>Texturização:</strong> Use técnicas como twists, tranças, coquinhos ou fitagem para uniformizar as duas texturas e disfarçar a transição.</li>
                    <li><strong>Big Chop (BC):</strong> Em algum momento, você pode decidir cortar toda a parte quimicamente tratada. É um ato libertador e um novo começo!</li>
                    <li><strong>Evite Calor:</strong> Diminua ao máximo o uso de chapinhas, secadores e babyliss, pois o calor pode danificar ainda mais a parte natural do cabelo.</li>
                    <li><strong>Seja Gentil:</strong> Desembarace os fios com cuidado, começando pelas pontas e subindo para a raiz. Use um pente de dentes largos ou os dedos.</li>
                </ul>
                <p>Lembre-se, cada transição é única. Celebrar cada pequena vitória e focar na saúde dos seus fios fará toda a diferença. Bem-vinda de volta aos seus cachos (ou ondas) naturais!</p>
            `
        },
        {
            id: 'queda-capilar',
            title: 'Entenda as Causas da Queda Capilar e Saiba Como Tratar',
            meta: 'Publicado em 01 de Junho de 2025',
            image: 'https://via.placeholder.com/350x200/F08080/FFFFFF?Text=Queda%20Capilar',
            categories: ['problemas-capilares'],
            excerpt: 'A queda de cabelo pode ser preocupante e afetar a autoestima. Neste artigo, exploramos as principais causas da queda capilar, desde fatores genéticos até hábitos de vida, e apresentamos algumas formas de tratamento e prevenção...',
            content: `
                <p>É normal perder de 50 a 100 fios de cabelo por dia, mas quando essa queda se torna excessiva, pode ser um sinal de que algo não vai bem. A queda capilar pode ter diversas causas, desde fatores simples e temporários até condições médicas mais sérias.</p>
                <h3>Principais Causas da Queda Capilar:</h3>
                <ul>
                    <li><strong>Estresse:</strong> Períodos de estresse físico ou emocional intenso podem levar à queda.</li>
                    <li><strong>Deficiências Nutricionais:</strong> Falta de vitaminas (como B12 e D), ferro, zinco e proteínas.</li>
                    <li><strong>Alterações Hormonais:</strong> Gravidez, pós-parto, menopausa, problemas de tireoide.</li>
                    <li><strong>Genética:</strong> A alopecia androgenética (calvície hereditária) é uma causa comum.</li>
                    <li><strong>Uso Excessivo de Produtos Químicos:</strong> Alisamentos, tinturas e descolorações frequentes.</li>
                    <li><strong>Penteados Apertados:</strong> Rabos de cavalo e tranças muito apertadas podem causar tração.</li>
                    <li><strong>Condições do Couro Cabeludo:</strong> Dermatite seborreica (caspa severa), micoses.</li>
                    <li><strong>Medicamentos:</strong> Alguns medicamentos podem ter a queda como efeito colateral.</li>
                </ul>
                <h3>Como Tratar e Prevenir:</h3>
                <ol>
                    <li><strong>Procure um Especialista:</strong> O primeiro passo é consultar um dermatologista para identificar a causa exata.</li>
                    <li><strong>Alimentação Equilibrada:</strong> Garanta uma dieta rica em nutrientes essenciais.</li>
                    <li><strong>Reduza o Estresse:</strong> Pratique exercícios, meditação ou outras atividades relaxantes.</li>
                    <li><strong>Cuidados Gentis:</strong> Evite prender o cabelo muito apertado, use produtos adequados e manuseie os fios com delicadeza.</li>
                    <li><strong>Tratamentos Tópicos:</strong> Shampoos e tônicos específicos podem ajudar a fortalecer o folículo.</li>
                </ol>
                <p>Com o diagnóstico correto e o tratamento adequado, é possível controlar a queda e recuperar a saúde dos seus cabelos.</p>
            `
        },
        {
            id: 'nutricao-capilar',
            title: 'Nutrição Capilar: Alimentos e Produtos Essenciais para Fios Fortes',
            meta: 'Publicado em 25 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/FFA07A/FFFFFF?Text=Nutri%C3%A7%C3%A3o',
            categories: ['cuidados'],
            excerpt: 'Assim como o nosso corpo, o cabelo também precisa de nutrientes para se manter forte e saudável. Descubra quais alimentos incluir na sua dieta e quais produtos de nutrição capilar podem fazer a diferença na saúde dos seus fios...',
            content: `
                <p>A nutrição capilar é um tratamento que repõe lipídios (óleos e gorduras) nos fios, essenciais para manter a hidratação, a elasticidade e o brilho. Cabelos desnutridos tendem a ser secos, ásperos e com frizz. Incorporar a nutrição na sua rotina é fundamental para a saúde capilar.</p>
                <h3>Alimentos para Cabelos Nutridos de Dentro para Fora:</h3>
                <ul>
                    <li><strong>Abacate:</strong> Rico em gorduras saudáveis e vitaminas, promove brilho e maciez.</li>
                    <li><strong>Castanhas e Sementes:</strong> Fontes de ômega-3, zinco e vitamina E, que fortalecem os fios.</li>
                    <li><strong>Peixes Gordurosos:</strong> Salmão e atum fornecem ômega-3, essencial para a saúde do couro cabeludo.</li>
                    <li><strong>Ovos:</strong> Ótima fonte de proteínas e biotina, importantes para o crescimento.</li>
                    <li><strong>Folhas Verdes Escuras:</strong> Espinafre e couve são ricos em ferro e vitamina A.</li>
                </ul>
                <h3>Produtos e Ingredientes Essenciais para Nutrição:</h3>
                <p>Máscaras nutritivas e óleos capilares são os grandes aliados da nutrição. Procure por ingredientes como:</p>
                <ul>
                    <li><strong>Óleos Vegetais Puros:</strong> Coco, argan, rícino, azeite de oliva, abacate. Podem ser usados em umectações ou adicionados à máscara.</li>
                    <li><strong>Manteigas Vegetais:</strong> Karité e cacau são ricas em ácidos graxos, promovendo emoliência.</li>
                    <li><strong>Ceramidas:</strong> Ajudam a reter a umidade e a manter a integridade da fibra capilar.</li>
                    <li><strong>Vitaminas Lipossolúveis:</strong> Como a Vitamina E, que tem ação antioxidante.</li>
                </ul>
                <h3>Quando e Como Fazer a Nutrição?</h3>
                <p>A nutrição pode ser feita semanalmente ou a cada 15 dias, dependendo da necessidade do seu cabelo. Após lavar o cabelo com shampoo, aplique a máscara nutritiva mecha por mecha, enluvando bem. Deixe agir pelo tempo indicado e enxágue. Para umectação, aplique óleos vegetais nos fios secos e "sujos" antes de lavar, deixe agir por algumas horas ou durante a noite, e depois lave normalmente.</p>
                <p>Cabelos nutridos são sinônimo de maciez, brilho e vitalidade. Invista nesse cuidado e veja a transformação!</p>
            `
        },
        {
            id: 'reconstrucao',
            title: 'Reconstrução Capilar: O Que É e Quando Fazer para Salvar Seus Fios',
            meta: 'Publicado em 20 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/B0C4DE/FFFFFF?Text=Reconstru%C3%A7%C3%A3o',
            categories: ['cuidados'],
            excerpt: 'A reconstrução capilar é um tratamento intensivo para cabelos danificados, quebradiços e quimicamente tratados. Ela repõe a massa capilar perdida, fortalecendo os fios de dentro para fora. Saiba quando e como realizar a reconstrução...',
            content: `
                <p>A reconstrução capilar é um dos três pilares do cronograma capilar (junto com hidratação e nutrição), sendo a etapa mais potente e essencial para cabelos que sofrem com danos intensos. Seu objetivo é repor a massa capilar, ou seja, as proteínas que compõem o fio, como a queratina, que são perdidas devido a processos químicos, calor excessivo e agressões externas.</p>
                <h3>Quando o Cabelo Precisa de Reconstrução?</h3>
                <p>Se seus cabelos estão:</p>
                <ul>
                    <li>Elásticos e emborrachados (principalmente após química)</li>
                    <li>Quebradiços e com pontas duplas visíveis</li>
                    <li>Porosos e sem brilho</li>
                    <li>Finos e fragilizados</li>
                    <li>Passando por processos químicos como descoloração, coloração, alisamento</li>
                </ul>
                <p>Esses são sinais claros de que seus fios precisam de uma injeção de proteínas para recuperar sua estrutura e resistência.</p>
                <h3>Principais Ingredientes da Reconstrução:</h3>
                <ul>
                    <li><strong>Queratina:</strong> A principal proteína do cabelo, repõe a massa capilar.</li>
                    <li><strong>Aminoácidos:</strong> Pequenas unidades que formam as proteínas, como arginina, cisteína.</li>
                    <li><strong>Colágeno:</strong> Contribui para a elasticidade e resistência.</li>
                    <li><strong>Proteínas Vegetais:</strong> Trigo, arroz, soja - alternativas para quem prefere evitar ingredientes de origem animal.</li>
                </ul>
                <h3>Como Fazer a Reconstrução:</h3>
                <ol>
                    <li>Lave os cabelos com um shampoo antirresíduos ou um shampoo suave.</li>
                    <li>Aplique a máscara reconstrutora mecha por mecha, enluvando bem os fios.</li>
                    <li>Deixe agir pelo tempo indicado na embalagem (geralmente de 5 a 15 minutos).</li>
                    <li>Enxágue abundantemente e finalize com um condicionador ou leave-in.</li>
                </ol>
                <p>A frequência da reconstrução depende do nível de dano. Para cabelos muito danificados, pode ser a cada 15 dias. Para manutenção, uma vez por mês é suficiente. O excesso de reconstrução pode deixar os fios rígidos, então use com moderação e siga as necessidades do seu cabelo!</p>
            `
        },
        {
            id: 'tonico-alecrim',
            title: 'Tônico Capilar Caseiro de Alecrim para Estimular o Crescimento',
            meta: 'Publicado em 18 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/DAA520/FFFFFF?Text=T%C3%B4nico%20Capilar',
            categories: ['receitas-caseiras'],
            excerpt: 'O alecrim é conhecido por suas propriedades que estimulam a circulação sanguínea no couro cabeludo, favorecendo o crescimento saudável dos fios. Aprenda a preparar um tônico caseiro simples e natural para turbinar seu projeto Rapunzel...',
            content: `
                <p>O alecrim é uma erva aromática poderosa, não só na culinária, mas também nos cuidados capilares. Suas propriedades estimulantes e antioxidantes o tornam um excelente aliado para quem busca acelerar o crescimento dos fios, combater a queda e fortalecer o couro cabeludo.</p>
                <h3>Benefícios do Alecrim para o Cabelo:</h3>
                <ul>
                    <li><strong>Estimula o Crescimento:</strong> Aumenta a circulação sanguínea no couro cabeludo, levando mais nutrientes para os folículos.</li>
                    <li><strong>Combate a Queda:</strong> Fortalece os fios desde a raiz, reduzindo a quebra.</li>
                    <li><strong>Ação Antifúngica e Antibacteriana:</strong> Ajuda a combater problemas como caspa e dermatite.</li>
                    <li><strong>Brilho e Maciez:</strong> Contribui para um cabelo mais saudável e com aspecto vibrante.</li>
                </ul>
                <h3>Receita do Tônico Capilar de Alecrim:</h3>
                <h4>Ingredientes:</h4>
                <ul>
                    <li>2 ramos de alecrim fresco (ou 2 colheres de sopa de alecrim seco)</li>
                    <li>250ml de água filtrada</li>
                </ul>
                <h4>Modo de Preparo:</h4>
                <ol>
                    <li>Em uma panela, leve a água para ferver.</li>
                    <li>Quando a água ferver, adicione o alecrim e desligue o fogo.</li>
                    <li>Tampe a panela e deixe em infusão por cerca de 30 minutos (até esfriar).</li>
                    <li>Coe a mistura para remover os ramos de alecrim.</li>
                    <li>Transfira o tônico para um borrifador limpo e esterilizado.</li>
                </ol>
                <h3>Como Usar:</h3>
                <p>Aplique o tônico diretamente no couro cabeludo limpo (após a lavagem ou nos dias alternados), massageando suavemente com as pontas dos dedos. Não é necessário enxaguar. Use 2 a 3 vezes por semana. Guarde na geladeira por até 7 dias.</p>
                <p>Com uso contínuo, você notará cabelos mais fortes, com menos queda e um crescimento saudável. Experimente o poder da natureza!</p>
            `
        },
        {
            id: 'adeus-caspa',
            title: 'Adeus Caspa: Causas, Sintomas e Melhores Tratamentos Eficazes',
            meta: 'Publicado em 12 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/DDA0DD/FFFFFF?Text=Caspa',
            categories: ['problemas-capilares'],
            excerpt: 'A caspa é um problema comum do couro cabeludo que pode causar coceira e descamação. Entender suas causas é o primeiro passo para um tratamento eficaz. Descubra os produtos e hábitos que podem te ajudar a se livrar da caspa...',
            content: `
                <p>A caspa, clinicamente conhecida como dermatite seborreica do couro cabeludo, é uma condição comum que causa descamação e, muitas vezes, coceira. Embora não seja contagiosa nem grave, pode ser bastante incômoda e afetar a autoestima.</p>
                <h3>Principais Causas da Caspa:</h3>
                <ul>
                    <li><strong>Produção Excessiva de Óleo:</strong> O couro cabeludo oleoso cria um ambiente propício para o fungo <em>Malassezia globosa</em>, que se alimenta do óleo.</li>
                    <li><strong>Fungo <em>Malassezia globosa</em>:</strong> Presente naturalmente no couro cabeludo, ele pode se proliferar em excesso, irritando a pele.</li>
                    <li><strong>Estresse:</strong> Períodos de estresse podem agravar a condição.</li>
                    <li><strong>Mudanças Hormonais:</strong> Flutuações hormonais podem influenciar a produção de sebo.</li>
                    <li><strong>Clima:</strong> Temperaturas extremas, tanto muito frio quanto muito calor.</li>
                    <li><strong>Falta de Higiene:</strong> Lavar o cabelo com pouca frequência pode levar ao acúmulo de óleo e células mortas.</li>
                    <li><strong>Sensibilidade a Produtos:</strong> Reação a certos shampoos, condicionadores ou produtos capilares.</li>
                </ul>
                <h3>Sintomas Comuns:</h3>
                <ul>
                    <li>Flocos brancos ou amarelados no cabelo e ombros.</li>
                    <li>Coceira intensa no couro cabeludo.</li>
                    <li>Vermelhidão ou irritação do couro cabeludo.</li>
                </ul>
                <h3>Tratamentos Eficazes e Hábitos a Adotar:</h3>
                <ol>
                    <li><strong>Shampoos Anticaspa:</strong> Contêm ingredientes como piritionato de zinco, sulfeto de selênio, cetoconazol ou alcatrão de hulha, que combatem o fungo.</li>
                    <li><strong>Lave Regularmente:</strong> Mantenha o couro cabeludo limpo para evitar o acúmulo de óleo.</li>
                    <li><strong>Enxágue Bem:</strong> Certifique-se de remover todo o shampoo e condicionador.</li>
                    <li><strong>Evite Água Quente:</strong> Lave o cabelo com água morna ou fria, pois a água quente estimula a oleosidade.</li>
                    <li><strong>Gerencie o Estresse:</strong> Técnicas de relaxamento podem ajudar a controlar surtos.</li>
                    <li><strong>Dieta Equilibrada:</strong> Consuma alimentos ricos em zinco, vitamina B e gorduras saudáveis.</li>
                </ol>
                <p>Se a caspa persistir ou for muito severa, procure um dermatologista. Ele poderá indicar o tratamento mais adequado para o seu caso.</p>
            `
        },
        {
            id: 'tendencias-2025',
            title: 'Top 5 Tendências de Cortes e Cores para Arrasar em 2025',
            meta: 'Publicado em 08 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/C0C0C0/000000?Text=Tend%C3%AAncias',
            categories: ['tendencias'],
            excerpt: 'Quer renovar o visual? Fique por dentro das últimas tendências em cortes e cores de cabelo que prometem bombar em 2025. Do bob clássico aos tons fantasia, encontre a inspiração perfeita para você...',
            content: `
                <p>O ano de 2025 promete trazer tendências capilares cheias de personalidade e que celebram a individualidade. Se você está pensando em uma mudança de visual, inspire-se nas apostas que vão dominar as ruas e as redes sociais!</p>
                <h3>Tendências de Cortes:</h3>
                <ol>
                    <li><strong>The Modern Shag:</strong> O corte repicado e em camadas, com franja cortininha, continua em alta. Versátil e com movimento, é perfeito para quem busca um visual despojado e cheio de atitude.</li>
                    <li><strong>Corte Borboleta (Butterfly Cut):</strong> Camadas mais curtas na frente que emolduram o rosto e mais longas atrás, criando um efeito de volume e leveza, como as asas de uma borboleta.</li>
                    <li><strong>Bob Assimétrico:</strong> Uma versão moderna do clássico bob, com uma assimetria sutil ou mais marcada, trazendo um toque de ousadia e elegância.</li>
                    <li><strong>Cabelos Longos com Camadas Leves:</strong> Para quem não abre mão do comprimento, as camadas invisíveis ou muito suaves trarão movimento sem sacrificar o volume.</li>
                    <li><strong>Pixie Desconstruído:</strong> Uma versão mais longa e com mais textura do pixie tradicional, ideal para quem quer um corte curto, mas com mais opções de estilização.</li>
                </ol>
                <h3>Tendências de Cores:</h3>
                <ol>
                    <li><strong>Caramelo Quente:</strong> Tons de loiro escuro e castanho com reflexos acobreados e dourados, trazendo calor e luminosidade aos fios, ideal para morenas iluminadas.</li>
                    <li><strong>Ruivo Acobreado Intenso:</strong> Tons vibrantes de ruivo, com fundo mais alaranjado, para quem quer ousar e ter um visual marcante.</li>
                    <li><strong>Loiro Manteiga (Butter Blonde):</strong> Um loiro cremoso e suave, nem muito platinado, nem muito dourado, que remete à cor da manteiga. Luxuoso e elegante.</li>
                    <li><strong>Moreno Iluminado Sutil:</strong> Reflexos discretos em tons de marrom e mel, que dão profundidade e brilho sem alterar drasticamente a cor natural dos fios.</li>
                    <li><strong>Tons Pastel Fantasia:</strong> Lavanda, pêssego e rosa bebê continuam a ser escolhas divertidas para quem quer expressar sua criatividade e estilo.</li>
                </ol>
                <p>Seja qual for a sua escolha, o importante é que o corte e a cor reflitam a sua personalidade e te façam sentir confiante e linda!</p>
            `
        },
        {
            id: 'lavagem-correta',
            title: 'Aprenda a Lavagem Correta dos Cabelos para Máxima Limpeza',
            meta: 'Publicado em 03 de Maio de 2025',
            image: 'https://via.placeholder.com/350x200/FFD700/000000?Text=Dicas%20Gerais',
            categories: ['dicas-gerais'],
            excerpt: 'Lavar o cabelo parece simples, mas fazer da forma correta pode potencializar os resultados da sua rotina de cuidados. Descubra a temperatura ideal da água, a quantidade de produto e a técnica de massagem para um cabelo limpo e saudável...',
            content: `
                <p>Lavar o cabelo é o primeiro passo e um dos mais importantes em qualquer rotina de cuidados capilares. Fazer isso da maneira correta não só garante fios limpos, mas também prepara o cabelo para receber os tratamentos seguintes e maximiza os resultados.</p>
                <h3>Passo a Passo da Lavagem Perfeita:</h3>
                <ol>
                    <li><strong>Molhe Bem os Cabelos:</strong> Antes de aplicar o shampoo, certifique-se de que todo o cabelo esteja completamente molhado com água morna. A água morna ajuda a abrir as cutículas e a remover a sujeira.</li>
                    <li><strong>Quantidade Certa de Shampoo:</strong> Aplique uma pequena quantidade de shampoo (o equivalente a uma moeda de 1 real para cabelos médios) apenas na raiz. Não é necessário esfregar as pontas, pois a espuma que escorre já as limpa.</li>
                    <li><strong>Massageie o Couro Cabeludo:</strong> Com as pontas dos dedos (nunca as unhas!), massageie suavemente o couro cabeludo em movimentos circulares por 1 a 2 minutos. Isso estimula a circulação e remove a sujeira e oleosidade.</li>
                    <li><strong>Enxágue Abundantemente:</strong> Remova todo o shampoo. Resíduos podem deixar o cabelo pesado e opaco.</li>
                    <li><strong>Aplique o Condicionador (se usar):</strong> Aplique o condicionador apenas no comprimento e pontas, evitando a raiz. Deixe agir por 1 a 2 minutos e enxágue completamente, preferencialmente com água mais fria para selar as cutículas e dar brilho.</li>
                    <li><strong>Seque Delicadamente:</strong> Retire o excesso de água com uma toalha, apertando suavemente, sem esfregar. Se for usar secador, aplique um protetor térmico.</li>
                </ol>
                <h3>Dicas Extras:</h3>
                <ul>
                    <li><strong>Temperatura da Água:</strong> Evite água muito quente, que pode ressecar o couro cabeludo e os fios.</li>
                    <li><strong>Pré-poo:</strong> Para cabelos secos, aplique um óleo vegetal nas pontas antes de lavar para proteger do ressecamento do shampoo.</li>
                    <li><strong>Shampoo Transparente/Perolado:</strong> Shampoos transparentes são ideais para limpeza profunda. Perolados são mais hidratantes.</li>
                </ul>
                <p>Uma lavagem bem feita é a base para cabelos saudáveis e bonitos!</p>
            `
        }
    ];

    /**
     * Carrega os comentários e avaliações de um post específico do localStorage.
     * @param {string} postId - O ID do post.
     * @returns {Array} Array de comentários para o post.
     */
    function loadCommentsAndRatings(postId) {
        const data = localStorage.getItem(`post_${postId}_comments`);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Salva os comentários e avaliações de um post específico no localStorage.
     * @param {string} postId - O ID do post.
     * @param {Array} comments - Array de comentários para o post.
     */
    function saveCommentsAndRatings(postId, comments) {
        localStorage.setItem(`post_${postId}_comments`, JSON.stringify(comments));
    }

    /**
     * Calcula e atualiza a média de avaliações de um post.
     * @param {string} postId - O ID do post.
     * @param {Array} comments - Array de comentários para o post.
     */
    function updatePostRatings(postId, comments) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;

        let totalRating = 0;
        let reviewCount = 0;

        comments.forEach(comment => {
            if (comment.rating && comment.rating >= 1 && comment.rating <= 5) { // Garante que a avaliação é válida
                totalRating += comment.rating;
                reviewCount++;
            }
        });

        post.averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : '0.0'; // Garante string '0.0'
        post.reviewsCount = reviewCount;

        // Atualiza a exibição na interface do post individual
        if (currentPostId === postId) { // Só atualiza se for o post atualmente visível
            averageRatingDisplay.textContent = post.averageRating;
            totalReviewsCount.textContent = post.reviewsCount;
            renderStars(starRatingDisplay, parseFloat(post.averageRating), false); // Estrelas da média, não editáveis
        }
        
        // Renderiza novamente os cards da lista para refletir as novas avaliações
        renderPosts(blogPosts.filter(p => currentCategory === 'all' || p.categories.includes(currentCategory)));
    }

    // --- Funções de Renderização e Lógica do Blog ---

    /**
     * Exibe a lista de posts e esconde a visualização de um único post.
     */
    function showPostList() {
        blogPostListSection.style.display = 'block';
        singlePostSection.style.display = 'none';
        sidebar.style.display = 'block';
        currentCategory = 'all';
        searchInput.value = '';
        updateCategoryActiveState('all');
        renderPosts(blogPosts); // Renderiza todos os posts
        currentPostId = null; // Reseta o post atual
    }

    /**
     * Exibe um único post e esconde a lista de posts.
     * @param {Object} postData - Dados do post a ser exibido.
     */
    function showSinglePost(postData) {
        currentPostId = postData.id; // Define o ID do post atual

        blogPostListSection.style.display = 'none';
        singlePostSection.style.display = 'block';
        sidebar.style.display = 'none';

        singlePostImage.src = postData.image;
        singlePostTitle.textContent = postData.title;
        singlePostMeta.textContent = postData.meta;
        singlePostContent.innerHTML = postData.content;
        window.scrollTo(0, 0);

        // Carrega e renderiza comentários para este post
        const comments = loadCommentsAndRatings(currentPostId);
        renderComments(comments);
        updatePostRatings(currentPostId, comments); // Atualiza a média ao exibir o post

        // Reseta o formulário de comentário
        commentForm.reset();
        selectedRating = 0;
        renderStars(commentRatingStars, 0, true); // Limpa e torna as estrelas do formulário editáveis
    }

    /**
     * Renderiza os cards dos posts na lista.
     * @param {Array} postsToRender - Array de objetos de posts para renderizar.
     */
    function renderPosts(postsToRender) {
        postListContainer.innerHTML = '';
        if (postsToRender.length === 0) {
            postListContainer.innerHTML = '<p class="no-posts-found">Nenhum artigo encontrado para esta pesquisa/categoria.</p>';
            return;
        }

        postsToRender.forEach(post => {
            // Garante que o post tem as propriedades de rating para evitar erros
            const averageRating = post.averageRating !== undefined ? post.averageRating : '0.0';
            const reviewsCount = post.reviewsCount !== undefined ? post.reviewsCount : 0;

            const article = document.createElement('article');
            article.classList.add('post-card');
            article.setAttribute('data-categories', post.categories.join(' '));

            // Para exibir a avaliação média nos cards da lista
            const avgRatingHtml = reviewsCount > 0 ? 
                `<div class="post-card-rating">
                    ${averageRating} <i class="fas fa-star filled"></i> 
                    (${reviewsCount} avaliações)
                </div>` :
                `<div class="post-card-rating no-rating">Sem avaliações</div>`;

            article.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="post-card-image">
                <h3><a href="#" data-post-id="${post.id}">${post.title}</a></h3>
                <p class="post-meta">${post.meta}</p>
                ${avgRatingHtml}
                <p>${post.excerpt}</p>
                <a href="#" data-post-id="${post.id}" class="btn btn-secondary">Leia mais</a>
            `;
            postListContainer.appendChild(article);
        });

        // Adiciona listeners para os novos links "Leia mais" e títulos
        document.querySelectorAll('.post-card a[data-post-id]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = e.currentTarget.dataset.postId;
                const post = blogPosts.find(p => p.id === postId);
                if (post) {
                    showSinglePost(post);
                }
            });
        });
    }

    /**
     * Filtra e renderiza posts com base na categoria selecionada.
     * @param {string} category - A categoria para filtrar (ou 'all').
     */
    let currentCategory = 'all';

    function filterPostsByCategory(category) {
        currentCategory = category;
        updateCategoryActiveState(category);
        const filteredPosts = blogPosts.filter(post => {
            return category === 'all' || post.categories.includes(category);
        });
        renderPosts(filteredPosts);
    }

    /**
     * Atualiza a classe 'active' nos links de categoria.
     * @param {string} activeCategory - A categoria que deve ser marcada como ativa.
     */
    function updateCategoryActiveState(activeCategory) {
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === activeCategory) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Pesquisa posts com base no texto de busca e na categoria atual.
     */
    function searchPosts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const postsToSearch = currentCategory === 'all' ? blogPosts : blogPosts.filter(p => p.categories.includes(currentCategory));

        const results = postsToSearch.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   post.content.toLowerCase().includes(searchTerm);
        });
        renderPosts(results);
    }

    // --- Funções de Comentários e Avaliações ---

    /**
     * Renderiza as estrelas de avaliação (cheias/vazias/meias).
     * @param {HTMLElement} container - O elemento HTML onde as estrelas serão renderizadas.
     * @param {number} rating - A avaliação (0 a 5).
     * @param {boolean} editable - Se as estrelas devem ser clicáveis para edição.
     */
    function renderStars(container, rating, editable = false) {
        container.innerHTML = ''; // Limpa as estrelas existentes
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.classList.add('fas'); // Ícone de estrela sólida para base

            if (i <= rating) { // Estrela cheia
                star.classList.add('fa-star', 'filled');
            } else if (i - 0.5 === rating && rating % 1 !== 0) { // Meia estrela (se a avaliação tiver .5)
                star.classList.remove('fa-star'); // Remove a estrela sólida
                star.classList.add('fa-star-half-alt', 'filled'); // Adiciona a meia estrela
            } else { // Estrela vazia
                star.classList.remove('filled');
                star.classList.add('far', 'fa-star'); // Ícone de estrela vazia
            }
            
            if (editable) {
                star.classList.add('star-editable');
                star.dataset.rating = i; // Guarda o valor da estrela para clique/hover
                star.addEventListener('mouseover', highlightStars);
                star.addEventListener('mouseout', resetStars);
                star.addEventListener('click', selectRating);
            }
            container.appendChild(star);
        }
    }

    /**
     * Destaca estrelas no hover (para o formulário de avaliação).
     * @param {Event} e - Evento de mouseover.
     */
    function highlightStars(e) {
        const hoveredRating = parseInt(e.currentTarget.dataset.rating);
        Array.from(commentRatingStars.children).forEach((star, index) => {
            // Garante que a estrela tem a classe 'fas' para manipulação
            star.classList.remove('far', 'fa-star-half-alt'); 
            star.classList.add('fas', 'fa-star');

            if (index < hoveredRating) {
                star.classList.add('hovered');
            } else {
                star.classList.remove('hovered');
            }
        });
    }

    /**
     * Reseta o destaque das estrelas no mouseout (para o formulário de avaliação).
     */
    function resetStars() {
        Array.from(commentRatingStars.children).forEach(star => {
            star.classList.remove('hovered');
            // Reverte para o estado selecionado ou vazio
            if (parseInt(star.dataset.rating) <= selectedRating) {
                star.classList.remove('far'); // Remove far se estiver lá
                star.classList.add('fas', 'filled');
            } else {
                star.classList.remove('fas', 'filled');
                star.classList.add('far');
            }
        });
    }

    /**
     * Seleciona a avaliação ao clicar em uma estrela (para o formulário).
     * @param {Event} e - Evento de click.
     */
    function selectRating(e) {
        selectedRating = parseInt(e.currentTarget.dataset.rating);
        renderStars(commentRatingStars, selectedRating, true); // Re-renderiza para mostrar a seleção
    }

    /**
     * Adiciona um novo comentário e avaliação ao post atual.
     * @param {Event} e - Evento de submissão do formulário.
     */
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!currentPostId) {
            alert('Erro: Nenhum post selecionado para comentar.');
            return;
        }

        const userName = commentNameInput.value.trim();
        const commentText = commentTextarea.value.trim();
        const rating = selectedRating; // Pega a avaliação selecionada globalmente

        if (!userName || !commentText || rating === 0) {
            alert('Por favor, preencha seu nome, selecione uma avaliação (1 a 5 estrelas) e escreva um comentário.');
            return;
        }

        const newComment = {
            id: Date.now(), // ID único para o comentário
            userName: userName,
            rating: rating,
            comment: commentText,
            date: new Date().toLocaleDateString('pt-BR') // Data atual formatada
        };

        const comments = loadCommentsAndRatings(currentPostId);
        comments.unshift(newComment); // Adiciona o novo comentário no início (mais recente)

        saveCommentsAndRatings(currentPostId, comments); // Salva no localStorage
        renderComments(comments); // Re-renderiza a lista de comentários
        updatePostRatings(currentPostId, comments); // Atualiza a média de avaliações e re-renderiza cards

        commentForm.reset(); // Limpa o formulário
        selectedRating = 0; // Reseta a avaliação selecionada
        renderStars(commentRatingStars, 0, true); // Limpa as estrelas do formulário
        alert('Seu comentário e avaliação foram adicionados com sucesso!');
    });

    /**
     * Renderiza a lista de comentários para o post atual.
     * @param {Array} comments - Array de comentários a serem exibidos.
     */
    function renderComments(comments) {
        commentsList.innerHTML = ''; // Limpa a lista existente

        if (comments && comments.length > 0) {
            comments.forEach(comment => {
                const li = document.createElement('li');
                li.classList.add('comment-item');
                li.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.userName}</span>
                        <div class="comment-rating-stars"></div>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <p class="comment-text">${comment.comment}</p>
                `;
                commentsList.appendChild(li);

                // Renderiza as estrelas para cada comentário
                const commentStarsContainer = li.querySelector('.comment-rating-stars');
                renderStars(commentStarsContainer, comment.rating, false); // Estrelas do comentário, não editáveis
            });
            noCommentsMessage.style.display = 'none'; // Esconde a mensagem "Nenhum comentário"
        } else {
            noCommentsMessage.style.display = 'block'; // Mostra a mensagem "Nenhum comentário"
        }
    }


    // --- Adição de Event Listeners Iniciais ---
    backToBlogListButton.addEventListener('click', showPostList);
    searchButton.addEventListener('click', searchPosts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPosts();
        }
    });
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            filterPostsByCategory(e.target.dataset.category);
        });
    });

    // Event listeners para as estrelas editáveis do formulário de comentário
    Array.from(commentRatingStars.children).forEach(star => {
        star.addEventListener('mouseover', highlightStars);
        star.addEventListener('mouseout', resetStars);
        star.addEventListener('click', selectRating);
    });

    // --- Inicialização ---
    // Na inicialização, é importante que cada post tenha sua média e contagem calculadas
    // antes de serem renderizados na lista, para que a média apareça nos cards.
    blogPosts.forEach(post => {
        const comments = loadCommentsAndRatings(post.id);
        updatePostRatings(post.id, comments);
    });

    const postIdFromUrl = window.location.hash.substring(1);
    if (postIdFromUrl) {
        const postToDisplay = blogPosts.find(p => p.id === postIdFromUrl);
        if (postToDisplay) {
            showSinglePost(postToDisplay);
        } else {
            showPostList();
        }
    } else {
        showPostList();
    }
});

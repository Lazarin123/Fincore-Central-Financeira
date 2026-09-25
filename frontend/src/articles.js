// Conteúdo estático de dicas/artigos exibidos no Dashboard.
// Se um dia quiser puxar isso do banco em vez do código, basta criar uma
// tabela "articles" e um endpoint GET /api/articles seguindo o mesmo formato.
export const articles = [
  {
    slug: 'reserva-de-emergencia',
    tag: 'Planejamento',
    readTime: '4 min',
    title: 'Como montar uma reserva de emergência',
    excerpt: 'O primeiro passo antes de qualquer investimento é ter uma rede de segurança para imprevistos.',
    content: [
      'Uma reserva de emergência é o dinheiro guardado para cobrir despesas em situações inesperadas, como perda de renda, problemas de saúde ou consertos urgentes, sem precisar recorrer a dívidas.',
      'O tamanho ideal varia conforme a estabilidade da sua renda. Para quem tem emprego fixo, de 3 a 6 meses de custo de vida costuma ser suficiente. Para autônomos ou rendas variáveis, o recomendado é de 6 a 12 meses.',
      'O lugar certo para guardar essa reserva não é a poupança tradicional, e sim um investimento com liquidez diária e baixo risco, como um fundo ou título atrelado ao CDI, para que o dinheiro renda algo enquanto espera ser usado.',
      'Comece pequeno: separar uma porcentagem fixa da renda todo mês, mesmo que seja 5%, já cria o hábito. O importante é a constância, não o valor inicial.',
    ],
  },
  {
    slug: 'regra-50-30-20',
    tag: 'Orçamento',
    readTime: '3 min',
    title: 'Regra 50-30-20: simples e eficaz',
    excerpt: 'Um jeito prático de organizar o orçamento sem precisar de planilhas complicadas.',
    content: [
      'A regra 50-30-20 divide a renda líquida mensal em três blocos: 50% para necessidades essenciais, 30% para desejos pessoais e 20% para poupança ou quitação de dívidas.',
      'Necessidades são gastos que você não consegue evitar: moradia, alimentação básica, transporte e contas fixas. Desejos são tudo o que melhora sua qualidade de vida, mas não é indispensável, como lazer e assinaturas.',
      'Os 20% finais são o motor do seu futuro financeiro. Nessa fatia entram a reserva de emergência, investimentos e o pagamento de dívidas além do mínimo.',
      'Essa regra é um ponto de partida, não uma lei fixa. Se você mora em uma cidade cara, talvez precise ajustar as proporções, o importante é ter uma referência para comparar com sua realidade.',
    ],
  },
  {
    slug: 'sair-das-dividas-cartao',
    tag: 'Dívidas',
    readTime: '5 min',
    title: 'Como sair das dívidas do cartão de crédito',
    excerpt: 'O rotativo do cartão está entre os juros mais altos do mercado. Veja como reverter isso.',
    content: [
      'A primeira atitude é parar de usar o cartão para novas compras enquanto a dívida existir. Isso evita que o problema cresça enquanto você tenta resolvê-lo.',
      'Liste todas as dívidas com seus respectivos juros e priorize o pagamento da mais cara primeiro, mesmo que seja a de menor valor. Esse método reduz o total de juros pagos ao longo do tempo.',
      'Considere negociar diretamente com o banco ou migrar a dívida para uma modalidade mais barata, como um empréstimo pessoal ou consignado, que costuma ter taxas bem menores que o rotativo do cartão.',
      'Se o valor das parcelas está maior que sua capacidade de pagamento, procure o Procon ou um serviço de renegociação de dívidas antes que o problema vire uma bola de neve.',
    ],
  },
  {
    slug: 'investir-com-pouco-dinheiro',
    tag: 'Investimentos',
    readTime: '4 min',
    title: 'Investir com pouco dinheiro: por onde começar',
    excerpt: 'Você não precisa de milhares de reais para dar o primeiro passo como investidor.',
    content: [
      'Hoje é possível começar a investir com valores a partir de R$ 30 em produtos como Tesouro Direto ou fundos de renda fixa, sem taxas escondidas na maioria das corretoras.',
      'Antes de pensar em ações ou fundos imobiliários, garanta que sua reserva de emergência já está formada. Investimentos de maior risco fazem mais sentido depois que essa base está sólida.',
      'Para quem está começando, a renda fixa pós-fixada (atrelada ao CDI ou Selic) é um bom ponto de partida: o risco é baixo e o rendimento é previsível.',
      'O hábito importa mais que o valor. Investir uma quantia pequena todo mês, de forma consistente, costuma gerar resultados melhores no longo prazo do que tentar acertar o momento perfeito para investir um valor alto de uma vez.',
    ],
  },
  {
    slug: 'orcamento-que-voce-segue',
    tag: 'Orçamento',
    readTime: '4 min',
    title: 'Como criar um orçamento que você realmente segue',
    excerpt: 'A maioria dos orçamentos falha não pela planilha, mas pelo método. Veja o que muda isso.',
    content: [
      'Orçamentos rígidos demais costumam ser abandonados nas primeiras semanas. Um orçamento realista deixa espaço para gastos com lazer, porque cortar tudo de uma vez raramente é sustentável.',
      'Registrar os gastos logo depois que eles acontecem, e não no fim do mês, é o que faz a diferença entre um orçamento que funciona e um que só existe no papel.',
      'Revise categorias que fogem do previsto com curiosidade, não com culpa. O objetivo é entender padrões de comportamento, não se punir por eles.',
      'Automatize o que for possível: transferências para investimento no dia do pagamento e alertas de vencimento de contas tiram decisões do seu dia a dia e reduzem o esforço mental de manter o controle.',
    ],
  },
  {
    slug: 'antes-de-financiar',
    tag: 'Crédito',
    readTime: '3 min',
    title: 'O que considerar antes de financiar algo',
    excerpt: 'Carro, imóvel ou eletrônico: alguns pontos valem a pena checar antes de assinar o contrato.',
    content: [
      'Calcule o Custo Efetivo Total (CET) do financiamento, não apenas a taxa de juros anunciada. O CET inclui tarifas e seguros embutidos e costuma ser bem maior do que a taxa de propaganda.',
      'Como regra prática, o valor total das parcelas de financiamentos (incluindo o imóvel, se houver) não deveria ultrapassar 30% da sua renda líquida mensal.',
      'Quanto maior a entrada, menor o total pago em juros. Se possível, vale mais a pena esperar alguns meses e juntar uma entrada maior do que financiar o valor cheio.',
      'Compare sempre mais de uma instituição financeira. A diferença de taxa entre bancos para o mesmo produto pode ser grande, e essa pesquisa leva poucos minutos.',
    ],
  },
];

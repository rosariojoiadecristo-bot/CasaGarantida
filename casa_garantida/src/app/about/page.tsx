import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PhotoIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  LockClosedIcon,
  HandRaisedIcon,
  LightBulbIcon,
  HeartIcon,
  CodeBracketIcon,
  ChartBarIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Sobre Nós | CasaGarantida",
  description:
    "Conheça a CasaGarantida, a plataforma que conecta proprietários e inquilinos de forma segura e simplifica todo o processo de locação.",
};

export default function AboutPage() {
  const features = [
    {
      icon: BuildingOffice2Icon,
      title: "Marketplace centralizado",
      desc: "Anúncios de imóveis reunidos num só lugar, fáceis de pesquisar e comparar.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Pagamento garantido",
      desc: "Garantia de pagamento pontual aos proprietários, mesmo em caso de inadimplência.",
    },
    {
      icon: DocumentTextIcon,
      title: "Gestão integrada",
      desc: "Contratos e pagamentos geridos de forma digital e transparente.",
    },
    {
      icon: UserGroupIcon,
      title: "Inquilinos verificados",
      desc: "Verificação e seleção criteriosa de inquilinos para maior segurança.",
    },
    {
      icon: PhotoIcon,
      title: "Anúncios reais",
      desc: "Fotos e vídeos reais dos imóveis, sem surpresas na visita.",
    },
    {
      icon: WrenchScrewdriverIcon,
      title: "Suporte técnico",
      desc: "Assistência para manutenções inclusa durante todo o contrato.",
    },
  ];

  const proprietarios = [
    "Recebimento garantido dos valores, mesmo com inadimplência",
    "Redução da burocracia e do tempo de vacância",
    "Inquilinos pré-selecionados e verificados",
  ];

  const inquilinos = [
    "Processo de locação simplificado e digital",
    "Transparência nas informações dos imóveis",
    "Assistência técnica para manutenções incluída",
  ];

  const equipe = [
    {
      nome: "Fredes Nascimento",
      cargo: "Co-Fundador & CTO",
      skills: [
        { icon: CodeBracketIcon, label: "Engenharia Informática" },
        { icon: ChartBarIcon, label: "Desenvolvimento de Plataformas Digitais" },
        { icon: LockClosedIcon, label: "Segurança de Dados e Transações" },
      ],
      initials: "FN",
    },
    {
      nome: "Rosário de Cristo",
      cargo: "Fundador & CEO",
      skills: [
        { icon: BriefcaseIcon, label: "Gestão de Negócios" },
        { icon: BuildingOffice2Icon, label: "Experiência no Mercado Imobiliário" },
        { icon: HandRaisedIcon, label: "Desenvolvimento de Parcerias Estratégicas" },
      ],
      initials: "RC",
    },
  ];

  const valores = [
    {
      icon: LockClosedIcon,
      title: "Segurança",
      desc: "Garantimos transações seguras e proteção de dados para todos os usuários.",
    },
    {
      icon: HandRaisedIcon,
      title: "Confiabilidade",
      desc: "Cumprimos nossas promessas e garantimos o pagamento aos proprietários.",
    },
    {
      icon: LightBulbIcon,
      title: "Inovação",
      desc: "Buscamos constantemente melhorar nossa plataforma e serviços.",
    },
    {
      icon: HeartIcon,
      title: "Comunidade",
      desc: "Construímos relacionamentos duradouros com proprietários e inquilinos.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold tracking-wide uppercase mb-4">
            Sobre Nós
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Plataforma digital de arrendamento e vendas de <span className="text-primary-600">imóveis</span>.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            A CasaGarantida conecta proprietários e inquilinos de forma segura,
            simplificando todo o processo de locação e garantindo o pagamento
            pontual aos proprietários.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Nossa Solução
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Uma plataforma completa que cobre todas as etapas da locação — do
            anúncio ao contrato, do pagamento ao suporte técnico.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-primary-200 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BuildingOffice2Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Para Proprietários
              </h3>
            </div>
            <ul className="space-y-3">
              {proprietarios.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Para Inquilinos
              </h3>
            </div>
            <ul className="space-y-3">
              {inquilinos.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Nossa Equipe
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Combinamos experiência em tecnologia, mercado imobiliário e gestão
            de negócios, com o compromisso de transformar a experiência de
            arrendamento e venda de imóveis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {equipe.map((membro) => (
            <div
              key={membro.nome}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {membro.initials}
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {membro.nome}
              </h3>
              <p className="text-sm text-primary-600 font-medium mb-5">
                {membro.cargo}
              </p>
              <ul className="space-y-2 text-left">
                {membro.skills.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Nossos Valores
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Os princípios que orientam cada decisão que tomamos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
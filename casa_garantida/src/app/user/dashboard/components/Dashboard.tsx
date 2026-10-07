import { getPropriedade, getPropriedadesDisponiveis } from '@/services/propriedadeService';
import { Propriedade } from '@/types/Propriedade';
import { Usuario } from '@/types/Usuario';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface UsuarioProps {
  currentUser: Usuario;
}

// Mapeamento dos status (coincide com a BD: 1..4)
const STATUS_ID = {
  DISPONIVEL: 1,
  INDISPONIVEL: 2,
  VENDIDO: 3,
  ARRENDADO: 4,
} as const;

export default async function Dashboard({ currentUser }: UsuarioProps) {
  const [todas, disponiveis] = await Promise.all([
    getPropriedade(),
    getPropriedadesDisponiveis(),
  ]);

  const total = todas.length;

  // 🔹 Contagem por status (usa o id do status — mais fiável que a string)
  const contarPorStatus = (statusId: number) =>
    todas.filter((p) => p.status?.id === statusId).length;

  const totalDisponiveis = contarPorStatus(STATUS_ID.DISPONIVEL);
  const totalIndisponiveis = contarPorStatus(STATUS_ID.INDISPONIVEL);
  const totalVendidos = contarPorStatus(STATUS_ID.VENDIDO);
  const totalArrendados = contarPorStatus(STATUS_ID.ARRENDADO);

  const taxaDisponibilidade =
    total > 0 ? Math.round((totalDisponiveis / total) * 100) : 0;

  // 🔹 Valor total de mercado das propriedades disponíveis
  const valorTotalDisponivel = disponiveis.reduce(
    (acc, p) => acc + (p.preco || 0),
    0
  );

  // 🔹 Receita total (vendas + arrendamentos já concretizados)
  const receitaVendas = todas
    .filter((p) => p.status?.id === STATUS_ID.VENDIDO)
    .reduce((acc, p) => acc + (p.preco || 0), 0);

  const receitaArrendamentos = todas
    .filter((p) => p.status?.id === STATUS_ID.ARRENDADO)
    .reduce((acc, p) => acc + (p.preco || 0), 0);

  // 🔹 Propriedades mais recentes (últimas 5)
  const recentes = [...todas].sort((a, b) => b.id - a.id).slice(0, 5);

  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0,
    }).format(valor);

    // 🔒 Bloqueia clientes (id = 3)
    if (currentUser.tipoUsuarioId === 3) {
      redirect("/unauthorized");
    }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {currentUser.firstName} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Aqui está o resumo das propriedades.
        </p>
      </div>

      {/* 🟦 Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          titulo="Total de Propriedades"
          valor={total}
          cor="bg-indigo-50 text-indigo-700"
          icone="🏠"
        />
        <StatCard
          titulo="Disponíveis"
          valor={totalDisponiveis}
          cor="bg-emerald-50 text-emerald-700"
          icone="✅"
        />
        <StatCard
          titulo="Indisponíveis"
          valor={totalIndisponiveis}
          cor="bg-red-50 text-red-700"
          icone="🚫"
        />
        <StatCard
          titulo="Taxa de Disponibilidade"
          valor={`${taxaDisponibilidade}%`}
          cor="bg-amber-50 text-amber-700"
          icone="📊"
        />
      </div>

      {/* 🟩 Cards de negócio (vendas + arrendamentos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          titulo="Propriedades Vendidas"
          valor={totalVendidos}
          cor="bg-purple-50 text-purple-700"
          icone="💜"
        />
        <StatCard
          titulo="Propriedades Arrendadas"
          valor={totalArrendados}
          cor="bg-sky-50 text-sky-700"
          icone="🔑"
        />
      </div>

      {/* 💰 Receitas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ValorCard
          titulo="Valor em Propriedades Disponíveis"
          valor={formatarPreco(valorTotalDisponivel)}
          gradient="from-sky-500 to-indigo-600"
        />
        <ValorCard
          titulo="Receita de Vendas"
          valor={formatarPreco(receitaVendas)}
          gradient="from-purple-500 to-fuchsia-600"
        />
        <ValorCard
          titulo="Receita de Arrendamentos"
          valor={formatarPreco(receitaArrendamentos)}
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      {/* 📋 Propriedades recentes */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Propriedades Recentes
          </h2>
          <Link
            href="/user/properties"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Nenhuma propriedade registada.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentes.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {p.localizacao || 'Sem localização'} — {p.provincia || 'N/A'}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <p className="text-lg font-bold text-indigo-600 mt-3">
                  {formatarPreco(p.preco)}
                </p>

                <div className="flex gap-3 text-xs text-gray-500 mt-2">
                  <span>🛏 {p.quarto}</span>
                  <span>🚗 {p.garagem}</span>
                  <span>🌳 {p.quintal}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* 🔹 Card de número */
function StatCard({
  titulo,
  valor,
  cor,
  icone,
}: {
  titulo: string;
  valor: string | number;
  cor: string;
  icone: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">{titulo}</p>
        <span className={`text-lg p-2 rounded-lg ${cor}`}>{icone}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{valor}</p>
    </div>
  );
}

/* 🔹 Card de valor monetário com gradiente */
function ValorCard({
  titulo,
  valor,
  gradient,
}: {
  titulo: string;
  valor: string;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-6 shadow-sm`}
    >
      <p className="text-sm opacity-90">{titulo}</p>
      <p className="text-2xl font-bold mt-1">{valor}</p>
    </div>
  );
}

/* 🔹 Badge do status (com cor por tipo) */
function StatusBadge({ status }: { status?: Propriedade['status'] }) {
  if (!status) {
    return (
      <span className="text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap bg-gray-100 text-gray-700">
        N/A
      </span>
    );
  }

  const cores: Record<number, string> = {
    1: 'bg-emerald-100 text-emerald-800', // Disponível
    2: 'bg-gray-100 text-gray-700',        // Indisponível
    3: 'bg-purple-100 text-purple-800',    // Vendido
    4: 'bg-sky-100 text-sky-800',          // Arrendado
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
        cores[status.id] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.value}
    </span>
  );
}
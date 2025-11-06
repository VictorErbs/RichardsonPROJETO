import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Stats {
  emailsReceived: number;
  emailsOpened: number;
  linksClicked: number;
  credentialsSubmitted: number;
}

interface RankingUser {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
}

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados
  const fetchData = async () => {
    // Aguardar o user estar disponível
    if (!user?.id) {
      return;
    }

    try {
      const [statsRes, rankingRes] = await Promise.all([
        api.get(`/users/stats/${user.id}`),
        api.get('/users/ranking'),
      ]);
      setStats(statsRes.data.stats);
      setRanking(rankingRes.data.ranking);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Atualizar ranking a cada 10 segundos
    const intervalId = setInterval(() => {
      if (user?.id) {
        fetchData();
      }
    }, 10000); // 10 segundos

    // Limpar interval quando o componente desmontar
    return () => clearInterval(intervalId);
  }, [user?.id]);

  // Listener para evento de novo usuário registrado
  useEffect(() => {
    const handleUserRegistered = () => {
      fetchData();
    };

    window.addEventListener('userRegistered', handleUserRegistered);
    
    return () => {
      window.removeEventListener('userRegistered', handleUserRegistered);
    };
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎣 Phishing Simulator</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Olá, {user?.name}</span>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-bold text-sm"
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition font-bold text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pontos</p>
                <p className="text-3xl font-bold text-purple-600">{user?.points || 0}</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Nível</p>
                <p className="text-3xl font-bold text-indigo-600">{user?.level || 1}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">E-mails Recebidos</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.emailsReceived || 0}</p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Cliques em Links</p>
                <p className="text-3xl font-bold text-red-600">{stats?.linksClicked || 0}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Sua Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats?.emailsOpened || 0}</p>
              <p className="text-sm text-gray-600">E-mails Abertos</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{stats?.linksClicked || 0}</p>
              <p className="text-sm text-gray-600">Links Clicados</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{stats?.credentialsSubmitted || 0}</p>
              <p className="text-sm text-gray-600">Dados Enviados</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {stats?.emailsReceived ? Math.round(((stats.emailsReceived - stats.linksClicked) / stats.emailsReceived) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">Taxa de Segurança</p>
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🏅 Ranking Global</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pontos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nível</th>
                </tr>
              </thead>
              <tbody>
                {ranking.slice(0, 10).map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b ${item.id === user?.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3">
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}º`}
                    </td>
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3">{item.points}</td>
                    <td className="px-4 py-3">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

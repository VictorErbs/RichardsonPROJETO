import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  active: boolean;
  autoSend: boolean;
  _count: { emailLogs: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  _count?: { clicks: number; submissions: number };
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, usersRes] = await Promise.all([
          api.get('/campaigns'),
          api.get('/users'),
        ]);
        setCampaigns(campaignsRes.data.campaigns);
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Enviar esta campanha para TODOS os usuários cadastrados agora?')) return;

    setSendingId(campaignId);
    try {
      const response = await api.post(`/campaigns/${campaignId}/send-once`);
      alert(response.data.message);
      // Atualizar a lista de campanhas para refletir lastSentAt
      const campaignsRes = await api.get('/campaigns');
      setCampaigns(campaignsRes.data.campaigns);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar campanha';
      alert(errorMessage);
    } finally {
      setSendingId(null);
    }
  };

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
      <nav className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔐 Painel Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Admin: {user?.name}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition font-bold text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition font-bold text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total de Campanhas</p>
                <p className="text-3xl font-bold text-purple-600">{campaigns.length}</p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total de Usuários</p>
                <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">E-mails Enviados</p>
                <p className="text-3xl font-bold text-blue-600">
                  {campaigns.reduce((acc, c) => acc + c._count.emailLogs, 0)}
                </p>
              </div>
              <div className="text-4xl">✉️</div>
            </div>
          </div>
        </div>

        {/* Campanhas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📨 Campanhas de Phishing</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dificuldade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pontos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Auto Envio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Enviados</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{campaign.title}</p>
                        <p className="text-xs text-gray-500">{campaign.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          campaign.difficulty === 'EASY'
                            ? 'bg-green-100 text-green-700'
                            : campaign.difficulty === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {campaign.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">{campaign.points}</td>
                    <td className="px-4 py-3">
                      {campaign.autoSend ? (
                        <span className="text-green-600 font-bold">✅ Ativo</span>
                      ) : (
                        <span className="text-gray-400">❌ Desativado</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{campaign._count.emailLogs}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        disabled={sendingId === campaign.id}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 text-sm font-bold"
                      >
                        {sendingId === campaign.id ? 'Enviando...' : 'Enviar Agora'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usuários */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Usuários Cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">E-mail</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pontos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cliques</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submissões</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">{u.points}</td>
                    <td className="px-4 py-3">
                      <span className="text-red-600 font-bold">{u._count?.clicks || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-orange-600 font-bold">{u._count?.submissions || 0}</span>
                    </td>
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

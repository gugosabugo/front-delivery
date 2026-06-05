"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de chamada de API para autenticação
    // No back-end, você buscaria o usuário no banco e checaria o cargo:
    // const user = await db.user.findUnique({ where: { email } })
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Lógica demonstrativa de redirecionamento por cargo:
      if (email.includes("admin")) {
        // Se o cargo retornado do banco for 'ADMIN'
        router.push("/admin");
      } else {
        // Se o cargo retornado do banco for 'LOJISTA' (ex: Juninho)
        router.push("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo do Sistema */}
        <div className="mx-auto h-12 w-12 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-md">
          <Store size={24} className="text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">
          MenuBuilder<span className="text-slate-500">.io</span>
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Insira suas credenciais para acessar seu painel de controle.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-2xl sm:px-10">
          
          {/* Formulário Único de Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                E-mail de acesso
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-950 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs font-bold text-slate-500 hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Autenticando..." : "Entrar no Sistema"}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

        </div>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          MenuBuilder System v1.0 • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email || !password) return;

        try {
            setIsLoading(true);

            // Substitua pela sua autenticação real
            console.log({ email, password });

            // Exemplo:
            // const response = await fetch("/api/auth/login", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ email, password }),
            // });

            // if (!response.ok) {
            //   throw new Error("E-mail ou senha inválidos.");
            // }

            // window.location.href = "/dashboard";
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-white font-sans text-black antialiased">
            <div className="min-h-screen grid lg:grid-cols-[1fr_560px]">
                {/* Lado esquerdo */}
                <section className="hidden lg:flex relative overflow-hidden bg-black">
                    <div className="absolute inset-0">
                        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/10" />
                        <div className="absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full bg-yellow-300/5" />
                        <div className="absolute top-1/3 right-20 h-56 w-56 rounded-full border border-yellow-400/10" />
                    </div>

                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
                        {/* Conteúdo */}
                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                                Gestão completa para seu delivery
                            </div>

                            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                                Seu delivery,
                                <br />
                                organizado em um só lugar.
                            </h1>

                            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
                                Gerencie pedidos, produtos, clientes, entregas e o
                                financeiro da sua loja através de um painel simples
                                e eficiente.
                            </p>

                            <div className="mt-10 flex gap-8">
                                <Feature icon={<OrderIcon />} label="Pedidos" />
                                <Feature icon={<ProductIcon />} label="Produtos" />
                                <Feature icon={<ChartIcon />} label="Financeiro" />
                            </div>
                        </div>

                        <p className="text-xs text-zinc-500">
                            © {new Date().getFullYear()} MenuBuilder.io
                        </p>
                    </div>
                </section>

                {/* Login */}
                <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20 bg-white">
                    <div className="w-full max-w-md">
                        {/* Logo mobile */}
                        <div className="mb-12 flex items-center gap-3 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black shadow-sm">
                                <StoreIcon />
                            </div>

                            <div>
                                <span className="text-lg font-bold tracking-tight text-black">
                                    MenuBuilder
                                </span>
                                <span className="text-lg font-bold text-yellow-500">
                                    .io
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <p className="mb-2 text-sm font-semibold text-zinc-500">
                                PAINEL DO ESTABELECIMENTO
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-black">
                                Bem-vindo de volta
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Entre com suas credenciais para acessar sua loja.
                            </p>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-zinc-800"
                                >
                                    E-mail
                                </label>

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                                        <MailIcon />
                                    </div>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-zinc-800"
                                    >
                                        Senha
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-zinc-500 transition hover:text-yellow-500"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                                        <LockIcon />
                                    </div>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-11 pr-12 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
                                        }
                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-400 transition hover:text-yellow-500"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon />
                                        ) : (
                                            <EyeIcon />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-zinc-300 accent-yellow-400"
                                    />
                                    Manter conectado
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingIcon />
                                        Entrando...
                                    </>
                                ) : (
                                    <>
                                        Entrar no sistema
                                        <ArrowRightIcon />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Rodapé */}
                        <div className="mt-8 border-t border-zinc-200 pt-6">
                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                <ShieldIcon />
                                <span>Ambiente seguro e protegido</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function Feature({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                {icon}
            </span>
            {label}
        </div>
    );
}

function StoreIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9l2-5h14l2 5" />
            <path d="M5 13v7h14v-7" />
            <path d="M9 20v-6h6v6" />
            <path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="m3 3 18 18" />
            <path d="M10.7 6.2A9.7 9.7 0 0112 6c6.5 0 10 6 10 6a17 17 0 01-2 2.6" />
            <path d="M6.6 6.6C3.6 8.4 2 12 2 12s3.5 6 10 6a9.8 9.8 0 004.2-.9" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function LoadingIcon() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.25"
            />
            <path
                d="M21 12a9 9 0 00-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function OrderIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M6 2h12l2 5H4l2-5Z" />
            <path d="M5 7h14v15H5z" />
            <path d="M9 11h6" />
        </svg>
    );
}

function ProductIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m12 2 9 5-9 5-9-5 9-5Z" />
            <path d="m3 12 9 5 9-5" />
            <path d="m3 17 9 5 9-5" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
        </svg>
    );
}
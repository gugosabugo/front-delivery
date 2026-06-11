"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingBag, Plus, Minus, Clock, DollarSign, ChevronRight, X, Check,
  MessageSquare, UtensilsCrossed, ArrowLeft, MapPin, CreditCard, Smile, Trash2,
  QrCode, Copy, ShieldCheck, Lock, Smartphone, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, MessageCircle, Truck, Store, ClipboardList,
} from "lucide-react";

// Interfaces do Sistema
interface AddOn {
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  active: boolean;
  addOns: AddOn[];
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedAddOns: AddOn[];
  observation: string;
  itemTotal: number;
}

interface AuthenticatedUser {
  fullName: string;
  phone: string;
}

export default function CustomerMenu() {
  const params = useParams();
  const storeSlug = params.slug;

  // Configurações Estáticas da Loja
  const storeName = storeSlug === "juninholanches" ? "Juninho Lanches" : "MenuBuilder Store";
  const deliveryTime = "35-45 min";
  const logoImg = "/image_e06582.png";
  const bannerImg = "/Banner.png";

  // Categorias do Cardápio
  const categories = ["Todos", "Burgers", "Combos", "Porções", "Bebidas"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Banco de dados de produtos (Mock)
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "X-Juninho Brutal",
      price: 34.90,
      category: "Burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      description: "Dois hambúrgueres artesanais de 150g, queijo cheddar derretido, bacon crispy e nossa maionese secreta.",
      active: true,
      addOns: [
        { name: "Bacon Extra", price: 5.00 },
        { name: "Cheddar Extra", price: 4.50 },
        { name: "Carne Extra 150g", price: 9.00 }
      ]
    },
    {
      id: 2,
      name: "Batata Suprema",
      price: 28.00,
      category: "Porções",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
      description: "Batatas fritas crocantes com cobertura de cheddar cremoso e muito bacon em cubos.",
      active: true,
      addOns: [{ name: "Queijo Extra", price: 3.50 }]
    },
    {
      id: 3,
      name: "Combo Brutal Individual",
      price: 49.90,
      category: "Combos",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60",
      description: "1 X-Juninho Brutal + 1 Batata Frita Individual + 1 Refrigerante Lata à sua escolha.",
      active: true,
      addOns: []
    },
  ]);

  // Estados de Telas (menu -> checkout -> pixPayment -> success)
  const [currentStep, setCurrentStep] = useState<"menu" | "checkout" | "pixPayment" | "success">("menu");

  // Estados de Estado do Carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal de Detalhes do Item
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [chosenAddOns, setChosenAddOns] = useState<AddOn[]>([]);
  const [observation, setObservation] = useState("");

  // Estado do Usuário Autenticado via WhatsApp
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"credentials" | "code">("credentials");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  
  // Rastreia quem abriu o modal para decidir o destino pós-login
  const [authTrigger, setAuthTrigger] = useState<"menu" | "checkout">("menu");

  // Informações de Endereço e Pagamento
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [cashChange, setCashChange] = useState("");
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Informações do Dropdown do Cartão
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [pixCopied, setPixCopied] = useState(false);
  const [isCheckingPix, setIsCheckingPix] = useState(false);

  // Recupera persistência do login do cliente e endereço salvo no dispositivo
  useEffect(() => {
    const savedUser = localStorage.getItem("mb_customer_user");
    const savedAddress = localStorage.getItem("customer_logged_address");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(parsedUser);
      setAuthName(parsedUser.fullName);
      setAuthPhone(parsedUser.phone);
    }
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setChosenAddOns([]);
    setObservation("");
  };

  const toggleAddOn = (addon: AddOn) => {
    if (chosenAddOns.some(item => item.name === addon.name)) {
      setChosenAddOns(chosenAddOns.filter(item => item.name !== addon.name));
    } else {
      setChosenAddOns([...chosenAddOns, addon]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const addOnsTotal = chosenAddOns.reduce((sum, item) => sum + item.price, 0);
    const itemTotal = (selectedProduct.price + addOnsTotal) * modalQuantity;

    setCart([...cart, {
      id: Date.now().toString(),
      product: selectedProduct,
      quantity: modalQuantity,
      selectedAddOns: chosenAddOns,
      observation,
      itemTotal
    }]);
    setSelectedProduct(null);
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Interceptador da Sacola para Checkout Seguro com Login Obrigatório
  const handleProceedToDelivery = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setAuthTrigger("checkout");
      setAuthStep("credentials");
      setIsAuthModalOpen(true);
    } else {
      setIsCartOpen(false);
      setCurrentStep("checkout");
    }
  };

  // Envio Simulado do Token via WhatsApp
  const handleRequestAuthCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authPhone.trim()) return;

    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setAuthStep("code");
    }, 1200);
  };

  // Validação do Token enviado para o WhatsApp
  const handleVerifyAuthCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.length < 4) return;

    const userPayload: AuthenticatedUser = {
      fullName: authName,
      phone: authPhone
    };

    localStorage.setItem("mb_customer_user", JSON.stringify(userPayload));
    setCurrentUser(userPayload);
    setIsAuthModalOpen(false);
    
    if (authTrigger === "checkout") {
      setCurrentStep("checkout");
    } else {
      setCurrentStep("menu");
    }
  };

  // Desconectar Conta do Dispositivo do Cliente
  const handleCustomerLogout = () => {
    if (confirm("Deseja desconectar sua conta deste dispositivo?")) {
      localStorage.removeItem("mb_customer_user");
      setCurrentUser(null);
      setAuthName("");
      setAuthPhone("");
      setAuthCode("");
      setCurrentStep("menu");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Por favor, preencha o seu endereço de entrega.");
      return;
    }

    if (paymentMethod === "Cartão de Crédito" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      alert("Por favor, preencha todas as informações do seu Cartão de Crédito.");
      return;
    }

    // Persiste o endereço atualizado atrelado ao usuário
    localStorage.setItem("customer_logged_address", address);

    if (paymentMethod === "Pix") {
      setCurrentStep("pixPayment");
    } else {
      completeOrderFlow();
    }
  };

  const handleVerifyPixPayment = () => {
    setIsCheckingPix(true);
    setTimeout(() => {
      setIsCheckingPix(false);
      completeOrderFlow();
    }, 1800);
  };

  const completeOrderFlow = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOrderId(`JB-${randomId}`);
    setCurrentStep("success");
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const currentDeliveryFee = 7.00;
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + currentDeliveryFee : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-red-100">

      {/* ================= ETAPA 1: CARDÁPIO PRINCIPAL ================= */}
      {currentStep === "menu" && (
        <>
          {/* BANNER GOURMET E INTEGRADO */}
          <div className="h-52 md:h-64 w-full relative bg-slate-900 overflow-hidden">
            <img src={bannerImg} alt="Banner" className="w-full h-full object-cover opacity-60 scale-105 blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* CARD DA LOJA REESTILIZADO */}
          <div className="max-w-4xl w-full mx-auto px-4 relative -mt-16 md:-mt-24 mb-8 z-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-white/50 p-6 md:p-8 shadow-2xl shadow-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-slate-200/80">

              {/* Informações da Loja e Logo */}
              <div className="flex flex-col md:flex-row items-center gap-2">
                {/* Logo com efeito de profundidade */}
                <div className="relative group cursor-default">
                  <div className="absolute inset-0 bg-slate-200 rounded-3xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <img
                    src={logoImg}
                    alt="Logo da Loja"
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-[4px] border-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Textos e Badges */}
                <div className="text-center md:text-left space-y-3">
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    {storeName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-red-100/50 border border-red-100/50 transition-colors hover:bg-red-100">
                      <Clock size={14} strokeWidth={2.5} />
                      {deliveryTime}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-slate-200/80 shadow-sm transition-colors hover:bg-slate-100">
                      <MapPin size={13} className="text-slate-400" />
                      Entrega calculada no checkout
                    </span>
                  </div>
                </div>
              </div>

              {/* Área de Ação (Login / Usuário Logado) */}
              {currentUser ? (
                <div className="flex flex-col items-center md:items-end gap-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 w-full md:w-auto shadow-inner">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 flex items-center gap-1">
                    <ShieldCheck size={12} /> Cliente Conectado
                  </span>
                  <button
                    onClick={handleCustomerLogout}
                    className="text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-red-600 border border-slate-200 px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm w-full md:w-auto justify-center group"
                  >
                    Olá, {currentUser.fullName.split(" ")[0]}
                    <span className="text-slate-300 ml-1">| Sair</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthTrigger("menu"); setAuthStep("credentials"); setIsAuthModalOpen(true); }}
                  className="group relative overflow-hidden bg-slate-900 text-white text-sm font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <Lock size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                    ACESSAR / CADASTRAR
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* BARRA DE CATEGORIAS SLICK */}
          <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-30 py-4 border-b border-slate-200/60">
            <div className="max-w-4xl w-auto mx-auto px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all border shrink-0 ${selectedCategory === cat
                      ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/10 scale-105"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DE PRODUTOS MODERNIZADO */}
          <main className="max-w-4xl w-full mx-auto px-4 py-6 pb-32 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleOpenProduct(prod)}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 flex gap-4 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 cursor-pointer group relative"
              >
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-black text-slate-900 group-hover:text-red-600 transition-colors text-sm">{prod.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed font-medium">{prod.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-black text-slate-950">R$ {prod.price.toFixed(2)}</span>
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      + ADICIONAR
                    </span>
                  </div>
                </div>
                <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
            ))}
          </main>

          {/* COMPONENTE DE BARRA DA SACOLA */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-40">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-slate-950 text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-2xl shadow-slate-900/30 hover:bg-slate-900 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-2 rounded-xl text-white shadow-xs">
                    <ShoppingBag size={16} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-wider">{cart.length} {cart.length === 1 ? "Item" : "Itens"} na sacola</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-white/10 px-3 py-1.5 rounded-lg">R$ {cartSubtotal.toFixed(2)}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= ETAPA 2: FORMULÁRIO DE CHECKOUT ================= */}
      {currentStep === "checkout" && (
        <div className="max-w-2xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep("menu")}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">Endereço & Pagamento</h2>
                <p className="text-xs text-slate-400">Olá {currentUser?.fullName.split(" ")[0]}, confirme os detalhes para a entrega.</p>
              </div>
            </div>

            {/* SEÇÃO: DADOS FIXOS DO CLIENTE LOGADO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-3">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-100">
                <Smile size={15} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">Identificação do Comprador</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100 font-bold text-slate-700">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nome Cadastrado</span>
                  {currentUser?.fullName}
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">WhatsApp / Telefone</span>
                  {currentUser?.phone}
                </div>
              </div>
            </div>

            {/* SEÇÃO: ENDEREÇO DE ENTREGA */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-100">
                <MapPin size={15} className="text-red-600" />
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">Local de Entrega</h3>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Endereço Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade e Complemento"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* SEÇÃO: FORMAS DE PAGAMENTO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-100">
                <CreditCard size={15} className="text-red-600" />
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">Forma de Pagamento</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Pix", "Cartão de Crédito", "Dinheiro"].map((method) => {
                  const active = paymentMethod === method;
                  return (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${active ? "border-slate-900 bg-slate-50 font-bold text-slate-950 shadow-3xs" : "border-slate-200 hover:border-slate-300 text-slate-500"
                        }`}
                    >
                      <span className="text-xs font-black">{method}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${active ? "border-slate-900 bg-slate-900" : "border-slate-300"}`}>
                        {active && <span className="w-1 h-1 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {paymentMethod === "Cartão de Crédito" && (
                <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden">
                  <div
                    onClick={() => setIsCardDropdownOpen(!isCardDropdownOpen)}
                    className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-[11px] font-black text-slate-600 flex items-center gap-1.5">
                      <Lock size={13} className="text-slate-400" /> Informações de Pagamento Seguro
                    </span>
                    {isCardDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {isCardDropdownOpen && (
                    <div className="p-4 bg-white grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome Impresso</label>
                        <input type="text" placeholder="JOÃO O SILVA" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Validade</label>
                        <input type="text" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">CVV</label>
                        <input type="text" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "Dinheiro" && (
                <div className="pt-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Precisa de troco?</label>
                  <input
                    type="text"
                    placeholder="Ex: Troco para R$ 50,00 ou Não preciso"
                    value={cashChange}
                    onChange={(e) => setCashChange(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-900"
                  />
                </div>
              )}
            </div>

            {/* FINANCEIRO DETALHADO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-2.5 text-xs font-bold text-slate-500">
              <div className="flex justify-between"><span>Subtotal dos produtos</span><span className="text-slate-800">R$ {cartSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxa de entrega</span><span className="text-slate-800">R$ {currentDeliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-dashed pt-3 mt-1">
                <span>Total Geral</span><span className="text-red-600">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleCheckoutSubmit}
              className="w-full bg-slate-950 text-white h-14 rounded-2xl flex items-center justify-center font-black text-sm hover:bg-slate-900 shadow-md transition-all cursor-pointer"
            >
              {paymentMethod === "Pix" ? "Ir para o Pagamento Pix" : "Confirmar e Finalizar Pedido"}
            </button>
          </div>
        </div>
      )}

      {/* ================= ETAPA 3: TELA DO QR CODE DO PIX ================= */}
      {currentStep === "pixPayment" && (
        <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center space-y-6">
          <div className="space-y-1">
            <div className="bg-red-50 p-2.5 rounded-xl text-red-600 w-fit mx-auto mb-2">
              <QrCode size={28} />
            </div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">Efetuar Pagamento Pix</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Use o Copia e Cola abaixo no app do seu banco para pagar instantaneamente.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-40 h-40 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-150 p-4">
              <div className="grid grid-cols-4 gap-2 opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`w-6 h-6 ${i % 3 === 0 ? "bg-slate-900" : "bg-transparent"} border border-slate-400 rounded-xs`} />
                ))}
              </div>
            </div>
            <div className="mt-3 text-xs font-black text-slate-900">Total: <span className="text-red-600 text-sm">R$ {cartTotal.toFixed(2)}</span></div>
          </div>

          <div className="w-full space-y-1.5 text-left">
            <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block pl-0.5">Código Pix Copia e Cola</span>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 font-mono truncate flex-1">00020101021226830014br.gov.bcb.pix2561api.pix.menu/juninholanches/checkout/val{cartTotal}</p>
              <button
                onClick={() => { setPixCopied(true); setTimeout(() => setPixCopied(false), 2000); }}
                className="p-2 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                {pixCopied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              disabled={isCheckingPix}
              onClick={handleVerifyPixPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer disabled:opacity-50"
            >
              {isCheckingPix ? <><RefreshCw size={13} className="animate-spin" /> Verificando banco...</> : <><ShieldCheck size={15} /> Confirmar que fiz o Pix</>}
            </button>
            <button onClick={() => setCurrentStep("checkout")} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer block mx-auto">
              Alterar meio de pagamento
            </button>
          </div>
        </div>
      )}

      {/* ================= ETAPA 4: TELA DE SUCESSO ================= */}
      {currentStep === "success" && (
        <div className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center space-y-5 animate-fade-in">
          {/* Card Principal de Sucesso GOURMET */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-md shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>

            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Pedido Enviado para a Cozinha
            </span>

            <h2 className="text-xl font-black text-slate-900 mt-3 tracking-tight">Tudo pronto, {currentUser?.fullName.split(" ")[0]}!</h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1 max-w-xs mx-auto">
              Seu pedido foi registrado no painel do <strong>{storeName}</strong> e a preparação já foi iniciada.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-left">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Identificador</span>
                <span className="text-sm font-black text-slate-900 tracking-wider font-mono">{generatedOrderId}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Previsão</span>
                <span className="text-xs font-black text-slate-900 flex items-center gap-1 justify-end">
                  <Clock size={13} className="text-red-500" /> {deliveryTime}
                </span>
              </div>
            </div>
          </div>

          {/* TRACKING DE STATUS DO PEDIDO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ClipboardList size={14} className="text-slate-400" />
              <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Acompanhamento do Pedido</h3>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative">
                <span className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-emerald-100 z-10" />
                <p className="text-xs font-black text-slate-900">Pedido Recebido e Confirmado</p>
                <p className="text-[10px] text-slate-400 font-semibold">Seu pedido já está no nosso sistema.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-100 animate-pulse z-10" />
                <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  Preparando com carinho na Cozinha
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">Os ingredientes estão sendo montados.</p>
              </div>

              <div className="relative opacity-40">
                <span className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white z-10" />
                <p className="text-xs font-bold text-slate-800">Saiu para Entrega</p>
                <p className="text-[10px] text-slate-400 font-medium">O motoboy levará até a sua porta.</p>
              </div>
            </div>
          </div>

          {/* RESUMO LOGÍSTICO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Truck size={11} /> Entrega em:</span>
              <p className="text-slate-900 font-black line-clamp-1">{address}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 justify-end"><CreditCard size={11} /> Pago via:</span>
              <p className="text-slate-900 font-black uppercase">{paymentMethod}</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep("menu")}
            className="w-full h-12 bg-slate-950 text-white font-black text-xs rounded-xl shadow-3xs hover:bg-slate-900 active:scale-[0.98] transition-all cursor-pointer"
          >
            VOLTAR PARA O CARDÁPIO INICIAL
          </button>
        </div>
      )}

      {/* ================= MODAL DE ADICIONAIS DO PRODUTO ================= */}
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity ${selectedProduct ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`bg-white w-full max-w-xl rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[90vh] shadow-xl overflow-hidden transition-all transform ${selectedProduct ? "translate-y-0" : "translate-y-full"}`}>
          {selectedProduct && (
            <>
              <div className="relative h-44 shrink-0">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="Produto" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 bg-white text-slate-900 p-1.5 rounded-full shadow-md cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 no-scrollbar">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">{selectedProduct.name}</h2>
                    <span className="text-base font-black text-red-600">R$ {selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>

                {selectedProduct.addOns.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adicionais Opcionais</h4>
                    {selectedProduct.addOns.map((addon, i) => {
                      const isSelected = chosenAddOns.some(a => a.name === addon.name);
                      return (
                        <div key={i} onClick={() => toggleAddOn(addon)} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected ? "border-red-600 bg-red-50/10" : "border-slate-100 hover:bg-slate-50"}`}>
                          <div>
                            <span className="text-xs font-black text-slate-800">{addon.name}</span>
                            <span className="block text-[11px] text-slate-400 font-bold">+ R$ {addon.price.toFixed(2)}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? "bg-red-600 border-red-600 text-white" : "border-slate-300"}`}>{isSelected && <Check size={12} strokeWidth={4} />}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observações</h4>
                  <textarea value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Ex: Sem maionese, carne bem passada..." className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red-600 resize-none" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-4 bg-white">
                <div className="flex items-center bg-slate-100 rounded-xl p-1"><button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="p-2 text-slate-500"><Minus size={14} /></button><span className="w-6 text-center font-black text-xs">{modalQuantity}</span><button onClick={() => setModalQuantity(modalQuantity + 1)} className="p-2 text-slate-500"><Plus size={14} /></button></div>
                <button onClick={handleAddToCart} className="flex-1 bg-red-600 text-white h-12 rounded-xl flex items-center justify-between px-5 font-black text-xs hover:bg-red-700"><span>Adicionar</span><span>R$ {((selectedProduct.price + chosenAddOns.reduce((s, i) => s + i.price, 0)) * modalQuantity).toFixed(2)}</span></button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= DRAWER: SACOLA LATERAL ================= */}
      <div className={`fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs transition-opacity ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><ShoppingBag size={18} className="text-red-600" /><h3 className="font-black text-sm text-slate-900">Itens Adicionados</h3></div>
            <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-slate-400 cursor-pointer"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="border border-slate-150 rounded-2xl p-4 bg-white space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{item.quantity}x {item.product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">R$ {item.product.price.toFixed(2)} cada</p>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="p-1 text-slate-300 hover:text-red-600 cursor-pointer"><Trash2 size={15} /></button>
                </div>
                {item.selectedAddOns.length > 0 && (
                  <p className="text-[10px] text-slate-400 pl-2 border-l border-slate-200 font-medium">+ Adicionais: {item.selectedAddOns.map(a => a.name).join(", ")}</p>
                )}
                <div className="text-right text-xs font-black text-slate-950 pt-1.5 border-t border-slate-50">Total: R$ {item.itemTotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500"><span>Subtotal dos produtos</span><span className="text-slate-900 font-black text-sm">R$ {cartSubtotal.toFixed(2)}</span></div>
            <button onClick={handleProceedToDelivery} className="w-full bg-slate-950 text-white h-13 rounded-xl flex items-center justify-center font-black text-xs hover:bg-slate-900 cursor-pointer">Prosseguir para Entrega</button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE LOGIN VIA WHATSAPP ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-fade-in">

            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-3xs">
                  <MessageCircle size={14} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">Acesso Rápido via WhatsApp</span>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"><X size={16} /></button>
            </div>

            {/* Passo 1: Informar Nome e Telefone do Whats */}
            {authStep === "credentials" && (
              <form onSubmit={handleRequestAuthCode} className="p-5 space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-black text-slate-900">Cadastre-se ou Entre na sua conta</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    Não precisa lembrar de senhas! Enviaremos um código de verificação para o seu WhatsApp agora.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Seu Nome Completo</label>
                    <input
                      required type="text" placeholder="Ex: Carlos Alberto" value={authName} onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Número do WhatsApp (com DDD)</label>
                    <input
                      required type="tel" placeholder="Ex: (14) 99888-7766" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={isSendingCode}
                  className="w-full h-11 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingCode ? <><RefreshCw size={12} className="animate-spin" /> ENVIANDO CÓDIGO...</> : "SOLICITAR CÓDIGO POR WHATSAPP"}
                </button>
              </form>
            )}

            {/* Passo 2: Validar o Código Recebido */}
            {authStep === "code" && (
              <form onSubmit={handleVerifyAuthCode} className="p-5 space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-black text-slate-900">Código Enviado!</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    Digite os 4 dígitos do código de confirmação enviado para o WhatsApp de número <span className="text-slate-900 font-bold">{authPhone}</span>.
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <input
                    required maxLength={4} type="text" placeholder="0 0 0 0" value={authCode} onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ""))}
                    className="w-32 text-center tracking-widest px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit" disabled={authCode.length < 4}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    CONFIRMAR CÓDIGO E CONECTAR
                  </button>
                  <button type="button" onClick={() => setAuthStep("credentials")} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 text-center block mx-auto uppercase tracking-wider">
                    Alterar telefone ou nome
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
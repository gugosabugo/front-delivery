"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  ShoppingBag, Plus, Minus, Clock, DollarSign, ChevronRight, X, Check, 
  MessageSquare, UtensilsCrossed, ArrowLeft, MapPin, CreditCard, Smile, Trash2,
  QrCode, Copy, ShieldCheck, Lock, Smartphone, RefreshCw, ChevronDown, ChevronUp
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

export default function CustomerMenu() {
  const params = useParams();
  const storeSlug = params.slug;

  // Configurações Estáticas da Loja
  const storeName = storeSlug === "juninholanches" ? "Juninho Lanches" : "MenuBuilder Store";
  const deliveryFee = 7.00;
  const deliveryTime = "35-45 min";
  const logoImg = "/image_e06582.png";
  const bannerImg = "/Banner.png";

  // Banco de dados temporário (Mock)
  const categories = ["Todos", "Burgers", "Combos", "Porções", "Bebidas"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const [products] = useState<Product[]>([
    { 
      id: 1, 
      name: "X-Juninho Brutal", 
      price: 34.90, 
      category: "Burgers", 
      image: "http://googleusercontent.com/image_collection/image_retrieval/3860928984529884465",
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
      image: "http://googleusercontent.com/image_collection/image_retrieval/14459026392836270175",
      description: "Batatas fritas crocantes com cobertura de cheddar cremoso e muito bacon em cubos.",
      active: true, 
      addOns: [{ name: "Queijo Extra", price: 3.50 }]
    },
  ]);

  // Estados de Telas (menu -> checkout -> pixPayment -> success)
  const [currentStep, setCurrentStep] = useState<"menu" | "checkout" | "pixPayment" | "success">("menu");
  
  // Estados globais de Fluxo
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modal de Detalhes do Item
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [chosenAddOns, setChosenAddOns] = useState<AddOn[]>([]);
  const [observation, setObservation] = useState("");

  // Dados digitados no Formulário
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [cashChange, setCashChange] = useState("");
  
  // Informações do Dropdown do Cartão
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Confirmação SMS Integrada
  const [smsCode, setSmsCode] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Simulação de Copiar Pix
  const [pixCopied, setPixCopied] = useState(false);
  const [isCheckingPix, setIsCheckingPix] = useState(false);

  // Recupera as informações salvas no navegador (Se houver login anterior)
  useEffect(() => {
    const savedPhone = localStorage.getItem("customer_logged_phone");
    const savedName = localStorage.getItem("customer_logged_name");
    const savedAddress = localStorage.getItem("customer_logged_address");
    
    if (savedPhone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomerPhone(savedPhone);
      if (savedName) setCustomerName(savedName);
      if (savedAddress) setAddress(savedAddress);
      setIsUserLoggedIn(true);
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

  // Processa o envio e validação do formulário de checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !address) {
      alert("Por favor, preencha todos os campos obrigatórios da entrega.");
      return;
    }

    // Validação do SMS integrado (Exigido em TODOS os pedidos se não estiver logado)
    if (!isUserLoggedIn) {
      if (smsCode.length < 4) {
        alert("Por favor, preencha o código SMS de confirmação enviado ao seu telefone.");
        return;
      }
      
      // Se validou o SMS, salva Telefone, Nome E TAMBÉM o Endereço para as próximas compras
      localStorage.setItem("customer_logged_phone", customerPhone);
      localStorage.setItem("customer_logged_name", customerName);
      localStorage.setItem("customer_logged_address", address);
      setIsUserLoggedIn(true);
    } else {
      // Se já estava logado mas mudou/atualizou o endereço, salva o endereço novo também
      localStorage.setItem("customer_logged_address", address);
    }

    // Validação extra se for cartão
    if (paymentMethod === "Cartão de Crédito" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      alert("Por favor, preencha todas as informações do seu Cartão de Crédito.");
      return;
    }

    // Fluxo condicional: se for Pix, vai pro QR Code. Se for Cartão/Dinheiro, finaliza.
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
    }, 2000);
  };

  const completeOrderFlow = () => {
    setCurrentStep("success");
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-red-100">
      
      {/* ================= ETAPA 1: CARDÁPIO PRINCIPAL ================= */}
      {currentStep === "menu" && (
        <>
          {/* BANNER & HEADER */}
          <div className="h-48 md:h-64 w-full relative bg-slate-200">
            <img src={bannerImg} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>

          <div className="max-w-4xl w-full mx-auto px-4 relative -mt-16 mb-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-5">
                <img src={logoImg} alt="Logo" className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg" />
                <div className="text-center md:text-left space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">{storeName}</h1>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Clock size={15} className="text-red-600" /> {deliveryTime}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={15} className="text-red-600" /> Taxa: R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
                ABERTO AGORA
              </div>
            </div>
          </div>

          {/* CATEGORIAS */}
          <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-30 py-4 border-b border-slate-200/50">
            <div className="max-w-4xl w-auto mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-2xl text-xs font-black transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LISTAGEM DE PRODUTOS */}
          <main className="max-w-4xl w-full mx-auto px-4 py-6 pb-32 grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                onClick={() => handleOpenProduct(prod)}
                className="bg-white border border-slate-200 rounded-3xl p-4 flex gap-4 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black text-slate-900 group-hover:text-red-600 transition-colors">{prod.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                  </div>
                  <span className="text-base font-black text-slate-900">R$ {prod.price.toFixed(2)}</span>
                </div>
                <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                </div>
              </div>
            ))}
          </main>

          {/* BOTÃO FLUTUANTE DA SACOLA */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-40">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-1.5 rounded-lg text-white">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="font-black text-sm">{cart.length} {cart.length === 1 ? "Item" : "Itens"} na sacola</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">R$ {cartSubtotal.toFixed(2)}</span>
                  <ChevronRight size={18} className="text-slate-500" />
                </div>
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= ETAPA 2: FORMULÁRIO DE CHECKOUT COMPLETO ================= */}
      {currentStep === "checkout" && (
        <div className="max-w-2xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentStep("menu")}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-xl font-black tracking-tight">Finalizar Pedido</h2>
                <p className="text-xs text-slate-400">Insira as informações finais da sua entrega.</p>
              </div>
            </div>

            {/* SEÇÃO: DADOS DE ENTREGA COM SMS OBRIGATÓRIO & SALVAMENTO DE ENDEREÇO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-100">
                <MapPin size={16} className="text-red-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Dados de Entrega</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Seu Nome completo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João da Silva" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Telefone / Celular</label>
                  <div className="relative">
                    <input 
                      required
                      disabled={isUserLoggedIn}
                      type="tel" 
                      placeholder="Ex: (14) 99888-7766" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-red-600 transition-all disabled:opacity-60 disabled:bg-slate-100"
                    />
                    {isUserLoggedIn && (
                      <span className="absolute right-3 top-3.5 text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check size={12} strokeWidth={3} /> CONECTADO
                      </span>
                    )}
                  </div>
                </div>

                {/* CONFIRMAÇÃO DE SMS INTEGRADA DIRETAMENTE NA TELA DE PAGAMENTO */}
                {!isUserLoggedIn && (
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Smartphone size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-slate-800">Confirmação de segurança por SMS</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Insira o código de 4 dígitos enviado ao número acima para autorizar este pedido e salvar sua conta com seu endereço.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 max-w-xs">
                      <input 
                        maxLength={4}
                        type="text" 
                        placeholder="Código SMS" 
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))}
                        className="w-1/2 p-2.5 bg-white border-2 border-slate-200 rounded-xl text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-slate-900 transition-all"
                      />
                      <div className="w-1/2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl flex items-center justify-center px-2 text-center select-none opacity-80">
                        Código enviado
                      </div>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Endereço de Entrega</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Rua, Número, Bairro, Complemento" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-red-600 transition-all"
                  />
                  {isUserLoggedIn && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">✓ Endereço sincronizado com o seu telefone</span>
                  )}
                </div>
              </div>
            </div>

            {/* SEÇÃO: FORMAS DE PAGAMENTO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-100">
                <CreditCard size={16} className="text-red-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Forma de Pagamento</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Pix", "Cartão de Crédito", "Dinheiro"].map((method) => {
                  const active = paymentMethod === method;
                  return (
                    <div 
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        active ? "border-red-600 bg-red-50/20 font-bold text-red-600" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-black">{method}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? "border-red-600 bg-red-600" : "border-slate-300"}`}>
                        {active && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DROPDOWN DINÂMICO COLAPSÁVEL DO CARTÃO DE CRÉDITO */}
              {paymentMethod === "Cartão de Crédito" && (
                <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                  <div 
                    onClick={() => setIsCardDropdownOpen(!isCardDropdownOpen)}
                    className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                      <Lock size={14} className="text-slate-400" /> Preencher dados do Cartão
                    </span>
                    {isCardDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  
                  {isCardDropdownOpen && (
                    <div className="p-4 bg-white grid grid-cols-2 gap-3 transition-all">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Número do Cartão</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Nome no Cartão</label>
                        <input 
                          type="text" 
                          placeholder="Ex: JOÃO O SILVA"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Validade</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">CVV</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Opção para Dinheiro */}
              {paymentMethod === "Dinheiro" && (
                <div className="pt-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Precisa de troco para quanto?</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Troco para R$ 50,00 ou Não preciso" 
                    value={cashChange}
                    onChange={(e) => setCashChange(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="text-slate-800 font-bold">R$ {cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span className="text-slate-800 font-bold">R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-dashed pt-3 mt-1">
                <span>Total Geral</span>
                <span className="text-red-600">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleCheckoutSubmit}
              className="w-full bg-red-600 text-white h-14 rounded-2xl flex items-center justify-center font-black text-sm hover:bg-red-700 shadow-xl shadow-red-600/10 active:scale-[0.99] transition-all"
            >
              {paymentMethod === "Pix" ? "Ir para o Pagamento Pix" : "Confirmar e Enviar Pedido"}
            </button>
          </div>
        </div>
      )}

      {/* ================= ETAPA 3: TELA DO QR CODE DO PIX ================= */}
      {currentStep === "pixPayment" && (
        <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center space-y-8">
          <div className="space-y-2">
            <div className="bg-red-50 p-3 rounded-2xl text-red-600 w-fit mx-auto">
              <QrCode size={32} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">Efetuar Pagamento Pix</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Leia o código abaixo ou use o Copia e Cola para realizar a transferência instantânea.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg relative">
            <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
              <div className="grid grid-cols-4 gap-2 opacity-85 p-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 ${i % 3 === 0 || i % 7 === 0 ? "bg-slate-900" : "bg-transparent"} border border-slate-300 rounded-xs`} />
                ))}
              </div>
            </div>
            <div className="mt-4 text-sm font-black text-slate-900">Total a pagar: <span className="text-red-600">R$ {cartTotal.toFixed(2)}</span></div>
          </div>

          <div className="w-full space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block text-left">Código Copia e Cola</span>
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
              <p className="text-xs text-slate-500 font-mono truncate flex-1">00020101021226830014br.gov.bcb.pix2561api.pix.menu/juninholanches/checkout/val{cartTotal}</p>
              <button 
                onClick={() => {
                  setPixCopied(true);
                  setTimeout(() => setPixCopied(false), 2000);
                }}
                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              >
                {pixCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            {pixCopied && <span className="text-[10px] text-emerald-600 font-bold block text-left pl-1">✓ Código copiado!</span>}
          </div>

          <div className="w-full space-y-3 pt-4">
            <button 
              disabled={isCheckingPix}
              onClick={handleVerifyPixPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-13 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {isCheckingPix ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Confirmando transferência...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> Já fiz o pagamento Pix
                </>
              )}
            </button>
            <button 
              onClick={() => setCurrentStep("checkout")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Voltar e alterar pagamento
            </button>
          </div>
        </div>
      )}

      {/* ================= ETAPA 4: TELA FINAL DE SUCESSO ================= */}
      {currentStep === "success" && (
        <div className="flex-1 max-w-md w-full mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Smile size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Pedido Confirmado!</h2>
            <p className="text-sm text-slate-500 leading-relaxed px-2">
              Seu pedido foi recebido e está sendo preparado pela nossa equipe. Agora é só relaxar!
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full text-xs font-bold text-slate-500 flex justify-between items-center shadow-xs">
            <span>Previsão de entrega:</span>
            <span className="text-slate-900 font-black flex items-center gap-1"><Clock size={14} className="text-red-600" /> {deliveryTime}</span>
          </div>
          <button 
            onClick={() => setCurrentStep("menu")}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black shadow-md hover:bg-slate-800 active:scale-[0.97] transition-all"
          >
            Voltar ao Cardápio Inicial
          </button>
        </div>
      )}

      {/* ================= MODAL DE PRODUTO COMPLETO ================= */}
      <div 
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4 transition-opacity duration-300 ${
          selectedProduct ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className={`bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[92vh] shadow-2xl overflow-hidden transition-all duration-300 transform ${
            selectedProduct ? "translate-y-0 sm:scale-100" : "translate-y-full sm:translate-y-4 sm:scale-95"
          }`}
        >
          {selectedProduct && (
            <>
              <div className="relative h-48 sm:h-56 shrink-0">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="Produto" />
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full shadow-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">{selectedProduct.name}</h2>
                    <span className="text-lg font-black text-red-600">R$ {selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {selectedProduct.addOns.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed size={16} className="text-slate-400" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Adicionais Extras</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedProduct.addOns.map((addon, i) => {
                        const isSelected = chosenAddOns.some(a => a.name === addon.name);
                        return (
                          <div 
                            key={i} 
                            onClick={() => toggleAddOn(addon)}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                              isSelected ? "border-red-600 bg-red-50/30" : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-slate-800">{addon.name}</span>
                              <span className="block text-xs font-bold text-slate-500">+ R$ {addon.price.toFixed(2)}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border ${
                              isSelected ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-300 shadow-inner"
                            }`}>
                              {isSelected && <Check size={14} strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare size={16} />
                    <h4 className="text-xs font-black uppercase tracking-widest">Alguma observação?</h4>
                  </div>
                  <textarea 
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Ex: Tirar cebola, ponto da carne, maionese à parte..."
                    className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100 transition-all resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 shrink-0">
                  <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="p-2.5 text-slate-500 hover:text-slate-900 transition-colors"><Minus size={16} /></button>
                  <span className="w-8 text-center font-black text-slate-900">{modalQuantity}</span>
                  <button onClick={() => setModalQuantity(modalQuantity + 1)} className="p-2.5 text-slate-500 hover:text-slate-900 transition-colors"><Plus size={16} /></button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 text-white h-14 rounded-2xl flex items-center justify-between px-6 font-black text-sm hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-600/20"
                >
                  <span>Adicionar</span>
                  <span>
                    {((selectedProduct.price + chosenAddOns.reduce((s, i) => s + i.price, 0)) * modalQuantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= DRAWER: SACOLA LATERAL (LETRAS GRANDES E REFORMULADAS) ================= */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className={`bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl transition-transform duration-300 transform ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-red-600" />
              <h3 className="font-black text-lg text-slate-900">Sua Sacola</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* LISTA DA SACOLA: TEXTOS AUMENTADOS CONFORME A FOTO */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="border-2 border-slate-100 rounded-3xl p-5 space-y-3 bg-white shadow-xs">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {/* Letras aumentadas e marcantes (text-base font-black) */}
                    <h4 className="font-black text-base text-slate-900 tracking-tight leading-tight">{item.quantity}x {item.product.name}</h4>
                    {/* Letras do preço unitário em text-xs */}
                    <p className="text-xs text-slate-400 font-bold mt-0.5">R$ {item.product.price.toFixed(2)} cada</p>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-slate-300 hover:text-red-600 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                {item.selectedAddOns.length > 0 && (
                  <div className="pl-3 border-l-2 border-slate-300 text-slate-500 text-xs font-semibold space-y-1">
                    {item.selectedAddOns.map((addOn, idx) => (
                      <p key={idx}>+ {addOn.name} (+ R$ {addOn.price.toFixed(2)})</p>
                    ))}
                  </div>
                )}

                {item.observation && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
                    <MessageSquare size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="italic"><span className="font-bold not-italic">Obs:</span> {item.observation}</p>
                  </div>
                )}

                <div className="text-right text-sm font-black text-slate-950 pt-2 border-t border-slate-50">
                  Total do item: <span>R$ {item.itemTotal.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-16">
                <ShoppingBag size={40} strokeWidth={1.5} />
                <p className="text-sm font-bold">Sua sacola está vazia.</p>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Subtotal dos itens</span>
              <span className="text-slate-900 font-black text-base">R$ {cartSubtotal.toFixed(2)}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={() => {
                setIsCartOpen(false);
                setCurrentStep("checkout");
              }}
              className="w-full bg-slate-900 text-white h-14 rounded-2xl flex items-center justify-center font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Prosseguir para Entrega
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
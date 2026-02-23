import { FiBookOpen, FiHome, FiShoppingCart, FiMail, FiPhone, FiMapPin } from "react-icons/fi";


export const Footer = () => {
  return (
   <footer className="bg-gradient-to-r from-indigo-200 to-purple-200 text-slate-800 p-8">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div>
             <h3 className="text-xl font-semibold border-b border-slate-400/40 pb-1 mb-2">EduCart</h3>
             <p>Your smart learning resources marketplace. Find everything you need for your educational journey.</p>
           </div>
           <div>
             <h3 className="text-xl font-semibold border-b border-slate-400/40 pb-1 mb-2">Quick Links</h3>
             <ul className="space-y-1">
               <li><a href="/" className="flex items-center gap-1 hover:text-indigo-700"><FiHome /> Home</a></li>
               <li><a href="/products" className="flex items-center gap-1 hover:text-indigo-700"><FiBookOpen /> Products</a></li>
               <li><a href="/cart" className="flex items-center gap-1 hover:text-indigo-700"><FiShoppingCart /> Cart</a></li>
             </ul>
           </div>
           <div>
             <h3 className="text-xl font-semibold border-b border-slate-400/40 pb-1 mb-2">Contact</h3>
             <ul className="space-y-1">
               <li><a href="mailto:info@educart.com" className="flex items-center gap-1 hover:text-indigo-700"><FiMail /> info@educart.com</a></li>
               <li><a href="tel:+1234567890" className="flex items-center gap-1 hover:text-indigo-700"><FiPhone /> (123) 456-7890</a></li>
               <li><a href="#" className="flex items-center gap-1 hover:text-indigo-700"><FiMapPin /> 123 Learning St, EduCity</a></li>
             </ul>
           </div>
         </div>
         <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-400/40 pt-4">
           &copy; {new Date().getFullYear()} EduCart. All rights reserved.
         </div>
       </footer>
  );
};

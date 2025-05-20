
'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-800">
          Ваша пригода починається тут
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Створіть персоналізований маршрут з точки A в точку B з урахуванням вашого вільного часу та вподобань. Відкрийте нові цікаві місця на своєму шляху.
        </p>
        <Link href="/map">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-lg px-6 py-4 rounded-2xl shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition inline-flex items-center gap-2"
          >
            Почати планування <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}
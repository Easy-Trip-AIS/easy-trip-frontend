"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Як створити маршрут?",
    answer:
      'На головній сторінці вкажіть ваші критерії: тип локацій (парки, історичні місця, кав’ярні тощо), тривалість, зручний час. Після цього натисніть "Побудувати маршрут".',
  },
  {
    question: "Чи можна обрати тип місць?",
    answer:
      "Так! Ви можете фільтрувати точки маршруту за категоріями: природа, архітектура, їжа, романтика, для дітей — усе у відповідному меню фільтрів.",
  },
  {
    question: "Чи працює це без реєстрації?",
    answer:
      "Так, ви можете побудувати маршрут без облікового запису. Але щоб зберігати історію подорожей, створювати списки бажаного або ділитися маршрутами — потрібна реєстрація.",
  },
  {
    question: "Як розраховується час маршруту?",
    answer:
      "Ми враховуємо тип місць, середній час перебування, а також реальні відстані та пішу доступність. Ви також можете вручну вказати бажану тривалість.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="space-y-4"
    >
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="border-b pb-2"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-600 transition-colors flex justify-between items-center"
          >
            <span>{faq.question}</span>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden text-gray-700 mt-2"
              >
                <p className="p-1">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function HelpPage() {
  return (
    <div className="relative min-h-screen">
      {/* Фон без анімації */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white z-0" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 p-8 gap-6 min-h-screen">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="p-10 flex flex-col justify-between text-blue-900 h-full"
        >
          <div className="flex flex-col items-start justify-center h-full text-left">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Допомога з EasyTrip</h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Плануйте маршрути легко. Ми допоможемо вам зорієнтуватись у всіх функціях платформи: фільтрація маршрутів, облік часу, збереження історії — все просто!
            </p>
          </div>

          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <img src="/ukraine.png" alt="Ukrainian Flag" className="w-6 h-6 rounded-full" />
              <span className="font-medium">Українська</span>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="/" className="font-medium hover:underline">Головна</a>
              <a href="/terms" className="font-medium hover:underline">Умови</a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-[700px] p-8 overflow-auto"
        >
          <motion.h2
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Часті запитання
          </motion.h2>

          <FAQSection />

          <hr className="my-6 border-gray-300" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              Не знайшли відповідь?
            </h3>
            <p className="mb-4 text-gray-700">
              Напишіть нам, і ми допоможемо вам особисто.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Повідомлення</label>
                <textarea
                  className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                  rows={4}
                  placeholder="Опишіть, з чим у вас виникли труднощі, будемо раді допомогти!"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Надіслати запит
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
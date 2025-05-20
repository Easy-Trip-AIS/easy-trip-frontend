"use client";

import React from "react";
import { motion } from "framer-motion";

const benefitVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.4 },
  }),
};

export default function PartnersPage() {
  const benefits = [
    "Просування ваших локацій через маршрути",
    "Поява в рекомендаціях для туристів",
    "Індивідуальні маршрути під ваш бренд",
    "Можливість організації івентів через платформу",
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white z-0" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 min-h-screen">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10 flex flex-col justify-between text-blue-900 h-full"
        >
          <div className="flex flex-col justify-center h-full text-left">
            <h2 className="text-5xl font-bold mb-5">
              Співпраця з EasyTrip
            </h2>
            <p className="text-lg text-gray-700 max-w-xl mb-6">
              Ми відкриті до співпраці з містами, туристичними компаніями, кав'ярнями, музеями, локальними брендами. Долучайтесь до спільноти EasyTrip — разом ми зробимо подорожі ще цікавішими.
            </p>

            <motion.ul
              initial="hidden"
              animate="visible"
              className="list-disc pl-6 text-gray-800 space-y-2"
            >
              {benefits.map((text, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={benefitVariants}
                  className="leading-relaxed"
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <img
                src="/ukraine.png"
                alt="Ukrainian Flag"
                className="w-6 h-6 rounded-full"
              />
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
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-[700px] p-8"
        >
          <motion.h3
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Залишити заявку
          </motion.h3>

          <motion.p
            className="mb-4 text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Залиште контактну інформацію, і ми зв’яжемося з вами для обговорення деталей партнерства.
          </motion.p>

          <motion.form
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Назва компанії</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                placeholder="Тур-агенція 'Мандри'"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Контактна особа</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                placeholder="Ім'я та прізвище"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                placeholder="contact@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Коментар або ідея співпраці</label>
              <textarea
                className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg placeholder-gray-500"
                rows={4}
                placeholder="Ми хочемо інтегрувати маршрут через наші кав’ярні у Львові..."
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Надіслати заявку
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
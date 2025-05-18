"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-blue-900">
          Умови та положення використання
        </h1>

        <div className="space-y-10 text-gray-700">
          <Section title="1. Вступ">
            <p>
              Вітаємо в EasyTrip! Ці Умови та положення регулюють доступ і використання нашої платформи. 
              Використовуючи EasyTrip, ви погоджуєтеся дотримуватись цих правил.
            </p>
          </Section>

          <Section title="2. Визначення термінів">
            <ul className="list-disc pl-5">
              <li><strong>Користувач</strong> — особа, яка використовує наш сервіс.</li>
              <li><strong>Платформа</strong> — вебсайт EasyTrip, мобільні додатки та всі пов’язані сервіси.</li>
              <li><strong>Маршрут</strong> — набір локацій, створений або рекомендований через платформу.</li>
            </ul>
          </Section>

          <Section title="3. Обов'язки користувача">
            <ul className="list-disc pl-5">
              <li>Надавати достовірну особисту інформацію при реєстрації.</li>
              <li>Не використовувати сервіс для протиправної діяльності.</li>
              <li>Поважати інтелектуальні права інших користувачів та компанії.</li>
            </ul>
          </Section>

          <Section title="4. Обмеження відповідальності">
            <p>
              EasyTrip не несе відповідальності за можливі збитки, що виникають в результаті використання 
              маршрутів, неточності даних або зовнішніх факторів (погода, ситуація в місті, тощо).
            </p>
          </Section>

          <Section title="5. Інтелектуальна власність">
            <p>
              Усі тексти, дизайн, логотипи, маршрути та програмний код є власністю EasyTrip або використовуються
              за ліцензією. Будь-яке копіювання без дозволу заборонене.
            </p>
          </Section>

          <Section title="6. Політика конфіденційності">
            <p>
              Ми поважаємо вашу приватність. Детальніше дивіться у нашій 
              <a href="/privacy" className="text-blue-600 underline hover:text-blue-800 ml-1">Політиці конфіденційності</a>.
            </p>
          </Section>

          <Section title="7. Зміни до умов">
            <p>
              Ми залишаємо за собою право змінювати ці умови в будь-який момент. Актуальна версія завжди доступна
              на цій сторінці.
            </p>
          </Section>

          <Section title="8. Контактна інформація">
            <p>
              Якщо у вас виникли питання щодо Умов — зв’яжіться з нами за адресою: 
              <a href="mailto:support@easytrip.com" className="text-blue-600 underline hover:text-blue-800 ml-1">
                support@easytrip.com
              </a>
            </p>
          </Section>
        </div>

        <p className="text-sm text-gray-400 mt-12 text-center">
          Останнє оновлення: 18 травня 2025
        </p>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-blue-800 mb-2">{title}</h2>
      <div className="leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
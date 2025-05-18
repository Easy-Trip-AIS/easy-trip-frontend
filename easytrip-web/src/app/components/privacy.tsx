"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-blue-900">
          Політика конфіденційності
        </h1>

        <div className="space-y-10 text-gray-700">
          <Section title="1. Загальні положення">
            <p>
              Ця політика описує, як EasyTrip збирає, використовує та захищає персональні дані користувачів.
              Ми дотримуємося чинного законодавства України та GDPR щодо захисту персональних даних.
            </p>
          </Section>

          <Section title="2. Які дані ми збираємо">
            <ul className="list-disc pl-5">
              <li>Ім’я, прізвище, дата народження</li>
              <li>Електронна пошта та логін</li>
              <li>Інформація про пристрій та IP-адреса</li>
              <li>Дані про маршрути та вподобання</li>
            </ul>
          </Section>

          <Section title="3. Як ми використовуємо ваші дані">
            <ul className="list-disc pl-5">
              <li>Для реєстрації та ідентифікації користувача</li>
              <li>Для покращення персоналізованого досвіду</li>
              <li>Для аналітики використання сервісу</li>
              <li>Для надсилання важливої інформації та оновлень</li>
            </ul>
          </Section>

          <Section title="4. Безпека даних">
            <p>
              Ми впроваджуємо технічні та організаційні заходи безпеки для запобігання несанкціонованому доступу,
              зміні або втраті даних.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Ми використовуємо cookies для покращення вашого досвіду на сайті. Ви можете змінити налаштування
              cookies у своєму браузері.
            </p>
          </Section>

          <Section title="6. Права користувача">
            <ul className="list-disc pl-5">
              <li>Право на доступ до своїх даних</li>
              <li>Право на виправлення чи видалення</li>
              <li>Право на обмеження обробки</li>
              <li>Право подати скаргу до уповноваженого органу</li>
            </ul>
          </Section>

          <Section title="7. Контактна інформація">
            <p>
              З питань захисту даних, зв’яжіться з нами за адресою:
              <a href="mailto:privacy@easytrip.com" className="text-blue-600 underline hover:text-blue-800 ml-1">
                privacy@easytrip.com
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
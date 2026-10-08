import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BookingSection from './components/BookingSection';
import LocationFooter from './components/LocationFooter';
import AdminModal from './components/AdminModal';
import { getPublicInfo } from './api';

export default function App() {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch shop public info
  const loadPublicData = async () => {
    try {
      const data = await getPublicInfo();
      setSettings(data.settings);
      setServices(data.services || []);
      if (!selectedService && data.services?.length > 0) {
        setSelectedService(data.services[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  const handleScrollToBooking = () => {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    handleScrollToBooking();
  };

  const handleSettingsUpdated = (updatedSettings) => {
    setSettings(updatedSettings);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col antialiased">
      
      {/* Top Utility Bar with Real Contact & Address */}
      <div className="bg-[#090b0e] border-b border-[#1f242e] text-[11px] text-slate-400 py-2 px-4 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>📍 Rua Walter Hollenwerger, 119 - Antiga Batateira, Centro</span>
            <span>🕒 Aberto todos os dias: 09:00 às 21:00 (Almoço 13h - 14h)</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://api.whatsapp.com/send?phone=5573981164949" 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              WhatsApp: (73) 98116-4949
            </a>
            <span>•</span>
            <span className="text-slate-400">edalves8127@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar
          settings={settings}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onScrollToBooking={handleScrollToBooking}
        />

        {/* Hero Section */}
        <Hero
          settings={settings}
          onScrollToBooking={handleScrollToBooking}
        />

        {/* Services Showcase */}
        <ServicesSection
          services={services}
          onSelectService={handleSelectService}
        />

        {/* Interactive Booking Flow */}
        <BookingSection
          services={services}
          settings={settings}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onAppointmentCreated={() => {}}
        />

        {/* Location & Footer */}
        <LocationFooter
          settings={settings}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Admin Password Modal & Dashboard */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onSettingsUpdated={handleSettingsUpdated}
        />
      </div>

    </div>
  );
}

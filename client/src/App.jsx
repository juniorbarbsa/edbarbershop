import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BookingSection from './components/BookingSection';
import AboutSection from './components/AboutSection';
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
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Background Decorative Mesh Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
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
          onAppointmentCreated={() => {
            // Can reload or trigger analytics
          }}
        />

        {/* Heritage & Values */}
        <AboutSection
          settings={settings}
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

"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import Link from "next/link";
// import { redirect } from "next/navigation";
import type React from "react";

import { useState } from "react";

export default function Page() {
  const organizers = ['Estacionamiento', 'Baños', 'Alcancía', '+21', 'Al aire libre'];
  const eventTypes = ['Gratuito', 'Pago'];


  const [filters, setFilters] = useState({
    location: 'Bogotá',
    eventType: 'Gratuito',
    organizers: ['Alcancía'],
    genres: ['Hard Techno']
  });

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    place: "",
    geo: "",
    info: "",
    receiveInfo: false,
  });

  console.log(filters.eventType)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleOrganizerToggle = (organizer: string) => {
    setFilters(prev => ({
      ...prev,
      organizers: prev.organizers.includes(organizer)
        ? prev.organizers.filter(o => o !== organizer)
        : [...prev.organizers, organizer]
    }));
  };

  const handleEventTypeChange = (eventType: string) => {
    setFilters(prev => ({ ...prev, eventType }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // redirect("/admin/events/create-event/ticket-config");
  };

  return (
    <DefaultForm handleSubmit={handleSubmit} title="Nuevo evento">
      <FormInput
        handleFunc={handleChange}
        title="Título del evento*"
        formName={formData.title}
        inputName="title"
      />
      <FormInput
        handleFunc={handleChange}
        title="Fecha y hora*"
        formName={formData.date}
        inputName="date"
      />
      <FormInput
        handleFunc={handleChange}
        title="Lugar*"
        formName={formData.place}
        inputName="place"
      />
      <FormInput
        handleFunc={handleChange}
        title="Geolocalización*"
        formName={formData.geo}
        inputName="geo"
      />

      <EventImageSwiper />

      <FormInput
        handleFunc={handleChange}
        title="Información general*"
        formName={formData.info}
        inputName="info"
      />

      <FormDropDown
        title="Organizador*"
        handleFunc={handleChange}
      >
        <option value="organizador">Organizador</option>
        <option value="promotor">Promotor</option>
        <option value="controlador">Controlador</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 1*"
        handleFunc={handleChange}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 2*"
        handleFunc={handleChange}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 3*"
        handleFunc={handleChange}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown>

      <br />

      <FilterTagButton
        items={organizers}
        type="organizers"
        handleFunc={handleOrganizerToggle}
        filters={filters}
        title="Etiquetas"
      />

      <br />

      <div>
        <h3 className="text-white text-sm font-medium mb-1">
          Tipo de evento
        </h3>
        <div className="px-4 flex rounded-xl gap-x-5">
          {eventTypes.map((item) => (
            <label
              key={item}
              className="flex gap-x-3 items-center py-3 justify-between cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="location"
                  checked={filters["eventType"] === item}
                  onChange={() => handleEventTypeChange(item)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                    filters["eventType"] === item
                      ? "border-inactive bg-primary-black"
                      : "border-inactive group-hover:border-primary/20"
                  }`}
                >
                  {filters["eventType"] === item && (
                    <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-primary-white group-hover:text-lime-200 transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Link
        href={`${filters.eventType === "Gratuito" ? "/admin/events/create-event/free-ticket-config" : "/admin/events/create-event/ticket-config"}`}
        // type="submit"
        className="bg-primary block text-center text-black input-button"
      >
        Continuar
      </Link>
    </DefaultForm>
  );
}

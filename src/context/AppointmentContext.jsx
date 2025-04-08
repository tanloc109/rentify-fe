import React, { createContext, useState, useEffect } from "react";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const storedData = localStorage.getItem("appointmentData");
  const initialData = storedData ? JSON.parse(storedData) : null;

  const [appointmentData, setAppointmentData] = useState(initialData);

  useEffect(() => {
    if (appointmentData) {
      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    } else {
      localStorage.removeItem("appointmentData");
    }
  }, [appointmentData]);

  return (
    <AppointmentContext.Provider value={{ appointmentData, setAppointmentData }}>
      {children}
    </AppointmentContext.Provider>
  );
};

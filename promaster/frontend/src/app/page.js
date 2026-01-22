// src/app/page.js

// 🔴 هذا السطر يحل المشكلة بتعريف الملف كمكون عميل
'use client'; 

import ProMasterServices from './components/ProMasterServices.jsx';

import './globals.css';

export default function Home() {
  return (
    <main className="main-content">
      <ProMasterServices />
    </main>
  );
}

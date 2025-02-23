// app/[lang]/settings/page.tsx
'use client';

import { useParams } from 'next/navigation';
import SettingsScreen from '../../../components/SettingsScreen';

export default function SettingsPage() {
  const params = useParams();
  const { lang } = params;
  // TODO lang
  // return <SettingsScreen lang={lang} />;
  return <SettingsScreen />;
}

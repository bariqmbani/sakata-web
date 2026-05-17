import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AppShell } from '@/components/layout/AppShell';
import { FirebaseSetup } from '@/components/layout/FirebaseSetup';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { getMissingFirebaseKeys, isFirebaseConfigured } from '@/lib/firebase';
import { HomeRoute } from '@/routes/HomeRoute';
import { HowToPlayRoute } from '@/routes/HowToPlayRoute';
import { NewSoloGameRoute } from '@/routes/NewSoloGameRoute';
import { ProfileRoute } from '@/routes/ProfileRoute';
import { SoloGameRoute } from '@/routes/SoloGameRoute';
import { useAuth } from '@/hooks/useAuth';
import { useWordDictionary } from '@/hooks/useWordDictionary';

export default function App() {
  if (!isFirebaseConfigured()) {
    return <FirebaseSetup missingKeys={getMissingFirebaseKeys()} />;
  }

  return (
    <BrowserRouter>
      <AppProviders />
    </BrowserRouter>
  );
}

function AppProviders() {
  const auth = useAuth();
  const dictionary = useWordDictionary();
  const error = auth.error ?? dictionary.error;

  if (auth.isLoading || dictionary.isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppShell>
        <div className="panel text-center">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-700">{error}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomeRoute user={auth.user} />} />
        <Route
          path="/bermain"
          element={<NewSoloGameRoute user={auth.user} />}
        />
        <Route path="/bermain/:gameId" element={<SoloGameRoute />} />
        <Route path="/cara-bermain" element={<HowToPlayRoute />} />
        <Route path="/profil" element={<ProfileRoute user={auth.user} />} />
        <Route path="/permainan" element={<Navigate to="/bermain" replace />} />
        <Route path="/permainan/:gameId" element={<LegacyGameRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function LegacyGameRedirect() {
  return <Navigate to="/bermain" replace />;
}

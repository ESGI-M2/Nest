'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/authContext';

export default function ProfileColorPicker() {
  const { state: authState } = useAuth();
  const userId = authState.currentUser?.sub;

  const [color, setColor] = useState('#cccccc');
  const [colorLoading, setColorLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const res = await api.get(`/users/${userId}`);
      const user = res.data;
      setColor(user.profileColor || '#cccccc');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    };
    fetchUser();
  }, [userId]);


  useEffect(() => {
    if (!userId) return;
    const updateColor = async () => {
      setColorLoading(true);
      try {
        await api.put(`/users/${userId}/color`, { profileColor: color });
      } catch (err) {
        console.error('Failed to update color', err);
      } finally {
        setColorLoading(false);
      }
    };

    updateColor();
  }, [color, userId]);

  const handleSave = async () => {
    if (!userId) return;
    setInfoLoading(true);
    try {
      await api.put(`/users/${userId}`, {
        firstName,
        lastName,
        email,
      });

    } catch (err) {
      console.error('Failed to update user info', err);
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-lg font-semibold">Changer la couleur de profil</h2>
        <div
          className="w-16 h-16 rounded-full border-2"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          disabled={colorLoading}
          className="cursor-pointer"
        />
        {colorLoading && (
          <p className="text-sm text-gray-500">Mise à jour de la couleur...</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Modifier les informations</h2>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Prénom"
          className="input input-bordered w-full"
          disabled={infoLoading}
        />
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Nom"
          className="input input-bordered w-full"
          disabled={infoLoading}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="input input-bordered w-full"
          disabled={infoLoading}
        />
        <button
          onClick={handleSave}
          disabled={infoLoading}
          className="btn btn-primary w-full"
        >
          {infoLoading ? 'Mise à jour...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}

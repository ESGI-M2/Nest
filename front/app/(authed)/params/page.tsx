'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Ton client axios
import { useAuth } from '@/context/authContext'; // Tu dois connaître l'user connecté

export default function ProfileColorPicker() {
  const { state: authState } = useAuth();
  const userId = authState.currentUser?.sub;

  const [color, setColor] = useState('#cccccc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const res = await api.get(`/users/${userId}`);
      setColor(res.data.profileColor || '#cccccc');
    };
    fetchUser();
  }, [userId]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);

    try {
      setLoading(true);
      await api.put(`/users/${userId}/color`, {
        profileColor: newColor,
      });
    } catch (err) {
      console.error('Failed to update color', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Changer la couleur de profil</h2>

      <div
        className="w-16 h-16 rounded-full border-2"
        style={{ backgroundColor: color }}
      />

      <input
        type="color"
        value={color}
        onChange={handleChange}
        disabled={loading}
        className="cursor-pointer"
      />

      {loading && <p className="text-sm text-gray-500">Mise à jour...</p>}
    </div>
  );
}

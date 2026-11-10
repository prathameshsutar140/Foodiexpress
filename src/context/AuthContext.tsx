import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { UserProfile, UserRole, DeliveryAddress } from '../types';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateAddress: (address: DeliveryAddress) => void;
  deleteAddress: (id: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest-user-1',
  email: 'guest.foodie@example.com',
  displayName: 'Aarav Mehta',
  role: 'customer',
  phone: '+91 98199 88776',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  savedAddresses: [
    {
      id: 'addr-1',
      title: 'Home',
      street: 'Flat 402, Sea Green Apartments, Carter Road',
      area: 'Bandra West',
      city: 'Mumbai',
      pinCode: '400050',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Work',
      street: 'Tech Park Tower 3, Floor 6, BKC G Block',
      area: 'Bandra Kurla Complex',
      city: 'Mumbai',
      pinCode: '400051',
      isDefault: false,
    },
  ],
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setProfile((prev) => ({
          ...prev,
          uid: user.uid,
          email: user.email || prev.email,
          displayName: user.displayName || 'Foodie Food Lover',
          avatarUrl: user.photoURL || prev.avatarUrl,
        }));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      console.warn('Google Popup auth error or closed by user:', err);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setProfile(DEFAULT_PROFILE);
      setActiveRole('customer');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const updateAddress = (address: DeliveryAddress) => {
    setProfile((prev) => {
      const addresses = prev.savedAddresses || [];
      const index = addresses.findIndex((a) => a.id === address.id);
      let updated: DeliveryAddress[];
      if (index >= 0) {
        updated = [...addresses];
        updated[index] = address;
      } else {
        updated = [...addresses, address];
      }
      return { ...prev, savedAddresses: updated };
    });
  };

  const deleteAddress = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      savedAddresses: (prev.savedAddresses || []).filter((a) => a.id !== id),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        activeRole,
        setActiveRole,
        isLoading,
        signInWithGoogle,
        logout,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

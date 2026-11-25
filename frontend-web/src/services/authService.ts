
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { AuthUser, UserRole } from '@/context/AuthContext';

const USERS_DB_KEY = 'campusSave_mock_users';

// Anciennes fonctions conservées temporairement pour compatibilité.
interface MockUser {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
}

interface StudentForm {
  fullName: string;
  email: string;
  password: string;
}

const getUsers = (): MockUser[] => {
  const users = localStorage.getItem(USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (user: MockUser) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const authService = {
  async signIn(
    role: UserRole,
    email: string,
    password: string
  ): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    if (user.role !== role) {
      throw new Error(`Ce compte n'est pas un compte ${role}.`);
    }

    return {
      uid: user.uid,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  },

  async signUpStudent(form: StudentForm): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = getUsers();

    if (users.some((u) => u.email === form.email)) {
      throw new Error('Cet email est déjà utilisé.');
    }

    const newUser: MockUser = {
      uid: crypto.randomUUID(),
      role: 'student',
      name: form.fullName,
      email: form.email,
      password: form.password,
    };

    saveUser(newUser);

    return {
      uid: newUser.uid,
      role: 'student',
      email: newUser.email,
      name: newUser.name,
    };
  },

  async sendPasswordReset(email: string): Promise<void> {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error('Veuillez saisir votre adresse email.');
    }

    await sendPasswordResetEmail(auth, normalizedEmail);
  },
};

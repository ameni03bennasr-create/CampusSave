import type { AuthUser, UserRole } from '@/context/AuthContext';

const USERS_DB_KEY = 'campusSave_mock_users';
const ASSOCIATION_ROLE = 'association' as UserRole;

export interface MockUser {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  status?: 'pending' | 'approved';
}

interface SignUpForm {
  email: string;
  password: string;
  fullName?: string;
  name?: string;
  establishmentName?: string;
  clubName?: string;
}

// --- INITIALISATION DES COMPTES DE TEST (FORCÉE) ---
const initMockDB = () => {
  const existingUsersStr = localStorage.getItem(USERS_DB_KEY);
  const users: MockUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

  const defaultUsers: MockUser[] = [
    { uid: 'admin-1', role: 'admin', name: 'Super Admin', email: 'admin@campussave.tn', password: 'admin123', status: 'approved' },
    { uid: 'merchant-1', role: 'merchant', name: 'Cafétéria ESSECT', email: 'merchant@campussave.tn', password: 'merchant123', status: 'approved' },
    { uid: 'student-1', role: 'student', name: 'Yasmine Ben Ali', email: 'student@campussave.tn', password: 'student123', status: 'approved' },
    { uid: 'assoc-1', role: ASSOCIATION_ROLE, name: 'Club Informatique', email: 'assoc@campussave.tn', password: 'assoc123', status: 'approved' },
  ];

  let updated = false;
  defaultUsers.forEach(defUser => {
    // Si l'email n'existe pas dans la base actuelle, on l'ajoute
    if (!users.find(u => u.email === defUser.email)) {
      users.push(defUser);
      updated = true;
    }
  });

  if (updated || !existingUsersStr) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  }
};

initMockDB();

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
  async signIn(role: UserRole, email: string, password: string): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    if (user.role !== role) {
      throw new Error(`Ce compte n'est pas un compte ${role}.`);
    }

    if (user.role === 'merchant' && user.status === 'pending') {
      throw new Error("Votre compte commerçant est en attente de validation par l'administrateur.");
    }

    return { uid: user.uid, role: user.role, email: user.email, name: user.name };
  },

  async signUpStudent(form: SignUpForm): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    
    if (users.some((u) => u.email === form.email)) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const newUser: MockUser = {
      uid: crypto.randomUUID(),
      role: 'student',
      name: form.fullName || form.name || '',
      email: form.email,
      password: form.password,
      status: 'approved'
    };

    saveUser(newUser);
    return { uid: newUser.uid, role: 'student', email: newUser.email, name: newUser.name };
  },

  async requestMerchantAccount(form: SignUpForm): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();

    if (users.some((u) => u.email === form.email)) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const newUser: MockUser = {
      uid: crypto.randomUUID(),
      role: 'merchant',
      name: form.establishmentName || form.name || 'Nouveau Commerçant',
      email: form.email,
      password: form.password,
      status: 'pending' 
    };

    saveUser(newUser);
  },

  async signUpAssociation(form: SignUpForm): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();

    if (users.some((u) => u.email === form.email)) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const newUser: MockUser = {
      uid: crypto.randomUUID(),
      role: ASSOCIATION_ROLE,
      name: form.clubName || form.name || '',
      email: form.email,
      password: form.password,
      status: 'approved'
    };

    saveUser(newUser);
    return { uid: newUser.uid, role: ASSOCIATION_ROLE, email: newUser.email, name: newUser.name };
  },

  async sendPasswordReset(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Email envoyé à ${email}`);
  }
};
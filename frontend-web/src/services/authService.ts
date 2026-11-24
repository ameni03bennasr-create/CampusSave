import type { AuthUser, UserRole } from '@/context/AuthContext';

const USERS_DB_KEY = 'campusSave_mock_users';

export interface MockUser {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  status?: 'pending' | 'approved' | 'rejected';
  type?: string;
}

interface StudentSignUpForm {
  fullName?: string;
  name?: string;
  email: string;
  password: string;
}

interface MerchantAccountForm {
  establishmentName?: string;
  email: string;
  password: string;
  type?: string;
}

interface AssociationSignUpForm {
  clubName?: string;
  name?: string;
  email: string;
  password: string;
}

// --- INITIALISATION DES COMPTES DE TEST ---
const initMockDB = () => {
  const existingUsersStr = localStorage.getItem(USERS_DB_KEY);
  const users: MockUser[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

  const defaultUsers: MockUser[] = [
    { uid: 'admin-1', role: 'admin', name: 'Super Admin', email: 'admin@campussave.tn', password: 'admin123', status: 'approved' },
    { uid: 'merchant-1', role: 'merchant', name: 'Cafétéria ESSECT', email: 'merchant@campussave.tn', password: 'merchant123', status: 'approved', type: 'Cafétéria' },
    { uid: 'student-1', role: 'student', name: 'Yasmine Ben Ali', email: 'student@campussave.tn', password: 'student123', status: 'approved' },
    { uid: 'assoc-1', role: 'association' as UserRole, name: 'Club Informatique', email: 'assoc@campussave.tn', password: 'assoc123', status: 'approved' },
  ];

  let updated = false;
  defaultUsers.forEach(defUser => {
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

    if (!user) throw new Error("Email ou mot de passe incorrect.");
    if (user.role !== role) throw new Error(`Ce compte n'est pas un compte ${role}.`);
    if (user.role === 'merchant' && user.status === 'pending') {
      throw new Error("Votre compte commerçant est en attente de validation par l'administrateur.");
    }
    if (user.role === 'merchant' && user.status === 'rejected') {
      throw new Error("Votre demande de compte a été refusée.");
    }

    return { uid: user.uid, role: user.role, email: user.email, name: user.name };
  },

  async signUpStudent(form: StudentSignUpForm): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    if (users.some((u) => u.email === form.email)) throw new Error("Cet email est déjà utilisé.");

    const name = form.fullName || form.name || '';
    const newUser: MockUser = { uid: crypto.randomUUID(), role: 'student', name, email: form.email, password: form.password, status: 'approved' };
    saveUser(newUser);
    return { uid: newUser.uid, role: 'student', email: newUser.email, name: newUser.name };
  },

  async requestMerchantAccount(form: MerchantAccountForm): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    if (users.some((u) => u.email === form.email)) throw new Error("Cet email est déjà utilisé.");

    const newUser: MockUser = {
      uid: crypto.randomUUID(), role: 'merchant', name: form.establishmentName || 'Nouveau Commerçant',
      email: form.email, password: form.password, status: 'pending', type: form.type || 'Restaurant'
    };
    saveUser(newUser);
  },

  async signUpAssociation(form: AssociationSignUpForm): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getUsers();
    if (users.some((u) => u.email === form.email)) throw new Error("Cet email est déjà utilisé.");

    const role = 'association' as UserRole;
    const name = form.clubName || form.name || '';
    const newUser: MockUser = { uid: crypto.randomUUID(), role, name, email: form.email, password: form.password, status: 'approved' };
    saveUser(newUser);
    return { uid: newUser.uid, role, email: newUser.email, name: newUser.name };
  },

  async sendPasswordReset(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Email envoyé à ${email}`);
  },

  // --- NOUVELLES FONCTIONS POUR L'ADMIN ---
  async getAllMerchants(): Promise<MockUser[]> {
    const users = getUsers();
    return users.filter(u => u.role === 'merchant');
  },

  async updateMerchantStatus(uid: string, status: 'approved' | 'rejected'): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getUsers();
    const updatedUsers = users.map(u => u.uid === uid ? { ...u, status } : u);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
  }
};
```typescript
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/config/firebase';

import type { StudentRegistrationForm } from '@/types/student';
import type { MerchantRegistrationForm } from '@/types/merchant';
import type { AssociationRegistrationForm } from '@/types/association';

const completeRegistration = httpsCallable(
  functions,
  'completeRegistration'
);

export async function registerStudent(form: StudentRegistrationForm) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    form.email.trim(),
    form.password
  );

  await completeRegistration({
    role: 'etudiant',
    nom: form.fullName.trim(),
    telephone: form.phone.trim(),
  });

  // Actualise le token pour récupérer le rôle attribué par le backend.
  await credential.user.getIdToken(true);
}

export async function registerMerchant(form: MerchantRegistrationForm) {
  await createUserWithEmailAndPassword(
    auth,
    form.email.trim(),
    form.password
  );

  await completeRegistration({
    role: 'commercant',
    nom: form.merchantFullName.trim(),
    telephone: form.phone.trim(),
    nomCommerce: form.establishmentName.trim(),
    adresse: form.address.trim(),
    specialite: form.establishmentType.trim(),
  });

  // Le compte reste en attente de validation : on ferme la session.
  await signOut(auth);
}

export async function registerAssociation(
  form: AssociationRegistrationForm
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    form.email.trim(),
    form.password
  );

  await completeRegistration({
    role: 'association',
    nom: form.responsibleFullName.trim(),
    nomClub: form.clubName.trim(),
    universite: form.university.trim(),
    ...(form.phone.trim()
      ? { telephone: form.phone.trim() }
      : {}),
  });

  // Actualise le token pour récupérer le rôle attribué par le backend.
  await credential.user.getIdToken(true);
}
```
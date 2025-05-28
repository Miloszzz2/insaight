// utils/cookie.ts
import { cookies } from 'next/headers';
import { encrypt, decrypt } from './encryption'; // twój własny moduł


export async function getSecureCookie(name: string) {
    const cookieStore = await cookies();
    const encrypted = cookieStore.get(name)?.value;
    if (!encrypted) return null;
    const decrypted = decrypt(encrypted);
    return JSON.parse(decrypted);
}

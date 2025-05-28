import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";

import { auth } from "./config";
import { toast } from "sonner";

export function onAuthStateChanged(cb: any) {
    return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb: any) {
    return _onIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'consent',
    })
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken as string;

        if (!token) throw new Error('Missing token');
        if (token != null) {
            await fetch('/api/set-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token }),
            });
        }

        toast.success('Succesfully logged in');
    } catch (error) {
        toast.error('Error signing in with Google');
        console.error(error);
    }
}

export async function signOut() {
    try {
        await auth.signOut();
        window.location.href = "/auth";
    } catch (error) {
        toast.error("Error signing out with Google")
        console.error("Error signing out with Google", error);
    }
}
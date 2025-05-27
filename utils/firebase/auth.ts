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
    try {
        const result = await signInWithPopup(auth, provider)
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential?.accessToken
        window.location.href = "/dashboard";
    } catch (error) {
        toast.error("Error signing in with Google")
        console.error("Error signing in with Google", error);
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
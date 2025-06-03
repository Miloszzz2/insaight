"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";


export default async function signOut() {
    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser()
    if (user) {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error)
            toast.error(error.message)
            redirect('/auth')
        }
    }
    revalidatePath('/', 'layout')
    redirect('/auth')
}
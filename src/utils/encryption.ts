import crypto from 'crypto';

const AES_SECRET = process.env.AES_SECRET!;
const IV = crypto.randomBytes(16); // lub ustal stałą wartość (np. Buffer.alloc(16))

export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET, 'utf-8'), IV);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return IV.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET, 'utf-8'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

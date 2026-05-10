export class Character {
    id!: any;
    name!: string;
    address!: string;
    picture!: string;
    relation!: string;
    content!: string[];
    shortname!: string;
    gender!: "male" | "female" | "other";
    isActive!: boolean;
    created_at!: string;
    updated_at!: string;
    side?: 'left' | 'right';
}
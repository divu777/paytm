import db from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import {z} from "zod";


export const userSchema=z.object({
    name:z.string(),
    phone:z.string().length(10),
    password:z.string()
})

export const authOptions={
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                name:{
                    label:'Name',type:"text",placeholder:"divakar"
                },
                phone:{
                    label:'Phone Number',type:"text",placeholder:"123456789"
                },
                password:{
                    label:"Password",type:"password",placeholder:"****"
                }
            },
            async authorize(credentials) {
                if (!credentials) {
                    console.error("No credentials provided");
                    return null;
                }
                const result = userSchema.safeParse(credentials);
                if (!result.success) {
                    console.error("Validation error:", result.error);
                    return null;
                }
            
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone,
                    },
                });

                if(existingUser){
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (!passwordValidation) {
                        console.error("Invalid password.");
                        return null;
                    }
                    
                    
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            number: existingUser.number,
                        };
                }
            
                      try {
                    const hashedPassword = await bcrypt.hash(credentials!.password, 10);
                    const user = await db.user.create({
                        data: {
                            name: credentials!.name,
                            number: credentials!.phone,
                            password: hashedPassword,
                        },
                    });

                    await db.balance.create({
                        data:{
                            userId:user.id,
                            amount:100,
                            locked:0
                        }
                    });
            
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        number: user.number,
                    };
                } catch (err) {
                    console.error("Error creating user:", err);
                    return null;
                }
            }
            
        })
    ],
    secret:process.env.JWT_SECRET || 'secret',
    callbacks:{
        async jwt({ token, user }:any) {
            if (user) {
                token.sub = user.id.toString(); // Set the user ID
            }
            return token;
        },
        async session({token,session}:any){
            session.user.id=token.sub

            return session
        }
    }
}
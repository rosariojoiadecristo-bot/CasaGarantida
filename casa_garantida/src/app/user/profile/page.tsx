import PageTitle from '@/app/components/pageTitle';
import { getUserByEmail } from '@/services/actions/user';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import React from 'react';
import ProfileContent from './_components/ProfileContent';

const ProfilePage = async () => {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    // Busca o usuário na API C# usando a Server Action
    const dbUser = await getUserByEmail(user ? user.email : "");

    return (
        <div>
            <PageTitle title='My Profile' linkCaption='Back To Home Page' href='/' />
            <ProfileContent dbUser={dbUser} kindeUser={user} />
        </div>
    );
};

export default ProfilePage;
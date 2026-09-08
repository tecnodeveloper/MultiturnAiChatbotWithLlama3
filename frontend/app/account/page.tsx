"use client";

import { FC } from "react";
import { AccountHeader } from "@/components/account/header";
import { ProfileForm } from "@/components/account/profile-form";

const AccountPage: FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="bg-card/80 dark:bg-[#070a12]/80 backdrop-blur-md border-b border-border/70 sticky top-0 z-40">
        <div className="px-4 sm:px-8 max-w-[1600px] mx-auto w-full">
          <AccountHeader />
        </div>
      </div>
      
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col items-center">
        <ProfileForm />
      </main>
    </div>
  );
};

export default AccountPage;

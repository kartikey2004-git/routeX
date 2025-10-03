import { currentUser } from "@/modules/authentication/actions";
import UserButton from "@/modules/authentication/components/user-button";
import React from "react";

const page = async () => {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center px-6 md:px-0">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4">
          Welcome to Our routeX!
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Explore amazing features and make your experience unforgettable.
        </p>

        <UserButton user={user} />
      </div>
    </main>
  );
};

export default page;

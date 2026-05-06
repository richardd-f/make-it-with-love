import { auth, signOut } from "@/src/auth";
import { NavBarClient } from "./NavBarClient";

export async function NavBar() {
  const session = await auth();

  const logoutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <NavBarClient 
      session={session} 
      logoutAction={logoutAction} 
    />
  );
}

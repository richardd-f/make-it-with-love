import { auth, signOut } from "@/src/auth";
import { NavBarClient } from "./NavBarClient";
import { getSubscriptionStatus } from "@/src/features/subscription/actions/get-subscription-status.action";

export async function NavBar() {
  const session = await auth();
  const { status } = await getSubscriptionStatus();
  const isSubscribed = status === "active";

  const logoutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <NavBarClient
      session={session}
      isSubscribed={isSubscribed}
      logoutAction={logoutAction}
    />
  );
}

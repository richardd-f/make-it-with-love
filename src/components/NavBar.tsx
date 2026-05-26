import { auth } from "@/src/auth";
import { NavBarClient } from "./NavBarClient";
import { getSubscriptionStatus } from "@/src/features/subscription/actions/get-subscription-status.action";
import { logoutUser } from "@/src/features/auth/actions/authActions";

export async function NavBar() {
  const session = await auth();
  const { status } = await getSubscriptionStatus();
  const isSubscribed = status === "active";

  return (
    <NavBarClient
      session={session}
      isSubscribed={isSubscribed}
      logoutAction={logoutUser}
    />
  );
}

import { useSelector } from "react-redux";

/**
 * Returns true if the current user holds the specified permission.
 * Subscribes only to the permissions array — no role-string comparisons at call sites.
 */
export const usePermission = (permission) =>
  useSelector((s) => s.user.currentUser.permissions.includes(permission));

/**
 * Returns a checker function for imperative use inside event handlers.
 */
export const usePermissionCheck = () => {
  const perms = useSelector((s) => s.user.currentUser.permissions);
  return (p) => perms.includes(p);
};

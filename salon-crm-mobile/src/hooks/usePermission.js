import {useSelector} from 'react-redux';

/**
 * Returns true if the current user holds the given permission.
 * Subscribes only to the permissions array — no role-string checks at call sites.
 */
export const usePermission = permission =>
  useSelector(s => s.user.currentUser.permissions.includes(permission));

/**
 * Returns an imperative checker for use inside callbacks / event handlers.
 */
export const usePermissionCheck = () => {
  const perms = useSelector(s => s.user.currentUser.permissions);
  return p => perms.includes(p);
};

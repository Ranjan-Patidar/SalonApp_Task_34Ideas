import { usePermission } from "../../hooks/usePermission";

const PermissionGate = ({ permission, children, fallback = null }) => {
  const allowed = usePermission(permission);
  return allowed ? children : fallback;
};

export default PermissionGate;

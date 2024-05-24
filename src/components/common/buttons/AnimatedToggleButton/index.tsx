import { ToggleButton } from "@mui/material";
import { motion } from "framer-motion";

const AnimatedToggleButton = ({
  value,
  isActive,
  children,
  textTransform = "capitalize"
}: {
  value: string;
  isActive: boolean;
  children: React.ReactNode;
  textTransform?: "capitalize" | "uppercase" | "lowercase";
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: "100%",
        scale: isActive ? 1.05 : 1,
        opacity: isActive ? 1 : 0.7
      }}
    >
      <ToggleButton
        value={value}
        sx={{
          border: "none",
          justifyContent: "flex-start",
          textTransform
        }}
      >
        {children}
      </ToggleButton>
    </motion.div>
  );
};

export default AnimatedToggleButton;

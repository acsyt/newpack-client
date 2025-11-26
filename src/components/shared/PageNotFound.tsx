import type { FileRouteTypes } from "@/routeTree.gen";

import MUILink from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Link } from "@tanstack/react-router";
import { FontWeight } from "@/theme/font-weight";
import Button from "@mui/material/Button";

interface PageNotFoundProps {
  message?: string;
  redirectPath?: FileRouteTypes["fullPaths"];
  statusCode?: number;
  showRetry?: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const PageNotFound = ({
  message,
  redirectPath = "/",
  statusCode = 404,
  showRetry = false,
  onRetry,
  isRetrying = false,
}: PageNotFoundProps) => {
  const defaultMessage = "Page not found";
  return (
    <Box
      display={"flex"}
      flexDirection={{
        sx: "column-reverse",
        md: "row",
      }}
      height={"calc(100vh - 300px)"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ verticalAlign: "middle" }}
    >
      <Box textAlign={"center"} px={2} mx={2}>
        <Typography variant={"h1"} fontWeight={FontWeight.bold}>
          {statusCode}
        </Typography>
        <Typography fontWeight={FontWeight.bold} variant="h6">
          {message || defaultMessage}
        </Typography>
        <Typography fontWeight={FontWeight.light}>
          <Typography component="span">Can go back to </Typography>
          <MUILink
            component={Link}
            to={redirectPath}
            className="transition-all"
            fontWeight={FontWeight.semiBold}
            underline="hover"
          >
            {redirectPath}
          </MUILink>
        </Typography>
        {showRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            disabled={isRetrying}
            sx={{ mt: 2 }}
          >
            {isRetrying ? "Loading..." : "Retry"}
          </Button>
        )}
      </Box>
      <Box px={3} mx={3}>
        <picture>
          <source srcSet="/images/logo.avif" type="image/avif" />
          <source srcSet="/images/logo.webp" type="image/webp" />
          <img
            loading="lazy"
            src="/images/logo.png"
            width="150"
            height="150"
            alt="Logo"
          />
        </picture>
      </Box>
    </Box>
  );
};

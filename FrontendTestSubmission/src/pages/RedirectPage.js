import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useStore } from "../lib/store";
import { logger } from "../lib/logger";

export default function RedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const store = useStore();
  const [state, setState] = React.useState({ loading: true, error: null });

  React.useEffect(() => {
    async function go() {
      if (!code) {
        setState({ loading: false, error: "Missing code" });
        logger.event("redirect.missing_code");
        return;
      }
      const link = store.resolve(code);
      if (!link) {
        setState({ loading: false, error: "Link not found or expired." });
        logger.event("redirect.miss_or_expired", { code });
        return;
      }

      // record hit with referrer + coarse geo/timezone
      const meta = { referrer: document.referrer || null, geo: Intl.DateTimeFormat().resolvedOptions().timeZone || null };
      store.recordHit(code, meta);

      // log then redirect
      logger.event("redirect.perform", { code, target: link.url });
      // small timeout to let setState settle, then navigate
      window.location.replace(link.url);
    }
    go();
  }, [code]);

  if (state.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (state.error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{state.error}</Alert>
        <Button variant="contained" onClick={() => navigate("/")}>Go Home</Button>
      </Box>
    );
  }
  return null;
}

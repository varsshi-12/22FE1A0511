import React, { useState } from "react";
import { useStore } from "../lib/store";
import { logger } from "../lib/logger";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UrlRow from "../components/UrlRow";

export default function Home() {
  const store = useStore();
  const [rows, setRows] = useState([{ url: "", validity: "", code: "" }]);
  const [snack, setSnack] = useState(null);

  function addRow() {
    if (rows.length >= 5) {
      setSnack({ severity: "warning", message: "You can add up to 5 URLs at once." });
      return;
    }
    setRows(r => [...r, { url: "", validity: "", code: "" }]);
  }
  function updateRow(idx, val) {
    setRows(r => r.map((x, i) => (i === idx ? val : x)));
  }
  function removeRow(idx) {
    setRows(r => r.filter((_, i) => i !== idx));
  }

  function showSnack(severity, message) {
    setSnack({ severity, message });
  }

  async function createAll() {
    // iterate rows and try creating each non-empty
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.url || !r.url.trim()) continue;
      try {
        const validity = r.validity === "" ? undefined : Number(r.validity);
        const res = store.create({ url: r.url, validityMins: validity, customCode: r.code || undefined });
        showSnack("success", `Created: ${res.code}`);
      } catch (err) {
        showSnack("error", err.message || "Failed to create link");
      }
    }
    // reset rows to a single empty row
    setRows([{ url: "", validity: "", code: "" }]);
  }

  function onCopy(fullUrl) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      showSnack("success", "Copied link to clipboard");
      logger.event("ui.copy", { fullUrl });
    }).catch(() => {
      showSnack("error", "Unable to copy");
    });
  }

  function onDelete(code) {
    store.remove(code);
    showSnack("info", `Deleted ${code}`);
  }

  const allLinks = store.readAll();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>URL Shortener</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Add up to 5 URLs. If validity is empty, default is 30 minutes.
        </Typography>

        <Stack spacing={2}>
          {rows.map((r, idx) => (
            <UrlRow
              key={idx}
              index={idx}
              value={r}
              onChange={(val) => updateRow(idx, val)}
              onRemove={() => removeRow(idx)}
            />
          ))}

          <Grid container spacing={1}>
            <Grid item>
              <Button variant="contained" onClick={addRow} disabled={rows.length >= 5}>Add Row</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={createAll}>Shorten</Button>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Your Shortened URLs</Typography>
      <Stack spacing={1}>
        {allLinks.length === 0 && <Typography color="text.secondary">No links yet.</Typography>}
        {allLinks.map(link => {
          const origin = window.location.origin;
          const short = `${origin}/${link.code}`;
          const expired = Date.now() >= link.expiresAt;
          return (
            <Paper key={link.code} sx={{ p: 1 }}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="subtitle2" noWrap>{link.url}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Expires: {new Date(link.expiresAt).toLocaleString()} • Created: {new Date(link.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Chip label={`/${link.code}`} color={expired ? "default" : "primary"} />
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2">{link.clicks}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => onCopy(short)} aria-label="copy">
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(link.code)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Stack>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snack ? (
          <Alert severity={snack.severity} onClose={() => setSnack(null)} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}

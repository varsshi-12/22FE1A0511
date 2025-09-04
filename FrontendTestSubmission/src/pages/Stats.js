import React, { useState } from "react";
import { useStore } from "../lib/store";
import { logger } from "../lib/logger";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Stats() {
  const store = useStore();
  const [showLogs, setShowLogs] = useState(false);
  const links = store.readAll();
  const logs = logger.read();

  return (
    <div>
      <Typography variant="h5" gutterBottom>Statistics</Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shortcode</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map(l => (
              <TableRow key={l.code}>
                <TableCell>/{l.code}</TableCell>
                <TableCell style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</TableCell>
                <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(l.expiresAt).toLocaleString()}</TableCell>
                <TableCell>{l.clicks}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => setShowLogs(false)} variant="outlined" href={`/${l.code}`} target="_blank" rel="noreferrer">Open</Button>
                    <Button size="small" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${l.code}`)}>Copy</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Click History (per link)</Typography>
      {links.map(l => (
        <Accordion key={l.code} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">/{l.code} — {l.clicks} clicks</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {(!l.history || l.history.length === 0) && <Typography color="text.secondary">No clicks yet.</Typography>}
            <List>
              {l.history.map((h, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <div>
                      <Typography variant="body2">{new Date(h.ts).toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Referrer: {h.referrer || "—"} • Geo/Timezone: {h.geo || "—"}</Typography>
                    </div>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Typography variant="h6" sx={{ mt: 3 }}>Logger</Typography>
      <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
        <Button size="small" onClick={() => { logger.clear(); window.location.reload(); }}>Clear Logs</Button>
        {logs.length === 0 && <Typography color="text.secondary">No logs yet.</Typography>}
        {logs.slice().reverse().map((l, i) => (
          <div key={i} style={{ marginTop: 8 }}>
            <Typography variant="caption" color="text.secondary">{new Date(l.ts).toLocaleString()} • {l.type}</Typography>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(l.payload)}</pre>
            <Divider sx={{ my: 1 }} />
          </div>
        ))}
      </Paper>
    </div>
  );
}


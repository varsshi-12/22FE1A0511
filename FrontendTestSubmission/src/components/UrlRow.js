import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UrlRow({ value, onChange, onRemove, index }) {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={7}>
        <TextField
          label={`Original URL #${index + 1}`}
          placeholder="https://example.com"
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Validity (mins)"
          type="number"
          value={value.validity ?? ""}
          onChange={(e) => onChange({ ...value, validity: e.target.value })}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Shortcode (opt)"
          value={value.code ?? ""}
          onChange={(e) => onChange({ ...value, code: e.target.value })}
          fullWidth
        />
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={onRemove} aria-label="remove">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

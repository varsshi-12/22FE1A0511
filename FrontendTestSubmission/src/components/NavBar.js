import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Shorten
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

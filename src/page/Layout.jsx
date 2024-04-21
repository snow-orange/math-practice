import { GeneratorProvider } from "../context/GeneratorContext";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

const Layout = ({ children }) => {
  return (
    <GeneratorProvider>
      <Box width="100%">
        <Stack direction="row" spacing={2}>
          <Paper elevation={0}></Paper>
          <Paper sx={{ flexGrow: 1, padding: "1em" }} elevation={0}>
            <Paper sx={{ padding: "1em " }}>{children}</Paper>
          </Paper>
        </Stack>
      </Box>
    </GeneratorProvider>
  );
};

export default Layout;

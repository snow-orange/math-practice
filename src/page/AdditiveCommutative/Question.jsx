import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import {
  Input,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Box,
} from "@mui/material";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import { useState } from "react";
import { parseCaclulationTree } from "../../lib/calculationTree";

const Question = ({ n = 0, question }) => {
  const [anwser, setAnwser] = useState("");
  const handleClickShowPassword = () => {
    const tree = parseCaclulationTree(anwser);
    console.log(tree);
  };
  const handleChange = (e) => {
    let v = e.target.value;
    v = v.trim();
    v = v.replace(/[^ a-z0-9{}()\[\]+\-\*\/]/g, "");
    setAnwser(v);
  };

  return (
    <Paper elevation={0} sx={{ padding: "0 0 1rem 0", overflow: "hidden" }}>
      <Typography padding="4px 1rem" bgcolor="#dedede">
        Q{n}:{" "}
        <Typography fontWeight="bold" variant="span">
          {question.body}
        </Typography>
      </Typography>

      <Box paddingRight="1rem">
        <FormControl sx={{ m: 1 }} variant="filled" fullWidth>
          <InputLabel htmlFor={`answer-${n}`}>Answer</InputLabel>
          <Input
            value={anwser}
            id={`answer-${n}`}
            type="text"
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  size="4"
                  disabled={!anwser}
                >
                  <DoneOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Question;

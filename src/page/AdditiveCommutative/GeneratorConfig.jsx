import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { useGeneratorContext } from "../../context/GeneratorContext";
import { useEffect, useMemo, useState } from "react";

const GeneratorConfig = ({ onCreate }) => {
  const questionNumbers = useMemo(
    () =>
      Array.from({ length: 5 }).map((_v, i) => ({
        value: (i + 1) * 10,
        label: `${(i + 1) * 10}`,
      })),
    []
  );
  const { config, setConfig } = useGeneratorContext();

  useEffect(
    () =>
      setConfig({
        questionNumber: questionNumbers[0].value,
        includeVars: true,
      }),
    []
  );

  return (
    <Box>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Question Count
        </FormLabel>
        <RadioGroup
          name="question-number"
          onChange={(e) => setConfig({ questionNumber: e.target.value })}
          defaultValue={questionNumbers[0].value}
        >
          {questionNumbers.map((num) => (
            <FormControlLabel {...num} key={num.label} control={<Radio />} />
          ))}
        </RadioGroup>
      </FormControl>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={onCreate}>
          Create
        </Button>
      </Stack>
    </Box>
  );
};

export default GeneratorConfig;

import { useCallback, useState } from "react";
import GeneratorConfig from "./GeneratorConfig";
import { useGeneratorContext } from "../../context/GeneratorContext";
import { generate } from "./generate";
import Paper from "@mui/material/Paper";
import Question from "./Question";

const AdditiveCommutative = () => {
  const { stage, setStage, config, questions, createQuestions } =
    useGeneratorContext();

  const onCreate = useCallback(() => {
    createQuestions(generate, config.questionNumber);
    setStage("anwser");
  }, [config]);

  return (
    <>
      {stage === "config" && <GeneratorConfig onCreate={onCreate} />}
      {stage === "anwser" && (
        <Paper elevation={0} sx={{}}>
          {questions.map((q, i) => (
            <Question key={q.body} n={i + 1} question={q}></Question>
          ))}
        </Paper>
      )}
    </>
  );
};

export default AdditiveCommutative;

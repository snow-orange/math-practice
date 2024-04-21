import { createContext, useCallback, useContext, useState } from "react";

const GeneratorContext = createContext({
  stage: "",
  setStage: () => undefined,
  config: {},
  setConfig: () => undefined,
  questions: [],
  createQuestions: () => undefined,
});

const useGeneratorContext = () => {
  return useContext(GeneratorContext);
};

const GeneratorProvider = ({ children }) => {
  const [stage, setStage] = useState("config");
  const [config, $setConfig] = useState({});
  const [questions, $setQuestions] = useState([]);

  const setConfig = useCallback(
    (conf) => {
      $setConfig({ ...config, ...conf });
    },
    [config]
  );

  const createQuestions = useCallback(
    (generator, count) => {
      const length = Number.parseInt(count);
      $setQuestions(
        Array.from({ length }).map((_v, i) => generator(i, config))
      );
    },
    [config]
  );

  const value = {
    stage,
    setStage,
    config,
    setConfig,
    questions,
    createQuestions,
  };

  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  );
};

export { GeneratorProvider, useGeneratorContext };

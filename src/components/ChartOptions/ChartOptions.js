import React, { useMemo } from "react";
import { getOptionsConfig } from "@raw-temp/rawgraphs-core";
import ChartOptionNumber from "./ChartOptionTypes/ChartOptionNumber";
import ChartOptionText from "./ChartOptionTypes/ChartOptionText";
import ChartOptionColor from "./ChartOptionTypes/ChartOptionColor";
import ChartOptionColorScale from "./ChartOptionTypes/ChartOptionColorScale";
import ChartOptionBoolean from "./ChartOptionTypes/ChartOptionBoolean";
import { map } from "lodash";

const CHART_OPTION_COMPONENTS = {
  number: ChartOptionNumber,
  text: ChartOptionText,
  color: ChartOptionColor,
  colorScale: ChartOptionColorScale,
  boolean: ChartOptionBoolean,
};

const ChartOptions = ({ chart, visualOptions, setVisualOptions, error }) => {
  const optionsDefinitionsByGroup = useMemo(() => {
    const options = getOptionsConfig(chart?.visualOptions)

    return Object.keys(options).reduce((acc, optionId) => {
      const option = options[optionId];
      const group = option?.group || "";
      if (!acc[group]) {
        acc[group] = {};
      }
      acc[group][optionId] = option;
      return acc;
    }, {});
  }, [chart]);

  return (
    <div>
      {map(optionsDefinitionsByGroup, (options, groupName) => {
        return (
          <div key={groupName} style={{textTransform:'capitalize', borderTop:'1px solid var(--gray-400)'}}>
            <h2>{groupName}</h2>
            {map(options, (def, optionId) => {
              const Component = CHART_OPTION_COMPONENTS[def.type];

              return (
                <Component
                  key={optionId}
                  {...def}
                  error={error?.errors?.[optionId]}
                  value={visualOptions?.[optionId]}
                  onChange={(nextValue) => {
                    setVisualOptions({
                      ...visualOptions,
                      [optionId]: nextValue,
                    });
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChartOptions;

import DefaultTemplate from "./DefaultTemplate";
import TwoColumnTemplate from "./TwoColumnTemplate";
import GridTemplate from "./GridTemplate";
import LaTeXTemplate from "./LaTeXTemplate";

export const templateComponents = {
  "single-column": DefaultTemplate,
  "two-column": TwoColumnTemplate,
  grid: GridTemplate,
  latex: LaTeXTemplate,
};
